export const quizOverview = {
    template:`
    <div class="container-fluid">
        <h1 class="mb-4">Quiz Übersicht</h1>
        <div v-if="!loading">
            <div class="row">
                <div class="col-md-4" v-for="(item, index) in quizList" :key="item.quiz_name">
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title">Quiz
                                <span>{{ index + 1}}: {{ item.quiz_name }}</span>
                            </h5>
                            <p class="card-text">Teste Dein Wissen mit diesem spannenden Quiz.</p>
                            <button class="btn btn-primary" @click.prevent="handleClick(index, item.quiz_name)">Quiz starten</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="d-flex justify-content-center">
                <div class="spinner-grow text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
        <div v-if="error" class="mt-4 alert alert-danger" role="alert">
            Fehler beim Laden der Daten.
        </div>
    </div>
    `,
    data() {
        return {
            quizList: null,
            loading: false,
            message: '',
            error: null,
            quizData: null
        };
},

methods: {
    // Methode zum Abrufen der Daten von der API
    fetchDataQuizList() {
        this.message = '';
        this.error = null;
        this.loading = true;

        const token = sessionStorage.getItem('token');

        if (token != null){
        fetch('https://iu-quiz-backend.onrender.com/api/quiz_list', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Token im Authorization-Header senden
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                this.quizList = data;  // Benutzerdaten in Vue.js speichern
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

handleClick(index, item){
    const token = sessionStorage.getItem('token');

    fetch(`https://iu-quiz-backend.onrender.com/api/quiz?quizID=${index+1}&quizName=${item}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Token im Authorization-Header senden
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            this.$emit('change-component', {component: 'singlePlayerQuiz', props: {quizData: data, quizName: item} });  // Benutzerdaten in Vue.js speichern
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
}
},

mounted() {
    this.fetchDataQuizList();
}
};