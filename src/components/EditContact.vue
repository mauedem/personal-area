<template lang="pug">
    v-dialog(
        persistent max-width="400px"
        v-model="dialog"
    )
        template(
            #activator="{ on, attrs }"
        )

            v-btn(
                icon
            )
                v-icon(
                    v-bind="attrs"
                    v-on="on"
                ) mdi-tooltip-edit

        v-alert(
            v-if="editError"
            type="error"
            dismissible
            close-icon="mdi-close"
            @click="closeDialog"
        ) An error occured while editing the contact. Reload the page.

        v-card
            v-card-title
                span.headline Edit contact

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
                        @click="updateContact"
                    ) Save
</template>

<script>
import { validationMixin } from '@/mixins/validationMixin';

export default {
    name: 'EditContact',

    mixins: [validationMixin],

    props: {
        id: {
            type: Number,
            required: true,
        },
    },

    data: () => ({
        dialog: false,

        name: '',
        phone: '',

        editError: false,
        nameError: false,
        phoneError: false,
    }),

    methods: {
        async closeDialog() {
            this.dialog = false;

            this.nameError = false;
            this.phoneError = false;

            await this.getUserContacts();
        },

        async getUserContacts() {
            const contacts = await this.$store.dispatch('getUserContacts');

            const result = contacts.find((contact) => contact.id === this.id);

            this.name = result.name;
            this.phone = result.phone;
        },

        async updateContact() {
            try {
                if (this.isValid()) {
                    this.editError = false;

                    await this.$store.dispatch('updateContact', {
                        id: this.id,
                        name: this.name,
                        phone: this.phone,
                    });

                    this.dialog = false;

                    this.$emit('get-user-contacts');
                }
            } catch (err) {
                this.editError = true;
            }
        },
    },

    async created() {
        try {
            this.editError = false;

            await this.getUserContacts();
        } catch (err) {
            this.editError = true;
        }
    },
};
</script>
