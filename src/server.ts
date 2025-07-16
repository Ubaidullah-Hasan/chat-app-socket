import mongoose from "mongoose";
import app from "./app";
import config from "./app/config/config";
import { Server } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
let server: Server;

async function main() {
  server = app.listen(config.port, () => {
    console.log(`Server running on 🔗🔗http://localhost:${config.port}`);
  });
  await mongoose.connect(config.DATABASEURL);
  console.log("Mongodb connected");

  // sockets
  let connectedUserOnSocket = new Set();

  const io = new SocketIOServer(server, {
    cors: {
      origin: "*", // frontend থেকে কানেক্ট করার অনুমতি
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(socket.id);
    connectedUserOnSocket.add(socket.id);

    io.emit("total-clients", connectedUserOnSocket.size);

    socket.on("disconnect", () => {
      console.log("Socket id disconnected:", socket.id);
      connectedUserOnSocket.delete(socket.id);
      io.emit("total-clients", connectedUserOnSocket.size);
    });

    socket.on("message", data => {
      socket.broadcast.emit("chat-message", data)
    })

  });

}

main();




process.on("unhandledRejection", () => {
  console.log("Unhandled rejection is detected, Sutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log("UncaughtException rejection is detected, Sutting down...");
  process.exit(1);
});
