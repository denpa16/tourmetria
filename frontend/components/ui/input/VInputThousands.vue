<template>
    <div class="v-input-thousands"
         :class="classList">
        <div class="v-input-thousands__inner">
            <input ref="input"
                   class="v-input-thousands__native"
                   :aria-label="label"
                   v-bind="$attrs"
                   :value="textValue ? textValue : splittedValue + postfix"
                   type="text"
                   :disabled="disabled"
                   @keydown.enter="$refs.input.blur()"
                   @input="onInput"
                   @change="onChange"
                   @focus="onFocus"
                   @blur="onBlur">
        </div>

        <span v-if="label"
              class="v-input-thousands__label">
            {{ label }}
        </span>
    </div>
</template>

<script>

    export default {
        name: 'VInputThousands',

        props: {
            value: {
                type: [String, Number],
                default: '',
            },

            label: {
                type: String,
                default: '',
            },

            postfix: {
                type: String,
                default: '',
            },

            /**
             * Определяет классы, которые будут модифицировать размер
             */
            size: {
                type: String,
                default: 'medium',
                validator(value) {
                    return ['large', 'medium', 'small'].indexOf(value) !== -1;
                },
            },

            color: {
                type: String,
                default: '',
            },

            disabled: {
                type: Boolean,
                default: false,
            },

            delimiter: {
                type: String,
                default: ' ',
            },

            decimalMark: {
                type: String,
                default: '.',
            },

            positiveOnly: {
                type: Boolean,
                default: true,
            },

            decimalCount: {
                type: Number,
                default: 2,
            },

            textValue: {
                type: String,
                default: '',
            },

            defaultValue: {
                type: [Number, String],
                default: 0,
            },
        },

        data() {
            return {
                isFocused: false,
                splittedValue: this.splitThousands(this.value),
            };
        },

        computed: {
            classList() {
                return [
                    `v-input-thousands--${this.color}`,
                    `v-input-thousands--${this.size}`,
                    {
                        'is-active': this.value,
                        'is-focus': this.isFocused,
                        'is-disabled': this.disabled,
                    },
                ];
            },

            cleanValue() {
                return Number(this.splittedValue.split(this.delimiter).join(''));
            },
        },

        watch: {
            value(newValue) {
                if (newValue !== this.cleanValue) {
                    this.splittedValue = this.splitThousands(newValue);
                }
            },
        },

        methods: {
            onChange() {
                // strip any leading zeros
                if (this.splittedValue.length > 1 && this.splittedValue[0] === '0') {
                    this.splittedValue = this.splitThousands(this.cleanValue.toString().replace(/^(-)?0+(?=\d)/, '$1'));
                }

                if ((!this.splittedValue || this.splittedValue === '0') && !this.textValue) {
                    this.splittedValue = this.splitThousands(this.defaultValue);
                }

                this.$nextTick(() => {
                    this.$emit('change', this.cleanValue);
                });
            },

            onFocus(e) {
                this.isFocused = true;
                this.$emit('focus', e);
            },

            onBlur(e) {
                this.isFocused = false;
                this.$emit('blur', e);
            },

            onInput(e) {
                let endPos = e.target.selectionEnd;
                const oldValue = e.target.value;
                const newValue = this.splitThousands(e.target.value);
                e.target.value = newValue;
                this.splittedValue = newValue;

                this.$nextTick(() => {
                    endPos = this.getNextCursorPosition(endPos, oldValue, newValue, this.delimiter);
                    this.setCursor(e.target, endPos);
                    this.$emit('input', this.cleanValue);
                });
            },

            splitThousands(value) {
                if (typeof value !== 'number' && typeof value !== 'string') {
                    console.warn('[CInputThousands] Wrong prop value');
                    return '';
                }

                let partDecimal = '';
                let parts;

                // strip alphabet letters
                value = value.toString();
                value = value
                    .replace(/[A-Za-z]/g, '')
                    // replace the first decimal mark with reserved placeholder
                    .replace(this.decimalMark, 'M')

                    // strip non numeric letters except minus and "M"
                    // this is to ensure prefix has been stripped
                    .replace(/[^\dM-]/g, '')

                    // replace the leading minus with reserved placeholder
                    .replace(/^-/, 'N')

                    // strip the other minus sign (if present)
                    .replace(/-/g, '')

                    // replace the minus sign (if present)
                    .replace('N', this.positiveOnly ? '' : '-')

                    // replace decimal mark
                    .replace('M', this.decimalMark);

                // strip any leading zeros
                // if (owner.stripLeadingZeroes) {
                // value = value.replace(/^(-)?0+(?=\d)/, '$1');
                // }

                const partSign = value.slice(0, 1) === '-' ? '-' : '';
                const partSignAndPrefix = partSign;
                let partInteger = value;

                if (value.indexOf(this.decimalMark) >= 0) {
                    parts = value.split(this.decimalMark);
                    partInteger = parts[0];
                    partDecimal = this.decimalMark + parts[1].slice(0, this.decimalCount);
                }
                if (partSign === '-') {
                    partInteger = partInteger.slice(1);
                }
                partInteger = partInteger.replace(/(\d)(?=(\d{3})+$)/g, '$1' + this.delimiter);

                return (
                    partSignAndPrefix +
                    partInteger.toString() +
                    (this.decimalCount > 0 ? partDecimal.toString() : '')
                );
            },

            getNextCursorPosition(prevPos, oldValue, newValue, delimiter) {
                return oldValue.length === prevPos
                    ? newValue.length
                    : prevPos + this.getPositionOffset(prevPos, oldValue, newValue, delimiter);
            },

            getPositionOffset(prevPos, oldValue, newValue, delimiter) {
                const oldRawValue = this.stripDelimiters(oldValue.slice(0, prevPos), delimiter);
                const newRawValue = this.stripDelimiters(newValue.slice(0, prevPos), delimiter);
                const lengthOffset = oldRawValue.length - newRawValue.length;
                return lengthOffset !== 0 ? lengthOffset / Math.abs(lengthOffset) : 0;
            },

            stripDelimiters(value, delimiter) {
                const delimiterRE = delimiter
                    ? new RegExp(delimiter.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'g')
                    : '';
                return value.replace(delimiterRE, '');
            },

            setCursor(el, position) {
                // eslint-disable-next-line func-style
                const setSelectionRange = function() {
                    el.setSelectionRange(position, position);
                };

                if (el === document.activeElement) {
                    setSelectionRange();
                    // Android Fix
                    setTimeout(setSelectionRange, 1);
                }
            },
        },
    };
</script>

<style lang="scss">
    .v-input-thousands {
        position: relative;
        width: 100%;
        height: 100%;
        font-size: 1.2rem;

        &.is-disabled {
            pointer-events: none;
        }

        &.is-focus {
            & .v-input-thousands__native {
                color: $blue;
            }
        }

        &__inner {
            position: relative;
            height: 100%;
        }

        &__native {
            width: 100%;
            height: 100%;
            padding: 0;
            border: none;
            background-color: transparent;
            font-family: inherit;
            font-size: 1.2rem;
            font-weight: inherit;
            color: inherit;
            transition: color $default-color-transition;
        }

        &__label {
            position: absolute;
            bottom: 1.8rem;
            left: 0;
            font-size: 1.2rem;
            transition: opacity .4s;
            pointer-events: none;
        }
    }
</style>
