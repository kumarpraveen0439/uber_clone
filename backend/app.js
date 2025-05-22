const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();


// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the Uber Clone Backend!');
});

module.exports = app;
