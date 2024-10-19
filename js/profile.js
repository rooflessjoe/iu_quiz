Vue.component('about-component', {
    data() {
        return {
            posts: [
                { id: 1, title: 'Post 1', content: 'This is the first post.' },
                { id: 2, title: 'Post 2', content: 'This is the second post.' }
            ]
        }
    },
    template: `
    <section>
        <h2>About Us</h2>
        <p>Here are some recent posts:</p>
        <div v-for="post in posts" :key="post.id" class="post">
            <h3>{{ post.title }}</h3>
            <p>{{ post.content }}</p>
        </div>
    </section>
    `
});