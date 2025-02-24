const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const colors = require("colors");
const { v4: uuidV4 } = require("uuid");
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

const {
  putSocket,
  getSocket,
  joinSocket,
  getUser,
} = require("./config/socket");

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

const rooms = new Map();

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("iAmReady", (username) => {
    console.log("iAmReady: " + username, socket.id);
    io.to(socket.id).emit("me", socket.id);
    putSocket(username, socket.id);
    socket.emit("me", socket.id);
  });

  socket.on("create-room", (roomId) => {
    if (rooms.has(roomId)) {
      return;
    }
    rooms.set(roomId, { participants: [] });
    console.log("room created", roomId);
  });

  socket.on("join-room", (roomId, userId, name) => {
    if (!rooms.has(roomId)) {
      socket.emit("invalid-room");
      return;
    }
    const room = rooms.get(roomId);
    if (room.participants.some((p) => p.userId == userId)) return;
    console.log("participants", room.participants, { userId, name });
    console.log(userId);
    room.participants.push({ userId, name });
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", { userId, name });

    socket.emit(
      "existing-users",
      room.participants.filter((item) => item.userId !== userId)
    );

    socket.on("disconnect", () => {
      const userId = socket.id;
      room.participants = room.participants.filter(
        (item) => item.userId !== userId
      );
      console.log("disconnecting ", userId);
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });

  socket.on("offer", (userId, offer) => {
    socket.broadcast.to(userId).emit("offer", socket.id, offer);
  });

  socket.on("answer", (userId, answer) => {
    socket.broadcast.to(userId).emit("answer", socket.id, answer);
  });

  socket.on("ice-candidate", (userId, candidate) => {
    socket.broadcast.to(userId).emit("ice-candidate", socket.id, candidate);
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
