const token = sessionStorage.getItem('token');
const socket = io.connect('https://iu-quiz-backend.onrender.com/quizAPI', {
    query: {token}
});

//DOM-Elements for Lobby and Room
const lobbyView = document.getElementById('lobby-view');
const roomView = document.getElementById('room-view');
const roomTitle = document.getElementById('room-title');

//Elements to create Rooms in Lobby
const roomNameInput = document.getElementById('roomName')
const categoryInput = document.getElementById('categorySelect');
const questionCountInput = document.getElementById('questionCount');
const createRoomForm = document.querySelector('.form-create-room');
const timerEnabledInput = document.getElementById('timerEnabled');
const timerInput = document.getElementById('timerInput');
const timerEnterOption = document.getElementById('timerEnterOption');

//Element to start Quiz in Room
const startQuizBtn = document.getElementById('start-quiz');

//Element to leave Room
const leaveRoomBtn = document.getElementById('leave-room');

// Displayelements to shows Questions, Answers and Scoreboard
const questionDisplay = document.getElementById('question-display');
const answerDisplay = document.getElementById('answer-display');
const scoreDisplay = document.querySelector('.score-display');
const scoreboard = document.querySelector('.scoreboard');
const questionSection = document.querySelector('.question-container');
const chatQuizDisplay = document.querySelector('.chatQuizDisplay');
const currentQuestionDisplay = document.getElementById('current-question-count-display');

// DOM-Elements for Chat, Error and Lists
const msgForm = document.querySelector('.form-msg');
const msgInput = document.getElementById('message');
const chatDisplay = document.querySelector('.chat-display');
const activity = document.querySelector('.activity');
const usersList = document.querySelector('.user-list');
const roomList = document.querySelector('.room-list');
const chatSection = document.querySelector('.chat-section');
const errorMessage = document.getElementById('error-message');


//Timer deactivated when entering Lobby to create a room
timerInput.disabled = true;

//Timer variables
let timer;
let timerActive = false;

/*Timer variable to show if someone is typing.
  Used in socket.on('activity')
*/
let activityTimer;

//Timer Functions
function startTimer(duration, question_id) {
    //stops timer if one is running
    stopTimer();

    //activates timer, sets duration and updates display
    let timeLeft = duration;
    timerActive = true;
    updateTimerDisplay(timeLeft);

    //starts timer and updates display
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);

        //if timer reaches 0 sends "null" answer to backend
        if (timeLeft <= 0) {
            clearInterval(timer);
            timerActive = false;
            socket.emit('submitAnswer', {
                playerAnswer: null,
                question_id: question_id
            });
        }
    },1000)
}

function stopTimer(){
    if(timerActive){
        clearInterval(timer);
        timerActive = false;
    }
    updateTimerDisplay(0)
}

function updateTimerDisplay(time) {
    //creates timer Elements and fills it with current time
    const timerElement = document.getElementById('timer-display');
    if (timerElement) {
        timerElement.textContent = `Verbleibenen Zeit: ${time}`
    }
}

//Event Listeners

//Create a new Room
createRoomForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //gets values from form
    const roomName = roomNameInput.value.trim();
    const category = categoryInput.value
    const questionCount = questionCountInput.value.trim();
    const timerEnabled = timerEnabledInput.checked;
    const timerTime = timerInput.value.trim();

    //chekcs if any invalid inputs are present and throws error
    let errorText = '';
    if (questionCount < 1) {
        errorText = 'Anzahl der Fragen muss mindestens 1 sein'
    }
    if (timerEnabled){
        if (timerTime < 1){
            errorText = 'Zeit darf nicht 0 oder negativ sein'
        }
    }

    if (!roomName || !category || !questionCount) return;

    if(timerEnabled && !timerTime) {
        return;
    }

    if (errorText) {
        errorMessage.style.display = 'block'
        errorMessage.textContent = errorText;
        return;
    }else{
        errorMessage.style.display = 'none'
    }
    // sends Data to backend including the token to get the Users username
    socket.emit('createRoom', {
        room: roomName,
        token: token,
        category: category,
        questionCount: questionCount,
        timerEnabled: timerEnabled,
        timer: timerTime,
    });

    // clears the form
    roomNameInput.value = '';
    categoryInput.value = '';
    questionCountInput.value = '';
    timerEnabledInput.value = '';

    // changes to Room view and hides Lobby
    lobbyView.classList.add('d-none');
    roomView.classList.remove('d-none');
    roomTitle.textContent = `Raum: ${roomName}`;
    leaveRoomBtn.classList.remove('d-none');
    chatDisplay.innerHTML = '';
    scoreboard.classList.add('d-none');
    chatSection.classList.remove('col-md-4');

});

//Enables/Disables the timer field in create form
timerEnabledInput.addEventListener('change', function () {
    //enables or disables the timer input field depending if timer is activated or not
    if (this.checked) {
        timerEnterOption.classList.remove('hidden');
        timerInput.disabled = false;
    }else{
        timerEnterOption.classList.add('hidden');
        timerInput.disabled = true;
        timerInput.value = '';
    }
})

//Activates Function Message when pressing Submit on Chat form (msgForm)
msgForm.addEventListener('submit', sendMessage);

//sends activity of user to backend when user is typing
msgInput.addEventListener('keypress', () => {
    const username = getUsernameFromToken();
    //if username present sends activity handle with the username to backend
    if (username) {
        socket.emit('activity', username);
    }
});

//starts quiz
startQuizBtn.addEventListener('click', () => {
    //emits start quiz and hides the startquiz/leaveRoom button
    socket.emit('startQuiz');
    startQuizBtn.classList.add('d-none');
    leaveRoomBtn.classList.add('d-none');

});

//leave room
leaveRoomBtn.addEventListener('click', () => {
    //emits leaveRoom and hides the leave room button
    socket.emit('leaveRoom');
    leaveRoomBtn.classList.add('d-none');
})


//Listen Socket handles

// if Token fails on Backend
socket.on('failedToken', ()=>{
    //directs the user back to index.html and removes the token from sessionStore to log them out
    window.location.href = '../index.html';
    sessionStorage.removeItem('token');
})

//handles list of Categories
socket.on('listOfCategories', (data) => {
    showCategories(data)
})
//handles list of rooms
socket.on('roomList', ({ rooms }) => {
    showRooms(rooms);
    console.log(rooms);
});
//handles list of users
socket.on('userList', ({ users }) => {
    showUsers(users);
});


// Listen for messages
socket.on("message", (data) => {
    //deconstructs incoming data and creates a list
    activity.textContent = "";
    const { name, text, time } = data;
    const li = document.createElement('li');
    li.className = 'post';

    //checks if incoming message is sent by user, admin or another user and styles them accordingly
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
    //adds new messages to Chat
    document.querySelector('.chat-display').appendChild(li);

    chatDisplay.scrollTop = chatDisplay.scrollHeight;
});

// listens for activity
socket.on("activity", (name) => {
    //sets activity message shown
    activity.textContent = `${name} is typing...`;

    // Clears activity after 3 seconds
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
        activity.textContent = "";
    }, 3000);
});

//listens for questions
socket.on('question', (data)=> {
    //hides startquiz and leaveRoom button
    startQuizBtn.classList.add('d-none');
    leaveRoomBtn.classList.add('d-none');

    //shows quiz area and scales down chat
    questionSection.classList.remove('d-none');
    chatSection.classList.add('col-md-4');
    questionSection.classList.add('col-md-8');

    //deconstructs incoming data and creates element for Question to be displayed
    const {currentQuestion, questionCount, question_id, question, timerEnabled, timerDuration} = data
    const questionDisplay = document.getElementById('question-display')

    if(questionDisplay){
        //clears content from display and adds the Question
        questionDisplay.textContent = '';
        questionDisplay.textContent = `${question}`
        if (timerEnabled) {
            //if a timer is used parses number
            const parsedDuration = Number(timerDuration)
            console.log('Timer gestartet mit Dauer:', parsedDuration);

            if (parsedDuration > 0) {
                //starts the timer with duration from backend
                stopTimer();
                startTimer(parsedDuration, question_id);
            } else {
                console.warn('Timer-Dauer ungültig:', timerDuration);
            }
        }
    }
    //displays current Question
    const currentQuestionDisplay = document.getElementById('current-question-count-display')
    if (currentQuestionDisplay) {
        currentQuestionDisplay.textContent = '';
        currentQuestionDisplay.textContent = `Frage: ${currentQuestion}/${questionCount}`;
        currentQuestionDisplay.classList.remove('d-none');
    }

    //emits ask for answers with the question id
    if (question_id !== undefined) {
        socket.emit('askForAnswers', { question_id });
    } else {
        console.log('question_id ist undefined');
    }
})

//listens for answers
socket.on('answers', (data) => {
    //creates AnswerDisplay element
    const answerDisplay = document.getElementById('answer-display')
    if (answerDisplay) {
        // shows all answers with a forEach loop
        answerDisplay.innerHTML = ''
        shuffleArray(data)
        data.forEach(answer => {
            const answerElement = document.createElement('button')
            answerElement.textContent = answer.answer;
            answerElement.classList.add('btn', 'btn-primary','p-2','px-4')

            answerElement.setAttribute('data-answer-id', answer.answer_id)
            answerElement.setAttribute('data-question-id', answer.question_id)

            //adds Event Listener which stops timer on answer and gets the Answer to send it to Backend
            answerElement.addEventListener('click', (event) => {
                if (timerActive){
                    stopTimer();
                }
                const playerAnswer = event.target.getAttribute('data-answer-id');
                const question_id = event.target.getAttribute('data-question-id');
                console.log('Antwort-ID:', playerAnswer, 'Frage-ID:', question_id); // Logge die IDs
                socket.emit('submitAnswer', { playerAnswer, question_id });
            })

            answerDisplay.appendChild(answerElement)
        })
    }
})

//listens for evaluated Answers
socket.on('evaluatedAnswer', (data)=>{

    console.log('Ev Antwort:', data)
    const{ correct, message, score } =data
    //Prototype
    socket.emit('nextQuestion')
})

//listens for Quiz over
socket.on('quizOver', (userScores, gameAnswersArray) => {

    // reactivates tbody element
    const scoreDisplay = document.querySelector('.score-display');
    if (!scoreDisplay) return;

    // Removes old Entries
    scoreDisplay.innerHTML = '';

    // Sorts Data by score descending and adds the information to the Table
    if (userScores && userScores.length > 0) {
        userScores.sort((a, b) => b.score - a.score);
        console.log('sorted data:', userScores);
        let rank = 0;
        userScores.forEach(u => {
            rank++;
            const tr = document.createElement('tr');

            const tdRank = document.createElement('td');
            tdRank.textContent = rank;
            const tdName = document.createElement('td');
            tdName.textContent = u.name;
            const tdScore = document.createElement('td');
            tdScore.textContent = u.score;

            tr.appendChild(tdRank);
            tr.appendChild(tdName);
            tr.appendChild(tdScore);

            scoreDisplay.appendChild(tr);
        });
    } else {
        console.warn('Keine Daten für das Scoreboard erhalten');
    }
    //checks if gameAnswersArray has content and logs it
    if (gameAnswersArray) {
        console.log(gameAnswersArray);
        const answersSummary = document.querySelector('.player-answers-summary-display');
        if (!answersSummary) return;

        // remove old content
        answersSummary.innerHTML = '';

        // Gets all Playernames (key of array)
        const players = Object.keys(gameAnswersArray);
        if (players.length === 0) return;

        const numQuestions = gameAnswersArray[players[0]].length;

        for (let i = 0; i < numQuestions; i++) {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question-summary');

            // Headline for Question
            const questionHeader = document.createElement('h4');
            questionHeader.textContent = `Frage ${i + 1}:`;
            questionDiv.appendChild(questionHeader);

            // Collects the Answers from all players for a question
            const answersList = players.map(player => {
                const answer = gameAnswersArray[player][i];
                // converst the boolean into check and x
                const answerText = answer ? "✓" : "✗";
                return `${player}: ${answerText}`;
            });

            // Adds the Answers as paragraphs
            const answersParagraph = document.createElement('p');
            answersParagraph.textContent = answersList.join(', ');
            questionDiv.appendChild(answersParagraph);

            // adds the questionContainer to summery
            answersSummary.appendChild(questionDiv);
        }}


    // makes scoreboard visible
    scoreboard.classList.add('col-md-8');
    scoreboard.classList.remove('d-none');
    leaveRoomBtn.classList.remove('d-none');

    // clears Question and Answer section and hides them
    questionDisplay.textContent = '';
    answerDisplay.textContent = '';
    questionSection.classList.add('d-none');
    currentQuestionDisplay.classList.add('d-none');
});

//listens for left room
socket.on('leftRoom',()=>{
    //shows Lobby and startQuizBtn again
    lobbyView.classList.remove('d-none');
    startQuizBtn.classList.remove('d-none');


    //hides room, Scoreboard and question
    roomView.classList.add('d-none');
    scoreboard.classList.add('d-none');
    questionSection.classList.add('d-none');
    currentQuestionDisplay.classList.add('d-none');

    //removes split of Chat and Question/Scoreboard
    chatSection.classList.remove('col-md-4');
    questionSection.classList.remove('col-md-8');
    scoreDisplay.classList.remove('col-md-8');

    //makes Chat centered again
    chatSection.classList.remove('float-end')

    //clear Scoreboard display
    scoreDisplay.innerHTML = '';
})

//Functions

//gets Username from Token
function getUsernameFromToken() {
    //gets token from session Storage
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    //decodes Payload and returns the username
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.username
    } catch (error) {
        console.error('Fehler beim Dekodieren des Tokens:', error)
        return null
    }
}


//converts Array of users into a list with HTML Elements
function showUsers(users) {
    //clears Userslist
    usersList.textContent = '';

    //creates an unordered List of Users from recieved Data
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

//converts Array of rooms into a table in HTML
function showRooms(rooms) {
    // reactivates the roomList Element
    const roomList = document.querySelector('.room-list');
    //clear the list
    roomList.innerHTML = '';

    const openRooms = rooms.filter(room => room.gameStatus === 'open')

    //filters the rooms by games "open" games
    if (openRooms && openRooms.length > 0) {
        openRooms.forEach(room => {
            const tr = document.createElement('tr');

            const tdName = document.createElement('td');
            tdName.textContent = room.room;
            const tdCategory = document.createElement('td');
            tdCategory.textContent = room.category;
            const tdQuestionCount = document.createElement('td');
            tdQuestionCount.textContent = room.questionCount;

            // Creates Action Button to join room
            const tdAction = document.createElement('td');
            const btn = document.createElement('button');
            btn.textContent = 'Beitreten';
            //adds EventListener to execute function to join room
            btn.addEventListener('click', () => {
                console.log("Beitreten-Button geklickt:", room.room);
                enterRoom(room.room);
            });

            tdAction.appendChild(btn);
            tr.appendChild(tdName);
            tr.appendChild(tdCategory);
            tr.appendChild(tdQuestionCount);
            tr.appendChild(tdAction);

            roomList.appendChild(tr);
        });
    } else {
        // if no rooms available returns and empty list
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 4;  // Damit die Nachricht über die gesamte Breite geht
        td.textContent = 'Keine aktiven Räume';
        tr.appendChild(td);
        roomList.appendChild(tr);
    }
}

//converts Array of categories into a select list in HTML
function showCategories(categories) {
    //creates the Select Element
    const select = document.getElementById('categorySelect');
    if (!select) {
        console.error("Das Element mit der ID 'categorySelect' wurde nicht gefunden.");
        return;
    }

    // adds Placeholder
    select.innerHTML = '<option value="" disabled selected>Kategorie auswählen</option>';

    // adds recieved Data to select list
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
}


//Sends a Message to the Backend
function sendMessage(e) {
    e.preventDefault();
    //gets username from token and message
    if (getUsernameFromToken() && msgInput.value) {
        //emits messages to server and clears input
        socket.emit('message', {
            name: getUsernameFromToken(),
            text: msgInput.value
        });
        msgInput.value = "";
    }
    msgInput.focus();
}

//function to enter a room
function enterRoom(roomName) {
    //gets token
    const token = sessionStorage.getItem('token');
    //emits enterRoom to backend
    socket.emit('enterRoom', {
        room: roomName,
        token: token
    });
    //hides Lobby, shows LeaveRoom/StartQuizBtn/Room, sets roomtitle and clear chat
    lobbyView.classList.add('d-none');
    leaveRoomBtn.classList.remove('d-none');
    startQuizBtn.classList.remove('d-none');
    roomView.classList.remove('d-none');
    roomTitle.textContent = `Raum: ${roomName}`;
    chatDisplay.innerHTML = '';

    // resets scoreboard
    scoreboard.classList.add('d-none');
    const scoreDisplay = document.querySelector('.score-display');
    if (scoreDisplay) {
        scoreDisplay.innerHTML = '';
    }
    // makes chat fullscreen
    chatSection.classList.remove('col-md-4');
}

// function to shuffle an Array to have a different order of Questions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
