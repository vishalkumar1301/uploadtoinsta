const upload = multer();
require('dotenv').config();
const router = express.Router();
const multer = require('multer');
const express = require('express');
const instagramService = require('../services/instagramService');




router.post('/upload', upload.single('image'), async (req, res) => {



    const { caption } = req.body;
    const imageBuffer = req.file.buffer;
    const username = process.env.INSTAGRAM_USERNAME;
    const password = process.env.INSTAGRAM_PASSWORD;




    try {
        
        
        
        // Login
        await instagramService.login(username, password);

        // Upload the image
        const publishResult = await instagramService.uploadPhoto(imageBuffer, caption);

        // Log the result
        res.json({ success: true, result: publishResult });



    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }






});





module.exports = router;