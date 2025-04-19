const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const colors = require("colors");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/MongoDBConnection");
const { initializeSocket } = require("./socketHandler");
const patientController = require("./Backend/controllers/PatientController");
const doctorController = require("./Backend/controllers/DoctorController");
// Routes
const adminRoutes = require("./routes/AdminRoutes");
const genericRoutes = require("./routes/GenericRoutes");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

// Database Connection
connectDB().then(() => console.log("Connected to MongoDB 200 OK".bgGreen.bold));

// Middleware
app.use(
  cors({
    origin: `http://localhost:${process.env.FRONT_END_PORT}`,
    credentials: true,
    optionSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/admins", adminRoutes);
app.use("/doctors", doctorController);
app.use("/patients", patientController);
app.use("/", genericRoutes);

// Initialize Socket.IO
initializeSocket(server);

// Start Server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`.cyan.bold);
});

module.exports = app;
