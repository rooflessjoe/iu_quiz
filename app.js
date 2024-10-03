document.getElementById("fetch-data").addEventListener("click", function() {
    fetch('https://iu-quiz-backend.onrender.com/api/data', {
        
        body: JSON.stringify({
        name: name,
        email: email,

    })})
    .then(function(a){
        return a.json();
    })
    .then(function (json) {
        console.log(json)
    })
})