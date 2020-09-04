<template lang="pug">
    v-container(
        v-if="authorizationError"
    )
        v-alert.white--text(
            type="error"
        ) Log in to enter to personal area.
            br
            | Return to
            router-link.white--text.text-decoration-none.font-weight-bold(
                to="/"
            )  login page.

    v-container.pa-0.mx-0(
        v-else
        fluid
    )
        v-app-bar(
            color="primary"
            dark
        )
            v-col.ml-12.ml-xs-0(
                xs="1"
                cols="2"
            )
                v-toolbar-title Contacts

            v-col.px-0(
                cols="6"
                xs="3"
            )
                v-text-field(
                    flat
                    solo-inverted
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    label="Search"
                    v-model="searchedText"
                )

            v-col.pr-0.ml-auto.pl-12(
                xs="2"
                cols="3"
            )
                create-contact(
                    @get-user-contacts="getUserContacts"
                )

        v-alert(
            v-show="getContactsError"
            type="error"
        ) An error occured while getting contacts. Reload the page.

        v-container
            v-alert(
                v-show="deleteError"
                type="error"
                dismissible
                dense
                close-icon="mdi-close"
                max-width="300"
                @click="closeError"
            ) An error occured while deleting the contact. Reload the page.

            v-card.elevation-12.mb-3(
                v-for="{ id, name, phone } in filteredContacts"
                :key="'contact_' + id"
                max-width="500"
                max-height="300"
            )
                v-col.pb-0(
                    cols="12"
                )
                    v-row
                        v-col.pa-0(
                            cols="9"
                            pa-0
                        )
                           v-card-title.py-1 {{ name }}

                        v-spacer

                        v-col.pa-0(
                            cols="3"
                        )
                            v-card-actions
                                v-row
                                    v-col.pa-0(

                                    )
                                        edit-contact(
                                            :id="id"
                                            @get-user-contacts="getUserContacts"
                                        )

                                    v-col.pa-0
                                        v-btn(
                                            icon
                                        )
                                            v-icon(
                                                @click="deleteContact(id)"
                                            ) mdi-delete

                v-col.pt-0(
                    cols="12"
                )
                    v-row
                        v-card-text.text-body-1.py-0 {{ phone }}
</template>

<script>
import CreateContact from '@/components/CreateContact.vue';
import EditContact from '@/components/EditContact.vue';

export default {
    name: 'PersonalArea',

    components: {
        CreateContact,
        EditContact,
    },

    data: () => ({
        contacts: null,

        authorizationError: false,
        deleteError: false,
        getContactsError: false,

        searchedText: '',
    }),

    computed: {
        filteredContacts() {
            const result = [];

            if (!this.searchedText) {
                return this.contacts;
            }

            // eslint-disable-next-line no-restricted-syntax
            for (const contact of this.contacts) {
                if (contact.name.indexOf(this.searchedText) !== -1) {
                    result.push(contact);
                }
            }

            return result;
        },
    },

    methods: {
        closeError() {
            this.deleteError = false;
        },

        async deleteContact(id) {
            try {
                this.deleteError = false;

                await this.$store.dispatch('deleteContact', id);

                await this.getUserContacts();
            } catch (err) {
                this.deleteError = true;
            }
        },

        async getUserContacts() {
            try {
                this.getContactsError = false;

                this.contacts = await this.$store.dispatch('getUserContacts');
            } catch (err) {
                this.getContactsError = true;
            }
        },
    },

    async created() {
        try {
            this.authorizationError = false;

            await this.$store.dispatch('isAuthorized');

            await this.getUserContacts();
        } catch (err) {
            this.authorizationError = true;
        }
    },
};
</script>
