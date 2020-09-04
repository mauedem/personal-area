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
                const url = 'http://localhost:3000/660/users/1';

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${state.token}`,
                    },
                });

                if (response.status === 401) {
                    commit('DELETE_TOKEN');

                    throw new Error();
                }
            } else {
                throw new Error();
            }
        },

        async getUserContacts({ state }) {
            const url = 'http://localhost:3000/660/users/1/contacts';

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${state.token}`,
                },
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            return response.json();
        },

        async createContact({ state }, { name, phone }) {
            const contact = {
                name,
                phone,
                userId: 1,
            };

            const url = 'http://localhost:3000/660/contacts';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.token}`,
                },
                body: JSON.stringify(contact),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }
        },

        async updateContact({ state }, { id, name, phone }) {
            const url = `http://localhost:3000/660/contacts/${id}`;

            const contact = {
                name,
                phone,
                userId: 1,
            };

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${state.token}`,
                },
                body: JSON.stringify(contact),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }
        },

        async deleteContact({ state }, id) {
            const url = `http://localhost:3000/660/contacts/${id}`;

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${state.token}`,
                },
            });

            if (!response.ok) {
                throw new Error(await response.text());
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
