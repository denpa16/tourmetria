<template>
    <div
        v-clickoutside="onClickOutside"
        :class="$style.DatePicker"
        @click="openPopUp"
    >
        <VInput
            v-model="valueInput"
            :class="[$style.dateInput, {[$style._opened] : isPopUpOpened}]"
            type="date"
            mask="date"
            :placeholder="placeholder"
            :error="!!errorMessage.length"
            :error-msg="errorMessage"
            @input="onInput"
        >
            <template #append>
                <div
                    :class="$style.iconWrapper"
                    @click.stop="togglePopUp"
                >
                    <slot name="icon">
                        <IconArrowUp :class="$style.iconArrow" />
                    </slot>
                </div>
            </template>
        </VInput>

        <!--        <transition name="overlay-appear">-->
        <!--            <div-->
        <!--                v-if="isModalBreakpoint && isPopUpOpened"-->
        <!--                :class="$style.modalOverlay">-->
        <!--            </div>-->
        <!--        </transition>-->

        <transition name="dropdown">
            <div
                v-if="isPopUpOpened"
                :class="[$style.popupWrapper, {[$style._showGlobalArrows]: isShowGlobalArrows}]"
            >
                <!--                <div v-if="isModalBreakpoint"-->
                <!--                     :class="$style.modalHeader">-->
                <!--                    <h5 :class="$style.modalTitle">-->
                <!--                        {{ modalTitle }}-->
                <!--                    </h5>-->
                <!--                    <VSquareButton color="light"-->
                <!--                                   size="small"-->
                <!--                                   aria-label="Закрыть"-->
                <!--                                   @click="onClickOutside">-->
                <!--                        <IconCross :class="$style.iconCross" />-->
                <!--                    </VSquareButton>-->
                <!--                </div>-->
                <Datepicker
                    v-model="valueDate"
                    value-type="DD/MM/YYYY"
                    title-format="DD/MM/YYYY"
                    :lang="lang"
                    :disabled-date="beforeToday ? notAfterToday : afterToday ? notBeforeToday : undefined"
                    inline
                    @panel-change="onPanelChange"
                    @input="onPickerInput"
                />
            </div>
        </transition>
    </div>
</template>

<script>
    import 'vue2-datepicker/index.css';
    import 'vue2-datepicker/locale/ru';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';

    import Datepicker from 'vue2-datepicker';
    import IconArrowUp from '~/components/icons/IconArrowUp';
    import clickoutside from '~/assets/js/directives/clickoutside';

    export default {
        name: 'DatePicker',
        components: {IconArrowUp,
                     Datepicker},

        directives: {
            clickoutside,
        },

        mixins: [breakpointCheck],
        props: {
            value: {
                type: [String, Date],
                default: ''
            },

            placeholder: {
                type: String,
                default: ''
            },

            beforeToday: {
                type: Boolean,
                default: false,
            },

            afterToday: {
                type: Boolean,
                default: false,
            },

            // /**
            //  * Разрешение при котором появляется модалка вместо Dropdown
            //  */
            // modalBreakpoint: {
            //     type: [String, Array],
            //     default: '',
            //     validator(value) {
            //         const validValues = ['', 'xs', 'sm', 'md', 'lg', 'xl'];
            //         if (Array.isArray(value)) {
            //             return value.every(el => validValues.indexOf(el));
            //         }
            //         return validValues.indexOf(value) !== -1;
            //     },
            // },
            //
            // modalTitle: {
            //     type: String,
            //     default: 'Выберите дату'
            // },
            //
            // /**
            //  * Вызывыать функцию unlockBody после закрытия модалки или нет
            //  */
            // toUnlockBody: {
            //     type: Boolean,
            //     default: true
            // }
        },

        data() {
            return {
                isPopUpOpened: false,
                isShowGlobalArrows: false,
                valueInput: '',
                valueDate: '',
                errorMessage: '',
                lang: {
                    formatLocale: {
                        monthsShort: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
                    }
                }
            };
        },

        computed: {
            // isModalBreakpoint() {
            //     return (Array.isArray(this.modalBreakpoint) && this.modalBreakpoint.includes(this.breakpoint))
            //         || this.modalBreakpoint === this.breakpoint;
            // },
            //
            // transitionWrapName() {
            //     if (this.isModalBreakpoint) {
            //         return 'overlay-appear';
            //     }
            //
            //     return 'dropdown';
            // },
            //
            // transitionPopUpName() {
            //     if (this.isModalBreakpoint) {
            //         return 'modal';
            //     }
            //
            //     return 'dropdown';
            // }
        },

        watch: {
            errorMessage(val) {
                if (val) {
                    this.$emit('error', true);
                    return;
                }

                this.$emit('error', false);
            }
        },

        mounted() {
            if (this.value) {
                this.valueDate = this.value;
                this.valueInput = this.valueDate;
            }
        },

        methods: {
            togglePopUp() {
                this.isPopUpOpened = !this.isPopUpOpened;
            },

            openPopUp() {
                this.isPopUpOpened = true;
            },

            closePopUp() {
                this.isShowGlobalArrows = false;
                this.isPopUpOpened = false;
            },

            onInput() {
                this.errorMessage = '';
                if (this.valueInput.length < 10) {
                    return;
                }
                if (!this.validateDate()) {
                    return;
                }

                this.valueDate = this.valueInput;
                this.$emit('input', this.valueInput);
            },

            onPickerInput(val) {
                this.valueInput = val;
                this.$emit('input', this.valueInput);
            },

            onPanelChange(val) {
                this.isShowGlobalArrows = val !== 'date';
            },

            validateDate() {
                const parts = this.valueInput.split('/');
                const today = new Date(new Date().setHours(0, 0, 0, 0));

                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10);
                const year = parseInt(parts[2], 10);

                const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                if (
                    !day
                    || day < 0
                    || day > monthLength[month - 1]
                    || !month || month < 0
                    || month > 12
                    || !year
                    || year < 0
                ) {
                    this.errorMessage = 'Неверно введена дата';
                    return false;
                }

                if (this.beforeToday && today < new Date(this.valueInput)) {
                    this.errorMessage = 'Дата позднее допустимой';
                    return false;
                }

                if (this.afterToday && today > new Date(this.valueInput)) {
                    this.errorMessage = 'Дата раньше допустимой';
                    return false;
                }

                return true;
            },

            onClickOutside() {
                this.closePopUp();
            },

            notAfterToday(date) {
                return date > new Date(new Date().setHours(0, 0, 0, 0));
            },

            notBeforeToday(date) {
                return date < new Date(new Date().setHours(0, 0, 0, 0));
            },
        },
    };
</script>

<style lang="scss" module>
    .DatePicker {
        position: relative;
    }

    .dateInput {
        :global(.v-input__icon-box) {
            display: flex;
            align-items: center;
            justify-content: center;
            width: fit-content;
            height: fit-content;
        }

        &:global(.v-input.has-error) {
            margin-bottom: 1.6rem;
        }

        &._opened {
            .iconArrow {
                transform: rotate(0deg);
            }
        }
    }

    .iconWrapper {
        cursor: pointer;
    }

    .iconArrow {
        width: .8rem;
        height: .4rem;
        color: $base-800;
        transform: rotate(180deg);
        transition: all $default-transition;
    }

    .popupWrapper {
        position: absolute;
        top: calc(100% + .8rem);
        z-index: 10;

        &:after {
            content: "";
            display: block;
            width: .1rem;
            height: 1.6rem;
        }

        //&._modal {
        //    position: fixed;
        //    bottom: 0;
        //    left: 0;
        //    width: 100%;
        //    box-shadow: unset;
        //    border-radius: .8rem .8rem 0 0;
        //}

        :global(.mx-datepicker) {
            overflow: hidden;
            box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
            border-radius: .8rem;
            background-color: $base-0;
        }

        :global(.mx-datepicker-main) {
            border: none;
        }

        :global(.mx-calendar) {
            width: 100%;
            max-width: 37.9rem;
            font-family: $base-font;
        }

        :global(.mx-calendar-content) {
            height: fit-content;

            thead {
                color: $base-300;
            }
        }

        :global(.mx-btn-icon-double-right),
        :global(.mx-btn-icon-double-left) {
            display: none;
        }

        :global(.cell) {
            padding: 1rem .6rem;
            color: $base-300;
        }

        :global(.mx-calendar-content .cell.active) {
            border-radius: .8rem;
            background-color: $blue;
        }

        :global(.mx-btn-text) {
            text-transform: uppercase;
            color: $base-800;
        }

        :global(.mx-icon-right) {
            &:before {
                content: "";
                width: .8rem;
                height: .8rem;
                clip-path: polygon(50% 0%, 50% 100%, 100% 50%);
                border: none;
                background-color: $base-300;
                transform: none;
            }
        }

        :global(.mx-icon-left) {
            &:before {
                content: "";
                width: .8rem;
                height: .8rem;
                clip-path: polygon(50% 0%, 50% 100%, 0% 50%);
                border: none;
                background-color: $base-300;
                transform: none;
            }
        }

        &._showGlobalArrows {
            :global(.mx-btn-icon-double-right),
            :global(.mx-btn-icon-double-left) {
                display: inline-block;
            }
        }
    }

    //.modalOverlay {
    //    position: fixed;
    //    top: 0;
    //    left: 0;
    //    z-index: 150;
    //    width: 100vw;
    //    height: 100%;
    //    border-radius: unset;
    //    background: rgba(15, 17, 17, .32);
    //}
    //
    //.modalHeader {
    //    display: flex;
    //    align-items: center;
    //    justify-content: space-between;
    //    height: 3.2rem;
    //    padding: 3.4rem 1.6rem 1.6rem;
    //}
    //
    //.modalTitle {
    //    text-transform: uppercase;
    //    font-size: 1.2rem;
    //    font-weight: 600;
    //    line-height: 1.2rem;
    //    color: $base-800;
    //}
    //
    //.iconCross {
    //    width: .8rem;
    //    height: .8rem;
    //    color: $base-600;
    //}
</style>
