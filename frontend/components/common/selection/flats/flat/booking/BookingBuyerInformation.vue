<template>
    <div :class="$style.BuyerInformation">
        <VScrollBox
            :class="$style.scrollBox"
            resizable
        >
            <div :class="$style.wrapper">
                <BookingFlatInfo
                    :class="$style.flatInfo"
                    :flat="flat"
                />
                <form :class="$style.form">
                    <div
                        v-for="(input, index) in inputs"
                        :key="index"
                        :class="$style[input.className]"
                    >
                        <VInput
                            v-if="input.type !== 'date'"
                            :id="input.id"
                            v-model.trim="input.vModel"
                            :mask="input.mask"
                            :type="input.type"
                            :name="input.name"
                            :max-length="input.maxLength"
                            :placeholder="input.placeholder"
                            :error="input.error"
                            :error-msg="input.errorMsg"
                            @blur="handleFocusOut(input)"
                            @focus="input.isFocus = true"
                            @input="checkField(input.id)"
                        />
                        <DatePicker
                            v-else
                            v-model.trim="input.vModel"
                            :class="$style[input.className]"
                            :placeholder="input.placeholder"
                            :before-today="input.beforeToday"
                            :after-today="input.afterToday"
                            @error="input.error = $event"
                        />
                    </div>
                </form>
            </div>
        </VScrollBox>
        <div :class="$style.buttons">
            <VButton
                color="light"
                @click="back"
            >
                Назад
            </VButton>
            <VButton
                responsive
                :disabled="!isFormEnable"
                @click="negotiate"
            >
                Согласовать договор оферты
            </VButton>
        </div>
    </div>
</template>

<script>
    import {formCheck} from '~/assets/js/mixins/formCheck';

    import BookingFlatInfo from '~/components/common/selection/flats/flat/booking/BookingFlatInfo';
    import DatePicker from '~/components/common/DatePicker';
    export default {
        name: 'BookingBuyerInformation',
        components: {DatePicker,
                     BookingFlatInfo},

        mixins: [formCheck],
        props: {
            flat: {
                type: Object,
                default: () => ({})
            }
        },

        data() {
            return {
                inputs: [
                    {
                        id: 'name',
                        placeholder: 'Имя',
                        type: 'text',
                        maxLength: 50,
                        vModel: '',
                        error: false,
                        errorMsg: '',
                        isFocus: false,
                        regex: 'multyLang',
                        required: true,
                        className: 'name'
                    },
                    {
                        id: 'surname',
                        placeholder: 'Фамилия',
                        type: 'text',
                        maxLength: 50,
                        vModel: '',
                        error: false,
                        errorMsg: '',
                        isFocus: false,
                        regex: 'multyLang',
                        required: true,
                        className: 'surname'
                    },
                    {
                        id: 'patronymic',
                        placeholder: 'Отчество',
                        type: 'text',
                        maxLength: 50,
                        vModel: '',
                        error: false,
                        errorMsg: '',
                        isFocus: false,
                        regex: 'multyLang',
                        required: false,
                        className: 'patronymic'
                    },
                    {
                        id: 'date',
                        placeholder: 'Дата рождения',
                        type: 'date',
                        vModel: '',
                        required: false,
                        className: 'birthday',
                        beforeToday: true,
                        error: false,
                    },
                    {
                        id: 'passportSeries',
                        placeholder: 'Серия паспорта',
                        maxLength: 4,
                        vModel: '',
                        error: false,
                        errorMsg: '',
                        isFocus: false,
                        regex: 'passportSeries',
                        required: true,
                        className: 'passportSeries'
                    },
                    {
                        id: 'passportNumber',
                        placeholder: 'Номер паспорта',
                        maxLength: 6,
                        vModel: '',
                        error: false,
                        errorMsg: '',
                        isFocus: false,
                        regex: 'passportNumber',
                        required: true,
                        className: 'passportNumber'
                    },
                    {
                        id: 'email',
                        placeholder: 'E-mail',
                        type: 'text',
                        vModel: '',
                        error: false,
                        errorMsg: '',
                        isFocus: false,
                        regex: 'email',
                        required: true,
                        className: 'email'
                    },
                    {
                        id: 'phone',
                        placeholder: 'Доп. номер телефона',
                        type: 'tel',
                        mask: 'phone',
                        maxLength: 18,
                        vModel: '',
                        error: false,
                        errorMsg: '',
                        isFocus: false,
                        regex: 'phone',
                        required: false,
                        className: 'phone'
                    },
                ]
            };
        },

        methods: {
            back() {
                this.$emit('back');
            },

            negotiate() {
                for (const i in this.inputs) {
                    this.checkField(this.inputs[i].id);
                }
                if (!this.isFormEnable) {
                    return;
                }
                let date = this.inputs[3].vModel;
                if (date.length) {
                    date = date.split('/').reverse()
                        .join('-');
                } else {
                    date = undefined;
                }
                const data = {
                    last_name: this.inputs[1].vModel,
                    first_name: this.inputs[0].vModel,
                    patronymic_name: this.inputs[2].vModel,
                    birthday: date,
                    passport_series: this.inputs[4].vModel,
                    passport_number: this.inputs[5].vModel,
                    email: this.inputs[6].vModel,
                    additional_phone_number: this.inputs[7].vModel,
                };
                this.$emit('negotiate', data);
            },
        },
    };
</script>

<style lang="scss" module>
    .BuyerInformation {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .scrollBox {
        flex: auto;
    }

    .wrapper {
        padding: 2.4rem;

        @include respond-to(xs) {
            padding: 1.2rem 1.6rem 0;
        }
    }

    .flatInfo {
        margin-bottom: 2.4rem;
    }

    .form {
        display: grid;
        grid-template-areas:
            "name name"
            "surname surname"
            "patronymic patronymic"
            "birthday birthday"
            "passportSeries passportNumber"
            "email phone";
        grid-gap: 1.6rem;
        width: 100%;

        @include respond-to(xs) {
            grid-template-areas:
                "name name"
                "surname surname"
                "patronymic patronymic"
                "birthday birthday"
                "passportSeries passportNumber"
                "email email"
                "phone phone";
            grid-gap: .8rem;
        }

        :global(.v-input.has-error) {
            margin-bottom: 1.6rem;
        }
    }

    .name {
        grid-area: name;
    }

    .surname {
        grid-area: surname;
    }

    .patronymic {
        grid-area: patronymic;
    }

    .birthday {
        grid-area: birthday;
    }

    .passportSeries {
        grid-area: passportSeries;
    }

    .passportNumber {
        grid-area: passportNumber;
    }

    .email {
        grid-area: email;
    }

    .phone {
        grid-area: phone;
    }

    .buttons {
        display: flex;
        margin-top: auto;
        padding: 0 2.4rem;

        @include respond-to(xs) {
            padding: 0 1.6rem;
        }

        & > *:not(:last-child) {
            margin-right: 1.6rem;

            @include respond-to(xs) {
                margin-right: .8rem;
            }
        }
    }
</style>
