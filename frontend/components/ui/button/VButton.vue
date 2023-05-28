<template>
    <component
        :is="tag"
        v-bind="$attrs"
        :disabled="disabled"
        :class="[$style.VButton, classList]"
        @click="onClick"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <span
            v-if="$slots.default"
            :class="$style.label"
        >
            <!-- @slot Контент внутри кнопки -->
            <slot></slot>
        </span>
    </component>
</template>

<script>
/**
 * Кастомная альтернатива тега button в стандартном html<br>
 * На проектах, обычно, имеет несколько цветов, форм и состояний.<br><br>
 * Область применения: ссылка, изменения состояния, вызов методов.
 *
 * @version 1.0.1
 * @displayName VButton
 */
export default {
    name: 'VButton',

    props: {
        /**
         * Определяет тег компонента
         */
        tag: {
            type: String,
            default: 'button',
            validator: v => [
                'n-link',
                'a',
                'span',
                'div',
                'button',
                'input',
            ].includes(v),
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
            validator: value => ['base', 'fill', 'dark', 'black'].includes(value),
        },

        /**
         * Модификатор вида кнопки с бордером
         */
        border: {
            type: Boolean,
            default: true,
        },

        /**
         * Модификатор вида кнопки с округлением
         */
        round: Boolean,

        /**
         * Активное состояние кнопки
         */
        active: Boolean,

        /**
         * Это свойство отключает взаимодействие
         */
        disabled: Boolean,
    },

    computed: {
        classList() {
            return [{
                [this.$style[`_${this.color}`]]: this.color,
                [this.$style[`_${this.size}`]]: this.size,
                [this.$style._disabled]: this.disabled,
                [this.$style._active]: this.active,
                [this.$style._border]: this.border,
                [this.$style._round]: this.round,
            }];
        },
    },

    methods: {
        /**
         * Эмитит событие клика в родительский компонент
         * @param {Event} event mouse event
         * @public
         */
        onClick($event) {
            /**
             * Cобытие клика в родительский компонент
             * @event click
             * @param {Event} event mouse event
             */
            this.$emit('click', $event);
        },

        /**
         * Эмитит cобытие при наведении на элемент
         * @param {Event} event mouse event
         * @public
         */
        onMouseEnter($event) {
            /**
             * Cобытие при наведении на элемент
             * @event mouseenter
             * @param {Event} event mouse event
             */
            this.$emit('mouseenter', $event);
        },

        /**
         * Эмитит событие, когда наведение на элемент прекращено
         * @param {Event} event mouse event
         * @public
         */
        onMouseLeave($event) {
            /**
             * Cобытие, когда наведение на элемент прекращено
             * @event mouseleave
             * @param {Event} event mouse event
             */
            this.$emit('mouseleave', $event);
        },
    },
};
</script>

<style lang="scss" module>
    $base-black: $base-600;
    $base-white: #fff;

    /* Colors */
    // base
    $base-color: $violet;

    // Black
    $black-active: $base-100;

    .VButton {
        display: inline-flex;
        align-items: center;
        outline: none;
        transition: opacity $default-transition, background-color $default-transition, border $default-transition;
        cursor: pointer;
        user-select: none;

        /* Sizes */
        &._small {
            .label {
                padding: 1rem 1.6rem;
                text-transform: uppercase;
                font-size: 1.2rem;
                line-height: 1;
                letter-spacing: -.005em;
            }
        }

        &._medium {
            .label {
                padding: 1.4rem 3.2rem;
                text-transform: uppercase;
                font-size: 1.2rem;
                line-height: 1;
                letter-spacing: -.005em;

                @include respond-to(mobile) {
                    padding: 1.2rem 3.2rem;
                }
            }
        }

        &._border {
            overflow: hidden;
            border-style: solid;
            border-width: .1rem;
        }

        &._round {
            border-radius: 10rem;
        }

        /* Colors */
        &._base {
            background-color: $base-white;

            .label {
                color: $base-black;
            }

            &._active {
                .label {
                    color: $base-color;
                }

                &._border {
                    border-color: $base-color;
                }
            }

            &:hover._border {
                border-color: $base-color;
            }
        }

        &._fill {
            background-color: $base-white;

            .label {
                color: $base-black;
            }

            &._active {
                background-color: $base-color;

                .label {
                    color: $base-white;
                }

                &._border {
                    border-color: $base-color;
                }
            }

            &:hover._border {
                border-color: $base-color;
            }
        }

        &._dark {
            border-color: $black-active;
            background-color: $base-black;

            .label {
                color: $base-white;
            }

            &._active {
                background-color: $black-active;

                .label {
                    color: $base-white;
                }

                &._border {
                    border-color: $black-active;
                }
            }

            &:hover._border {
                border-color: $black-active;
            }
        }

        &._black {
            background-color: $base-white;

            .label {
                font-weight: 500;
                color: $base-black;
            }

            &._active {
                background-color: $base-black;

                .label {
                    color: $base-white;
                }

                &._border {
                    border-color: $base-black;
                }
            }

            &:hover._border {
                border-color: $base-black;
            }
        }

        /* Modificators */

        &._disabled {
            pointer-events: none;
            opacity: .5;
        }

        &:hover {
            opacity: .7;
        }
    }

    .label {
        width: 100%;
        text-align: center;
        white-space: nowrap;
        transition: color $default-transition;
    }
</style>
