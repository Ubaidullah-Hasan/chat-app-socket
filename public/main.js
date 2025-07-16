const socket = io();

const clientsTotal = document.getElementById("clients-total");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");


messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
})

socket.on("total-clients", (data) => {
    clientsTotal.innerText = `Total clients : ${data}`;
})


function sendMessage() {
    const message = messageInput.value;
    console.log(message);
}