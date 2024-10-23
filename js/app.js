import { Home, Contact } from './components.js';
import { About } from '/components/about.js'

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