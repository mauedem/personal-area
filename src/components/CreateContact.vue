<template lang="pug">
    v-dialog.mb-0(
        persistent max-width="400px"
        v-model="dialog"
    )

        template(
            #activator="{ on, attrs }"
        )
            v-btn.px-1.px-md-5.px-sm-5(
                color="white"
                text
                outlined
                v-bind="attrs"
                v-on="on"
            ) Add contact

        v-alert(
            v-if="createError"
            type="error"
            dismissible
            close-icon="mdi-close"
            @click="closeDialog"
        ) An error occured while creating the contact. Reload the page.

        v-card(
            v-else
        )
            v-card-title
                span.headline Create new contact

            v-card-text
                v-container
                    v-row
                        v-alert(
                            v-show="nameError"
                            dense
                            outlined
                            width="350"
                            type="error"
                        ) Name is required. 18 characters are allowed.

                        v-text-field(
                            label="Name"
                            v-model="name"
                        )

                    v-row
                        v-alert(
                            v-show="phoneError"
                            dense
                            outlined
                            width="350"
                            type="error"
                        ) Phone is required. Phone must be in format (xxx-xxx-xxxx).

                        v-text-field(
                            label="Phone"
                            v-model="phone"
                        )

            v-card-actions
                <v-spacer></v-spacer>
                    v-btn(
                        color="primary"
                        text
                        @click="closeDialog"
                    ) Close

                    v-btn(
                        color="primary"
                        text
                        @click="createContact"
                    ) Create
</template>

<script>
import { validationMixin } from '@/mixins/validationMixin';

export default {
    name: 'CreateContact',

    mixins: [validationMixin],

    data: () => ({

        dialog: false,

        name: '',
        phone: '',

        createError: false,
        nameError: false,
        phoneError: false,
    }),

    methods: {
        closeDialog() {
            this.dialog = false;

            this.nameError = false;
            this.phoneError = false;

            this.name = '';
            this.phone = '';
        },

        async createContact() {
            try {
                if (this.isValid()) {
                    this.createError = false;

                    await this.$store.dispatch('createContact', {
                        name: this.name,
                        phone: this.phone,
                    });

                    this.dialog = false;

                    this.name = '';
                    this.phone = '';

                    this.$emit('get-user-contacts');
                }
            } catch (err) {
                this.createError = true;
            }
        },
    },
};
</script>
