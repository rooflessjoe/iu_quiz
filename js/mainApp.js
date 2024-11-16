import { Contact } from './components/contact.js';
import { About } from './components/about.js';
import { Home } from './components/home.js';


// Router konfigurieren
const routes = [
    { path: '/', component: Home, name: 'Home' },          // Standard-Route
    { path: '/about', component: About, name: 'About' },  // Über
    { path: '/contact', component: Contact, name: 'Contact' } // Kontakt
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(), // HTML5-History-Modus
    routes,
});


// Haupt-App
const App = Vue.createApp ({
    data() {
        return {
            menuItems: [
                { name: 'Home', path: '/'},//component: 'Home' },
                { name: 'Über', path: 'about'},//component: 'About' },
                { name: 'Kontakt', path: 'contact'},//component: 'Contact' }
            ],
            currentComponent: Home,  // Standardmäßig Home anzeigen
            isLoggedIn: false
        };
    },
    /*components: {
        Home,
        About,
        Contact
    },*/
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

// Router zu Vue-App hinzufügen
App.use(router);

App.mount('#app');