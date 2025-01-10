import psycopg2
from psycopg2 import sql

# Database connection parameters
db_params = {
    'user': 'postgres',
    'host': 'localhost',
    'database': 'dahwin',
    'password': '5779ra',
    'port': 5432,
}

try:
    # Establish the connection
    conn = psycopg2.connect(**db_params)
    # Create a cursor object
    cursor = conn.cursor()
    # Execute a simple query to check the connection
    cursor.execute("SELECT version();")
    # Fetch and print the result of the query
    db_version = cursor.fetchone()
    print(f"Connected to database. PostgreSQL version: {db_version}")
    
    # Close the cursor and connection
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error connecting to database: {e}")








