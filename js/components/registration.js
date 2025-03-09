export const Registration = {
    template: `
    <div class="row justify-content-center">
            <div class="col-md-6">
                <h2 class="text-center mt-5">Registrierung</h2>
                <form id="registrationForm" @submit.prevent="fetchDataRegistration">
                    <div class="form-group mt-4">
                        <input type="email" class="form-control" id="email" placeholder="E-Mail" v-model="email" required>
                    </div>
                    <div class="form-group mt-4">
                        <input type="text" class="form-control" id="username" placeholder="Benutzername" v-model="username" required>
                    </div>
                    <div class="form-group mt-4">
                        <input type="password" class="form-control" id="password" minlength="8" placeholder="Passwort" v-model="password" required>
                    </div>
                    <div v-if="!loading">
                        <button id="Registrieren" class="btn btn-primary mt-4" type="submit">Registrieren</button>
                    </div>
                    <div v-else>
                        <button id="Registrieren" class="btn btn-primary mt-4" disabled>
                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Lade...
                        </button>
                        <button id="Registrieren" class="btn btn-primary mt-4 float-end" disabled>
                            Registrieren
                        </button>
                    </div>
                    <div v-if="error" class="mt-4 alert alert-danger" role="alert">
                        Registrierung fehlgeschlagen.
                    </div>
                    <div v-else-if="message" class="mt-4 alert alert-success" role="alert">
                        Nutzer {{this.username}} Erfolgreich registriert.
                        Eine Bestätigungsmail wurde an {{this.email}} verschickt.
                        Bitte bestätige Deine E-Mail Adresse über den Link in der Mail.
                    </div>
                </form>
            </div>
            </div>
    `,
    
            data() {
                    return {
                        email: '',
                        username: '',
                        password: '',
                        message: '',
                        error: null,
                        loading: false,
                    };
            },
            
            methods: {
                // Methode zum Abrufen der Daten von der API
                fetchDataRegistration() {
                    this.error = null;
                    this.loading = true;
                    
                    fetch('https://iu-quiz-backend.onrender.com/api/register', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: this.email, username: this.username, password: this.password }),
                      })

                        .then(response => {
                            if (response.status === 201){
                                this.message = 'Erfolgreich registriert!';
                            }
                        })
                        .catch(() => {
                            this.error = true;
                        })
                        .finally(() => {
                          this.loading = false;
                      });
            }
}
};