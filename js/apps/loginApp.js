const Login =  Vue.createApp ({
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
                handleLogin() {
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
});

Login.mount('#loginForm');
