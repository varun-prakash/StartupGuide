const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users.js');
const profile = require('./routes/api/profile.js');
const posts = require('./routes/api/posts.js');

const app = express();

// Database configuration

const db = require('./config/keys').MongoURI;

// Connecting mongoose to database

mongoose.connect(db).then(() => console.log('connection established')).catch(err => console.log(err)
);


app.get('/', (req,res)=>res.send('Hello'));

// using routes

app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);

const port = process.env.port || 5000;

app.listen(port,()=> console.log(`server running on ${port}`));