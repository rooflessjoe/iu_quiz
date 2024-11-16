// Mappings für URL-Aliase
const aliasMap = {
    '/home': 'Home-Seite',
    '/login': 'Login-Seite',
    '/contact': 'Kontakt-Seite'
};

window.history.pushState({ page: window.location.pathname }, '', aliasMap[path]);