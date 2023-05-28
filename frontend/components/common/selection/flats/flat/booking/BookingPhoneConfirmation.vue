<template>
    <div :class="$style.PhoneConfirmation">
        <div :class="$style.topContent">
            <p :class="[$style.label, 'p2','c-base300']">
                Выслали код подтверждения на номер:
            </p>
            <div
                :class="[$style.phone, 'p2']"
                @click="onPhoneClick"
            >
                {{ phone }}
                <IconEdit :class="$style.iconEdit" />
            </div>
            <div :class="$style.inputs">
                <input
                    v-for="(input, index) in 4"
                    :key="index"
                    :ref="`input-${index}`"
                    :class="$style.input"
                    type="text"
                    @input="onInput($event, index)"
                    @keydown.enter="onEnter"
                >
            </div>
            <p
                v-if="error !== ''"
                :class="$style.errorMessage"
            >
                *{{ error }}
            </p>
        </div>
        <p
            v-if="seconds"
            :class="$style.timer"
        >
            Запросить код повторно через <span class="c-blue">{{ timer }}</span>
        </p>
        <button
            v-else
            :class="$style.buttonResend "
            value="Выслать код повторно"
            @click="resendCode"
        >
            Выслать код повторно
        </button>
        <VButton
            :disabled="!isCodeEntered"
            color="primary"
            responsive
            @click="onButtonClick"
        >
            Подтвердить номер
        </VButton>
    </div>
</template>

<script>
    import IconEdit from '~/components/icons/IconEdit';
    export default {
        name: 'BookingPhoneConfirmation',
        components: {IconEdit},
        props: {
            phone: {
                type: String,
                default: ''
            },

            error: {
                type: String,
                default: ''
            },

            code: {
                type: String,
                default: ''
            }
        },

        data() {
            return {
                seconds: 59,
                interval: null,
                codeArray: ['', '', '', ''],
                codeString: ''
            };
        },

        computed: {
            timer() {
                return `0:${this.seconds < 10 ? '0'+ this.seconds : this.seconds}`;
            },

            isCodeEntered() {
                return this.codeString.length === 4;
            }
        },

        watch: {
            phone() {
                this.setTimer();
            }
        },

        methods: {
            onInput(e, index) {
                const inputValue = e.target.value.replace(/[A-Za-z]/g, '')
                    .replace(' ', '')
                    .replace(/[-!$(){}[\]:;<+?\\@#%^'"/*_=&,>]/g, '');
                e.target.value = inputValue;
                if (!inputValue.length) {
                    this.codeArray[index] = '';
                    this.codeString = this.codeArray.join('');
                    return;
                }
                e.target.value = inputValue[1] || inputValue[0];
                this.codeArray[index] = e.target.value;
                this.codeString = this.codeArray.join('');
                if (index < 3) {
                    this.$refs[`input-${index + 1}`][0].focus();
                }
            },

            onEnter() {
                if (!this.isCodeEntered) {
                    return;
                }
                this.$emit('confirmButtonClicked', this.codeString);
            },

            onButtonClick() {
                this.$emit('confirmButtonClicked', this.codeString);
            },

            onPhoneClick() {
                this.$emit('phoneClicked');
            },

            setTimer() {
                clearInterval(this.interval);
                this.seconds = 59;
                this.interval = setInterval(() => {
                    if (this.seconds <= 0) {
                        clearInterval(this.interval);
                    } else {
                        this.seconds -= 1;
                    }
                }, 1000);
            },

            resendCode() {
                this.$emit('resendCode');
                this.setTimer();
            }
        }
    };
</script>

<style lang="scss" module>
    .PhoneConfirmation {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 2.4rem 2.4rem 0;

        @include respond-to(xs) {
            padding: 1.2rem 1.6rem 0;
        }
    }

    .topContent {
        margin-bottom: auto;
    }

    .label {
        margin-bottom: .8rem;
        font-family: $accent-font-family;

        @include respond-to(xs) {
            margin-bottom: .4rem;
            font-size: 1.2rem;
            line-height: 1.6rem;
        }
    }

    .phone {
        display: flex;
        align-items: center;
        margin-bottom: 2.4rem;
        font-family: $accent-font-family;
        color: $blue;
        transition: color $default-transition;
        cursor: pointer;

        @include hover {
            color: rgba($blue, .6);
        }

        @include respond-to(sm) {
            margin-bottom: 1.6rem;
        }

        @include respond-to(xs) {
            margin-bottom: 2.4rem;
            font-family: unset;
            font-size: 1.2rem;
            line-height: 1.6rem;
        }
    }

    .iconEdit {
        width: 1.4rem;
        height: 1.4rem;
        margin-left: .8rem;
    }

    .inputs {
        display: flex;
        height: 12.4rem;
        margin-bottom: auto;

        @include respond-to(sm) {
            height: 10.7rem;
        }

        @include respond-to(xs) {
            height: 7.9rem;
        }
    }

    .input {
        flex: auto;
        width: 100%;
        height: 100%;
        margin-right: .8rem;
        border-radius: .8rem;
        border: none;
        background-color: #f4f4f4;
        outline: none;
        text-align: center;
        font-size: 3.2rem;

        @include respond-to(xs) {
            font-size: 2.4rem;
        }

        &:last-child {
            margin-right: 0;
        }
    }

    .errorMessage {
        margin-top: .8rem;
        font-size: 1.1rem;
        font-weight: 500;
        line-height: 1.6rem;
        color: $error;
    }

    .timer {
        margin-bottom: 1.6rem;
        font-size: 1.2rem;
        line-height: 1.6rem;
        color: $base-300;
    }

    .buttonResend {
        width: fit-content;
        margin-bottom: 1.6rem;
        font-size: 1.2rem;
        font-weight: 400;
        line-height: 1.6rem;
        color: $blue;
        transition: color $default-transition;
        cursor: pointer;

        @include hover {
            color: rgba($blue, .6);
        }
    }
</style>
