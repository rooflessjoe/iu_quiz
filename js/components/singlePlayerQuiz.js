export const singlePlayerQuiz = {
    props: ['quizData'],
    template:`
    <div class="container">
        <h1 class="mb-4">Quiz</h1>
        <div v-if="quizData.questions && quizData.questions.length">
            <div v-for="(question, index) in quizData.questions" :key="index" class="mb-4">
                <h5>Frage {{ index + 1 }}: {{ question.question }}</h5>
                <ul class="list-group">
                    <li v-for="(answer, ansIndex) in quizData.answers[index]" :key="ansIndex" class="list-group-item">
                        {{ answer.answer }}
                    </li>
                </ul>
            </div>
        </div>
        <div v-else>
            <p>Keine Fragen verfügbar.</p>
        </div>
        <button class="btn btn-primary mt-4">Quiz starten</button>
    </div>
    `,

methods: {
    // Methode zum Abrufen der Daten von der API
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
};