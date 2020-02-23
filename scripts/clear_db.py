import os
import psycopg2
from dotenv import load_dotenv

def main():
    """Clears all db tables
    """

    load_dotenv()

    POSTGRES_HOST = os.getenv('POSTGRES_HOST')
    POSTGRES_USER = os.getenv('POSTGRES_USER')
    POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')
    POSTGRES_DB = os.getenv('POSTGRES_DB')

    conn = psycopg2.connect(
        host=POSTGRES_HOST,
        database=POSTGRES_DB,
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
    )

    cur = conn.cursor()
    cur.execute('DELETE FROM rooms')
    cur.execute('DELETE FROM users')
    cur.execute('DELETE FROM players')
    cur.execute('DELETE FROM events')
    conn.commit()
    cur.close()

if __name__ == '__main__':
    main()
