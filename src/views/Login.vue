<template lang="pug">
    v-container.fill-height(
        fluid
    )
        v-row(
            align="center"
            justify="center"
        )
            v-col(
                cols="12"
                sm="8"
                md="6"
                lg="5"
            )
                v-alert(
                    v-show="error"
                    type="error"
                    outlined
                    dense
                ) {{ errorMessage }}

                v-card.elevation-12
                    v-toolbar(
                        color="primary"
                        dark
                        flat
                    )
                        v-toolbar-title(
                            class="text-center"
                        ) Login to your personal area

                    v-card-text
                        v-form
                            v-text-field(
                                v-model="email"
                                label="Email"
                                name="email"
                                prepend-icon="mdi-account"
                                type="text"
                            )

                            v-text-field(
                                v-model="password"
                                id="password"
                                label="Password"
                                name="password"
                                prepend-icon="mdi-lock"
                                :append-icon="passwordVisibility ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="togglePasswordVisible"
                                :type="passwordVisibility ? 'text' : 'password'"
                            )

                    v-card-actions
                        v-spacer

                        v-btn.px-6(
                            color="primary"
                            @click="loginToPersonalArea"
                        ) Login
</template>

<script>
export default {
    name: 'Login',

    data: () => ({
        email: '',
        password: '',

        passwordVisibility: false,

        error: false,
        errorMessage: '',
    }),

    methods: {
        togglePasswordVisible() {
            this.passwordVisibility = !this.passwordVisibility;
        },

        async loginToPersonalArea() {
            try {
                this.error = false;

                await this.$store.dispatch('loginToPersonalArea', {
                    email: this.email,
                    password: this.password,
                });

                await this.$router.push({ name: 'personal_area' });
            } catch (err) {
                this.error = true;

                if (JSON.parse(err.message) === 'Cannot find user') {
                    this.errorMessage = 'Incorrect email or password';
                } else {
                    this.errorMessage = JSON.parse(err.message);
                }
            }
        },
    },
};
</script>
