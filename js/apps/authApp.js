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
        checkLoginStatus() {
            this.isLoggedIn = !!sessionStorage.getItem('token');
            if (this.isLoggedIn){
                window.location.href = '../index.html';
            }
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
        //this.checkLoginStatus();
      }
});

Auth.mount('#authApp');