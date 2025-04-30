from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from datetime import datetime
import logging
import shutil
from urllib.parse import unquote
import json

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Correct db_params:
db_params = {
    'user': os.getenv("DB_USER", "postgres"),  # Changed to "postgres"
    'host': os.getenv("DB_HOST", "localhost"),
    'database': os.getenv("DB_NAME", "dahwin"),
    'password': os.getenv("DB_PASSWORD", "5779ra"),
    'port': int(os.getenv("DB_PORT", 5432)),
}

def get_db_connection():
    try:
        conn = psycopg2.connect(**db_params)
        return conn
    except psycopg2.Error as e:
        logger.error(f"Unable to connect to the database: {e}")
        raise

# Create tables if they don't exist
def create_tables():
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS blog_posts (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
        logger.info("Tables created successfully")
    except Exception as e:
        logger.error(f"Error creating tables: {str(e)}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

create_tables()

# Ensure the upload directory exists
UPLOAD_DIR = "all_data"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount the static files directory
app.mount("/all_data", StaticFiles(directory=UPLOAD_DIR), name="all_data")

class ContentBlock(BaseModel):
    type: str
    content: str

class BlogPostCreate(BaseModel):
    title: str
    blocks: List[ContentBlock]

@app.post("/api/blog")
async def create_blog_post(
    title: str = Form(...),
    blocks: str = Form(...),
    files: List[UploadFile] = File(None)
):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        blocks_data = json.loads(blocks)
        processed_blocks = []
        file_index = 0

        logger.info(f"Received blog post creation request. Title: {title}")
        logger.info(f"Number of blocks: {len(blocks_data)}")
        logger.info(f"Number of files received: {len(files) if files else 0}")

        for block in blocks_data:
            logger.info(f"Processing block: {block['type']}")
            if block['type'] in ['image', 'video']:
                if files and file_index < len(files):
                    file = files[file_index]
                    file_index += 1
                    filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
                    file_path = os.path.join(UPLOAD_DIR, filename)
                    
                    # Ensure the UPLOAD_DIR exists
                    os.makedirs(UPLOAD_DIR, exist_ok=True)
                    
                    # Save the file
                    with open(file_path, "wb") as buffer:
                        shutil.copyfileobj(file.file, buffer)
                    
                    # Update the block content with the correct path
                    block['content'] = f"/all_data/{filename}"
                    
                    logger.info(f"File saved: {file_path}")
                else:
                    logger.warning(f"No file provided for {block['type']} block")
                    block['content'] = ""
            processed_blocks.append(block)

        cur.execute("""
            INSERT INTO blog_posts (title, content)
            VALUES (%s, %s)
            RETURNING id
        """, (title, json.dumps(processed_blocks)))
        
        new_id = cur.fetchone()[0]
        conn.commit()
        
        logger.info(f"Blog post created successfully with id: {new_id}")
        return JSONResponse(status_code=201, content={"message": "Blog post created successfully", "id": new_id})
    except Exception as e:
        conn.rollback()
        logger.error(f"Error creating blog post: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        cur.close()
        conn.close()

@app.get("/api/bloglist")
def get_all_blog_posts():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cur.execute("SELECT * FROM blog_posts ORDER BY created_at DESC")
        blog_posts = cur.fetchall()
        
        formatted_posts = []
        for post in blog_posts:
            formatted_post = dict(post)
            if isinstance(formatted_post['created_at'], datetime):
                formatted_post['created_at'] = formatted_post['created_at'].isoformat()
            
            # Handle content field
            try:
                formatted_post['content'] = json.loads(formatted_post['content'])
            except json.JSONDecodeError:
                # If content is not valid JSON, wrap it in a list with a single text block
                formatted_post['content'] = [{'type': 'text', 'content': formatted_post['content']}]
            
            formatted_posts.append(formatted_post)
        
        logger.info(f"Retrieved {len(formatted_posts)} blog posts")
        
        return JSONResponse(content=jsonable_encoder(formatted_posts))
    except Exception as e:
        logger.error(f"Error fetching blog posts: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        cur.close()
        conn.close()

@app.get("/api/blog/title/{title}")
def get_blog_post_by_title(title: str):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        decoded_title = unquote(title).replace('-', ' ')
        cur.execute("SELECT * FROM blog_posts WHERE title ILIKE %s", (decoded_title,))
        blog_post = cur.fetchone()
        if blog_post is None:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        if isinstance(blog_post['created_at'], datetime):
            blog_post['created_at'] = blog_post['created_at'].isoformat()
        blog_post['content'] = json.loads(blog_post['content'])
        
        return JSONResponse(content=jsonable_encoder(blog_post))
    except Exception as e:
        logger.error(f"Error fetching blog post: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        cur.close()
        conn.close()

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": str(exc.detail)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)