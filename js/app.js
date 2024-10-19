import { Home, About, Contact } from './components.js';

// Haupt-App
const App = {
    data() {
        return {
            menuItems: [
                { name: 'Home', component: 'Home' },
                { name: 'Über', component: 'About' },
                { name: 'Kontakt', component: 'Contact' }
            ],
            currentComponent: 'Home'  // Standardmäßig Home anzeigen
        };
    },
    components: {
        Home,
        About,
        Contact
    },
    methods: {
        setCurrentComponent(component) {
            this.currentComponent = component;
        }
    }
};

Vue.createApp(App).mount('#app');