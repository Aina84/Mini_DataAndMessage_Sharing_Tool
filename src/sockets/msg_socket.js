export function MsgSocket(io) {
  const messages_stack = [];
  const MAX_MESSAGES = 100;
  
  io.on("connection", (socket) => {
    socket.emit("messages", messages_stack);
    
    socket.on("message", (data, callback) => {
      try {
        if (messages_stack.length >= MAX_MESSAGES) {
          messages_stack.shift();
        }
        messages_stack.push(data);
        io.emit("message", data);
        if (callback) callback({ status: "ok" });
      } catch (err) {
        console.error("Message error:", err);
        if (callback) callback({ status: "error", message: err.message });
      }
    });
    
    socket.on("disconnect", () => {
      console.log("Message socket disconnected");
    });
  });
}
