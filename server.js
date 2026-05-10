require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// CORS middleware
app.use(cors());

// Built in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// Built in middleware for JSON
app.use(express.json());

// Serve the index HTML directly on the root route
app.get(['/', '/index', '/index.html'], (req, res) => {
    res.type('html').send('<!DOCTYPE html><html lang="en"><head><title>States API</title></head><body><h1>Welcome to the States API</h1></body></html>');
});

// API Routes
app.use('/states', require('./routes/api/states'));

// Catch all 404 (This MUST be the very last route!)
app.use((req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.type('html').send('<!DOCTYPE html><html lang="en"><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1></body></html>');
    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

// Start the server only after MongoDB connects successfully
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});