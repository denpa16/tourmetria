<template>
    <div :class="[$style.SliderNavigation, classes, 'p6']">
        <button ref="prev"
                :class="[$style.btn, {[$style._disabled]: prevDisabled}]"
                @click="$emit('prev-click')">
            <slot name="left">
                <IconArrowLeft :class="$style.icon" />
            </slot>
        </button>

        <slot>
            <span
                :class="$style.verticalLine"
            ></span>
        </slot>

        <button ref="next"
                :class="[$style.btn, {[$style._disabled]: nextDisabled}]"
                @click="$emit('next-click')">
            <slot name="right">
                <IconArrowLeft :class="[$style.icon, $style._right]" />
            </slot>
        </button>
    </div>
</template>

<script>
    import IconArrowLeft from '~/components/icons/IconArrowLeft';

    export default {
        name: 'SliderNavigation',

        components: {IconArrowLeft},

        props: {
            color: {
                type: String,
                default: 'light',
                validator(value) {
                    return ['light', 'blur', 'gray', 'transparent', 'custom'].indexOf(value) !== -1;
                },
            },

            prevDisabled: {
                type: Boolean,
                default: false,
            },

            nextDisabled: {
                type: Boolean,
                default: false,
            }
        },

        computed: {
            classes() {
                return {
                    [this.$style[`_${this.color}`]]: this.color,
                };
            },
        }
    };
</script>

<style lang="scss" module>
    .SliderNavigation {
        display: flex;
        align-items: center;
        border-radius: .4rem;
        color: $base-300;

        &._light {
            background-color: $base-50;

            .btn {
                color: $base-300;

                @include hover {
                    color: $blue;
                }

                &._disabled {
                    color: rgba($base-300, .15);
                    pointer-events: none;
                }
            }
        }

        &._blur {
            background-color: $white-16;

            .btn {
                color: $base-0;

                @include hover {
                    color: $white-48;
                }

                &._disabled {
                    color: rgba($base-0, .15);
                    pointer-events: none;
                }
            }
        }

        &._gray {
            background-color: $base-50;
            // filter: drop-shadow(0 0 4px rgba(0, 0, 0, .04)) drop-shadow(0 4px 8px rgba(0, 0, 0, .06));
            box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);

            .btn {
                color: $base-800;

                @include hover {
                    color: $base-300;
                }

                &._disabled {
                    color: rgba($base-800, .15);
                    pointer-events: none;
                }
            }
        }

        &._transparent {
            background-color: $white-16;

            .btn {
                color: $base-300;

                @include hover {
                    color: $base-0;
                }

                &._disabled {
                    color: rgba($base-0, .15);
                    pointer-events: none;
                }
            }
        }
    }

    .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4.4rem;
        height: 4.4rem;
        transition: $default-color-transition;
        cursor: pointer;

        &:global(.swiper-button-lock) {
            display: flex;
        }
    }

    .icon {
        width: 1.6rem;
        height: 1.6rem;

        &._right {
            transform: rotate(180deg);
        }
    }

    .verticalLine {
        height: 1.6rem;
        margin: 0 auto;
        border-left: .1rem solid rgba(0, 0, 0, .24);
        transform: translateX(50%);
    }
</style>
