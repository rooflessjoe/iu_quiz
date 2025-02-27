import { quizOverview } from '../components/quizOverview.js';
//import { singlePlayerQuiz } from '../components/singlePlayerQuiz.js';

// Haupt-App
const Quiz = Vue.createApp ({
    data() {
        return {
            menuItems: [
                { name: 'Home'},
            ],
            currentComponent: quizOverview,
            isLoggedIn: false
        };
    },
    components: {
        quizOverview,
        //singlePlayerQuiz
    },
    methods: {
        /*loadToken(){
            const token = sessionStorage.getItem('token');
        },*/
        checkLoginStatus() {
            this.isLoggedIn = !!sessionStorage.getItem('token');
        },

        setCurrentComponent(component) {
            this.currentComponent = component;
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
        this.loadCurrentComponent();
        //this.loadToken();
        this.checkLoginStatus();
      }
});

Quiz.mount('#quizApp');