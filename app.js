const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { IgApiClient } = require('instagram-private-api');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configure multer for file upload
const upload = multer({ 
    dest: 'upload/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Ensure the upload directory exists
if (!fs.existsSync('upload')) {
    fs.mkdirSync('upload');
}

app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No image file uploaded.');
    }

    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);

    try {
        // Login to Instagram
        await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

        // Upload the image
        const publishResult = await ig.publish.photo({
            file: fs.readFileSync(req.file.path),
            caption: 'Image uploaded via API'
        });

        console.log('Image uploaded successfully:', publishResult.media.id);
        res.status(200).send('Image uploaded successfully to Instagram');
    } catch (error) {
        console.error('Error uploading to Instagram:', error);
        res.status(500).send('Error uploading image to Instagram');
    } finally {
        // Clean up the uploaded file
        fs.unlink(req.file.path, (err) => {
            if (err) console.error(`Error deleting file: ${err}`);
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});