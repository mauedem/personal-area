// eslint-disable-next-line import/prefer-default-export
export const validationMixin = {
    methods: {
        isValid() {
            this.nameError = this.name.length === 0 || this.name.length > 18;
            this.phoneError = this.phone.length === 0
                || !this.phone.match(/^\+?(\d{1,3})?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/);

            return !this.nameError && !this.phoneError;
        },
    },
};
