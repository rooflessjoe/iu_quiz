//TODO
export const Registration = {
    template: `
    <div class="container-fluid">
    <button class="btn btn-primary" @click.prevent="changeComponent">Zurück</button>
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
                        username: '',
                        password: '',
                        error: null,
                        loading: false,
                    };
            },
            
            methods: {
                // Methode zum Abrufen der Daten von der API
                fetchData() {
                    this.error = null;
                    this.loading = true;
                    
                    fetch('https://iu-quiz-backend.onrender.com/api/login', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username: this.username, password: this.password }),
                      })

                        .then(response => {
                          return response.json();
                        })
                        .then(data => {
                            sessionStorage.setItem('token', data.token);
                            this.message = 'Daten erfolgreich geladen!';
                            //this.$router.push('../index.html');
                            window.location.href = '../index.html';
                        })
                        .catch(error => {
                            console.error('Anmeldedaten nicht korrekt', error);
                            this.error = true;
                            //alert('Anmeldedaten nicht korrekt');
                        })
                        .finally(() => {
                          this.loading = false;
                      });
            }
}
};