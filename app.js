const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const colors = require('colors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/MongoDBConnection');
const adminRoutes = require('./routes/AdminRoutes');
const DeleteModelRecords = require('./config/DeleteAllRecords');
// Connect to MongoDB
connectDB().then(r => console.log("Connected to MongoDB 200 OK".bgGreen.bold));

//Start Express server
const app = express();
const Port = process.env.PORT || 3000;

//DeleteModelRecords.deleteAllRecords(); //uncomment this line to delete all records from a specific model

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.listen(Port);


console.log("Server running at http://localhost:" + process.env.PORT + "/");

// routes

app.use('/admin', adminRoutes);

module.exports = app;
