import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        token: null,
    },

    mutations: {
        SET_TOKEN(state, token) {
            state.token = token;
        },

        DELETE_TOKEN(state) {
            state.token = null;
        },
    },

    actions: {
        async loginToPersonalArea({ dispatch, commit }, { email, password }) {
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

            commit('SET_TOKEN', result.accessToken);

            dispatch('saveTokenToStorage');
        },

        async isAuthorized({ state, commit }) {
            if (state.token) {
                const url = 'http://localhost:3000/660/users';

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${state.token}`,
                    },
                });

                /* TODO проверить работу этого if */
                if (response.status === 401) {
                    commit('DELETE_TOKEN');

                    throw new Error(await response.text());
                }
            } else {
                throw new Error('Log in to enter to personal area');
            }
        },

        getTokenFromLocalStorage({ commit }) {
            const serializedToken = localStorage.getItem('token');

            const token = serializedToken ? JSON.parse(serializedToken) : '';

            commit('SET_TOKEN', token);

            if (!serializedToken) {
                localStorage.setItem('token', token);
            }
        },

        saveTokenToStorage({ state }) {
            localStorage.setItem('token', JSON.stringify(state.token));
        },
    },
});
