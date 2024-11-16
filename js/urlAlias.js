
        // Prüfe, ob die URL auf /home oder /login umgeleitet werden soll
        const aliasMap = {
            '/iu_quiz/home': '/iu_quiz/index.html',
            '/iu_quiz/login': '/iu_quiz/pages/login.html'
        };
    
        const target = aliasMap[window.location.pathname];
        if (target) {
            // Lade die Zielseite, aber ersetze die URL in der Adressleiste
            history.pushState({}, '', window.location.pathname);
            window.location.replace(target);
        }