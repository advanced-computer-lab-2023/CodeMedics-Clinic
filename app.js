const createError = require('http-errors');
const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const colors = require('colors');
const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200
};


const stripe = require("stripe")("sk_test_51OA3YuHNsLfp0dKZBQsyFFPLXepbGkt9p5xZzd2Jzzj6zxLqUTY2DYF244qILCi0cfVjg37szrwdXZzin83e5ijm00X5eXuTnM");

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
const Port = process.env.PORT;

const http = require('http');

const server = http.createServer(app);



const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors(corsOptions));

// server.listen(5000);
io.on("connection", (socket) => {

  console.log("Socket id:", socket.id);

  socket.on("iAmReady", () => {
    socket.emit("me", socket.id);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded")
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    console.log("call answered, " + data.to + " is the caller");
    io.to(data.to).emit("callAccepted", data.signal)
  });
});

app.use(express.static("public"));
app.use(express.json());



//DeleteModelRecords.deleteAllRecords(); //uncomment this line to delete all records from a specific model

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
server.listen(Port);

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


app.post("/package/create-payment-intent", async (req, res) => {
  // const { items } = req.body;
  const card = req.body.card;
  console.log("in the package payment intent");
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 100,
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    }
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.post("/create-payment-intent", async (req, res) => {
  // const { items } = req.body;
  const card = req.body.card;
  console.log("in the payment intent");
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 100,
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    }
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

module.exports = app;
