new Vue({
    el: '#app',
    data: {
        message: 'Klicke den Button, um Daten abzurufen',
        users: []  // Array zum Speichern der Benutzerdaten
    },
    methods: {
        // Methode zum Abrufen der Daten von der API
        fetchData() {
            this.message = 'Daten werden geladen...';
            
            // API-Aufruf zur PostgreSQL-Datenbank über dein Backend
            fetch('https://my-backend.onrender.com/api/data')
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
    }
});
