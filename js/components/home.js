export const Home = {
    template: `
    <div class="container-fluid">
        <h1>Home</h1>
        <p>Willkommen auf der Startseite!</p>
        <div v-if="!isLoggedIn>
            <a class="btn btn-primary" role="button" href="pages/quiz.html">Quiz</a>
        </div>
    </div>
    `
};
