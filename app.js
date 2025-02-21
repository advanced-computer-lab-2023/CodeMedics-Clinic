const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const colors = require("colors");
const cors = require("cors");
const corsOptions = {
  origin: `http://localhost:${process.env.FRONT_END_PORT}`,
  credentials: true,
  optionSuccessStatus: 200,
};

const connectDB = require("./config/MongoDBConnection");
const adminRoutes = require("./routes/AdminRoutes");
const DeleteModelRecords = require("./config/DeleteAllRecords");
const doctorRoutes = require("./routes/DoctorRoutes");
const patientRoutes = require("./routes/PatientRoutes");
const genericRoutes = require("./routes/GenericRoutes");
const chatRoutes = require("./routes/ChatsRoutes");

const { putSocket, getSocket, joinSocket } = require("./config/socket");

// Connect to MongoDB
connectDB().then((r) =>
  console.log("Connected to MongoDB 200 OK".bgGreen.bold)
);

//Start Express server
const app = express();
const Port = process.env.PORT;

const http = require("http");

const server = http.createServer(app);

app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(express.json());

//DeleteModelRecords.deleteAllRecords(); //uncomment this line to delete all records from a specific model

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
server.listen(Port);

console.log("Server running at http://localhost:" + process.env.PORT + "/");


app.use("/admins", adminRoutes);
app.use("/doctors", doctorRoutes);
app.use("/patients", patientRoutes);
app.use("/", genericRoutes);
app.use("/chats", chatRoutes);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("iAmReady", (username) => {
    console.log("iAmReady: " + username);
    putSocket(username, socket.id);
    socket.emit("me", socket.id);
  });

  socket.on("iWantToJoin", async () => {
    console.log("iWantToJoin");
    await joinSocket(socket);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", async ({ userToCall, signalData, from, name }) => {
    const idToCall = await getSocket(userToCall);
    console.log("callUser: " + userToCall + " with socketId: " + idToCall);
    io.to(idToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    console.log("call answered, " + data.to + " is the caller");
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("newMessage", async ({ message, receiver }) => {
    const socketId = await getSocket(receiver);
    console.log(
      "newMessage: " +
        message.content +
        " to " +
        receiver +
        " with socketI: " +
        socketId
    );
    io.to(socketId).emit("newMessage", message);
  });

  socket.on(
    "newMessagePharmacy",
    async ({ message, receiver, sendingToPharmacy }) => {
      const socketId = await getSocket(receiver);
      console.log(
        "newMessagePharmacy: " +
          message.content +
          " to " +
          receiver +
          " with socketId: " +
          socketId +
          " sendingToPharmacy: " +
          sendingToPharmacy
      );
      const room = receiver + " room";
      if (sendingToPharmacy) {
        io.to(room).emit("newMessagePharmacy", message);
      } else {
        io.to(socketId).to(room).emit("newMessagePharmacy", message);
      }
    }
  );
});

module.exports = app;
