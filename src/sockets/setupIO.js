import { Server } from "socket.io";

export function setupIO(server) {
  const io = new Server(server, {
    maxHttpBufferSize: 500 * 1024 * 1024,
    transports: ['websocket', 'polling'],
    pingInterval: 60000,
    pingTimeout: 30000
  });
  io.on("connection", (socket) => {
    console.log("New client connected",socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
  return io;
}