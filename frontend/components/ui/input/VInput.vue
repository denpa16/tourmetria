<template>
    <div :class="['v-input', classes]">
        <div
            v-if="label"
            :class="['v-input__label', 'p5', 'c-base300']"
        >
            {{ label }}
        </div>

        <span
            v-if="$slots.prepend"
            class="v-input__icon-box v-input__icon-box_prepend"
        >
            <slot name="prepend"></slot>
        </span>

        <div class="v-input__inner">
            <input
                ref="input"
                v-model="lazyValue"
                v-bind="$attrs"
                class="v-input__native"
                :type="numbers ? 'tel' : type"
                :name="name"
                :disabled="disabled"
                :maxlength="maxLength"
                @keydown.enter="onEnter"
                @input="onInput"
                @change="onChange"
                @focus="onFocus"
                @blur="onBlur"
            >

            <div
                v-if="preMask"
                class="v-input__premask_wrap"
            >
                <div
                    class="v-input__premask"
                    v-html="currentPreMask"
                >
                </div>
            </div>
        </div>

        <span
            v-if="$slots.append"
            class="v-input__icon-box v-input__icon-box_append"
        >
            <slot name="append"></slot>
        </span>

        <transition name="fade-content">
            <VTooltip
                v-if="tooltipContent"
                class="v-input__tooltip"
                :offset-x="0"
                :offset-y="0"
                :nudge="13"
                default-wrapper
                top
            >
                <template #activator>
                    <svg
                        class="v-input__tooltip-icon"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M7.99967 14.6668C4.31767 14.6668 1.33301 11.6822 1.33301 8.00016C1.33301 4.31816 4.31767 1.3335 7.99967 1.3335C11.6817 1.3335 14.6663 4.31816 14.6663 8.00016C14.6663 11.6822 11.6817 14.6668 7.99967 14.6668ZM7.99967 13.3335C9.41416 13.3335 10.7707 12.7716 11.7709 11.7714C12.7711 10.7712 13.333 9.41465 13.333 8.00016C13.333 6.58567 12.7711 5.22912 11.7709 4.22893C10.7707 3.22873 9.41416 2.66683 7.99967 2.66683C6.58519 2.66683 5.22863 3.22873 4.22844 4.22893C3.22824 5.22912 2.66634 6.58567 2.66634 8.00016C2.66634 9.41465 3.22824 10.7712 4.22844 11.7714C5.22863 12.7716 6.58519 13.3335 7.99967 13.3335ZM7.33301 4.66683H8.66634V6.00016H7.33301V4.66683ZM7.33301 7.3335H8.66634V11.3335H7.33301V7.3335Z"
                            fill="currentColor"
                        />
                    </svg>
                </template>
                <span
                    v-show="!$deviceIs.mobile"
                    class="v-input__tooltip-content"
                    v-html="tooltipContent"
                >
                </span>
            </VTooltip>
        </transition>

        <transition name="fade">
            <div
                v-if="error && !disabled && errorMsg"
                class="v-input__error"
            >

                <div :class="['v-input__error-content', modClass]">
                    <div
                        :class="['p7', 'v-input__error-text']"
                        v-html="`*${errorMsg}`"
                    >
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import {
        addMask,
        setCursor,
        getNextCursorPosition,
        setSelection,
    } from '~/assets/js/utils/maskUtils';
    import {splitThousands} from '~/assets/js/utils/numberUtils';

    export default {
        name: 'VInput',

        props: {
            name: {
                type: String,
                default: '',
            },

            value: {
                type: [String, Number],
                default: '',
            },

            label: {
                type: String,
                default: String,
            },

            type: {
                type: String,
                default: 'text',
            },

            /**
             * Устанавливает класс для определения размера
             */
            size: {
                type: String,
                default: 'medium',
                validator: val => ['medium', 'zero'].includes(val),
            },

            /**
             * Устанавливает класс для определения цвета
             */
            color: {
                type: String,
                default: 'default',
                validator: val => ['default', 'white', 'transparent'].includes(val),
            },

            preMask: {
                type: Boolean,
                default: false,
            },

            mask: {
                type: String,
                default: null,
            },

            disabled: {
                type: Boolean,
                default: false,
            },

            error: {
                type: Boolean,
                default: false,
            },

            errorMsg: {
                type: String,
                default: '',
            },

            modClass: {
                type: String,
                default: '',
            },

            presetValue: {
                type: Boolean,
                default: false,
            },

            maxLength: {
                type: Number,
                default: null,
            },

            /**
             * Определяет текст тултипа
             */
            tooltipContent: {
                type: String,
                default: '',
            },
        },

        data() {
            return {
                lazyValue: '',
                isFocused: false,
                numbers: false,
                numberInputs: ['phone', 'date', 'time', 'number', 'snils', 'inn', 'pass', 'card', 'code', 'percent', 'year', 'month'],
            };
        },

        computed: {
            classes() {
                return [
                    `v-input--${this.color}`,
                    `v-input--${this.size}`,
                    this.modClass,
                    {
                        'is-active': this.lazyValue,
                        'is-focused': this.isFocused,
                        'is-disabled': this.disabled,
                        'is-prepend': this.$slots.prepend,
                        'is-append': this.$slots.append,
                        'has-error': this.error,
                        'has-label': this.label,
                    },
                ];
            },

            currentMask() {
                switch (this.mask) {
                    case 'phone':
                        return '+7 (9##) ###-##-##';
                    case 'date':
                        return '##/##/####';
                    case 'datedot':
                        return '##.##.####';
                    case 'time':
                        return '##:##';
                    case 'number':
                        return '##########';
                    case 'snils':
                        return '###-###-### ##';
                    case 'inn':
                        return '############';
                    case 'passport':
                        return '#### ######';
                    case 'card':
                        return '#### #### #### ####';
                    case 'months':
                        return '###';
                    case 'percent':
                    case 'year':
                    case 'code':
                        return '####';
                    default:
                        return null;
                }
            },

            currentPreMask() {
                if (!this.currentMask) {
                    return;
                }

                if (this.lazyValue.length) {
                    const regex = new RegExp('^.{0,' + this.lazyValue.length + '}', 'g');
                    const pre = this.currentMask.replace(regex, `<span>${this.lazyValue}</span>`);
                    return pre.replace(/#/g, '&ensp;');
                }

                return this.currentMask.replace(/#/g, '&ensp;');
            },
        },

        watch: {
            value(val) {
                if (val !== this.lazyValue) {
                    let newValue = val;

                    if (this.mask && newValue) {
                        newValue = addMask(newValue, this.currentMask);
                    }
                    this.lazyValue = newValue;
                    this.$emit('input', newValue);
                }
            },
        },

        created() {
            if (this.presetValue && this.value) {
                this.lazyValue = this.value;
            }

            if (this.mask && this.value) {
                this.lazyValue = addMask(this.value, this.currentMask);
            }

            if (this.numberInputs.includes(this.mask)) {
                this.numbers = true;
            }
        },

        methods: {
            onEnter(e) {
                this.$refs.input.blur();
                this.$emit('enter', e);
            },

            onFocus(e) {
                this.isFocused = true;
                this.$emit('focus', e);

                if (this.mask === 'phone' && !this.value) {
                    this.$nextTick(() => {
                        setCursor(e.target, this.value.length);
                    });
                }
            },

            onBlur(e) {
                this.isFocused = false;
                this.$emit('blur', e);

                // Automatically remove '+' or '+7' character
                if (this.mask === 'phone' && (this.value === '+' || this.value === '+7')) {
                    this.$emit('input', '');
                }
            },

            onChange(e) {
                if (this.numbers) {
                    if (
                        (this.lazyValue.length > 1 && this.lazyValue[0] === '0') ||
                        (this.lazyValue.length === 1 && this.lazyValue[0] === '-')
                    ) {
                        const cleanValue = !this.lazyValue.length || this.lazyValue === '-'
                            ? ''
                            : Number(this.lazyValue.split(' ').join(''));
                        this.lazyValue = splitThousands(cleanValue
                            .toString()
                            .replace(/^(-)?0+(?=\d)/, '$1'));
                    }
                }

                this.$emit('change', e);
            },

            onInput(e) {
                if (this.mask) {
                    let endPos = e.target.selectionEnd;
                    const oldValue = this.lazyValue;
                    if (this.mask === 'phone' && this.lazyValue.charAt(0) == 8) {
                        this.lazyValue = '+7';
                    }

                    const newValue = addMask(this.lazyValue, this.currentMask);

                    endPos = getNextCursorPosition(endPos, oldValue, newValue, ' ');
                    this.lazyValue = newValue;
                    this.$nextTick(() => {
                        setSelection(e.target, endPos);
                    });

                    if (this.mask === 'percent') {
                        if (this.lazyValue === '00') {
                            this.lazyValue = 1;
                        }
                        this.lazyValue = this.lazyValue > 100 ? '100%' : e.target.value + '%';
                    } else if (this.mask === 'months' && this.lazyValue > 360) {
                        this.lazyValue = 360;
                    }
                } else {
                    this.lazyValue = e.target.value;
                }

                this.$emit('input', this.lazyValue);
            },
        },
    };
</script>

<style lang="scss">
    .v-input {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        border: 1px solid transparent;
        transition: border-color $default-color-transition, background-color $default-color-transition, color $default-color-transition;

        @include respond-to(xs) {
            -webkit-text-size-adjust: 100%;
        }

        /* Size */
        &--zero {
            padding: 0;
            border-radius: .4rem;
            border: 0;
            font-size: 1.2rem;
            line-height: 1.6rem;
        }

        &--medium {
            height: 4.4rem;
            padding: 0 2.4rem;
            border-radius: .4rem;
            font-size: 1.2rem;
            line-height: 1.6rem;
        }

        /* Colors */
        &--default {
            border-color: $base-50;
            background-color: $base-50;
            color: $base-800;

            &::placeholder {
                color: $base-300;
            }

            @include hover {
                color: $base-700;
            }

            &.is-focused {
                color: $base-700;

                .v-input__label {
                    color: $blue;
                }
            }

            &.has-error {
                color: $error;
            }

            &.is-disabled {
                opacity: .44;
            }

            .v-input__label {
                color: $base-500;
            }

            .v-input__error-icon {
                color: $error;
            }
        }

        &--white {
            border-color: $base-0;
            background-color: $base-0;
            color: $base-300;

            &::placeholder {
                color: $base-300;
            }

            @include hover {
                color: $base-300;
            }

            &.is-focused {
                color: $base-800;

                .v-input__label {
                    color: $blue;
                }
            }

            &.has-error {
                color: $error;
            }

            &.is-disabled {
                opacity: .44;
            }

            .v-input__label {
                color: $base-800;
            }

            .v-input__error-icon {
                color: $error;
            }
        }

        &--transparent {
            border-color: transparent;
            background-color: transparent;
            color: $base-800;

            &::placeholder {
                color: $base-300;
            }

            @include hover {
                color: $base-700;
            }

            &.is-focused {
                color: $base-700;
            }

            &.has-error {
                color: $error;
            }

            .v-input__error-icon {
                color: $error;
            }
        }

        /* End colors */

        /* Modificators */

        &.is-active {
            .v-input__premask_wrap {
                opacity: .5;

                span {
                    opacity: 0;
                }
            }
        }

        &.is-disabled {
            pointer-events: none;
        }

        &.is-prepend {
            padding-left: calc(2.4rem + 1.6rem + 1.2rem);
        }

        &.is-append {
            padding-right: calc(2.4rem + 1.6rem + 1.2rem);
        }

        &.has-label {
            margin-top: 2.6rem;
        }

        &.has-error {
            margin-bottom: 3.6rem;
        }

        &__error-text {
            color: currentColor;
        }

        &__error-content {
            color: $error;
        }

        &__error {
            position: absolute;
            bottom: -2rem;
            left: 0;
            z-index: 3;
        }

        /* End Modificators */

        &__premask_wrap {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            display: flex;
            align-items: center;
            width: 100%;
            height: calc(100% - 1.7rem);
            margin-top: 1.7rem;
            font-size: inherit;
            color: currentColor;
            opacity: 0;
            transition: .3s all ease;
        }

        &__premask {
            display: inline-block;
            line-height: 1.15;
        }

        &__inner {
            position: relative;
            width: 100%;
            height: 100%;
        }

        &__native {
            position: relative;
            z-index: 2;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            border: none;
            background-color: transparent;
            outline: none;
            font-size: inherit;
            color: currentColor;
            box-shadow: none;
            -webkit-appearance: none;
            -webkit-text-size-adjust: 100%;
        }

        &__label {
            position: absolute;
            top: -2.6rem;
            left: 0;
            pointer-events: none;
            transform-origin: left center;
            transition: transform .3s ease;

            @include respond-to(xs) {
                bottom: 18px;
            }
        }

        &__icon-box {
            position: absolute;
            top: 50%;
            width: 1.6rem;
            height: 1.6rem;
            color: $blue;
            transform: translateY(-50%);

            &_prepend {
                left: 2.4rem;
            }

            &_append {
                right: 2.4rem;
            }
        }

        &__tooltip {
            position: absolute;
            top: 50%;
            right: 2.4rem;
            z-index: 5;
            width: 1.6rem;
            height: 1.6rem;
            transform: translate3d(0, -50%, 0);

            &-content {
                font-size: 1.2rem;
                font-weight: 500;
                line-height: 1.6rem;
                color: $base-400;
            }

            &-icon {
                width: 1.6rem;
                height: 1.6rem;
                color: $base-800;
                transition: all $default-transition;
                cursor: pointer;

                &:hover {
                    color: $base-400;
                }
            }
        }
    }
</style>
