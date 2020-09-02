<template lang="pug">
    v-container(
        v-if="error"
    )
        v-alert(
            type="error"
        ) {{ errorMessage }}

        div(
        ) Return to <a href="/">login page</a>

    v-container(
        v-else
    )
        div(
            v-show="!error"
        ) hey))))
</template>

<script>
export default {
    name: 'PersonalArea',

    data: () => ({
        error: false,
        errorMessage: '',
    }),

    async created() {
        try {
            this.error = false;

            await this.$store.dispatch('isAuthorized');
        } catch (err) {
            this.error = true;

            this.errorMessage = err.message;
        }
    },
};
</script>
