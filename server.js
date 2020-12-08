const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users.js');
const profile = require('./routes/api/profile.js');
const posts = require('./routes/api/posts.js');

const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 


// Database configuration

const db = require('./config/keys').MongoURI;

// Connecting mongoose to database

mongoose.connect(db).then(() => console.log('connection established')).catch(err => console.log(err)
);


// passport middleware

app.use(passport.initialize());

//passport config

require('./config/passport')(passport);


// using routes

app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);

const port = process.env.port || 5000;

app.listen(port,()=> console.log(`server running on ${port}`));