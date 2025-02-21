import psycopg2

db_params = {
    'user': 'dahwin',
    'host': 'localhost',
    'database': 'dahwin',
    'password': '5779ra',
    'port': 5432,
}

def create_database():
    default_conn_params = db_params.copy()
    default_conn_params['database'] = 'dahwin'
    
    # Debugging output
    print("Connecting with:", default_conn_params)

    conn = psycopg2.connect(**default_conn_params)
    conn.autocommit = True
    cursor = conn.cursor()
    cursor.close()
    conn.close()

create_database()
