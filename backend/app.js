// Express app configure.....(routes, middleware, db conection etc.)

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const app = express();

const connectDB = require('./db/db');

const userRoutes = require('./routes/user_Routes');

connectDB(); // Connect to MongoDB

// Middleware to parse JSON
app.use(cors());
// These lines are essential to "make req.body work properly" in your controllers.
app.use(express.json());//This middleware tells Express to automatically "parse incoming requests" (like post,get...) with Content-Type: application/json.
app.use(express.urlencoded({ extended: true }));//parses "URL-encoded data" (like form submissions from HTML <form>).

app.get('/', (req, res) => {
    res.send('Welcome to the Uber Clone Backend!');
});

app.use('/users', userRoutes);

module.exports = app;
