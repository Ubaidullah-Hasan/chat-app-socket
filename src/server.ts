import mongoose from "mongoose";
import app from "./app";
import config from "./app/config/config";
import { Server } from "http";

let server: Server;

async function main() {
  server = app.listen(config.port, () => {
    console.log(`Server running on 🔗🔗http://localhost:${config.port}`);
  });
  await mongoose.connect(config.DATABASEURL);
  console.log("Mongodb connected");
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

// process.on('SIGTERM', () => {
//     console.log('SIGTERM IS RECEIVE');
//     if (server) {
//         server.close();
//     }
// });
