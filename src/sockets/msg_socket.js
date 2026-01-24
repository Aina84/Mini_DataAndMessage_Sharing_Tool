export function MsgSocket(io) {
  //hehehe no database cuz it's just a...a tool...
  const messages_stack = [];
  io.on("connection", (socket) => {
    socket.emit("messages", messages_stack);
    socket.on("message", (data) => {
      messages_stack.push(data);
      io.emit("message", data);
    });
    socket.on("disconnect", () => {
      console.log("Message socket disconnected");
    });
  });
}
