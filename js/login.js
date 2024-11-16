/*async function handleLogin(event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginButton = document.getElementById("loginButton");

    loginButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sie werden eingeloggt...';
    loginButton.setAttribute("type", "button");
    loginButton.setAttribute("disabled", "true");
    loginButton.classList.remove("btn-block");
    const response = await fetch('https://iu-quiz-backend.onrender.com/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })

    });

    if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('token', data.token); // Token im sessionStorage speichern

        loginButton.innerHTML = 'Login';
        loginButton.setAttribute("type", "submit"); //Bleibt bis zur Implementierung der manuellen/automatischen Abmeldung so
        loginButton.removeAttribute("disabled");
        loginButton.classList.add("btn-block");

        window.location.href = '../index.html';
    } else {
        loginButton.innerHTML = 'Login';
        loginButton.setAttribute("type", "submit");
        loginButton.removeAttribute("disabled");
        loginButton.classList.add("btn-block");
        alert('Anmeldedaten nicht korrekt');
    }
}*/

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
                    this.loading = true;
                    
                    fetch('https://iu-quiz-backend.onrender.com/api/login', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username: this.username, password: this.password }),
                      })

                        .then(response => response.json())
                        .then(data => {
                            sessionStorage.setItem('token', data.token);
                            this.message = 'Daten erfolgreich geladen!';
                            this.$router.push('../index.html');
                        })
                        .catch(error => {
                            console.error('Anmeldedaten nicht korrekt', error);
                            this.error = true;
                            alert('Anmeldedaten nicht korrekt');
                        })
                        .finally(this.loading = false);
                      }
            }
});

Login.mount('#loginForm');