<template>
    <component :is="component"
               :class="classes"
               v-bind="attrs"
               class="v-tag">
        <span v-if="$slots.leftAddon"
              class="v-tag__addon is-left">
            <slot name="leftAddon"></slot>
        </span>

        <span v-html="label"></span>
        <slot v-if="$slots.default"></slot>

        <span v-if="$slots.rightAddon"
              class="v-tag__addon is-right">
            <slot name="rightAddon"></slot>
        </span>
    </component>
</template>

<script>
    export default {
        name: 'VTag',

        props: {
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
                validator(value) {
                    return ['primary', 'white', 'light', 'transparent'].indexOf(value) !== -1;
                },
            },

            label: {
                type: String,
                default: '',
            },

            link: {
                type: [Object, String],
                default: '',
            },

            blank: {
                type: Boolean,
                default: false,
            }
        },

        computed: {
            classes() {
                return {
                    [`v-tag--${this.color}`]: this.color,
                    [`v-tag--${this.size}`]: this.size,
                    'v-tag--link': this.link,
                };
            },

            component() {
                if (this.link) {
                    return 'nuxt-link';
                }

                return 'div';
            },

            attrs() {
                const attrs = {};

                if (this.link) {
                    attrs.to = this.link;

                    if (this.blank) {
                        attrs.target = '_blank';
                    }
                }

                return attrs;
            }
        },
    };
</script>

<style lang="scss">
    .v-tag {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        transition: background-color $default-color-transition, color $default-color-transition;
        user-select: none;

        &--link {
            transition: all $default-color-transition;
            cursor: pointer;
        }

        &__text {
            font-family: $base-font;
            font-size: 1.1rem;
            line-height: 1.6rem;
        }

        /* Colors */

        &--primary {
            background-color: $blue;
            color: $base-0;

            &.v-tag--link {
                @include hover {
                    background-color: rgba($blue, .8);
                }
            }
        }

        &--white {
            background-color: $base-0;
            color: $base-800;

            &.v-tag--link {
                @include hover {
                    background-color: $blue;
                    color: $base-0;
                }
            }
        }

        &--light {
            background-color: $base-50;
            color: $base-800;

            &.v-tag--link {
                @include hover {
                    background-color: $blue;
                    color: $base-0;
                }
            }
        }

        &--transparent {
            background: linear-gradient(0deg, rgba(255, 255, 255, .24), rgba(255, 255, 255, .24)), rgba(255, 255, 255, .16);
            color: $base-0;

            &.v-tag--link {
                @include hover {
                    border-color: $white-48;
                }
            }
        }

        /* End colors */

        /* Sizes */

        &--large {
            //
        }

        &--medium {
            padding: .4rem .8rem;
            border-radius: .4rem;
            font-size: 1.1rem;
            font-weight: 500;
            line-height: 1.6rem;
        }

        &--small {
            //
        }

        /* End sizes */

        &__addon {
            display: flex;
            flex-shrink: 0;

            &.is-left {
                margin-right: .4rem;
            }

            &.is-right {
                margin-left: .4rem;
            }
        }
    }
</style>
