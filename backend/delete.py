import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection parameters
db_params = {
    'user': os.getenv("DB_USER", "postgres"),
    'host': os.getenv("DB_HOST", "localhost"),
    'database': os.getenv("DB_NAME", "dahwin"),
    'password': os.getenv("DB_PASSWORD", "5779ra"),
    'port': int(os.getenv("DB_PORT", 5432)),
}

# Function to count users
def count_users():
    conn = psycopg2.connect(**db_params)
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM users")
    user_count = cur.fetchone()[0]
    cur.close()
    conn.close()
    return user_count

# Function to get all emails
def get_all_emails():
    conn = psycopg2.connect(**db_params)
    cur = conn.cursor()
    cur.execute("SELECT email FROM users")
    emails = cur.fetchall()
    cur.close()
    conn.close()
    return emails

# Function to delete all users
def delete_all_users():
    conn = psycopg2.connect(**db_params)
    cur = conn.cursor()
    cur.execute("DELETE FROM users")
    conn.commit()  # Commit the transaction to save changes
    cur.close()
    conn.close()

# Main script
if __name__ == "__main__":
    # Delete all users
    delete_all_users()
    print("All users have been deleted.")

    # Verify user count
    user_count = count_users()
    print(f"Number of users in the database: {user_count}")

    # Get all emails (should return an empty list)
    emails = get_all_emails()
    print("User emails:")
    for email in emails:
        print(email[0])
