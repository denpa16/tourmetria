<template>
    <div
        class="v-switch"
        :class="classes"
        role="switch"
        :aria-checked="lazyValue"
        :aria-disabled="disabled"
    >

        <span
            v-if="$slots.falseLabel"
            :class="{'_blur': lazyValue}"
            class="v-switch__label _left"
            @click="onLabelClick(false)"
        >
            <slot name="falseLabel"></slot>
        </span>

        <div
            class="v-switch__field"
            tabindex="0"
            @focus="onFocus"
            @blur="onBlur"
            @click="onChange"
            @keydown.enter="onChange"
        >

            <div class="v-switch__dot"></div>
        </div>

        <span
            v-if="$slots.trueLabel"
            :class="{'_blur': !lazyValue}"
            class="v-switch__label _right"
            @click="onLabelClick(true)"
        >
            <slot name="trueLabel"></slot>
        </span>

        <input
            v-if="name"
            type="hidden"
            :name="name"
            :value="lazyValue ? trueValue : falseValue"
        >
    </div>
</template>

<script>
    export default {
        name: 'VSwitch',

        props: {
            /**
             * Имя, которое используется при отправке формы
             */
            name: {
                type: String,
                default: '',
            },

            /**
             * Текущее значение чекбокса
             */
            value: {
                type: [Array, String, Boolean, Number],
                default: undefined,
            },

            /**
             * Значение, которое используется при отправке формы, а также передается в value
             * при активации чекбокса
             */
            trueValue: {
                type: [String, Boolean],
                default: true,
            },

            falseValue: {
                type: [String, Boolean],
                default: false,
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

            /**
             * Определяет классы, которые будут модифицировать цвет
             */
            color: {
                type: String,
                default: 'primary',
            },

            /**
             * Устанавливает класс для определения обратного цвета
             */
            inversed: {
                type: Boolean,
                default: false,
            },

            /**
             * Очевидно, что это свойство отключает взаимодействие с чекбоксом
             */
            disabled: {
                type: Boolean,
                default: false,
            },

            reverse: {
                type: Boolean,
                default: false,
            },

            changeActiveLabel: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                lazyValue: false,
                isFocused: false,
            };
        },

        computed: {
            classes() {
                return [
                    `v-switch--${this.color}`,
                    `v-switch--${this.size}`,
                    {
                        'is-inversed': this.inversed,
                        'is-disabled': this.disabled,
                        'is-active': this.lazyValue,
                        'is-focused': this.isFocused,
                        'is-reverse': this.reverse,
                    },
                ];
            },

            singleLabel() {
                return !this.$slots.trueLabel || !this.$slots.falseLabel;
            },
        },

        watch: {
            value(val) {
                const newVal = val;
                if (Array.isArray(newVal)) {
                    if (val.includes(this.trueValue)) {
                        if (this.lazyValue !== true) {
                            this.lazyValue = true;
                            this.$emit('change', val);
                        }
                    } else if (this.lazyValue !== false) {
                        this.lazyValue = false;
                        this.$emit('change', val);
                    }
                } else if (newVal === this.trueValue && this.lazyValue !== true) {
                    this.lazyValue = true;
                    this.$emit('change', newVal);
                } else if (this.lazyValue !== false) {
                    this.lazyValue = false;
                    this.$emit('change', newVal);
                }
            },

            changeActiveLabel(val) {
                this.lazyValue = val;
            },
        },

        created() {
            Array.isArray(this.value)
                ? this.lazyValue = this.value.includes(this.trueValue)
                : this.lazyValue = Boolean(this.value);
        },

        methods: {
            onFocus() {
                this.isFocused = true;
            },

            onBlur() {
                this.isFocused = false;
            },

            onLabelClick(val) {
                if (this.disabled || (this.lazyValue === val && !this.singleLabel)) {
                    return;
                }

                if (this.singleLabel) {
                    return this.onChange();
                }

                if (this.value !== undefined) {
                    if (Array.isArray(this.value)) {
                        const newValue = [...this.value];
                        val
                            ? newValue.push(this.trueValue)
                            : newValue.splice(newValue.indexOf(this.trueValue), 1);
                        this.$emit('input', newValue);
                    } else {
                        this.$emit('input', val ? this.trueValue : this.falseValue);
                    }
                } else {
                    this.lazyValue = val;
                    this.$emit('change', this.lazyValue);
                }
            },

            onChange() {
                if (this.disabled) {
                    return;
                }

                if (this.value !== undefined) {
                    if (Array.isArray(this.value)) {
                        const newValue = [...this.value];
                        this.lazyValue
                            ? newValue.splice(newValue.indexOf(this.trueValue), 1)
                            : newValue.push(this.trueValue);
                        this.$emit('input', newValue);
                    } else {
                        this.$emit('input', this.lazyValue ? this.falseValue : this.trueValue);
                    }
                } else {
                    this.lazyValue = !this.lazyValue;
                    this.$emit('change', this.lazyValue);
                }
            },
        },
    };
</script>

<style lang="scss">
    .v-switch {
        $large-dot-size: 2.4rem;
        $medium-dot-size: .6rem;
        $small-dot-size: 1.6rem;

        display: inline-flex;
        align-items: center;
        -webkit-user-select: none;
        user-select: none;
        outline: none;
        transition: $default-transition;
        cursor: pointer;

        /* Colors */

        &--primary {
            &:not(.is-inversed) {
                .v-switch__field {
                    background-color: $base-600;
                }

                .v-switch__dot {
                    background-color: $base-0;
                }

                .v-switch__label {
                    &._blur {
                        color: $base-800;
                    }
                }

                &.is-active {
                    .v-switch__field {
                        background-color: $blue;
                    }
                }

                &.is-disabled {
                    opacity: .44;
                }
            }

            &.is-inversed {
                .v-switch__field {
                    background-color: $base-0;

                    @include hover {
                        .v-switch__dot {
                            background-color: $blue;
                        }
                    }
                }

                .v-switch__dot {
                    background-color: $blue;
                }

                .v-switch__label {
                    color: $base-0;

                    &._blur {
                        color: $base-800;
                    }
                }

                &.is-disabled {
                    opacity: .44;
                }
            }
        }

        /* End colors */

        /* Sizes */

        &--large {
            //
        }

        &--medium {
            font-size: 1.2rem;
            line-height: 1.6rem;

            .v-switch__field {
                width: 2.2rem;
                height: 1.4rem;
                margin: 0 .7rem;
            }

            .v-switch__dot {
                width: $medium-dot-size;
                height: $medium-dot-size;
            }

            &.is-active {
                .v-switch__dot {
                    left: calc(100% - #{$medium-dot-size} - 4px);
                }
            }
        }

        &--small {
            //
        }

        /* End Sizes */

        /* Modificators */

        &.is-reverse {
            flex-direction: row-reverse;
        }

        &.is-single {
            .v-switch__field {
                margin-left: 0;
            }
        }

        &.is-disabled {
            pointer-events: none;
        }

        /* End Modificators */

        &__label {
            transition: $default-transition;
        }

        &__field {
            position: relative;
            display: block;
            border-radius: 100rem;
            outline: none;
            transition: background-color .3s ease-in-out;
            cursor: pointer;
        }

        &__dot {
            position: absolute;
            top: 51%;
            left: 4px;
            border-radius: 50%;
            transform: translate3d(0, -50%, 0);
            transition: left .3s ease, background-color $default-color-transition;
            will-change: left;
        }
    }
</style>
