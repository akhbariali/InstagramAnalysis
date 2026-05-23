import mysql.connector
import json
from datetime import datetime

DB_CONFIG = {
    "host": "127.0.0.1", 
    "user": "USERNAME",  
    "password": "PAASWORD",
    "database": "INSTAGRAM_DATA"
}

def insert_instagram_post(data):

    connection = None
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        cursor = connection.cursor()

        url = data.get("url")
        caption = data.get("caption")
        tags_json = json.dumps(data.get("tags", []))
        owner = data.get("owner")
        likes = data.get("likes")
        comments_count = data.get("comments_count")
        top_comments_json = json.dumps(data.get("top_comments", []))

        date_str = data.get("date")
        post_datetime = None
        if date_str:
            try:
                post_datetime = datetime.strptime(date_str, "%Y-%m-%d")
            except ValueError as e:
                print(f"Warning: Could not parse date string '{date_str}': {e}")
                post_datetime = None

        sql = """
        INSERT INTO posts (url, caption, tags, owner, likes, comments_count, top_comments, post_date)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            url,
            caption,
            tags_json,
            owner,
            likes,
            comments_count,
            top_comments_json,
            post_datetime
        )

        cursor.execute(sql, values)
        connection.commit()
        print(f"Data for URL '{url}' inserted successfully!")

    except mysql.connector.Error as err:
        if err.errno == 1062:
            print(f"Error: Duplicate entry for URL '{url}'. This URL already exists in the database.")
        else:
            print(f"Error: {err}")
        if connection:
            connection.rollback()
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection closed.")

def load_posts_from_json(file_path):
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
            return data
    except FileNotFoundError:
        print(f"Error: File not found at '{file_path}'")
        return None
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from '{file_path}'")
        return None

if __name__ == "__main__":
    json_file_path = 'newoutputone.json' 
    posts = load_posts_from_json(json_file_path)

    if posts:
        for post_data in posts:
            insert_instagram_post(post_data)