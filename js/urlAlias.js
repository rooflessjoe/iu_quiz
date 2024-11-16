
        // Prüfe, ob die URL auf /home oder /login umgeleitet werden soll
        const aliasMap = {
            '/iu-quiz/home': '/iu-quiz/index.html',
            '/iu-quiz/login': '/iu-quiz/pages/login.html'
        };
    
        const target = aliasMap[window.location.pathname];
        if (target) {
            // Lade die Zielseite, aber ersetze die URL in der Adressleiste
            history.pushState({}, '', window.location.pathname);
            window.location.replace(target);
        }