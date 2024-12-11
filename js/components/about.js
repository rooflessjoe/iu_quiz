//Datenabfrage Test
export const About = {
    template: `
    <div class="container-fluid">
        <h2>Benutzerdaten</h2>
        <div v-if="!loading">
            <button type="button" class="btn btn-primary" @click="fetchData">Daten abrufen</button>
        </div>
        <div v-else>
            <button class="btn btn-primary" type="button" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Lade Daten...
            </button>
        </div>
        <div :class="{ 
            'alert alert-warning': !!error,
            'alert alert-success': error === null && message === 'Daten erfolgreich geladen!'
            }"
            role="alert">
            <p>{{ message }}</p>
        </div>
            <div class="container-fluid" v-for="user in userData" :key="user.id">
                <p>{{ user.name }} - {{ user.email }}</p>
            </div>
    </div>
    `,
    
            data() {
                return {
                    message: 'Klicke den Button, um Daten abzurufen',
                    userData: null,
                    error: null,
                    loading: false
                };
            },
            
            methods: {
                // Methode zum Abrufen der Daten von der API
                fetchData() {
                    this.message = '';
                    this.error = null;
                    this.loading = true;

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
                            this.error = true;
                            this.message = 'Fehler beim Laden der Daten.';
                        })
                        .finally(() => {
                            this.loading = false;
                        });
            }
}
};
