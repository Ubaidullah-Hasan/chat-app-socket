const socket = io();

const messageContainer = document.getElementById("message-container");
const clientsTotal = document.getElementById("clients-total");
const mblClientsTotal = document.getElementById("mbl-client");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

let messageTone;


window.addEventListener("click", (event) => {
    if (!messageTone) {
        messageTone = new Audio("/notification-sound.mp3");
    }
});

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
})

socket.on("total-clients", (data) => {
    clientsTotal.innerText = `Total clients : ${data}`;
    mblClientsTotal.innerText = data;
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
    addMessageToUi(false, data)
    if (messageTone) {
        messageTone.play();
    }
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
    messageContainer.scrollTo("0", messageContainer.scrollHeight)
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

function clearFeedback() {
    document.querySelectorAll("li.message-feedback").forEach(el => {
        el.parentNode.removeChild(el);
    })
}


// user name
const inputField = document.getElementById("user-name-input");
const startButton = document.getElementById("start-chat-btn");
const formContainer = document.getElementById("user-name");

inputField.addEventListener("input", () => {
    if (inputField.value.trim().length > 0) {
        startButton.disabled = false;
        nameInput.value = inputField.value;
    } else {
        startButton.disabled = true;
        nameInput.value = "Anonymous";
    }
})

formContainer.addEventListener("submit", (e) => {
    e.preventDefault();
    formContainer.style.display = "none";
})