<template>
    <component
        :is="isComponent"
        :class="[$style.VTab, classList]"
        @click="$emit('click')"
    >
        <slot></slot>
    </component>
</template>

<script>
export default {
    name: 'VTab',

    props: {
        active: Boolean,
        disabled: Boolean,

        tag: {
            type: String,
            default: 'li',
        },
    },

    computed: {
        classList() {
            return {
                [this.$style._active]: this.active,
                [this.$style._disabled]: this.disabled,
                [this.$style._close]: this.$parent.close,
                [this.$style[`_${this.$parent.size}`]]: this.$parent.size,
                [this.$style[`_${this.$parent.color}`]]: this.$parent.color,
                [this.$style._colorOnly]: this.$parent.slider,
            };
        },

        isComponent() {
            return this.tag;
        },
    },
};
</script>

<style lang="scss" module>
    $primary: $violet;
    $secondary: $violet;
    $grey-l-color: $grey-light;
    $grey-b-color: $grey;
    $grey-m-color: $base-300;

    .VTab {
        position: relative;
        white-space: nowrap;
        line-height: 1.2;
        color: rgba(#fff, .7);
        transition: color $default-transition;
        cursor: pointer;
        user-select: none;

        @include respond-to(mobile) {
            font-size: 1.4rem;
        }

        &:hover {
            color: #fff;
        }

        &._small {
            margin-right: 3.2rem;
            font-size: 1.4rem;
        }

        &._large {
            margin-right: 6.4rem;
            font-size: 2rem;

            @include respond-to(tablet) {
                margin-right: 3.2rem;
                font-size: 1.6rem;
            }

            @include respond-to(mobile) {
                margin-right: 2.4rem;
                font-size: 1.4rem;
            }
        }

        &._active {
            color: #fff;

            &:after {
                transform: scaleX(1);
            }
        }

        &._disabled {
            opacity: .5;
            pointer-events: none;

            &:after {
                transform: scaleX(0);
            }
        }

        &._close {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 4rem;
            margin-right: .8rem;
            padding: 0 2rem;
            border-radius: 2.4rem;
            border: 1px solid $grey-m-color;
            transition: color $default-transition, border-color $default-transition, background-color $default-transition;

            &._grey {
                &:hover {
                    border-color: $secondary;
                    color: $primary;
                }

                &._active {
                    border-color: $primary;
                    background-color: $primary;
                    color: #fff;

                    &._disabled {
                        border-color: $grey-light;
                        background-color: transparent;
                        color: $grey-b-color;
                    }
                }

                &._disabled {
                    border-color: $grey-light;
                    background-color: transparent;
                    color: $grey-b-color;
                }
            }

            &:after {
                display: none;
            }
        }

        &._grey {
            color: $grey-b-color;

            &:after {
                background-color: $primary;
            }

            &:hover {
                color: $secondary;
            }

            &._active {
                color: $primary;

                &._disabled {
                    color: $grey-b-color;
                }
            }

            &._disabled {
                color: $grey-b-color;
            }
        }

        &:after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: .2rem;
            background-color: #fff;
            transform: scaleX(0);
            transform-origin: left center;
            transition: transform $default-transition;
            pointer-events: none;
        }

        &._colorOnly {
            &._close {
                margin-right: 0;
                border: none;
            }

            &._active,
            &._close._active {
                border: none;
                background: none;
                background-color: transparent;
                color: $primary;

                &:after {
                    display: none;
                }
            }
        }
    }
</style>
