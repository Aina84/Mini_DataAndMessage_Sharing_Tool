import http from "http";
import express from "express";
import app from "./src/app.js";
import dotenv from "dotenv";
import process, { loadEnvFile } from "process";
import readline from 'node:readline';
import { setupIO } from "./src/sockets/setupIO.js";
import { MsgSocket } from "./src/sockets/msg_socket.js";
loadEnvFile();
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout 
})

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const server = http.createServer(app);
const PORT = process.env.PORT ?? 3000;

const Config = {
  dev : {
    host: "localhost",
    port: PORT,
  },
  prod : {
    host: process.env.HOST ?? "192.168.137.1",
    port: 4001,
  }
}

rl.question('Entrez 1 pour dev ou 2 pour prod : ', (answer) => {
  const HOST = Config[answer === '1' ? 'dev' : 'prod'].host;
  const PORT = Config[answer === '1' ? 'dev' : 'prod'].port;
  const io = setupIO(server);
  MsgSocket(io);
  server.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  });
});
  