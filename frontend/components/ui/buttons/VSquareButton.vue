<template>
    <component
        :is="tag || component"
        class="v-square-button"
        :class="classes"
        :disabled="disabled"
        :type="!link && !href ? type : null"
        v-bind="linkProperties"
        @click="onClick"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <span
            v-if="$slots.default"
            class="v-square-button__text"
        >
            <slot></slot>
        </span>
    </component>
</template>

<script>
    export default {
        name: 'VSquareButton',

        props: {
            /**
             * Определяет классы, которые будут модифицировать размер
             */
            size: {
                type: String,
                default: 'medium',
                validator(value) {
                    return ['large', 'medium', 'medium-resp', 'small', 'xsmall', 'custom'].indexOf(value) !== -1;
                },
            },

            /**
             * Определяет классы, которые будут модифицировать цвет
             */
            color: {
                type: String,
                default: 'primary',
                validator(value) {
                    return ['primary', 'white', 'light', 'custom'].indexOf(value) !== -1;
                },
            },

            /**
             * Добавить тень
             */
            shadow: {
                type: Boolean,
                default: false,
            },

            /**
             * Добавляет класс custom
             */
            custom: {
                type: Boolean,
                default: false,
            },

            /**
             * Это свойство задизейблет кнопку
             */
            disabled: {
                type: Boolean,
                default: false,
            },

            /**
             * Меняет тип кнопки
             */
            type: {
                type: String,
                default: 'button',
            },

            /**
             * Устанавливает тег a для кнопки
             */
            href: {
                type: String,
                default: '',
            },

            /**
             * target="_blank" для ссылок
             */
            blank: {
                type: Boolean,
                default: false,
            },

            /**
             * Для внутренних ссылок (тег n-link)
             */
            link: {
                type: [String, Object],
                default: '',
            },

            /**
             * Выключает ховер-состояние
             */
            disableHover: {
                type: Boolean,
                default: false,
            },

            tag: {
                type: String,
                default: '',
            },
        },

        computed: {
            component() {
                if (this.href) {
                    return 'a';
                } else if (this.link) {
                    return 'n-link';
                }
                return 'button';
            },

            linkProperties() {
                const linkProperties = {};
                if (this.link) {
                    linkProperties.to = this.link;
                } else if (this.href) {
                    linkProperties.href = this.href;
                }

                if (this.blank) {
                    linkProperties.target = '_blank';
                }
                return linkProperties;
            },

            classes() {
                return [
                    `v-square-button--${this.color}`,
                    `v-square-button--${this.size}`,
                    {
                        'is-disabled': this.disabled,
                        'is-disable-hover': this.disableHover,
                        'v-square-button__custom': this.custom,
                        'is-shadow': this.shadow,
                    },
                ];
            },
        },

        methods: {
            onClick(e) {
                if (this.disabled || this.loading) {
                    return;
                }
                this.$emit('click', e);
            },

            onMouseEnter(e) {
                if (this.disabled || this.loading) {
                    return;
                }
                this.$emit('mouseenter', e);
            },

            onMouseLeave(e) {
                if (this.disabled || this.loading) {
                    return;
                }
                this.$emit('mouseleave', e);
            },
        },
    };
</script>

<style lang="scss">
    .v-square-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: .4rem;
        border: 1px solid transparent;
        outline: none;
        text-align: center;
        white-space: nowrap;
        line-height: 1;
        transition: all $default-transition;
        cursor: pointer;
        -webkit-user-select: none;
        user-select: none;

        &__text {
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Colors */
        &--primary {
            border-color: $blue;
            background-color: $blue;
            color: $base-0;

            &:not(.is-disabled) {
                @include hover {
                    border-color: rgba($blue, .6);
                    background-color: rgba($blue, .8);
                }

                &:active {
                    border-color: $blue;
                    background-color: $blue;
                    color: $base-0;
                }
            }

            &.is-disabled {
                opacity: .44;
                pointer-events: none;
            }

            &.is-shadow {
                box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
            }
        }

        &--white {
            border-color: $base-0;
            background-color: $base-0;
            color: $base-800;
            box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);

            &:not(.is-disabled) {
                @include hover {
                    border-color: $blue;
                    background: $blue;
                    color: $base-0;
                }

                &:active {
                    border-color: $base-0;
                    background-color: $base-0;
                    color: $base-800;
                }
            }

            &.is-disabled {
                opacity: .44;
                pointer-events: none;
            }

            &.is-shadow {
                box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
            }
        }

        &--light {
            border-color: $base-50;
            background-color: $base-50;
            color: $base-800;

            &:not(.is-disabled) {
                @include hover {
                    border-color: $blue;
                    background: $blue;
                    color: $base-0;
                }

                &:active {
                    border-color: $base-50;
                    background-color: $base-50;
                    color: $base-800;
                }
            }

            &.is-disabled {
                opacity: .44;
                pointer-events: none;
            }

            &.is-shadow {
                box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
            }
        }

        /* Sizes */
        &--large {
            width: 6.4rem;
            height: 6.4rem;
        }

        &--medium {
            width: 4.4rem;
            height: 4.4rem;
        }

        &--medium-resp {
            width: 4.4rem;
            height: 4.4rem;

            @include respond-to(xs) {
                width: 40px;
                height: 40px;
            }
        }

        &--small {
            width: 3.2rem;
            height: 3.2rem;
        }

        &--xsmall {
            width: 2.4rem;
            height: 2.4rem;
        }

        &__custom {
            //
        }
    }
</style>
