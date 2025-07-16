// import moment from 'moment';

const socket = io();

const messageContainer = document.getElementById("message-container");
const clientsTotal = document.getElementById("clients-total");
const nameInput = document.getElementById("name-input");
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
    if(messageInput.value === "") return;
    const message = messageInput.value;
    const data = {
        name: nameInput.value,
        message: message,
        dateTime: new Date()
    }
    socket.emit("message", data);
    addMessageToUi(true, data);
    messageInput.value = ""
}


socket.on("chat-message", (data)=> {
    addMessageToUi(false, data)
})


function addMessageToUi(isOwnMessage, data) {
    const element = `
            <li class=${isOwnMessage ? "message-right" : "message-left"}>
                <p class="message">
                    ${data.message}
                    <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
                </p>
            </li>`

    messageContainer.innerHTML += element;
}
