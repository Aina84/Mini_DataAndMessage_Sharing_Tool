import http from "http";
import express from "express";
import app from "./src/app.js";
import dotenv from "dotenv";
import process, { loadEnvFile } from "process";
import path from "path";
import { setupIO } from "./src/sockets/setupIO.js";
import { MsgSocket } from "./src/sockets/msg_socket.js";
loadEnvFile();
dotenv.config();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const server = http.createServer(app);
const PORT = process.env.PORT || 4001;
const HOST = process.env.HOST ?? "192.168.137.1" ?? "localhost";

const io = setupIO(server);
MsgSocket(io);

server.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
