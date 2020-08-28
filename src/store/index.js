import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
    },
    mutations: {
    },
    actions: {
        // eslint-disable-next-line no-empty-pattern
        async loginToPersonalArea({}, { email, password }) {
            const url = 'http://localhost:3000/login';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const result = await response.json();

            console.log('result = ', result);
        },
    },
    modules: {
    },
});
