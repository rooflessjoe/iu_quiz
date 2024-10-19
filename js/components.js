export const Home = {
    template: `<div class="container mt-4"><h1>Home</h1><p>Willkommen auf der Startseite!</p></div>`
};

export const About = {
    template: `
    <h2>Benutzerdaten</h2>
        <button @click="fetchData">Daten abrufen</button>
        <p>{{ message }}</p>
            <div v-for="user in userData" :key="user.id">
                <p>{{ user.name }} - {{ user.email }}</p>
            </div>
            `,
    
            data() {
                return {
                    message: 'Klicke den Button, um Daten abzurufen',
                    userData: null,
                    error: null
                };
            },

            methods: {
                // Methode zum Abrufen der Daten von der API
                fetchData() {
                    this.message = 'Daten werden geladen...';
                    
                    // API-Aufruf zur PostgreSQL-Datenbank über dein Backend
                    fetch('https://iu-quiz-backend.onrender.com/api/data')
                        .then(response => response.json())
                        .then(data => {
                            this.userData = data;  // Benutzerdaten in Vue.js speichern
                            this.message = 'Daten erfolgreich geladen!';
                        })
                        .catch(error => {
                            console.error('Fehler beim Laden der Daten:', error);
                            this.message = 'Fehler beim Laden der Daten.';
                        });
                }
            }
};

export const Contact = {
    template: `<div class="container mt-4"><h1>Kontakt</h1><p>So kannst du uns erreichen.</p></div>`
};

// Exportiere die Komponenten, damit sie in anderen Dateien verwendet werden können
//export { Home, About, Contact };