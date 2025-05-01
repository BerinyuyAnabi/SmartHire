import os
import mysql.connector
from dotenv import load_dotenv

# Load environment variables
project_folder = '/home/smarthiringorg/SmartHire/Flask_Backend/'
load_dotenv(os.path.join(project_folder, '.env'))

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )