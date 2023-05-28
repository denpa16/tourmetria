<template>
    <label
        :class="[$style.VSwitch, classList]"
        role="switch"
        :aria-checked="active"
        :aria-disabled="disabled"
        :tabindex="disabled ? false : 0"
    >

        <input
            v-model="modelValue"
            :class="$style.input"
            :name="name"
            :disabled="disabled"
            :true-value="trueValue"
            :false-value="falseValue"
            aria-hidden="true"
            type="checkbox"
            tabindex="-1"
        >

        <span
            v-if="$slots.falseLabel"
            :class="[$style.label, $style._left]"
        >
            <!-- @slot Не всегда соответствует передаваемой данной в форме -->
            <slot name="falseLabel"></slot>
        </span>

        <div :class="$style.core"></div>

        <span
            v-if="$slots.trueLabel"
            :class="[$style.label, $style._right]"
        >
            <!-- @slot Не всегда соответствует передаваемой данной в форме -->
            <slot name="trueLabel"></slot>
        </span>
    </label>
</template>

<script>

/**
 * Позволяет пользователю выбрать одно из двух значений, для передачи в форму.
 *
 * @version 1.0.1
 * @displayName VSwitch
 */
export default {
    name: 'VSwitch',

    props: {
        /**
         * Текущее значение чекбокса
         */
        value: {
            type: [String, Array, Boolean],
            required: true,
        },

        /**
         * Имя, которое используется при отправке формы
         */
        name: {
            type: String,
            default: '',
        },

        /**
         * Определяет классы, которые будут модифицировать размер
         */
        size: {
            type: String,
            default: 'small',
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
         * Значение, которое используется при отправке формы, а также передается в value
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
         * Это свойство отключает взаимодействие
         */
        disabled: Boolean,
    },

    computed: {
        classList() {
            return {
                [this.$style[`_${this.color}`]]: this.color,
                [this.$style[`_${this.size}`]]: this.size,
                [this.$style._disabled]: this.disabled,
                [this.$style._active]: this.active,
                [this.$style._notChecked]: !this.active,
            };
        },

        modelValue: {
            get() {
                return this.value;
            },

            set(value) {
                this.$nextTick(() => {
                    /**
                     * Возвращает новое значение в родительский компонент.
                     @param {String|Boolean} value Новое значение
                     */
                    this.$emit('input', value);


                    const emitData = this.name ? { [this.name]: value } : this.$emit('change', value);

                    /**
                     * Используется для форм, возвращает объект с именем и значением
                     @param {String|Boolean|Object} value Новое значение и ключ объекта, если задан пропс
                     */
                    this.$emit('change', emitData);
                });
            },
        },

        active() {
            if (Array.isArray(this.value)) {
                return this.value.indexOf(this.trueValue) > -1;
            } else {
                return this.value === this.trueValue;
            }
        },
    },
};
</script>

<style lang="scss" module>
    $active: $violet;
    $white-color: $white;
    $grey-l-color: $grey-light;
    $grey-color: $grey;

    .VSwitch {
        display: inline-flex;
        align-items: center;
        outline: none;
        transition: opacity $default-transition;
        cursor: pointer;
        user-select: none;

        /* Colors */
        &._base {
            .core {
                background-color: $grey-l-color;
            }

            .label {
                color: $grey-color;

                &._left {
                    color: $active;
                }
            }

            &._active {
                .core {
                    background-color: $active;
                }

                .label {
                    &._left {
                        color: $grey-color;
                    }

                    &._right {
                        color: $active;
                    }
                }
            }

            &:hover:not(._disabled) {
                opacity: .7;
            }
        }

        &._dark {
            .label {
                color: $white-color;
            }

            &._active {
                .core {
                    background-color: $active;
                }
            }

            .core {
                background-color: rgba($white-color, .2);
            }
        }

        /* Sizes */
        &._small {
            .label {
                font-size: 1.4rem;

                &._left {
                    margin-right: 1.4rem;
                }

                &._right {
                    margin-left: 1.4rem;
                }
            }

            .core {
                width: 2.8rem;
                height: 1.6rem;

                &:after {
                    width: 1.4rem;
                    height: 1.4rem;
                }
            }

            &._active {
                .core {
                    &:after {
                        left: calc(100% - 1.6rem);
                    }
                }
            }
        }

        &._medium {
            .label {
                font-size: 1.6rem;

                &._left {
                    margin-right: 1.6rem;
                }

                &._right {
                    margin-left: 1.6rem;
                }
            }

            .core {
                width: 3.2rem;
                height: 1.8rem;

                &:after {
                    width: 1.6rem;
                    height: 1.6rem;
                }
            }

            &._active {
                .core {
                    &:after {
                        left: calc(100% - 1.8rem);
                    }
                }
            }
        }

        /* Modificators */
        &._disabled {
            opacity: .5;
            cursor: not-allowed;
        }
    }

    .input {
        display: none;
    }

    .label {
        font-weight: 500;
        line-height: 1.2;
        transition: color $default-transition;
    }

    .core {
        position: relative;
        flex-shrink: 0;
        border-radius: 10rem;
        transition: background-color $default-transition;

        &:after {
            content: "";
            position: absolute;
            top: 50%;
            left: .2rem;
            border-radius: 50%;
            background-color: $white-color;
            transform: translateY(-50%);
            transition: left $default-transition;
            box-shadow: 0 .1rem .4rem rgb(0 0 0 / 25%);
            will-change: left;
        }
    }
</style>
