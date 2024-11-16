import { Contact } from './components/contact.js';
import { About } from './components/about.js';
import { Home } from './components/home.js';

// Haupt-App
const App = Vue.createApp ({
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

        toggleNav() {
            this.drawer = !this.drawer;
        },

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

const { createVuetify } = Vuetify;

const vuetify = createVuetify();

App.use(vuetify);
App.mount('#app');