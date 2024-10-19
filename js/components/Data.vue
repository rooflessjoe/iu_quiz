<template>
    <h2>Benutzerdaten</h2>
        <button @click="fetchData">Daten abrufen</button>
        <p>{{ message }}</p>
            <div v-for="user in users" :key="user.id">
                <p>{{ user.name }} - {{ user.email }}</p>
            </div>
</template>

<!--script>
export default {
    name: 'About',
    data() {
        return {
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
                    this.users = data;  // Benutzerdaten in Vue.js speichern
                    this.message = 'Daten erfolgreich geladen!';
                })
                .catch(error => {
                    console.error('Fehler beim Laden der Daten:', error);
                    this.message = 'Fehler beim Laden der Daten.';
                });
        }
    }
}
</script-->