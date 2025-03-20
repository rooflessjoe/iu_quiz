import { About } from '../components/about.js';
import { Home } from '../components/home.js';

// Haupt-App
const Main = Vue.createApp ({
    data() {
        return {
            menuItems: [
                { name: 'Home', component: 'Home' },
                { name: 'Über', component: 'About' },
            ],
            currentComponent: Home,  // Standardmäßig Home anzeigen
            isLoggedIn: false
        };
    },
    components: {
        Home,
        About
    },
    methods: {
        checkLoginStatus() {
            this.isLoggedIn = !!sessionStorage.getItem('token');
            if (!this.isLoggedIn){
                window.location.href = './pages/login.html';
            }
        },

        Logout() {
            sessionStorage.removeItem('token');
            this.checkLoginStatus();
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
        this.checkLoginStatus();
    }
});

Main.mount('#mainApp');
