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
            v-col.pl-0.pl-sm-5.pl-md-12.pr-0(
                cols="3"
            )
                v-toolbar-title Contacts

            v-col.px-0(
                cols="5"
            )
                v-text-field(
                    flat
                    solo-inverted
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    label="Search"
                    v-model="searchedText"
                )

            v-col.ml-md-12.ml-sm-12.pl-md-12.pl-sm-0.pl-1(
                cols="5"
                sm="3"
            )
                create-contact(
                    @get-user-contacts="getUserContacts"
                )

        v-alert.mt-2(
            v-show="getContactsError"
            type="error"
        ) An error occured while getting contacts. Reload the page.

        v-alert.mb-0.mt-2.mx-md-12.mx-lg-12(
            v-show="deleteError"
            type="error"
            dismissible
            dense
            close-icon="mdi-close"
            @click="closeError"
        ) An error occured while deleting the contact. Reload the page.

        v-container.fill-height.d-flex
            v-card.elevation-12.mb-3.mr-3.flex-grow-1.flex-md-grow-0.flex-lg-grow-0(
                v-for="{ id, name, phone } in filteredContacts"
                :key="'contact_' + id"
                max-width="500"
                min-width="270"
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
                if (contact.name.toLowerCase().indexOf(this.searchedText) !== -1) {
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
