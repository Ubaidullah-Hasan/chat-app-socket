"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config/config"));
const socket_io_1 = require("socket.io");
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        server = app_1.default.listen(config_1.default.port, () => {
            console.log(`Server running on 🔗🔗http://localhost:${config_1.default.port}`);
        });
        yield mongoose_1.default.connect(config_1.default.DATABASEURL);
        console.log("Mongodb connected");
        // sockets
        let connectedUserOnSocket = new Set();
        const io = new socket_io_1.Server(server, {
            cors: {
                origin: "*", // frontend থেকে কানেক্ট করার অনুমতি
            },
        });
        io.on("connection", (socket) => {
            console.log(socket.id);
            connectedUserOnSocket.add(socket.id);
            io.emit("total-clients", connectedUserOnSocket.size);
            socket.on("disconnect", () => {
                console.log("Socket id disconnected:", socket.id);
                connectedUserOnSocket.delete(socket.id);
                io.emit("total-clients", connectedUserOnSocket.size);
            });
            socket.on("message", data => {
                socket.broadcast.emit("chat-message", data);
            });
            socket.on("feedback", data => {
                socket.broadcast.emit("feedback", data);
            });
        });
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
