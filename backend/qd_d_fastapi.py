from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
import bcrypt
import logging
from datetime import date

# Configure logging
logging.basicConfig(level=logging.INFO)

# Database connection parameters
db_params = {
    'user': 'postgres',
    'host': 'localhost',
    'database': 'dahwin',
    'password': '5779ra',
    'port': 5432,
}

app = FastAPI()
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to match your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def connect_db():
    """Establish a connection to the PostgreSQL database."""
    try:
        conn = psycopg2.connect(**db_params)
        logging.info("Connected to database.")
        return conn
    except Exception as e:
        logging.error(f"Error connecting to database: {e}")
        return None

def create_user_table():
    """Create a table for storing user information."""
    conn = connect_db()
    if conn:
        try:
            cursor = conn.cursor()
            create_table_query = '''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(50),
                last_name VARCHAR(50),
                date_of_birth DATE,
                gender VARCHAR(10),
                country VARCHAR(50),
                email VARCHAR(100) UNIQUE,
                password VARCHAR(100)
            );
            '''
            cursor.execute(create_table_query)
            conn.commit()
            cursor.close()
            conn.close()
            logging.info("User table created successfully.")
        except Exception as e:
            logging.error(f"Error creating user table: {e}")

def hash_password(password):
    """Hash a password for storing."""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(hashed_password, user_password):
    """Check a hashed password."""
    return bcrypt.checkpw(user_password.encode('utf-8'), hashed_password.encode('utf-8'))

def signup_user(first_name, last_name, date_of_birth, gender, country, email, password):
    """Sign up a new user and store their information in the database."""
    conn = connect_db()
    if conn:
        try:
            cursor = conn.cursor()
            hashed_password = hash_password(password)
            insert_query = '''
            INSERT INTO users (first_name, last_name, date_of_birth, gender, country, email, password)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
            '''
            cursor.execute(insert_query, (first_name, last_name, date_of_birth, gender, country, email, hashed_password))
            conn.commit()
            cursor.close()
            conn.close()
            return True
        except Exception as e:
            logging.error(f"Error signing up user: {e}")
            return False

def login_user(email, password):
    """Login a user by verifying their credentials."""
    conn = connect_db()
    if conn:
        try:
            cursor = conn.cursor()
            select_query = '''
            SELECT password FROM users WHERE email = %s;
            '''
            cursor.execute(select_query, (email,))
            stored_password = cursor.fetchone()
            cursor.close()
            conn.close()
            if stored_password and check_password(stored_password[0], password):
                return True
            else:
                return False
        except Exception as e:
            logging.error(f"Error logging in user: {e}")
            return False

def get_user_data(email):
    """Retrieve user data by email."""
    conn = connect_db()
    if conn:
        try:
            cursor = conn.cursor()
            select_query = '''
            SELECT first_name, last_name, date_of_birth, gender, country, email
            FROM users WHERE email = %s;
            '''
            cursor.execute(select_query, (email,))
            user_data = cursor.fetchone()
            cursor.close()
            conn.close()
            if user_data:
                return {
                    "first_name": user_data[0],
                    "last_name": user_data[1],
                    "date_of_birth": user_data[2].isoformat(),
                    "gender": user_data[3],
                    "country": user_data[4],
                    "email": user_data[5]
                }
            else:
                return None
        except Exception as e:
            logging.error(f"Error retrieving user data: {e}")
            return None

class UserSignup(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    gender: str
    country: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@app.on_event("startup")
def on_startup():
    create_user_table()

@app.post("/api/signup")
def signup(user: UserSignup):
    if signup_user(user.first_name, user.last_name, user.date_of_birth, user.gender, user.country, user.email, user.password):
        return {"message": "User signed up successfully."}
    else:
        raise HTTPException(status_code=400, detail="Error signing up user.")

@app.post("/api/login")
def login(user: UserLogin):
    if login_user(user.email, user.password):
        return {"message": "Login successful."}
    else:
        raise HTTPException(status_code=400, detail="Login failed. Invalid email or password.")

@app.get("/api/user/{email}")
def get_user(email: str):
    user_data = get_user_data(email)
    if user_data:
        return user_data
    else:
        raise HTTPException(status_code=404, detail="User not found.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)