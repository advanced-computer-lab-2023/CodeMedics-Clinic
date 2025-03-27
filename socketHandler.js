const { Server } = require("socket.io");
const { putSocket, getSocket } = require("./config/socket");

const rooms = new Map();

const initializeSocket = (server) => {
  const io = new Server(server, {
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
    });

    socket.on("create-room", (roomId) => {
      if (!rooms.has(roomId)) {
        rooms.set(roomId, { participants: [] });
        console.log("Room created:", roomId);
      }
    });

    socket.on("join-room", (roomId, userId, name) => {
      if (!rooms.has(roomId)) {
        socket.emit("invalid-room");
        return;
      }

      const room = rooms.get(roomId);
      if (!room.participants.some((p) => p.userId === userId)) {
        room.participants.push({ userId, name });
        socket.join(roomId);
        socket.to(roomId).emit("user-connected", { userId, name });

        socket.emit(
          "existing-users",
          room.participants.filter((p) => p.userId !== userId)
        );
      }

      socket.on("disconnect", () => {
        room.participants = room.participants.filter((p) => p.userId !== userId);
        console.log("User disconnected:", userId);
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
      if (socketId) io.to(socketId).emit("newMessage", message);
    });

    socket.on("newMessagePharmacy", async ({ message, receiver, sendingToPharmacy }) => {
      const socketId = await getSocket(receiver);
      const room = receiver + " room";

      if (sendingToPharmacy) {
        io.to(room).emit("newMessagePharmacy", message);
      } else {
        io.to(socketId).to(room).emit("newMessagePharmacy", message);
      }
    });
  });
};

module.exports = { initializeSocket };
