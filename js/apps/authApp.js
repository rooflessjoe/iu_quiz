import { Login } from '../components/login.js';
import { Registration } from '../components/registration.js';

// Haupt-App
const Auth = Vue.createApp ({
    data() {
        return {
            currentComponent: Login,
            isLoggedIn: false
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
        },

        handlePopState(){
            sessionStorage.removeItem('currentComponent');
            this.loadCurrentComponent();
        }
    },
    created() {
        window.addEventListener('pageshow', this.handlePopState);
    }
});

Auth.mount('#authApp');