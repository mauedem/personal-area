<template lang="pug">
    v-app
        v-main
            login
</template>

<script>
import login from './views/login.vue';

export default {
    name: 'App',

    components: {
        login,
    },

    data: () => ({
    //
    }),
};
</script>
