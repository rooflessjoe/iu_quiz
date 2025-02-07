const token = sessionStorage.getItem('token');
const socket = io.connect('https://iu-quiz-backend.onrender.com/quizAPI', {
    query: {token}
});

//DOM-Elemente für Lobby und Raum
const lobbyView = document.getElementById('lobby-view');
const roomView = document.getElementById('room-view');
const roomTitle = document.getElementById('room-title');
/*const roomListElement = document.querySelector('.room-list');*/

//Elemente fürs Raumerstellen formular in Lobby
const roomNameInput = document.getElementById('roomName')
const categoryInput = document.getElementById('categorySelect');
const questionCountInput = document.getElementById('questionCount');
const createRoomForm = document.querySelector('.form-create-room');

//Element des 'Quiz Starten' Button in Raum view
const startQuizBtn = document.getElementById('start-quiz');

//Element fürs Verlassen eines Raumes
const leaveRoomBtn = document.getElementById('leave-room');

// Anzeigeelemente für Fragen, Antworten und Punktestand
const questionDisplay = document.getElementById('question-display');
const answerDisplay = document.getElementById('answer-display');
const scoreDisplay = document.getElementById('score-display');

// DOM-Elemente für den Chat im Raum
const msgForm = document.querySelector('.form-msg');
const msgInput = document.getElementById('message');
const chatDisplay = document.querySelector('.chat-display');

// const chatRoom = document.querySelector('#room');
const activity = document.querySelector('.activity');
const usersList = document.querySelector('.user-list');
const roomList = document.querySelector('.room-list');
// const chatDisplay = document.querySelector('.chat-display');
// const categoryInput = document.querySelector('#category');
// const questionCountInput = document.querySelector('#questionCount');
const errorMessage = document.getElementById('error-message');

//Create Room
createRoomForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const roomName = roomNameInput.value.trim();
    const category = categoryInput.value
    const questionCount = questionCountInput.value.trim();

    let errorText = '';
    if (questionCount < 1) {
        errorText = 'Anzahl der Fragen muss mindestens 1 sein'
    }

    if (!roomName || !category || !questionCount) return;

    if (errorText) {
        errorMessage.style.display = 'block'
        errorMessage.textContent = errorText;
        return;
    }else{
        errorMessage.style.display = 'none'
    }
    // Sende alle Daten an das Backend: Raum, Token, Kategorie und Frageanzahl
    socket.emit('createRoom', {
        room: roomName,
        token: token,
        category: category,
        questionCount: questionCount
    });

    // Formularfelder leeren
    roomNameInput.value = '';
    categoryInput.value = '';
    questionCountInput.value = '';

    // Wechsel zur Raum-Ansicht: Lobby ausblenden, Raum anzeigen
    lobbyView.classList.add('d-none');
    roomView.classList.remove('d-none');
    roomTitle.textContent = `Raum: ${roomName}`;
    leaveRoomBtn.classList.remove('d-none');
});


function sendMessage(e) {
    e.preventDefault();
    if (getUsernameFromToken() && msgInput.value) {
        socket.emit('message', {
            name: getUsernameFromToken(),
            text: msgInput.value
        });
        msgInput.value = "";
    }
    msgInput.focus();
}


//Start Quiz
startQuizBtn.addEventListener('click', () => {
    socket.emit('startQuiz');
    startQuizBtn.classList.add('d-none');
    leaveRoomBtn.classList.add('d-none');

});

//Leave Room
leaveRoomBtn.addEventListener('click', () => {
    socket.emit('leaveRoom');
    leaveRoomBtn.classList.add('d-none');
})

socket.on('leftRoom',()=>{
    lobbyView.classList.remove('d-none');
    roomView.classList.add('d-none');
})

function enterRoom(roomName) {
    const token = sessionStorage.getItem('token');
    console.log("Entering room:", roomName);
    socket.emit('enterRoom', {
        room: roomName,
        token: token
    });
    lobbyView.classList.add('d-none');
    leaveRoomBtn.classList.remove('d-none');
    startQuizBtn.classList.remove('d-none');
    roomView.classList.remove('d-none');
    roomTitle.textContent = `Raum: ${roomName}`;
}

socket.on('listOfCategories', (data) => {
    showCategories(data)
})



document.querySelector('.form-msg').addEventListener('submit', sendMessage);
//document.querySelector('.form-join').addEventListener('submit', enterRoom);

msgInput.addEventListener('keypress', () => {
    const username = getUsernameFromToken();
    if (username) {
        socket.emit('activity', username);
    }
});


// Listen for messages
socket.on("message", (data) => {
    activity.textContent = "";
    const { name, text, time } = data;
    const li = document.createElement('li');
    li.className = 'post';
    if (name === getUsernameFromToken()) li.className = 'post post--left';
    if (name !== getUsernameFromToken() && name !== 'Admin') li.className = 'post post--right';
    if (name !== 'Admin') {
        li.innerHTML = `<div class="post__header ${name === getUsernameFromToken()
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
    console.log(rooms);
});

function showUsers(users) {
    usersList.textContent = '';
    if (users && users.length > 0) {
        usersList.innerHTML = `<em>Spieler im Raum:</em>`;
        const ul = document.createElement('ul');
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user.name;
            ul.appendChild(li);
        });
        usersList.appendChild(ul);
    }else {
        usersList.innerHTML = '<em>Keine Spieler im Raum</em>';
    }
}

function showRooms(rooms) {
    // Holen des tbody-Elements, wo die Räume eingefügt werden sollen
    const roomList = document.querySelector('.room-list');
    roomList.innerHTML = '';  // Leere die Raumliste, bevor neue Räume eingefügt werden

    if (rooms && rooms.length > 0) {
        rooms.filter(room => room.gameStatus === 'open').forEach(room => {
            // Erstelle eine neue Tabellenzeile (tr)
            const tr = document.createElement('tr');

            // Erstelle Zellen für den Raumname, Kategorie und Anzahl Fragen
            const tdName = document.createElement('td');
            tdName.textContent = room.room;  // Raumname einfügen
            const tdCategory = document.createElement('td');
            tdCategory.textContent = room.category;  // Kategorie einfügen
            const tdQuestionCount = document.createElement('td');
            tdQuestionCount.textContent = room.questionCount;  // Anzahl der Fragen einfügen

            // Erstelle die Aktion (Beitreten-Button)
            const tdAction = document.createElement('td');
            const btn = document.createElement('button');
            btn.textContent = 'Beitreten';
            btn.addEventListener('click', () => {
                console.log("Beitreten-Button geklickt:", room.room);
                enterRoom(room.room);  // Funktion zum Beitreten des Raums
            });

            tdAction.appendChild(btn);  // Button in die Aktion-Zelle einfügen

            // Alle Zellen (td) zur Zeile (tr) hinzufügen
            tr.appendChild(tdName);
            tr.appendChild(tdCategory);
            tr.appendChild(tdQuestionCount);
            tr.appendChild(tdAction);

            // Die Zeile zur Raumliste (tbody) hinzufügen
            roomList.appendChild(tr);
        });
    } else {
        // Falls keine Räume vorhanden sind
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 4;  // Damit die Nachricht über die gesamte Breite geht
        td.textContent = 'Keine aktiven Räume';
        tr.appendChild(td);
        roomList.appendChild(tr);
    }
}

function showCategories(categories) {
    const select = document.getElementById('categorySelect');
    if (!select) {
        console.error("Das Element mit der ID 'categorySelect' wurde nicht gefunden.");
        return;
    }

    // Platzhalter erhalten und restliche Optionen entfernen
    select.innerHTML = '<option value="" disabled selected>Kategorie auswählen</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
}


socket.on('question', (data)=> {
    startQuizBtn.classList.add('d-none');
    leaveRoomBtn.classList.add('d-none');
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
    leaveRoomBtn.classList.remove('d-none');
    questionDisplay.textContent = '';
    answerDisplay.textContent = '';
});
//Test Comment
socket.on('failedToken', ()=>{
    window.location.href = '../index.html';
})


function getUsernameFromToken() {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Dekodiere den Payload
        return payload.username; // Passe dies an, falls der Benutzername unter einem anderen Schlüssel gespeichert ist
    } catch (error) {
        console.error('Fehler beim Dekodieren des Tokens:', error);
        return null;
    }
}
