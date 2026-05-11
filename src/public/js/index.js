// Connexion au serveur Socket.io
const socket = io();
let myId;
const btnSend = document.getElementById("sendMsgBtn");
const fileInput = document.getElementById("fileInput");
const fileInput0 = document.getElementById("fileInput0");
const progressBar = document.getElementById("progress-bar");

const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

function uploadFile(file, message) {
  let offset = 0;
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  let currentChunk = 0;

  progressBar.value = 0;
  progressBar.style.display = "block";

  const reader = new FileReader();
  
  // We'll use a simpler approach: Read the whole file but use reader.onprogress 
  // to show something, or keep the manual chunking but fix the data joining.
  // Actually, Socket.io supports sending Blobs/ArrayBuffers directly.
  
  reader.onload = (e) => {
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: e.target.result, // This will be a DataURL
      };
      socket.emit("message", { text: message, file: fileData, by: socket.id });
      document.getElementById("msgInput").value = "";
      fileInput0.value = "";
      progressBar.style.display = "none";
  };

  reader.onprogress = (e) => {
    if (e.lengthComputable) {
      progressBar.value = e.loaded / e.total;
    }
  };

  reader.readAsDataURL(file);
}

// Re-implementing uploadFile with real chunking if we want to show NETWORK progress 
// (though here it's still just disk reading progress on the client side since 
// socket.io emit is atomic). 
// For real network progress, we'd need to emit chunks and have the server acknowledge.

btnSend.addEventListener("click", () => {
  const file = fileInput.files[0];
  const file0 = fileInput0.files[0];
  myId = socket.id;
  const message = document.getElementById("msgInput").value;

  if (file0) {
    uploadFile(file0, message);
  } else if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: reader.result,
      };
      socket.emit("message", { text: message, file: fileData, by: myId });
      document.getElementById("msgInput").value = "";
    };
    reader.readAsDataURL(file);
    fileInput.value = "";
  } else {
    socket.emit("message", { text: message, by: myId });
    document.getElementById("msgInput").value = "";
  }
});

function appendMessage(item, isHistory = false) {
  myId = socket.id;
  const div = document.createElement("div");
  const msgTime = document.createElement("span");
  div.className = "msgContainer";
  div.style.backgroundColor = item.by == myId ? "#4780FF" : "white";
  msgTime.classList = "msgItemTime";
  msgTime.style.color = item.by == myId ? "white" : "#4780FF";
  msgTime.style.alignSelf = item.by == myId ? "flex-end" : "flex-start";
  msgTime.textContent = `${new Date().toLocaleTimeString()}`;

  if (item.file) {
    if (item.file.type && item.file.type.split("/")[0] == "image") {
      const img = document.createElement("img");
      img.src = item.file.data;
      img.alt = item.file.name;
      img.classList = "img";
      div.append(img);
      div.style.flexDirection = "column";
    }
    
    const a = document.createElement("a");
    a.classList = item.by == myId ? "msgItemUser" : "msgItem";
    a.style.cursor = "pointer";
    a.style.display = "block";
    a.style.color = item.by == myId ? "#1877f2" : "blue";
    
    if (item.file.data) {
      a.href = item.file.data;
      a.download = item.file.name;
    } else {
      a.onclick = (e) => {
        e.preventDefault();
        socket.emit("download_file", item.id, (response) => {
          if (response.status === "ok") {
            const link = document.createElement("a");
            link.href = response.file.data;
            link.download = response.file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            alert("Erreur : " + response.message);
          }
        });
      };
    }
    
    const sizeStr = item.file.size ? ` - ${(item.file.size / 1024).toFixed(2)} KB` : "";
    a.textContent = `📥 ${item.file.name}${sizeStr}`;
    div.appendChild(a);
    div.appendChild(msgTime);
    document.getElementById("msgArea").append(div);
  }

  if (item.text && item.text !== "") {
    const msgArea = document.getElementById("msgArea");
    const msgElement = document.createElement("p");
    msgElement.textContent = `${item.text}`;
    msgElement.classList = item.by == myId ? "msgItemUser" : "msgItem";
    div.appendChild(msgElement);
    div.appendChild(msgTime);
    msgArea.append(div);
  }
  
  if (!isHistory) {
     const msgArea = document.getElementById("msgArea");
     msgArea.scrollTop = msgArea.scrollHeight;
  }
}

addEventListener("load", () => {
  socket.on("messages", (data) => {
    document.getElementById("msgArea").innerHTML = "";
    data.forEach((item) => appendMessage(item, true));
    const msgArea = document.getElementById("msgArea");
    msgArea.scrollTop = msgArea.scrollHeight;
  });
});

socket.on("message", (data) => {
  appendMessage(data);
});
