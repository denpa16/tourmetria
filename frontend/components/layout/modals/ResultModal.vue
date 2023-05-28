<template>
    <ModalWrap
        :is-visible="visible"
        without-overlay
        @close="onClose"
        @after-enter="$emit('after-enter')"
        @before-leave="$emit('before-leave')"
        @after-leave="$emit('after-leave')"
    >
        <div :class="$style.ResultModal">
            <div :class="$style.modalBody">
                <div :class="$style.iconWrapper">
                    <component
                        :is="errorData.iconComponent"
                        :class="$style.icon"
                    />
                </div>
                <h4 :class="[$style.title, 'h4']">
                    {{ errorData.title }}
                </h4>
                <p :class="[$style.description, 'p2']"
                   v-html="errorData.message">
                </p>
            </div>
            <div :class="$style.modalFooter">
                <VButton
                    v-if="errorData.btnText"
                    responsive
                    :href="errorData.url"
                    @click="onButtonClick"
                >
                    {{ errorData.btnText }}
                </VButton>
                <p
                    v-else
                    :class="[$style.footerText, 'p2']"
                >
                    Окно закроется через <span class="c-blue">{{ timer }} сек</span>
                </p>
            </div>
        </div>
    </ModalWrap>
</template>

<script>
    import ModalWrap from '~/components/common/ModalWrap';
    import IconCheck from '~/components/icons/IconCheck';
    import IconCrossBold from '~/components/icons/IconCrossBold';

    export default {
        name: 'ResultModal',
        components: {
            ModalWrap,
            IconCheck,
            IconCrossBold
        },

        props: {
            visible: {
                type: Boolean,
                default: true
            },

            data: {
                type: Object,
                default: () => ({})
            }
        },

        data() {
            return {
                seconds: 9,
            };
        },

        computed: {
            errorData() {
                let error;
                switch (this.data.status) {
                    case 'Успешно':
                        error = {
                            title: 'Успешно',
                            message: 'Квартира забронирована. Менеджер свяжется <br> с вами в ближайшее время',
                            iconComponent: 'IconCheck',
                            btnText: '',
                            url: '',
                        };
                        break;
                    case 'ERROR':
                        error = {
                            title: 'ошибка',
                            message: 'Заявка не отправлена, попробуйте <br> повторить попытку снова',
                            iconComponent: 'IconCrossBold',
                            btnText: 'Повторить попытку',
                            url: '',
                        };
                        break;
                    case 'PAYMENT_CONFIRM_ERROR':
                        error = {
                            title: 'произошла ошибка',
                            message: 'Сожалеем, но оплата не прошла. <br> Не переживайте, средства не списались',
                            iconComponent: 'IconCrossBold',
                            btnText: 'Повторить попытку',
                            url: '',
                        };
                        break;
                    case 'PAYMENT_REJECTED':
                        error = {
                            title: 'произошла ошибка',
                            message: 'Сожалеем, но оплата не прошла. <br> Не переживайте, средства не списались',
                            iconComponent: 'IconCrossBold',
                            btnText: 'Повторить попытку',
                            url: '',
                        };
                        break;
                    case 'CRM_PAYMENT_NOT_CONFIRMED':
                        error = {
                            title: 'произошла ошибка',
                            message: 'Что-то пошло не так после оплаты - <br> свяжитесь с поддержкой по телефону',
                            iconComponent: 'IconCrossBold',
                            btnText: 'Связаться с нами',
                            url: `tel: ${this.contactNumber}`,
                        };
                        break;
                    default:
                        error = {
                            title: 'произошла ошибка',
                            message: 'Что-то пошло не так после оплаты - <br> свяжитесь с поддержкой по телефону',
                            iconComponent: 'IconCrossBold',
                            btnText: 'Связаться с нами',
                            url: `tel: ${this.contactNumber}`,
                        };
                }
                return error;
            },

            timer() {
                return `0${this.seconds}`;
            },
        },

        mounted() {
            if (!this.errorData.btnText) {
                this.setTimer();
            }
        },

        methods: {
            onClose() {
                if (this.data.beforeClose) {
                    this.data.beforeClose();
                }
                this.$emit('close');
            },

            setTimer() {
                clearInterval(this.interval);
                this.seconds = 9;
                this.interval = setInterval(() => {
                    if (this.seconds <= 0) {
                        clearInterval(this.interval);
                        this.onClose();
                    } else {
                        this.seconds -= 1;
                    }
                }, 1000);
            },

            onButtonClick() {
                if (!this.errorData.url) {
                    this.onClose();
                }
            },
        },
    };
</script>

<style lang="scss" module>
    .ResultModal {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .modalBody {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: auto;
    }

    .iconWrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4.8rem;
        height: 4.8rem;
        margin-bottom: 2.4rem;
        border-radius: 50%;
        background-color: $base-50;
    }

    .icon {
        width: 1.5rem;
        height: 1.5rem;
        color: $blue;
    }

    .title {
        margin-bottom: 2.4rem;
        text-transform: uppercase;
    }

    .description {
        max-width: 35rem;
        text-align: center;
        font-family: $accent-font-family;
        color: rgba(0, 0, 0, .4);
    }

    .modalFooter {
        display: flex;
        justify-content: center;
        padding: 2.4rem;
    }

    .footerText {
        color: rgba(0, 0, 0, .4);
    }
</style>
