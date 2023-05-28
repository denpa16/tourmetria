<template>
    <div :class="[$style.FormResult, {['form-error']: !success}]">
        <div :class="['form-content', $style.content]">
            <div :class="['form-icon', $style.iconWrapper]">
                <IconCheck v-if="success"
                           :class="$style.icon" />
                <IconCrossBold v-if="isErrorIcon && !success"
                               :class="$style.icon" />
                <IconNotAvalable v-if="!isErrorIcon && !success"
                                 :class="$style.icon" />
            </div>
            <h4 :class="['h4', $style.title, 'form-title']">
                {{ success ? successTitle : errorTitle }}
            </h4>
            <p :class="['p2', $style.subtitle, $style.text, 'form-text']"
               v-html="success ? successMessage : errorMessage"></p>
        </div>

        <div :class="[$style.bottom, 'form-bottom']">
            <div v-if="success"
                 :class="['p2', $style.text, 'form-text']">
                {{ timerText }} <span :class="'c-blue'">{{ currentTime | leadingZero }} сек</span>
            </div>
            <VButton v-else
                     :class="$style.btn"
                     :href="href"
                     @click="onButtonClick">
                {{ btnText }}
            </VButton>
        </div>

    </div>
</template>

<script>
    import IconCrossBold from '~/components/icons/IconCrossBold';
    import IconNotAvalable from '~/components/icons/IconNotAvalable';
    import IconCheck from '~/components/icons/IconCheck';

    export default {
        name: 'FormResult',

        components: {
            IconCrossBold,
            IconNotAvalable,
            IconCheck,
        },

        props: {
            success: {
                type: Boolean,
                default: false,
            },

            successTitle: {
                type: String,
                default: 'Успешно',
            },

            successMessage: {
                type: String,
                default: 'Квартира забронирована. Менеджер свяжется <br> с вами в ближайшее время',
            },

            errorTitle: {
                type: String,
                default: 'Ошибка',
            },

            errorMessage: {
                type: String,
                default: 'Заявка не отправлена, попробуйте <br> повторить попытку снова',
            },

            btnText: {
                type: String,
                default: 'Повторить попытку',
            },

            href: {
                type: String,
                default: '',
            },

            timerText: {
                type: String,
                default: 'Окно закроется через',
            },

            isErrorIcon: {
                type: Boolean,
                default: true,
            },
        },

        data() {
            return {
                currentTime: 9,
                timer: null,
            };
        },

        watch: {
            currentTime(time) {
                if (time === 0) {
                    this.stopTimer();
                    this.currentTime = 9;
                    this.$emit('close');
                }
            },
        },

        mounted() {
            if (!this.success) {
                return;
            }

            this.startTimer();
        },

        beforeDestroy() {
            this.currentTime = 9;
        },

        methods: {
            startTimer() {
                this.timer = setInterval(() => {
                    this.currentTime--;
                }, 1000);
            },

            stopTimer() {
                clearTimeout(this.timer);
            },

            onButtonClick() {
                if (!this.href) {
                    this.$emit('resent');
                }
            },
        }

    };
</script>

<style lang="scss" module>
    .FormResult {
        display: flex;
        flex-direction: column;
    }

    .content {
        margin: 0 auto;
        text-align: center;
    }

    .iconWrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4.8rem;
        height: 4.8rem;
        margin: 0 auto;
        border-radius: 50%;
        background-color: $base-50;
        color: $blue;
    }

    .icon {
        width: 1.8rem;
        height: 1.8rem;
    }

    .title {
        margin: 2.4rem 0;
        text-transform: uppercase;

        @include respond-to(sm) {
            margin-bottom: .8rem;
        }
    }

    .text {
        text-align: center;
        color: rgba($black, .4);
    }

    .subtitle {
        margin: 0 auto;
        white-space: nowrap;

        @include respond-to(xs) {
            max-width: unset;
        }
    }

    .bottom {
        margin-top: auto;
        text-align: center;

        @include respond-to(sm) {
            padding: 2.4rem;
            border-top: 1px solid $base-100;
        }

        @include respond-to(xs) {
            padding: 0;
            border-top: unset;
        }
    }

    .btn {
        width: 100%;
    }
</style>
