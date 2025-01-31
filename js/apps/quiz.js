const token = sessionStorage.getItem('token');
const socket = io.connect('https://testingbackendrepo.onrender.com/quizAPI', {
    query: {token}
});

const msgInput = document.querySelector('#message');
const nameInput = document.querySelector('#name');
const chatRoom = document.querySelector('#room');
const activity = document.querySelector('.activity');
const usersList = document.querySelector('.user-list');
const roomList = document.querySelector('.room-list');
const chatDisplay = document.querySelector('.chat-display');

const categoryInput = document.querySelector('#category');
const questionCountInput = document.querySelector('#questionCount');

function sendMessage(e) {
    e.preventDefault();
    if (nameInput.value && msgInput.value && chatRoom.value) {
        socket.emit('message', {
            name: nameInput.value,
            text: msgInput.value
        });
        msgInput.value = "";
    }
    msgInput.focus();
}

function changeRoom(e){
    e.preventDefault()
    console.log(categoryInput.value)
    socket.emit('startQuiz', {
        questionCount: parseInt(questionCountInput.value),
        category: categoryInput.value

    });
    categoryInput.value=""
}



function enterRoom(e) {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    if (nameInput.value && chatRoom.value) {
        socket.emit('enterRoom', {
            name: nameInput.value,
            room: chatRoom.value,
            token: token
        });
    }
}

document.querySelector('.form-room')
    .addEventListener('submit', changeRoom);
document.querySelector('.form-msg')
    .addEventListener('submit', sendMessage);
document.querySelector('.form-join')
    .addEventListener('submit', enterRoom);

msgInput.addEventListener('keypress', () => {
    socket.emit('activity', nameInput.value);
});

// Listen for messages
socket.on("message", (data) => {
    activity.textContent = "";
    const { name, text, time } = data;
    const li = document.createElement('li');
    li.className = 'post';
    if (name === nameInput.value) li.className = 'post post--left';
    if (name !== nameInput.value && name !== 'Admin') li.className = 'post post--right';
    if (name !== 'Admin') {
        li.innerHTML = `<div class="post__header ${name === nameInput.value
            ? 'post__header--user'
            : 'post__header--reply'
        }">
        <span class="post__header--name">${name}</span> 
        <span class="post__header--time">${time}</span> 
        </div>
        <div class="post__text">${text}</div>`;
    } else {
        li.innerHTML = `<div class="post__text">${text}</div>`;
    }
    document.querySelector('.chat-display').appendChild(li);

    chatDisplay.scrollTop = chatDisplay.scrollHeight;
});

let activityTimer;
socket.on("activity", (name) => {
    activity.textContent = `${name} is typing...`;

    // Clear after 3 seconds
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
        activity.textContent = "";
    }, 3000);
});

// User- und Raum-Listen aktualisieren
socket.on('userList', ({ users }) => {
    showUsers(users);
});

socket.on('roomList', ({ rooms }) => {
    showRooms(rooms);
});

function showUsers(users) {
    usersList.textContent = '';
    if (users) {
        usersList.innerHTML = `<em>Users in ${chatRoom.value}:</em>`;
        users.forEach((user, i) => {
            usersList.textContent += ` ${user.name}`;
            if (users.length > 1 && i !== users.length - 1) {
                usersList.textContent += ",";
            }
        });
    }
}

function showRooms(rooms) {
    roomList.textContent = '';
    if (rooms) {
        roomList.innerHTML = '<em>Active Rooms:</em>';
        rooms.forEach((room, i) => {
            roomList.textContent += ` ${room}`;
            if (rooms.length > 1 && i !== rooms.length - 1) {
                roomList.textContent += ",";
            }
        });
    }
}

socket.on('question', (data)=> {
    const {question_id, question} = data
    console.log(data)
    const questionDisplay = document.getElementById('question-display')
    if(questionDisplay){
        questionDisplay.textContent = '';
        questionDisplay.textContent = `Frage: ${question}`
    }
    if (question_id !== undefined) {
        socket.emit('askForAnswers', { question_id });
    } else {
        console.log('question_id ist undefined');
    }
})

socket.on('answers', (data) => {
    console.log('Client: Antworten:', data)
    const answerDisplay = document.getElementById('answer-display')
    if (answerDisplay) {
        // Alle Antworten anzeigen
        answerDisplay.innerHTML = ''
        data.forEach(answer => {
            const answerElement = document.createElement('button')
            answerElement.textContent = `Antwort: ${answer.answer}`
            answerElement.setAttribute('data-answer-id', answer.answer_id)
            answerElement.setAttribute('data-question-id', answer.question_id)
            answerElement.addEventListener('click', (event) => {
                const playerAnswer = event.target.getAttribute('data-answer-id');
                const question_id = event.target.getAttribute('data-question-id');
                console.log('Antwort-ID:', playerAnswer, 'Frage-ID:', question_id); // Logge die IDs
                socket.emit('submitAnswer', { playerAnswer, question_id });
            })

            answerDisplay.appendChild(answerElement)
        })
    }
})

socket.on('evaluatedAnswer', (data)=>{
    console.log('Ev Antwort:', data)
    const{ correct, message, score } =data
    //Prototype
    socket.emit('nextQuestion')
})


socket.on('quizOver', (data) => {
    const scoreDisplay = document.getElementById('score-display');
    if (scoreDisplay) {
        data.forEach(u => {
            const scoreElement = document.createElement('div');
            scoreElement.textContent = `Name: ${u.name} Score: ${u.score}`;
            scoreDisplay.appendChild(scoreElement);
        });
    }
});
//Test Comment
socket.on('failedToken', ()=>{
    window.location.href = '../index.html';
})





