from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime
import psycopg2
import bcrypt
import logging
from jose import jwt
from fastapi.security import OAuth2PasswordBearer
from datetime import date, datetime, timedelta
# Configure logging
logging.basicConfig(level=logging.INFO)

db_params = {
    'user': 'postgres',
    'host': 'localhost',
    'database': 'dahwin',
    'password': r'LCFr&$wfj1()DFJLEW(*DFDAdahwinw9r8uer69q;Bt#k1.vE8!2sP\xbp=nbh',
    'port': 5432,
}



app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT settings
JWT_SECRET = "your_jwt_secret_key"
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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
                password VARCHAR(100),
                oauth_provider VARCHAR(20),
                oauth_id VARCHAR(100)
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

def create_jwt_token(email: str) -> str:
    """Create a JWT token for the user."""
    expires = datetime.utcnow() + timedelta(minutes=JWT_EXPIRATION_MINUTES)
    to_encode = {"sub": email, "exp": expires}
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_jwt_token(token: str = Depends(oauth2_scheme)):
    """Verify the JWT token."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return email
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

def signup_user(first_name, last_name, date_of_birth, gender, country, email, password=None, oauth_provider=None, oauth_id=None):
    """Sign up a new user and store their information in the database."""
    conn = connect_db()
    if conn:
        try:
            cursor = conn.cursor()
            hashed_password = hash_password(password) if password else None
            insert_query = '''
            INSERT INTO users (first_name, last_name, date_of_birth, gender, country, email, password, oauth_provider, oauth_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
            '''
            cursor.execute(insert_query, (first_name, last_name, date_of_birth, gender, country, email, hashed_password, oauth_provider, oauth_id))
            conn.commit()
            cursor.close()
            conn.close()
            return True
        except Exception as e:
            logging.error(f"Error signing up user: {e}")
            return False

def login_user(email, password=None, oauth_provider=None, oauth_id=None):
    """Login a user by verifying their credentials."""
    conn = connect_db()
    if conn:
        try:
            cursor = conn.cursor()
            if password:
                select_query = 'SELECT password FROM users WHERE email = %s;'
                cursor.execute(select_query, (email,))
                stored_password = cursor.fetchone()
                if stored_password and check_password(stored_password[0], password):
                    return True
            elif oauth_provider and oauth_id:
                select_query = 'SELECT id FROM users WHERE email = %s AND oauth_provider = %s AND oauth_id = %s;'
                cursor.execute(select_query, (email, oauth_provider, oauth_id))
                user = cursor.fetchone()
                if user:
                    return True
            cursor.close()
            conn.close()
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
            SELECT first_name, last_name, date_of_birth, gender, country, email, oauth_provider
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
                    "email": user_data[5],
                    "oauth_provider": user_data[6]
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
    email: EmailStr
    password: Optional[str] = None
    oauth_provider: Optional[str] = None
    oauth_id: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: Optional[str] = None
    oauth_provider: Optional[str] = None
    oauth_id: Optional[str] = None

@app.on_event("startup")
def on_startup():
    create_user_table()

@app.post("/api/signup")
def signup(user: UserSignup):
    if signup_user(user.first_name, user.last_name, user.date_of_birth, user.gender, user.country, user.email, user.password, user.oauth_provider, user.oauth_id):
        token = create_jwt_token(user.email)
        return {"message": "User signed up successfully.", "token": token}
    else:
        raise HTTPException(status_code=400, detail="Error signing up user.")

@app.post("/api/login")
def login(user: UserLogin):
    if login_user(user.email, user.password, user.oauth_provider, user.oauth_id):
        token = create_jwt_token(user.email)
        return {"message": "Login successful.", "token": token}
    else:
        raise HTTPException(status_code=400, detail="Login failed. Invalid credentials.")

@app.get("/api/user")
def get_user(email: str = Depends(verify_jwt_token)):
    user_data = get_user_data(email)
    if user_data:
        return user_data
    else:
        raise HTTPException(status_code=404, detail="User not found.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)