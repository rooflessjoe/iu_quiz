import { Contact } from '../components/contact.js';
import { About } from '../components/about.js';
import { Home } from '../components/home.js';

// Haupt-App
const Main = Vue.createApp ({
    data() {
        return {
            menuItems: [
                { name: 'Home', component: 'Home' },
                { name: 'Über', component: 'About' },
                { name: 'Kontakt', component: 'Contact' }
            ],
            currentComponent: Home,  // Standardmäßig Home anzeigen
            isLoggedIn: false
        };
    },
    components: {
        Home,
        About,
        Contact
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
        //sessionStorage.setItem('currentComponent', this.currentComponent);
        this.loadCurrentComponent();
        this.checkLoginStatus();
      }
});

Main.mount('#mainApp');
