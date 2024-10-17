new Vue({
    el: '#app',  // Verbindung zum App-Element in der HTML-Datei
    data: {
        message: 'Benutzerdaten werden geladen...',  // Initiale Nachricht
        users: []  // Platzhalter für die Benutzerdaten
    },
    created() {
        // API-Aufruf, um Benutzerdaten zu laden
        fetch('https://iu-quiz-backend.onrender.com/api/data')
            .then(response => response.json())
            .then(data => {
                this.users = data;  // Benutzerdaten in Vue speichern
                this.message = 'Benutzerdaten erfolgreich geladen!';
            })
            .catch(error => {
                console.error('Fehler beim Laden der Daten:', error);
                this.message = 'Fehler beim Laden der Daten.';
            });
    }
});
