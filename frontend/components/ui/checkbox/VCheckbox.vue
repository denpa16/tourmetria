<template>
    <label
        ref="label"
        :aria-checked="active"
        :aria-disabled="disabled"
        :class="[$style.VCheckbox, classList]"
        role="checkbox"
    >
        <span :class="$style.input">
            <input
                v-model="computedValue"
                :class="$style.inputNative"
                :disabled="disabled"
                :false-value="falseValue"
                :name="name"
                :true-value="trueValue"
                :value="trueValue"
                type="checkbox"
                @blur="onBlur"
                @focus="onFocus"
                @keydown.enter.stop.prevent="$refs.label.click()"
            >
        </span>

        <span
            v-if="$slots.default"
            :class="$style.label"
        >
            <!-- @slot лейбл-->
            <slot></slot>
        </span>
    </label>
</template>

<script>

/**
 * Позволяет пользователю выбрать одно значение, для передачи в форму.
 *
 * @version 1.0.1
 * @displayName VCheckbox
 */
export default {
    name: 'VCheckbox',

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
            type: [Array, String, Boolean],
            required: true,
        },

        /**
         * True значение, которое используется при отправке формы, а также передается в value
         * при активации чекбокса
         */
        trueValue: {
            type: [String, Boolean],
            default: true,
        },

        /**
         * False значение, которое используется при отправке формы, а также передается в value
         * при активации чекбокса
         */
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
            validator: value => ['small', 'medium'].includes(value),
        },


        /**
         * Определяет классы, которые будут модифицировать цвет
         */
        color: {
            type: String,
            default: 'base',
            validator: value => ['base', 'dark'].includes(value),
        },

        /**
         * Модификатор компонента под radiobtn
         */
        radio: Boolean,

        /**
         * Определяет, будет ли красится лейб в активном состоянии
         */
        coloredLabel: Boolean,

        /**
         * Это свойство отключает взаимодействие
         */
        disabled: Boolean,
    },

    data() {
        return {
            isFocused: false,
        };
    },

    computed: {
        classList() {
            return {
                [this.$style[`_${this.color}`]]: this.color,
                [this.$style[`_${this.size}`]]: this.size,
                [this.$style._radio]: this.radio,
                [this.$style._checkbox]: !this.radio,
                [this.$style._colored]: this.coloredLabel,
                [this.$style._active]: this.active,
                [this.$style._disabled]: this.disabled,
                [this.$style._focused]: this.isFocused,
            };
        },

        computedValue: {
            get() {
                return this.value;
            },

            set(value) {
                /**
                 * Возвращает новое значение в родительский компонент.
                 @param {String|Boolean} value Новое значение
                 */
                this.$emit('input', value);
            },
        },

        active() {
            if (Array.isArray(this.value)) {
                return this.value.indexOf(this.trueValue) > -1;
            }

            return this.value === this.trueValue;
        },
    },

    methods: {
        /**
         * Метод, который обрабатывает событие focus на инпуте
         * @public
         */
        onFocus(e) {
            this.isFocused = true;

            /**
             * Передаёт родителю, что компонент находится в focus.
             * В большинстве реализаций - может и не пригодится
             * @event focus
             */
            this.$emit('focus', e);
        },

        /**
         * Метод, который обрабатывает событие blur на инпуте
         * @public
         */
        onBlur(e) {
            this.isFocused = false;

            /**
             * Передаёт родителю, что компонент больше не находится в focus.
             * В большинстве реализаций - может и не пригодится
             * @event blur
             */
            this.$emit('blur', e);
        },
    },
};
</script>

<style lang="scss" module>
    $primary: $violet;
    $secondary: $violet;
    $grey-color: $grey;
    $light-color: $grey-light;
    $white-color: $white;

    .VCheckbox {
        display: inline-flex;
        align-items: center;
        user-select: none;
        outline: none;
        cursor: pointer;

        /* Colors */
        &._base {
            .label {
                color: $grey-color;
            }

            .input {
                border: 1px solid $light-color;
                color: $white-color;
            }

            &:hover {
                .input {
                    @media (min-width: 1280px) {
                        border-color: $secondary;
                    }
                }

                .label {
                    @media (min-width: 1280px) {
                        color: $secondary;
                    }
                }
            }

            &._active {
                &._colored {
                    .label {
                        color: $primary;
                    }
                }

                .input {
                    border-color: $primary;
                }

                &._radio {
                    .input:after {
                        background-color: $primary;
                    }
                }

                &._checkbox {
                    .input {
                        background-color: $primary;
                    }
                }
            }
        }

        &._dark {
            .label {
                color: $white-color;
            }

            .input {
                border: 1px solid $white-color;
            }

            &._active {
                &._colored {
                    .label {
                        color: $primary;
                    }
                }

                .input {
                    border-color: $primary;
                    background-color: $primary;
                }

                &._radio {
                    .input {
                        border-color: $primary;
                        background-color: transparent;
                        color: $primary;
                    }
                }

                &._checkbox {
                    .input {
                        background-color: $primary;
                    }
                }
            }

            &:hover {
                .label {
                    color: $primary;
                    opacity: .5;
                }
            }
        }

        /* Sizes */
        &._small {
            .label {
                margin-left: 1.4rem;
                font-size: 1.4rem;
            }

            .input {
                width: 14px;
                height: 14px;

                &:after {
                    width: 10px;
                    height: 10px;
                }
            }
        }

        &._medium {
            .label {
                margin-left: 1.6rem;
                font-size: 1.6rem;
            }

            .input {
                width: 16px;
                height: 16px;

                &:after {
                    width: 10px;
                    height: 10px;
                }
            }
        }

        /* Modificators */
        &._radio {
            .input {
                border-radius: 50%;

                &:after {
                    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10.13 10.13'%3E%3Cpath d='M5.06,10A4.94,4.94,0,1,1,10,5.06,4.94,4.94,0,0,1,5.06,10Z'/%3E%3C/svg%3E");
                    /* stylelint-disable */
                    /* postcss-ignore-line */
                    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10.13 10.13'%3E%3Cpath d='M5.06,10A4.94,4.94,0,1,1,10,5.06,4.94,4.94,0,0,1,5.06,10Z'/%3E%3C/svg%3E");
                    /* stylelint-enable */
                }
            }
        }

        &._checkbox {
            .input {
                border-radius: 2px;

                &:after {
                    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10.06 10.06'%3E%3Cpath d='M9.74,1.82a1,1,0,0,1,0,1.42l-5,5a1,1,0,0,1-1.42,0l-3-3A1,1,0,0,1,1.74,3.82L4,6.12l4.29-4.3A1,1,0,0,1,9.74,1.82Z'/%3E%3C/svg%3E");
                    /* stylelint-disable */
                    /* postcss-ignore-line */
                    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10.06 10.06'%3E%3Cpath d='M9.74,1.82a1,1,0,0,1,0,1.42l-5,5a1,1,0,0,1-1.42,0l-3-3A1,1,0,0,1,1.74,3.82L4,6.12l4.29-4.3A1,1,0,0,1,9.74,1.82Z'/%3E%3C/svg%3E");
                    /* stylelint-enable */
                }
            }
        }

        &._disabled {
            opacity: .5;
            cursor: not-allowed;

            .input {
                pointer-events: none;
            }
        }

        &._active {
            .input {
                &:after {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
        }
    }

    .input {
        position: relative;
        flex-shrink: 0;
        transition: border-color .2s ease, background-color .2s ease, transform .2s ease;

        &:after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            border-radius: 50%;
            background-color: currentcolor;
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
            transition: opacity $default-transition, transform $default-transition;
            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
            -webkit-mask-position: center;
            mask-position: center;
        }
    }

    .inputNative {
        display: none;
    }

    .label {
        white-space: nowrap;
        font-weight: 500;
        transition: color $default-transition, opacity $default-transition;
    }
</style>
