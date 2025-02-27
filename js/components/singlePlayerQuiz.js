export const singlePlayerQuiz = {
    template:`
    <div class="container mt-5">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Frage
                    <span>{{ index + 1}}: {{ question }}</span>
                </h5>
                <div class="list-group" v-for="item in answerList">
                    <button type="button" class="list-group-item list-group-item-action">{{ item }}</button>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            quizID: null,
            quizName: null,
            answerID: null,
            questionID: null,
            answerList: null,
            questionList: null,
            valid: null,
            loading: false,
            message: '',
            error: null
        };
},

methods: {
    // Methode zum Abrufen der Daten von der API
    fetchDataQuestions() {
        this.message = '';
        this.error = null;
        this.loading = true;

        const token = sessionStorage.getItem('token');

        if (token != null){
        fetch('https://iu-quiz-backend.onrender.com/api/quiz?quizID=${this.quizname}&quizName=${this.quizid}', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Token im Authorization-Header senden
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                this.questionList = data.questions;
                this.answerList = data.answers;
                this.message = 'Daten erfolgreich geladen!';
            })
            .catch(error => {
                console.error('Fehler beim Laden der Daten:', error);
                this.error = true;
                this.message = 'Fehler beim Laden der Daten.';
            })
            .finally(() => {
                this.loading = false;
            });
} else {
    this.message = "Nicht Authentifiziert";
}
},
fetchDataAnswer() {
        this.message = '';
        this.error = null;
        this.loading = true;
        this.answerID = null;
        this.questionID = null;
        this.valid = null;

        const token = sessionStorage.getItem('token');

        if (token != null){
        fetch('https://iu-quiz-backend.onrender.com/api/answer', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Token im Authorization-Header senden
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: this.questionID, answer: this.answerID })
        })
            .then(response => response.json())
            .then(data => {
                this.valid = data;  // Benutzerdaten in Vue.js speichern
                this.message = 'Daten erfolgreich geladen!';
            })
            .catch(error => {
                console.error('Fehler beim Laden der Daten:', error);
                this.error = true;
                this.message = 'Fehler beim Laden der Daten.';
            })
            .finally(() => {
                this.loading = false;
            });
} else {
    this.message = "Nicht Authentifiziert";
}
},
changeComponent(){
    this.$emit('change-component', 'quizOverview');
}
},
mounted() {
    this.quizName = quizName;
    this.fetchDataQuestions();
}
};