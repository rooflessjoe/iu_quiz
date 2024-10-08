// Abruf der Daten über den Button
document.getElementById("fetch-data").addEventListener("click", function() {
    
    //Abruf der Daten über die API, liefert ein Promise mit Response
    fetch('https://iu-quiz-backend.onrender.com/api/data')
    
    //Umwandlung des Response in JSON
    .then(function(a){
        return a.json();
    })

    //Extrahieren der gewünschten Informationen als Text
    .then(function (json) {
        document.getElementById("data-output").innerText =  json[0].name + " " + json[0].email;
    })
})