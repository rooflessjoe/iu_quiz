export const createQuestion = {
    props: {},
    template: `
    <div class="container mt-5">
      <h2>Frage erstellen</h2>
      <form @submit.prevent="submitQuestion">

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

        <div class="mb-3">
          <label for="category" class="form-label">Kategorie</label>
          <select
            id="category"
            class="form-select"
            v-model="category"
            required
          >
            <option disabled value="">Wählen Sie eine Kategorie</option>
            <option
              v-for="cat in categories"
              :key="cat.quiz_name"
              :value="cat.quiz_name"
            >
              {{ cat.quiz_name }}
            </option>
          </select>
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
            category: '',
            answers: ['', '', '', ''],
            correctAnswer: null,
            categories: [],
            error: null,
            message: '',
            loading: false,
        };
    },
    methods: {
        submitQuestion() {
            const question = {
                question: this.questionText,
                quiz_name: this.category,
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
                        console.log(data);
                        this.message = data.message;
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

            // Formular zurücksetzen
            this.questionText = '';
            this.category = '';
            this.answers = ['', '', '', ''];
            this.correctAnswer = null;
        },

        fetchCategory() {
            const token = sessionStorage.getItem('token');
            if (token != null) {
                fetch('https://iu-quiz-backend.onrender.com/api/quiz_list', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then((data) => {
                        console.log(data);
                        this.categories = data;
                    })
                    .catch(error => {
                        console.error('Fehler beim Laden der Kategorien:', error);
                    });
            }
        }
    },
    mounted() {
        this.fetchCategory();
    }
};
