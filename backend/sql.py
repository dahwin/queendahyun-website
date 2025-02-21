import psycopg2

# Database connection parameters
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
    conn = psycopg2.connect(**default_conn_params)
    conn.autocommit = True
    cursor = conn.cursor()

    # No need to check for database existence or create it

    cursor.close()
    conn.close()

def create_restaurants_table():
    conn = psycopg2.connect(**db_params)
    cursor = conn.cursor()

    # Define the SQL for creating the restaurants table
    create_table_query = """
    CREATE TABLE IF NOT EXISTS restaurants (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        name VARCHAR(50) NOT NULL
    );
    """
    cursor.execute(create_table_query)

    cursor.close()
    conn.commit()
    conn.close()

def create_reviews_table():
    conn = psycopg2.connect(**db_params)
    cursor = conn.cursor()

    # Define the SQL for creating the reviews table
    create_table_query = """
    CREATE TABLE IF NOT EXISTS reviews (
        id BIGSERIAL NOT NULL PRIMARY KEY,
        restaurant_id BIGINT NOT NULL REFERENCES restaurants(id),
        name VARCHAR(50) NOT NULL,
        review TEXT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5)
    );
    """
    cursor.execute(create_table_query)

    cursor.close()
    conn.commit()
    conn.close()

def insert_data():
    conn = psycopg2.connect(**db_params)
    cursor = conn.cursor()

    # Define sample data to insert
    sample_data = [
        (1, 'Restaurant A', 'Great food and atmosphere!', 4),
        (2, 'Restaurant B', 'Amazing service!', 5),
        (3, 'Restaurant C', 'Delicious dishes!', 4),
        (4, 'Restaurant D', 'Friendly staff!', 3),
        (5, 'Restaurant E', 'Cozy ambiance!', 5),
        (6, 'Restaurant F', 'Tasty cuisine!', 4),
        (7, 'Restaurant G', 'Excellent experience!', 5),
        (8, 'Restaurant H', 'Good value for money!', 4),
        (9, 'Restaurant I', 'Quality ingredients!', 5),
        (10, 'Restaurant J', 'Unique flavors!', 4),
    ]

    # Insert data into the restaurants table
    insert_query = """
    INSERT INTO restaurants (id, name)
    VALUES (%s, %s);
    """

    cursor.executemany(insert_query, [(i, name) for i, name, *_ in sample_data])

    # Insert data into the reviews table
    insert_query = """
    INSERT INTO reviews (restaurant_id, name, review, rating)
    VALUES (%s, %s, %s, %s);
    """

    cursor.executemany(insert_query, [(i, name, review, rating) for i, name, review, rating in sample_data])

    cursor.close()
    conn.commit()
    conn.close()

# Main execution
create_database()
create_restaurants_table()
create_reviews_table()
insert_data()
