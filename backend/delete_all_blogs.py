import psycopg2
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database connection parameters (same as in FastAPI app)
db_params = {
    'user': os.getenv("DB_USER", "postgres"),
    'host': os.getenv("DB_HOST", "localhost"),
    'database': os.getenv("DB_NAME", "dahwin"),
    'password': os.getenv("DB_PASSWORD", "5779ra"),
    'port': int(os.getenv("DB_PORT", 5432)),
}

def delete_all_blog_posts():
    """Delete all records from the `blog_posts` table."""
    conn = None
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        
        # Delete all blog posts
        cur.execute("DELETE FROM blog_posts")
        conn.commit()
        
        logger.info("✅ Successfully deleted all blog posts!")
        
    except Exception as e:
        logger.error(f"❌ Error deleting blog posts: {str(e)}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":

    delete_all_blog_posts()
