// import moment from 'moment';

const socket = io();

const messageContainer = document.getElementById("message-container");
const clientsTotal = document.getElementById("clients-total");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

let messageTone;


messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    messageTone = new Audio("/notification-sound.mp3");
    sendMessage();
})

socket.on("total-clients", (data) => {
    clientsTotal.innerText = `Total clients : ${data}`;
})


function sendMessage() {
    if (messageInput.value === "") return;
    const message = messageInput.value;
    const data = {
        name: nameInput.value,
        message: message,
        dateTime: new Date()
    }
    socket.emit("message", data);
    addMessageToUi(true, data);
    messageInput.value = "";
}


socket.on("chat-message", (data) => {
    messageTone.play();
    addMessageToUi(false, data)
})


function addMessageToUi(isOwnMessage, data) {
    clearFeedback();
    const element = `
            <li class=${isOwnMessage ? "message-right" : "message-left"}>
                <p class="message">
                    ${data.message}
                    <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
                </p>
            </li>`

    messageContainer.innerHTML += element;
    scrollToBottom();
}


function scrollToBottom() {
    messageContainer.scrollTo("-20px", messageContainer.scrollHeight)
}

messageInput.addEventListener("focus", () => {
    socket.emit("feedback", {
        feedback: `✍️ ${nameInput.value} is typing...`
    })


})

messageInput.addEventListener("keypress", () => {
    socket.emit("feedback", {
        feedback: `✍️ ${nameInput.value} is typing...`
    })


})

messageInput.addEventListener("blur", () => {
    socket.emit("feedback", {
        feedback: ""
    })
})


// recieve feedback showFeedback
socket.on("feedback", (data) => {
    clearFeedback();

    const element = `
            <li class="message-feedback">
                <p class="feedback" id="feedback">
                    ${data.feedback}
                </p>
            </li>
    `
    messageContainer.innerHTML += element;
})

function clearFeedback(){
    document.querySelectorAll("li.message-feedback").forEach(el => {
        el.parentNode.removeChild(el);
    })
}