// Express app configure.....(routes, middleware, db conection etc.)
const userRoutes = require('./routes/user_Routes');
const captionRoutes = require('./routes/captain_Routes');
const cookiesParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const app = express();

const connectDB = require('./db/db');

connectDB(); // Connect to MongoDB

// Middleware to parse JSON
app.use(cors());
// These lines are essential to "make req.body work properly" in your controllers.
app.use(express.json());//This middleware tells Express to automatically "parse incoming requests" (like post,get...) with Content-Type: application/json.
app.use(express.urlencoded({ extended: true }));//parses "URL-encoded data" (like form submissions from HTML <form>).
app.use(cookiesParser()); // Middleware to parse cookies
// This middleware allows us to access cookies in our request object (req.cookies).

app.get('/', (req, res) => {
    res.send('Welcome to the Uber Clone Backend!');
});

app.use('/users', userRoutes);
app.use('/captions', captionRoutes);


module.exports = app;//1:36 min
