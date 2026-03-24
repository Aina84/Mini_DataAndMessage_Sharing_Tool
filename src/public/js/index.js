// Connexion au serveur Socket.io
const socket = io();
let myId;
const btnSend = document.getElementById("sendMsgBtn");
const fileInput = document.getElementById("fileInput");
const fileInput0 = document.getElementById("fileInput0");

btnSend.addEventListener("click", () => {
  const file = fileInput.files[0];
  const file0 = fileInput0.files[0];
  console.log(socket.id);
  myId = socket.id;
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const message = document.getElementById("msgInput").value;
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
  } else if (file0) {
    const reader = new FileReader();
    reader.onload = () => {
      const message = document.getElementById("msgInput").value;
      const fileData = {
        name: file0.name,
        type: file0.type,
        size: file0.size,
        data: reader.result,
      };
      socket.emit("message", { text: message, file: fileData, by: myId });
      document.getElementById("msgInput").value = "";
    };
    reader.readAsDataURL(file0);
    fileInput0.value = "";
  } else {
    const message = document.getElementById("msgInput").value;
    socket.emit("message", { text: message, by: myId });
    document.getElementById("msgInput").value = "";
  }
});

addEventListener("load", () => {
  socket.on("messages", (data) => {
    myId = socket.id;
    data.forEach((item) => {
      const div = document.createElement("div");
      const msgTime = document.createElement("span");
      div.className = "msgContainer";
      div.style.backgroundColor = item.by == myId ? "#4780FF" : "white";
      msgTime.classList = "msgItemTime";
      msgTime.style.color = item.by == myId ? "white" : "#4780FF";
      msgTime.style.alignSelf = item.by == myId ? "flex-end" : "flex-start";
      msgTime.textContent = `${new Date().toLocaleTimeString()}`;
      if (item.file) {
        if (item.file.type.split("/")[0] == "image") {
          const img = document.createElement("img");
          img.src = item.file.data;
          img.alt = item.file.name;
          img.classList = "img";
          div.append(img);
          div.style.flexDirection = "column";
        }
        const a = document.createElement("a");
        a.classList = item.by == myId ? "msgItemUser" : "msgItem";
        a.href = item.file.data;
        a.download = item.file.name;
        a.textContent = `📥 ${item.file.name}`;
        div.appendChild(a);
        div.appendChild(msgTime);
        document.getElementById("msgArea").append(div);
      }
      if (item.text != "") {
        const msgArea = document.getElementById("msgArea");
        const msgElement = document.createElement("p");
        msgElement.textContent = `${item.text}`;
        msgElement.classList = item.by == myId ? "msgItemUser" : "msgItem";
        div.appendChild(msgElement);
        div.appendChild(msgTime);
        msgArea.append(div);
      }
    });
  });
});
// Réception d'un message
socket.on("message", (data) => {
  myId = socket.id;
  const div = document.createElement("div");
  const msgTime = document.createElement("span");
  const date = new Date();
  msgTime.textContent = `${date.toLocaleTimeString()}`;
  div.className = "msgContainer";
  div.style.backgroundColor = data.by == myId ? "#4780FF" : "white";
  msgTime.style.color = data.by == myId ? "white" : "#4780FF";
  msgTime.style.alignSelf = data.by == myId ? "flex-end" : "flex-start";
  msgTime.classList = "msgItemTime";
  if (data.file && data.file.size > 0) {
    if (data.file.type.split("/")[0] == "image") {
      const img = document.createElement("img");
      img.src = data.file.data;
      img.alt = data.file.name;
      img.classList = "img";
      div.append(img);
      div.style.flexDirection = "column";
    }
    const a = document.createElement("a");
    a.classList = data.by == myId ? "msgItemUser" : "msgItem";
    a.style.color = "blue";
    a.href = data.file.data;
    a.download = data.file.name;
    a.textContent = `📥 ${data.file.name}`;
    div.appendChild(a);
    div.appendChild(msgTime);
    document.getElementById("msgArea").append(div);
  }
  if (data.text != "") {
    const msgArea = document.getElementById("msgArea");
    const msgElement = document.createElement("p");
    msgElement.textContent = `${data.text}`;
    msgElement.classList = data.by == myId ? "msgItemUser" : "msgItem";
    div.appendChild(msgElement);
    div.appendChild(msgTime);
    msgArea.append(div);
  }
});
