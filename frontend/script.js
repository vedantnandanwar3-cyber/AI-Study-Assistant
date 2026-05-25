window.onload = function () {
    loadTasks();
};

function addTask() {

    const input = document.getElementById("taskInput");

    const taskText = input.value;

    if(taskText === "") {
        alert("Please enter a task");
        return;
    }

    createTaskElement(taskText);

    saveTask(taskText);

    fetch("http://127.0.0.1:8000/tasks", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            task: taskText
        })

    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });

    input.value = "";

}

function createTaskElement(taskText) {

    const li = document.createElement("li");

    li.innerHTML = `
        ${taskText}
        <button onclick="removeTask(this, '${taskText}')">Delete</button>
    `;

    document.getElementById("taskList").appendChild(li);
}

function removeTask(button, taskText) {

    button.parentElement.remove();

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks = tasks.filter(task => task !== taskText);

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveTask(taskText) {

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.push(taskText);

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(task => {
        createTaskElement(task);
    });
}

let time = 1500;

let timerRunning = false;

function startTimer() {

    if(timerRunning) return;

    timerRunning = true;

    const timerElement = document.getElementById("timer");

    const countdown = setInterval(() => {

        let minutes = Math.floor(time / 60);

        let seconds = time % 60;

        seconds = seconds < 10 ? "0" + seconds : seconds;

        timerElement.innerText = `${minutes}:${seconds}`;

        time--;

        if(time < 0) {

            clearInterval(countdown);

            timerElement.innerText = "Time's Up!";

            alert("Pomodoro Session Complete!");

            timerRunning = false;

            time = 1500;
        }

    }, 1000);
}

window.onload = function () {

    loadTasks();

    loadNotes();
};

function saveNotes() {

    const notes = document.getElementById("notesInput").value;

    localStorage.setItem("notes", notes);

    alert("Notes Saved!");
}

function loadNotes() {

    const savedNotes = localStorage.getItem("notes");

    if(savedNotes) {

        document.getElementById("notesInput").value = savedNotes;
    }
}

function toggleTheme() {

    document.body.classList.toggle("light-mode");
}


function signup() {

    const username = document.getElementById("username").value;

    const password = document.getElementById("password").value;

    fetch("http://127.0.0.1:8000/signup", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            username: username,
            password: password
        })

    })
    .then(response => response.json())
    .then(data => {

        alert(data.message);

    });
}

function login() {

    const username = document.getElementById("username").value;

    const password = document.getElementById("password").value;

    fetch("http://127.0.0.1:8000/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            username: username,
            password: password
        })

    })
    .then(response => response.json())
    .then(data => {

        if(data.message === "Login Successful") {

            localStorage.setItem("loggedInUser", username);

            document.getElementById("welcomeUser").innerText =
                "Welcome, " + username;

            alert("Login Successful");

        }
        else {

            alert("Invalid Credentials");

        }

    });


}

function logout() {

    localStorage.removeItem("loggedInUser");

    const welcome = document.getElementById("welcomeUser");

    welcome.innerHTML = "";

    location.reload();
}

window.onload = function() {

    const user = localStorage.getItem("loggedInUser");

    if(user) {

        document.getElementById("welcomeUser").innerText =
            "Welcome, " + user;
    }

    loadTasks();
    loadNotes();
    loadChatHistory();
}

function sendMessage() {

    const input = document.getElementById("chatInput");

    const message = input.value;

    if(message === "") return;

    const chatBox = document.getElementById("chatBox");

    let chats =
        JSON.parse(localStorage.getItem("chatHistory")) || [];

    chats.push({
        type: "user",
        text: message
    });

    localStorage.setItem(
        "chatHistory",
        JSON.stringify(chats)
    );

    chatBox.innerHTML += `
        <div class="message user">
            ${message}
        </div>
    `;

    chatBox.innerHTML += `
        <div class="message bot typing" id="typing">
            AI is typing...
        </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

    fetch("http://127.0.0.1:8000/chat", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            message: message
        })

    })
    .then(response => response.json())
    .then(data => {

        document.getElementById("typing").remove();

        chatBox.innerHTML += `
            <div class="message bot">
                ${data.reply}
            </div>
        `;

        let chats =
            JSON.parse(localStorage.getItem("chatHistory")) || [];

        chats.push({
            type: "bot",
            text: data.reply
        });

        localStorage.setItem(
            "chatHistory",
            JSON.stringify(chats)
        );

        chatBox.scrollTop = chatBox.scrollHeight;
    });


    input.value = "";
}

document.getElementById("chatInput")
.addEventListener("keypress", function(event) {

    if(event.key === "Enter") {

        sendMessage();
    }
});

function loadChatHistory() {

    const savedChats =
        JSON.parse(localStorage.getItem("chatHistory")) || [];

    const chatBox = document.getElementById("chatBox");

    savedChats.forEach(chat => {

        chatBox.innerHTML += `
            <div class="message ${chat.type}">
                ${chat.text}
            </div>
        `;
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}