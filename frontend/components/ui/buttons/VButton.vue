<template>
    <component
        :is="tag || component"
        v-bind="linkProperties"
        class="v-button"
        :class="[classes, modClass]"
        :disabled="disabled"
        :type="!link && !href ? type : null"
        :value="!link && !href ? value : null"
        @click="onClick"
    >
        <span
            v-if="$slots.default"
            class="v-button__text"
        >
            <slot></slot>
        </span>

        <span
            v-if="$slots.icon"
            class="v-button__icon"
        >
            <span :class="['v-button__icon-wrap']">
                <slot name="icon"></slot>
            </span>
        </span>
    </component>
</template>

<script>
    export default {
        name: 'VButton',
        props: {
            /**
             * Определяет классы, которые будут модифицировать размер
             */
            size: {
                type: String,
                default: 'large',
                validator(value) {
                    return ['large', 'large-resp', 'large-with-icon', 'medium', 'small', 'link', 'custom'].indexOf(value) !== -1;
                },
            },

            /**
             * Определяет классы, которые будут модифицировать цвет
             */
            color: {
                type: String,
                default: 'primary',
                validator(value) {
                    return ['primary', 'light', 'dark', 'transparent', 'white', 'text', 'white-additional', 'link', 'link-black', 'custom'].indexOf(value) !== -1;
                },
            },

            icon: {
                type: String,
                default: '',
            },

            /**
             * Это свойство задизейблет кнопку
             */
            disabled: {
                type: Boolean,
                default: false,
            },

            /**
             * Добавить тень
             */
            shadow: {
                type: Boolean,
                default: false,
            },

            /**
             * Растягивает кнопку на всю ширину внешнего контейнера
             */
            responsive: {
                type: Boolean,
                default: false,
            },

            /**
             * Растягивает текст по всей ширине кнопки
             */
            fullWidthText: {
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

            value: {
                type: String,
                default: null,
            },

            tag: {
                type: String,
                default: '',
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

            loading: {
                type: Boolean,
                default: false,
            },

            spinner: {
                type: Boolean,
                default: false,
            },

            customClass: {
                type: String,
                default: '',
            },

            modClass: {
                type: String,
                default: '',
            },

            /**
             * Активное состояние кнопки
             */
            active: {
                type: Boolean,
                default: false,
            },

            /**
             * Сначала иконка
             */
            iconFirst: {
                type: Boolean,
                default: false,
            },
        },

        computed: {
            component() {
                if (this.href) {
                    return 'a';
                } else if (this.link) {
                    return 'nuxt-link';
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
                    `v-button--${this.color}`,
                    `v-button--${this.size}`,
                    `v-button--${this.customClass}`,
                    {
                        'is-disabled': this.disabled,
                        'is-responsive': this.responsive,
                        'is-full-width-text': this.fullWidthText,
                        'is-loading': this.loading,
                        'is-spinner': this.spinner,
                        'is-icon-first': this.iconFirst,
                        'is-shadow': this.shadow,
                        'is-active': this.active,
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
        },
    };
</script>

<style lang="scss">
    .v-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid transparent;
        outline: none;
        white-space: nowrap;
        line-height: 1;
        transition: all .4s;
        cursor: pointer;
        -webkit-user-select: none;
        user-select: none;

        &__text {
            z-index: 2;
            display: inline-flex;
            align-items: center;
            font-family: $base-font;
            font-size: inherit;
            font-weight: 600;
            line-height: inherit;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
        }

        &__icon-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1.6rem;
            height: 1.6rem;
            margin-left: 1.4rem;
            // transition: all $default-color-transition;
        }

        /* Colors */
        &--primary {
            border-color: $blue;
            background-color: $blue;
            color: $base-0;
            transition: all $default-color-transition;

            &:not(.is-disabled) {
                @include hover {
                    border-color: rgba($blue, .6);
                    background-color: rgba($blue, .8);
                }

                &.is-active {
                    border-color: rgba($blue, .6);
                    background-color: rgba($blue, .8);
                }

                &:active {
                    border-color: $blue;
                    background-color: $blue;
                    color: $base-0;

                    &:after {
                        opacity: 0;
                    }
                }
            }

            &.is-disabled {
                opacity: .44;
                pointer-events: none;
            }
        }

        &--light {
            border-color: $base-50;
            background-color: $base-50;
            color: $base-800;

            &:not(.is-disabled) {
                @include hover {
                    border-color: $blue;
                    background-color: $blue;
                    color: $base-0;
                }

                &.is-active {
                    border-color: $blue;
                    background-color: $blue;
                    color: $base-0;
                }

                &:active {
                    border-color: $base-50;
                    background-color: $base-50;
                    color: $base-500;
                }
            }

            &.is-disabled {
                opacity: .44;
                pointer-events: none;
            }
        }

        &--dark {
            border-color: $base-800;
            background-color: $base-800;
            color: $base-0;

            &:not(.is-disabled) {
                @include hover {
                    border-color: $blue;
                    background-color: $blue;
                    color: $base-0;
                }

                &.is-active {
                    border-color: $blue;
                    background-color: $blue;
                    color: $base-0;
                }

                &:active {
                    border-color: $base-800;
                    background-color: $base-800;
                    color: $base-0;
                }
            }

            &.is-disabled {
                opacity: .44;
                pointer-events: none;
            }
        }

        &--transparent {
            border-color: $white-16;
            background-color: $white-16;
            color: $base-0;

            &:not(.is-disabled) {
                @include hover {
                    border-color: $white-48;
                }

                &.is-active {
                    border-color: $white-48;
                }

                &:active {
                    border-color: $white-16;
                }
            }

            &.is-disabled {
                color: $white-24;
                pointer-events: none;
            }
        }

        &--link {
            background-color: transparent;
            font-size: 1.2rem;
            line-height: 1;
            color: $blue;

            &:not(.is-disabled) {
                @include hover {
                    color: $black;
                }

                &.is-active {
                    border-color: $black;
                }

                &:active {
                    color: $black;
                }
            }

            &.is-disabled {
                opacity: .44;
            }
        }

        &--link-black {
            background-color: transparent;
            font-size: 1.2rem;
            line-height: 1;
            color: $black;

            &:not(.is-disabled) {
                @include hover {
                    color: $blue;
                }

                &.is-active {
                    color: $blue;
                }

                &:active {
                    color: $blue;
                }
            }

            &.is-disabled {
                opacity: .44;
            }
        }

        &--white {
            border-color: $blue;
            background-color: $base-0;
            color: $blue;

            &:not(.is-disabled) {
                @include hover {
                    border-color: $blue;
                    background-color: $blue;
                    color: $base-0;
                }

                &.is-active {
                    border-color: $blue;
                    background-color: $blue;
                    color: $base-0;
                }

                &:active {
                    border-color: $blue;
                    background-color: $base-0;
                    color: $blue;
                }
            }

            &.is-disabled {
                opacity: .44;
                pointer-events: none;
            }
        }

        &--white-additional {
            border-color: $base-0;
            background-color: $base-0;
            color: $base-800;

            &:not(.is-disabled) {
                @include hover {
                    border-color: $blue;
                    background-color: $blue;
                    color: $base-0;
                }

                &:hover .v-button__icon-wrap {
                    color: $base-0;
                }

                &.is-active {
                    border-color: $blue;
                    background-color: $blue;
                    color: $base-0;

                    .v-button__icon-wrap {
                        color: $base-0;
                    }
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
        }

        &--text {
            border: unset;
            background-color: unset;
            color: $base-800;

            &:not(.is-disabled) {
                @include hover {
                    border-color: $blue;
                    background-color: $blue;
                    color: $base-0;
                }
            }

            &.is-disabled {
                opacity: .44;
                pointer-events: none;
            }
        }

        /* End Colors */

        /* Sizes */
        &--large {
            height: 4.4rem;
            padding: 0 2.4rem;
            border-radius: .4rem;
            font-size: 1.2rem;
            line-height: 1.6rem;
        }

        &--large-resp {
            height: 4.4rem;
            padding: 0 2.4rem;
            border-radius: .4rem;
            font-size: 1.2rem;
            line-height: 1.6rem;

            @include respond-to(xs) {
                height: 40px;
            }
        }

        &--large-with-icon {
            height: 4.4rem;
            padding: 0 1.6rem;
            border-radius: .4rem;
            font-size: 1.2rem;
            line-height: 1.6rem;
        }

        &--medium {
            height: 3.2rem;
            padding: 0 2rem;
            border-radius: .4rem;
            font-size: 1.2rem;
            line-height: 1.6rem;
        }

        &--small {
            height: 3.2rem;
            padding: 0 1.6rem;
            border-radius: .4rem;
            font-size: 1rem;
            line-height: 1.2rem;
        }

        &__custom {
            //
        }

        /* End Sizes */

        &.is-spinner {
            position: relative;

            &:after {
                content: "";
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                width: 2rem;
                height: 2rem;
                margin: auto;
                border-radius: 50%;
                border: .3rem solid rgba(#fff, .5);
                border-top-color: white;
                opacity: 0;
                transition: opacity .3s ease;
                animation: spinner 1s linear 0s infinite;
            }
        }

        &.is-loading {
            pointer-events: none;

            &:after {
                opacity: 1;
            }

            .v-button__text {
                opacity: 0;
            }
        }

        &.is-responsive {
            width: 100%;
        }

        &.is-full-width-text {
            .v-button__text {
                width: 100%;
            }
        }

        &.is-icon-first {
            flex-direction: row-reverse;

            .v-button__icon-wrap {
                margin: 0 .8rem 0 0;
            }
        }

        &.is-shadow {
            box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
        }

        @keyframes spinner {
            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }
        }
    }
</style>
