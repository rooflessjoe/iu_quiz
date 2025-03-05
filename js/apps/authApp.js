import { Login } from '../components/login.js';
import { Registration } from '../components/registration.js';

// Haupt-App
const Auth = Vue.createApp ({
    data() {
        return {
            currentComponent: Login,
        };
    },
    components: {
        Login,
        Registration
    },
    methods: {

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
    /*created() {
        // Lade die aktuell gespeicherte Komponente beim Erstellen der App
        this.loadCurrentComponent();
      }*/
});

Auth.mount('#authApp');