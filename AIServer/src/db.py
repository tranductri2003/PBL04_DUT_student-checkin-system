import psycopg2
from settings import (
    DB_NAME,
    DB_HOST,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
)

def get_connection():
    try:
        connection = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
        )
        return connection
    except psycopg2.Error as e:
        print('Error connecting to the database: %s', e)
        return None

def close_connection(conn):
    try:
        if conn:
            conn.close()
    except psycopg2.Error as e:
        print('Error closing connection: %s', e)
        return None
    
def create_table():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute('CREATE TABLE IF NOT EXISTS FaceFeatures (id serial PRIMARY KEY, staff_id varchar(15) UNIQUE, features text);') 
    conn.commit() 
    cur.close() 
    conn.close() 

def drop_table():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute('DROP TABLE FaceFeatures;') 
    conn.commit() 
    cur.close() 
    conn.close() 
    
create_table()
# drop_table()
