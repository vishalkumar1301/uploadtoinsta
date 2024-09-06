const express = require('express');
const instagramRoutes = require('./routes/instagramRoutes');

const app = express();
const port = 3000;

app.use(express.json());

// Use the routes
app.use('/instagram', instagramRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});