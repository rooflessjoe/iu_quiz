document.getElementById("fetch-data").addEventListener("click", function() {
    fetch('https://iu-quiz-backend.onrender.com/api/data')
    .then(response => response.json())
    .then(data => {
        document.getElementById("data-output").innerText = data.message;
    })
    .catch(error => console.error('Fehler:', error));
});