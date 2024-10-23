//import { Home, About, Contact } from './components/*.js';

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
    components: {},
    methods: {
        setCurrentComponent(component) {
            this.currentComponent = component;
        }
    }
};

// Dynamische Imports der Komponenten
const components = import.meta.glob('./components/*.js');

// Vor dem Mounten der App die Komponenten registrieren
app.mixin({
  async beforeCreate() {
    // Dynamische Registrierung der Komponenten
    for (const path in components) {
      const module = await components[path](); // Komponente importieren
      const componentName = path.split('/').pop().replace('.js', ''); // Name extrahieren
      this.$options.components[componentName] = module.default; // In der Komponenten-Option registrieren
    }
  }
});

Vue.createApp(App).mount('#app');