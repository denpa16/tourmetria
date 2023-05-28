<template>
    <div v-clickoutside="handleClickOutside"
         :class="['v-dropdown', classes]">
        <div v-if="$slots.default"
             class="v-dropdown__label"
             @click="handleClick">
            <div class="v-dropdown__text">
                <slot></slot>
            </div>

            <span v-if="arrow"
                  class="v-dropdown__arrow-box">
                <svg class="v-dropdown__arrow"
                     viewBox="0 0 8 8"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M3.93661 4.02016L2.52911 2.61266C2.24275 2.3263 1.77847 2.3263 1.49211 2.61266C1.20575 2.89902 1.20575 3.3633 1.49211 3.64966L3.58306 5.7406C3.77832 5.93587 4.0949 5.93587 4.29017 5.7406L6.38111 3.64966C6.66747 3.3633 6.66747 2.89902 6.38111 2.61266C6.09475 2.3263 5.63047 2.3263 5.34411 2.61266L3.93661 4.02016Z" />
                </svg>
            </span>
        </div>

        <transition name="select-menu">
            <div v-if="isOpened"
                 class="v-dropdown__menu">
                <slot name="dropdown"></slot>
            </div>
        </transition>
    </div>
</template>

<script>
    import clickoutside from 'assets/js/directives/clickoutside';

    export default {
        name: 'VDropdown',

        directives: {
            clickoutside,
        },

        props: {
            color: {
                type: String,
                default: 'default',
            },

            isForcedOpen: {
                type: Boolean,
                default: false,
            },

            optionsLength: {
                type: Number,
                default: 0,
            },

            arrow: {
                type: Boolean,
                default: true,
            }
        },

        data() {
            return {
                isOpened: false,
            };
        },

        computed: {
            classes() {
                return [
                    `v-dropdown--${this.color}`,
                    {
                        'is-opened': this.isOpened || this.isForcedOpen,
                    },
                ];
            },
        },

        mounted() {
            this.$on('item-click', this.choiceValue);
        },

        methods: {
            handleClick() {
                if (this.isForcedOpen) {
                    return;
                }

                if (this.isOpened) {
                    this.isOpened = false;
                    this.$emit('close');
                } else {
                    this.isOpened = true;
                    this.$emit('open');
                }
            },

            // onMouseEnter() {
            //     if (this.isMortgageDropdown && !this.$deviceIs.mobile) {
            //         this.isOpened = true;
            //         this.$emit('open');
            //     }
            // },

            // onMouseLeave() {
            //     if (this.isMortgageDropdown && !this.$deviceIs.mobile) {
            //         this.isOpened = false;
            //         this.$emit('close');
            //     }
            // },

            choiceValue() {
                this.isOpened = false;
                this.$emit('close');
            },

            handleClickOutside() {
                if (this.isForcedOpen) {
                    return;
                }

                if (!this.isOpened) {
                    return;
                }
                this.isOpened = false;
                this.$emit('close');
            },
        },
    };
</script>

<style lang="scss">
    .v-dropdown {
        position: relative;
        display: block;
        user-select: none;

        &--default {
            color: $base-800;

            &.is-disabled {
                pointer-events: none;

                .v-dropdown__arrow-box {
                    visibility: hidden;
                    opacity: 0;
                    transition: opacity $default-transition;
                }
            }

            @include hover {
                &:not(.is-opened) {
                    .v-dropdown__arrow-box {
                        color: $base-0;

                        &:before {
                            border-color: $blue;
                        }

                        &:after {
                            background-color: $blue;
                            opacity: 1;
                        }
                    }
                }
            }

            .v-dropdown__arrow-box {
                transition: opacity $default-transition;

                &:before {
                    content: "";
                    border-color: $base-200;
                }

                &:after {
                    content: "";
                    background-color: $base-0;
                }
            }
        }

        &.is-opened {
            .v-dropdown__arrow-box {
                transform: rotate(180deg);
            }
        }

        &.is-mortgage {
            .v-dropdown__menu {
                transform: translateX(0);
            }
        }

        &__label {
            display: inline-flex;
            align-items: center;
            color: currentColor;
            cursor: pointer;

            @include hover() {
                color: $blue;
            }
        }

        &__text {
            transition: color $default-color-transition;
        }

        &__arrow-box {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 2rem;
            height: 2rem;
            margin-left: .8rem;
            border-radius: 50%;
            background-color: transparent;
            transform: rotate(0);
            transition: transform .2s;
            pointer-events: none;

            &:before,
            &:after {
                content: "";
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                border-radius: 50%;
                transform: translateY(0);
                backface-visibility: hidden;
            }

            &:before {
                border: 1px solid;
                transition: border-color $default-color-transition;
            }

            &:after {
                opacity: 0;
                transition: opacity .4s, background-color .4s;
            }
        }

        &__arrow {
            z-index: 1;
            width: .8rem;
            height: .8rem;
            line-height: 0;
            fill: currentColor;
            transform: translateZ(0);
            transition: color $default-color-transition;
        }

        &__menu {
            position: absolute;
            top: calc(100% + 30px);
            left: calc(100% - 1rem);
            z-index: 17;
            transform: translateX(-50%);

            &.select-menu-enter-active {
                transition: opacity .3s ease-in-out, transform .3s ease-in-out;
            }

            &.select-menu-leave-active {
                transition: opacity .15s ease-in-out, transform .15s ease-in-out;
            }

            &.select-menu-enter,
            &.select-menu-leave-active {
                opacity: 0;
                transform: translateX(-50%) translateY(16px);
            }
        }
    }
</style>
