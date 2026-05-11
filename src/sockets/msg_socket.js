export function MsgSocket(io) {
  
  const messages_stack_raw = [];
  let messageCounter = 0;

  const getLightMessage = (data) => {
    const lightData = { ...data };
    if (lightData.file && lightData.file.type.split("/")[0] !== "image") {
      const { data: _, ...fileWithoutData } = lightData.file;
      lightData.file = fileWithoutData;
    }
    return lightData;
  };

  const MAX_MESSAGES = 100;

  io.on("connection", (socket) => {
    // Send existing messages (light version)
    socket.emit("messages", messages_stack_raw.map(getLightMessage));

    socket.on("message", (data, callback) => {
      try {
        if (messages_stack_raw.length >= MAX_MESSAGES) {
          messages_stack_raw.shift();
        }
        
        const messageWithId = { ...data, id: messageCounter++ };
        messages_stack_raw.push(messageWithId);
        
        // Broadcast light version
        io.emit("message", getLightMessage(messageWithId));
        
        if (callback) callback({ status: "ok" });
      } catch (err) {
        console.error("Message error:", err);
        if (callback) callback({ status: "error", message: err.message });
      }
    });

    socket.on("download_file", (messageId, callback) => {
      const msg = messages_stack_raw.find(m => m.id === messageId);
      if (msg && msg.file) {
        callback({ status: "ok", file: msg.file });
      } else {
        callback({ status: "error", message: "File not found" });
      }
    });
    
    socket.on("disconnect", () => {
      console.log("Message socket disconnected");
    });
  });
}
