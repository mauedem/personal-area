<template lang="pug">
    v-app
        v-main
            router-view
                slot
</template>

<script>

export default {
    name: 'App',

    async created() {
        await this.$store.dispatch('getTokenFromLocalStorage');
    },
};
</script>
