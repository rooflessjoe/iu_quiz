export const singlePlayerQuiz = {
    props: ['quizData', 'quizName'],
    template:`
    <div class="container">
        <button class="btn btn-primary" @click.prevent="changeComponent">Zurück</button>
        <h1 class="mb-4">Quiz: {{ quizName }}</h1>
        <div v-if="quizData.questions && quizData.questions.length">
            <div v-for="(question, index) in quizData.questions" :key="index" class="mb-4">
                <h5>Frage {{ index + 1 }}: {{ question.question }}</h5>
                <ul class="list-group">
                <div :class="{'bg-success': valid, 'bg-danger': valid===false}">
                    <li v-for="(answer, ansIndex) in getAnswersForQuestion(question.question_id)" :key="ansIndex" class="list-group-item">
                        <button class="btn btn-primary" @click.prevent="fetchDataAnswer(answer.question_id, answer.answer_id)">{{ answer.answer }}</button>
                    </li>
                    </div>
                </ul>
            </div>
        </div>
        <div v-else>
            <p>Keine Fragen verfügbar.</p>
        </div>
        <button class="btn btn-primary mt-4">Quiz starten</button>
    </div>
    `,
    data() {
        return {
            valid: null,
            loading: false,
            message: '',
            error: null,
        };
},

methods: {
    // Methode zum Abrufen der Daten von der API
fetchDataAnswer(questionID, answerID) {
        this.message = '';
        this.error = null;
        this.loading = true;
        this.valid = null;

        const token = sessionStorage.getItem('token');

        if (token != null){
        fetch('https://iu-quiz-backend.onrender.com/api/answer', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Token im Authorization-Header senden
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: questionID, answer: answerID })
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

getAnswersForQuestion(questionId) {
    return this.quizData.answers.filter(answer => answer.question_id === questionId);
},

changeComponent(){
    this.$emit('change-component', {component: 'quizOverview', props: {} });
}
},
};