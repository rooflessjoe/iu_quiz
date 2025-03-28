export const createQuestion = {
    props: ['quizName'],
    template: `
    <div class="container mt-5">
      <h2>Frage für {{quizName}} Quiz erstellen</h2>
      <form @submit.prevent="submitQuestion(quizName)">

        <div class="mb-3">
          <label for="questionText" class="form-label">Frage</label>
          <input
            type="text"
            id="questionText"
            class="form-control"
            v-model="questionText"
            placeholder="Geben Sie die Frage ein"
            required
          />
        </div>

        <div class="mb-3" v-for="(answer, index) in answers" :key="index">
          <label :for="'answer' + (index + 1)" class="form-label">
            Antwort {{ index + 1 }}
          </label>
          <input
            type="text"
            :id="'answer' + (index + 1)"
            class="form-control"
            v-model="answers[index]"
            placeholder="Antwort eingeben"
            required
          />
        </div>

        <div class="mb-3">
          <label for="correctAnswer" class="form-label">Korrekte Antwort</label>
          <select
            id="correctAnswer"
            class="form-select"
            v-model.number="correctAnswer"
            required
          >
            <option disabled value="">Wählen Sie die richtige Antwort</option>
            <option v-for="(answer, index) in answers" :key="index" :value="index">
              Antwort {{ index + 1 }}
            </option>
          </select>
        </div>

        <button type="submit" class="btn btn-primary">Frage erstellen</button>
      </form>
      <h4>{{message}}</h4>
    </div>
  `,
    data() {
        return {
            questionText: '',
            answers: ['', '', '', ''],
            correctAnswer: null,
            categories: [],
            error: null,
            message: '',
            loading: false,
        };
    },
    methods: {
        submitQuestion(quizName) {
            const question = {
                question: this.questionText,
                quiz_name: quizName,
                answers: this.answers.map((answer, index) => ({
                    answer,
                    valid: index === this.correctAnswer,
                })),
            };

            const token = sessionStorage.getItem('token');

            if (token != null) {
                fetch('https://iu-quiz-backend.onrender.com/api/create', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(question)
                })
                    .then(response => response.json())
                    .then(data => {
                        //console.log(data);
                        this.message = data.message;
                    })
                    .catch(error => {
                        //console.error('Fehler beim Laden der Daten:', error);
                        this.error = true;
                        this.message = 'Fehler beim Laden der Daten.';
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            } else {
                this.message = "Nicht Authentifiziert";
            }

            // Formular zurücksetzen
            this.questionText = '';
            this.answers = ['', '', '', ''];
            this.correctAnswer = null;
        }
    }
};
