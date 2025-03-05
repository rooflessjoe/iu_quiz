import { quizOverview } from '../components/quizOverview.js';
import { singlePlayerQuiz } from '../components/singlePlayerQuiz.js';

// Haupt-App
const Quiz = Vue.createApp ({
    data() {
        return {
            currentComponent: quizOverview,
            currentProps: {},
            isLoggedIn: false
        };
    },
    components: {
        quizOverview,
        singlePlayerQuiz
    },
    methods: {
        checkLoginStatus() {
            this.isLoggedIn = !!sessionStorage.getItem('token');
        },

        setCurrentComponent({ component, props }) {
            this.currentComponent = component;
            this.currentProps = props;
            sessionStorage.setItem('currentComponent', component); // Speichere die aktuelle Komponente in sessionStorage
        },

        loadCurrentComponent() {
            const savedComponent = sessionStorage.getItem('currentComponent'); // Lade die gespeicherte Komponente
            if (savedComponent) {
              this.currentComponent = savedComponent; // Setze die aktuelle Komponente auf die gespeicherte
            }
        }
    },
    created() {
        // Lade die aktuell gespeicherte Komponente beim Erstellen der App
        sessionStorage.setItem('currentComponent', this.currentComponent);
        this.checkLoginStatus();
      }
});

Quiz.mount('#quizApp');