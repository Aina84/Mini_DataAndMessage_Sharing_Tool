import { Server } from "socket.io";

export function setupIO(server) {
  const io = new Server(server);
  io.on("connection", (socket) => {
    console.log("New client connected",socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
  return io;
}