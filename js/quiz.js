const Home = {
    template: `<div class="container mt-4"><h1>Home</h1><p>Willkommen auf der Startseite!</p></div>`
};

// Dynamisch importieren der Komponenten
const importComponent = async (componentName) => {
    const component = await import(`./components/${componentName}.vue`);
    return component.default;
};

const loadComponents = async () => {
    //App.components.Home = await importComponent('Home');
    App.components.About = await importComponent('Data');
    //App.components.Contact = await importComponent('Contact');
};

loadComponents();

//const About = {Data};

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