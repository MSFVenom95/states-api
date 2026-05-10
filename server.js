require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// CORS
app.use(cors());

// Built in middleware to handl urlencoded form data
app.use(express.urlencoded({ extended: false }));

// Built in middleware for JSON
app.use(express.json());

// Routes
app.use('/', require('./routes/root'));
app.use('/states', require('./routes/api/states'));

// Catch all 404
app.use((req, res) => {
    res.status(404);
    if (req.accepts('text/html')) {
        res.send('<html><body><h1>404 Not Found</h1><p>The requested page does not exist.</p></body></html>');
    } else if (req.accepts('application/json')) {
        res.json({ error: '404 Not Found' });
    } else {
        res.type('txt').send('404 Not Found');
    }
});

// Start the server only after MongoDB connects successfully
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    const path = require('path');
    // Serve the index.html on the root route
app.get(['/', '/index', '/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
    app.use((req, res) => {
        res.status(404);
        if (req.accepts('html')) {
            res.sendFile(path.join(__dirname, 'views', '404.html'));
        } else if (req.accepts('json')) {
            res.json({ error: "404 Not Found" });
        } else {
            res.type('txt').send("404 Not Found");
        }
    });
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});