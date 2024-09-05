# Instagram Auto Uploader

This Python script automatically uploads images to Instagram from the upload folder.

## Features

- Monitors a folder for new image files
- Automatically uploads new images to Instagram
- Moves uploaded images to a uploaded folder
- Implements login retry mechanism with exponential backoff
- Adds random delay before each upload to avoid rate limiting
- Uses environment variables for secure credential management

## Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

## Installation

1. Clone this repository or download the script.

2. Install the required Python packages:

   ```
   pip install instagrapi watchdog python-dotenv
   ```

3. Create two folders in the same directory as the script:
   - `upload`: Place images to be uploaded here
   - `uploaded`: Successfully uploaded images will be moved here

4. Create a `.env` file in the same directory as the script with your Instagram credentials:

   ```
   INSTAGRAM_USERNAME=your_instagram_username
   INSTAGRAM_PASSWORD=your_instagram_password
   ```

   Replace `your_instagram_username` and `your_instagram_password` with your actual Instagram credentials.

## Usage

1. Run the script:

   ```
   python instagram_uploader.py
   ```

2. The script will start monitoring the `upload` folder.

3. Place image files (jpg, jpeg, or png) in the `upload` folder.

4. The script will automatically detect new images, upload them to Instagram, and move them to the `uploaded` folder.

5. To stop the script, press Ctrl+C in the terminal.

## Notes

- The script adds a random delay (30-60 seconds) before each upload to avoid triggering Instagram's rate limits.
- If the script encounters login issues, it will attempt to retry with an exponential backoff.
- Always use this script responsibly and in accordance with Instagram's terms of service.
- Be aware that excessive automated posting may lead to account restrictions.
- Keep your `.env` file secure and never commit it to version control.

## Troubleshooting

- If uploads fail, check your Instagram credentials in the `.env` file and your internet connection.
- Ensure you have the necessary permissions to read from the `upload` folder and write to the `uploaded` folder.
- Check the console output for any error messages or logs.

## License

This project is open source and available under the [MIT License](LICENSE).