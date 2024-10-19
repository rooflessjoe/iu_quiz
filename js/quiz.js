// Komponenten importieren
//const Home = () => import('./components/Home.vue');
//const About = () => import('./components/Data.vue');
//const Contact = () => import('./components/Contact.vue');

const Home = {
    template: `<div class="container mt-4"><h1>Home</h1><p>Willkommen auf der Startseite!</p></div>`
};

const About = {
    template: `
    <h2>Benutzerdaten</h2>
        <button @click="fetchData">Daten abrufen</button>
        <p>{{ message }}</p>
            <div v-for="user in users" :key="user.id">
                <p>{{ user.name }} - {{ user.email }}</p>
            </div>
            `
    /*methods: {
                // Methode zum Abrufen der Daten von der API
                fetchData() {
                    this.message = 'Daten werden geladen...';
                    
                    // API-Aufruf zur PostgreSQL-Datenbank über dein Backend
                    fetch('https://iu-quiz-backend.onrender.com/api/data')
                        .then(response => response.json())
                        .then(data => {
                            this.users = data;  // Benutzerdaten in Vue.js speichern
                            this.message = 'Daten erfolgreich geladen!';
                        })
                        .catch(error => {
                            console.error('Fehler beim Laden der Daten:', error);
                            this.message = 'Fehler beim Laden der Daten.';
                        });
                }
            }*/
};

const Contact = {
    template: `<div class="container mt-4"><h1>Kontakt</h1><p>So kannst du uns erreichen.</p></div>`
};

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

// Dynamisch importieren der Komponenten
/*const importComponent = async (componentName) => {
    const component = await import(`./components/${componentName}.vue`);
    return component.default;
};*/

/*const loadComponents = async () => {
    //App.components.Home = await import('./components/Home.vue');
    App.components.About = await import('./components/Data.vue');
    //App.components.Contact = await import('./components/Contact.vue');
};

loadComponents();*/