import os
import time
import logging
import random
from dotenv import load_dotenv
from instagrapi import Client
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Load environment variables
load_dotenv()

UPLOAD_FOLDER = "upload"
UPLOADED_FOLDER = "uploaded"
SESSION_FILE = "instagram_session.json"

# Instagram credentials from .env file
USERNAME = os.getenv("INSTAGRAM_USERNAME")
PASSWORD = os.getenv("INSTAGRAM_PASSWORD")

class NewImageHandler(FileSystemEventHandler):
    def __init__(self, instagram_client):
        self.client = instagram_client

    def on_created(self, event):i
        if event.is_directory:
            return
        if event.src_path.lower().endswith(('.png', '.jpg', '.jpeg')):
            logging.info(f"New image detected: {event.src_path}")
            self.upload_image(event.src_path)

    def upload_image(self, image_path):
        try:
            # Add a random delay before uploading
            delay = random.uniform(30, 60)
            logging.info(f"Waiting for {delay:.2f} seconds before uploading")
            time.sleep(delay)
            
            # Upload image to Instagram
            media = self.client.photo_upload(image_path, caption="Uploaded via Python script")
            logging.info(f"Uploaded {image_path} to Instagram. Media ID: {media.id}")
            # Move image to uploaded folder
            filename = os.path.basename(image_path)
            os.rename(image_path, os.path.join(UPLOADED_FOLDER, filename))
            logging.info(f"Moved {filename} to {UPLOADED_FOLDER}")
        except Exception as e:
            logging.exception(f"Error uploading {image_path}: {str(e)}")

def login_with_retry(client, max_retries=5):
    for attempt in range(max_retries):
        try:
            if os.path.exists(SESSION_FILE):
                client.load_settings(SESSION_FILE)
                client.login(USERNAME, PASSWORD)
            else:
                client.login(USERNAME, PASSWORD)
            client.dump_settings(SESSION_FILE)
            logging.info("Successfully logged in to Instagram")
            return True
        except Exception as e:
            logging.warning(f"Login attempt {attempt + 1} failed: {str(e)}")
            time.sleep((2 ** attempt) + random.random())  # Exponential backoff
    logging.error("Failed to log in after multiple attempts")
    return False

def main():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    if not os.path.exists(UPLOADED_FOLDER):
        os.makedirs(UPLOADED_FOLDER)
    
    logging.info(f"Monitoring folder: {UPLOAD_FOLDER}")
    logging.info(f"Uploaded images will be moved to: {UPLOADED_FOLDER}")

    client = Client()
    if not login_with_retry(client):
        return

    event_handler = NewImageHandler(client)
    observer = Observer()
    observer.schedule(event_handler, path=UPLOAD_FOLDER, recursive=False)
    observer.start()

    try:
        logging.info("Starting to monitor for new images...")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logging.info("Stopping the script...")
        observer.stop()
    observer.join()

if __name__ == "__main__":
    main()