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
                        ) Name is required

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
                v-spacer
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
export default {
    name: 'EditContact',

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
        closeDialog() {
            this.dialog = false;
        },

        isValid() {
            this.nameError = this.name.length === 0;
            this.phoneError = this.phone.length === 0
                || !this.phone.match(/^\+?(\d{1,3})?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/);

            return !this.nameError && !this.phoneError;
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

            const contacts = await this.$store.dispatch('getUserContacts');

            const result = contacts.find((contact) => contact.id === this.id);

            this.name = result.name;
            this.phone = result.phone;
        } catch (err) {
            this.editError = true;
        }
    },
};
</script>
