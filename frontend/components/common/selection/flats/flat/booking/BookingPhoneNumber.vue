<template>
    <div :class="$style.BookingPhone">
        <p :class="$style.label">
            Введите номер телефона, на который будет выслан код подтверждения
        </p>
        <VInput
            v-model="phone"
            type="tel"
            placeholder="Телефон"
            mask="phone"
            name="phone"
            :error-msg="error"
            :error="error !== ''"
            @enter="phoneEntered"
        />
        <VButton
            :class="$style.getCodeButton"
            :disabled="!isPhoneValid"
            color="primary"
            responsive
            @click="phoneEntered"
        >
            Получить код
        </VButton>
    </div>
</template>

<script>
    export default {
        name: 'BookingPhoneNumber',
        components: {},
        props: {
            error: {
                type: String,
                default: ''
            }
        },

        data() {
            return {
                phone: '',
            };
        },

        computed: {
            isPhoneValid() {
                const PHONE_STRING_LENGTH = 18;
                return this.phone.length === PHONE_STRING_LENGTH;
            }
        },

        methods: {
            phoneEntered() {
                if (!this.isPhoneValid) {
                    return;
                }
                this.$emit('phoneEntered', this.phone);
            }
        },
    };
</script>

<style lang="scss" module>
    .BookingPhone {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 2.4rem 2.4rem 0;

        @include respond-to(xs) {
            padding: 1.2rem 1.6rem 0;
        }
    }

    .label {
        max-width: 30.2rem;
        margin-bottom: 2.4rem;
        font-family: $accent-font-family;
        font-weight: 500;
        line-height: 2rem;
        color: rgba(0, 0, 0, .4);

        @include respond-to(sm) {
            margin-bottom: 1.6rem;
        }

        @include respond-to(xs) {
            margin-bottom: 2.4rem;
            font-size: 1.2rem;
            line-height: 1.6rem;
        }
    }

    .getCodeButton {
        margin-top: auto;
    }
</style>
