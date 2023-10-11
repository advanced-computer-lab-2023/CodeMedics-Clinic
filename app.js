const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const colors = require('colors');
//const cors = require('cors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/MongoDBConnection');
const adminRoutes = require('./routes/AdminRoutes');
const DeleteModelRecords = require('./config/DeleteAllRecords');
const doctorRoutes = require('./routes/DoctorRoutes');
const patientRoutes = require('./routes/PatientRoutes');
const genericRoutes = require('./routes/GenericRoutes');
// Connect to MongoDB
connectDB().then(r => console.log("Connected to MongoDB 200 OK".bgGreen.bold));

//Start Express server
const app = express();
const Port = process.env.PORT || 3000;

//DeleteModelRecords.deleteAllRecords(); //uncomment this line to delete all records from a specific model

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.listen(Port);

console.log("Server running at http://localhost:" + process.env.PORT + "/");

app.set('view engine', 'ejs');
// const corsOptions = {
//     origin: 'http://example.com', // Replace with your frontend's URL
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true, // Enable credentials (e.g., cookies, authorization headers)
// };
//
// app.use(cors(corsOptions));

// routes

app.use('/admin', adminRoutes);
app.use('/doctor', doctorRoutes);
app.use('/patient', patientRoutes);
app.use('/', genericRoutes);
module.exports = app;
