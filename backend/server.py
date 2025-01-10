from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
from google.oauth2 import id_token
from google.auth.transport import requests

# Load environment variables
load_dotenv()

# FastAPI app
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "A1b78Qc5MjtdfO0jIfl9MPNHW7MiqCFQBaxrUWD51Js")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30000

# Password hashing
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Database connection parameters
db_params = {
    'user': os.getenv("DB_USER", "postgres"),
    'host': os.getenv("DB_HOST", "localhost"),
    'database': os.getenv("DB_NAME", "dahwin"),
    'password': os.getenv("DB_PASSWORD", "5779ra"),
    'port': int(os.getenv("DB_PORT", 5432)),
}

# Google OAuth2 client ID
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "523322493045-4ev8g65gb1vddkem1idqf1e5igei10gh.apps.googleusercontent.com")

# Pydantic models
class UserSignup(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: str
    gender: str
    country: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class GoogleToken(BaseModel):
    token: str

# Database functions
def get_db_connection():
    conn = psycopg2.connect(**db_params)
    return conn

def get_user(email: str):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()
    conn.close()
    return user

# Authentication functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def authenticate_user(email: str, password: str):
    user = get_user(email)
    if not user:
        return False
    if not verify_password(password, user['password']):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = get_user(email=token_data.email)
    if user is None:
        raise credentials_exception

    return user

@app.post("/api/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user['email']}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/signup")
async def signup(user: UserSignup):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        hashed_password = get_password_hash(user.password)
        cur.execute("""
            INSERT INTO users (first_name, last_name, date_of_birth, gender, country, email, password)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (user.first_name, user.last_name, user.date_of_birth, user.gender, user.country, user.email, hashed_password))
        conn.commit()
        return {"message": "User signed up successfully."}
    except psycopg2.IntegrityError:
        conn.rollback()
        raise HTTPException(status_code=400, detail="Email already registered")
    finally:
        cur.close()
        conn.close()

@app.get("/api/user")
async def get_user_data(current_user: dict = Depends(get_current_user)):
    return {
        "first_name": current_user['first_name'],
        "last_name": current_user['last_name'],
        "email": current_user['email'],
        "date_of_birth": current_user['date_of_birth'],
        "gender": current_user['gender'],
        "country": current_user['country']
    }

@app.post("/api/refresh_token", response_model=Token)
async def refresh_token(current_user: dict = Depends(get_current_user)):
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": current_user['email']}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/google-login", response_model=Token)
async def google_login(google_token: GoogleToken):
    try:
        # print(f"Received token: {google_token.token[:10]}...") # Print first 10 chars of token
        idinfo = id_token.verify_oauth2_token(google_token.token, requests.Request(), GOOGLE_CLIENT_ID)
        
        # print(f"Decoded token info: {idinfo}")
        
        email = idinfo['email']
        user = get_user(email)
        
        if not user:
            # Create a new user if they don't exist
            conn = get_db_connection()
            cur = conn.cursor()
            try:
                cur.execute("""
                    INSERT INTO users (first_name, last_name, email)
                    VALUES (%s, %s, %s)
                """, (idinfo.get('given_name', ''), idinfo.get('family_name', ''), email))
                conn.commit()
                print(f"Created new user: {email}")
            except psycopg2.IntegrityError as e:
                conn.rollback()
                print(f"Error creating user: {str(e)}")
                raise HTTPException(status_code=400, detail=f"Email already registered: {str(e)}")
            finally:
                cur.close()
                conn.close()
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": email}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except ValueError as e:
        print(f"Error verifying token: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid token: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)