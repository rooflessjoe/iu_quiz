export const Login = {
    template: `
    <div class="row justify-content-center">
            <div class="col-md-6">
                <h2 class="text-center mt-5">Login</h2>
                <form id="loginForm" @submit.prevent="fetchDataLogin">
                    <div class="form-group mt-4">
                        <input type="text" class="form-control" id="username" placeholder="Benutzername" v-model="username" required>
                    </div>
                    <div class="form-group mt-4">
                        <input type="password" class="form-control" id="password" placeholder="Passwort" v-model="password" required>
                    </div>
                    <div v-if="!loading">
                        <button id="Login" class="btn btn-primary mt-4" role="submit">Login</button>
                        <button id="Registrieren" class="btn btn-primary mt-4 float-end" @click.prevent="changeComponent">Registrieren</button>
                    </div>
                    <div v-else>
                        <button id="Login" class="btn btn-primary mt-4" disabled>
                            <span class="spinner-border spinner-border-sm" role="status"></span>
                            Lade...
                        </button>
                        <button id="Registrieren" class="btn btn-primary mt-4 float-end" disabled>
                            Registrieren
                        </button>
                    </div>
                    <div v-if="error" class="mt-4 alert alert-danger" role="alert">
                        Anmeldedaten sind nicht korrekt.
                    </div>
                </form>
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
                fetchDataLogin() {
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
                            window.location.href = '../index.html';
                        })
                        .catch(error => {
                            console.error('Anmeldedaten nicht korrekt', error);
                            this.error = true;
                        })
                        .finally(() => {
                          this.loading = false;
                      });
            },
            changeComponent(){
                this.$emit('change-component', 'Registration');
            }
}
};