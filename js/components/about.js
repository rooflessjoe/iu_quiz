//Datenabfrage Test
export const About = {
    template: `
    <div class="container-fluid">
        <h2>Benutzerdaten</h2>
        <div v-if="message === 'Daten werden geladen...'">
            <button class="btn btn-primary" type="button" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Lade Daten...
            </button>
        </div>
        <div v-else>
            <button type="button" class="btn btn-primary" @click="fetchData">Daten abrufen</button>
        </div>
        <p>{{ message }}</p>
            <div class="container-fluid" v-for="user in userData" :key="user.id">
                <p>{{ user.name }} - {{ user.email }}</p>
            </div>
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

                    const token = sessionStorage.getItem('token');

                    // API-Aufruf zur PostgreSQL-Datenbank über dein Backend
                    fetch('https://iu-quiz-backend.onrender.com/api/data', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`, // Token im Authorization-Header senden
                            'Content-Type': 'application/json'
                        }
                    })
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