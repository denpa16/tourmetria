<template>
    <div :class="[
             $style.HintOverlay,
             classes,
             {
                 [$style._visible]: isOverlayVisible,
             }]"
         @click.stop="isOverlayVisible = false"
         @touchstart.stop="isOverlayVisible = false"
    >
        <div :class="$style.content">
            <div :class="$style.svg">
                <slot name="icon">
                    <IconOneFinger />
                </slot>
            </div>

            <span :class="$style.text"
                  v-html="text"></span>
        </div>
    </div>
</template>

<script>
    import IconOneFinger from '~/components/icons/IconOneFinger';

    export default {
        name: 'HintOverlay',

        components: {
            IconOneFinger,
        },

        props: {
            text: {
                type: String,
                default: 'Двигайте карту пальцем',
            },

            animation: {
                type: String,
                default: '',
            },
        },

        data() {
            return {
                isOverlayVisible: true,
            };
        },

        computed: {
            classes() {
                return {
                    [this.$style[`_${this.animation}`]]: this.animation,
                };
            },
        }
    };
</script>

<style lang="scss" module>
    .HintOverlay {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        width: 100%;
        height: 100%;
        background: rgba($base-800, .64);
        pointer-events: none;
        opacity: 0;
        transition: opacity .3s linear;

        &._visible {
            opacity: 1;
            pointer-events: all;
        }

        &._move {
            .svg {
                animation: transform 2s ease infinite;
            }

            .text {
                margin-top: 4.4rem;

                @include respond-to(xs) {
                    margin-top: 2.4rem;
                }
            }
        }

        &._horizontal {
            .svg {
                animation: horizontalTransform 2s ease infinite;
            }
        }
    }

    .content {
        position: absolute;
        top: 50%;
        left: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        text-align: center;
        color: #fff;
        transform: translate(-50%, -50%);
    }

    .text {
        margin-top: 2.4rem;
        text-align: center;
        font-size: 1.4rem;
        font-weight: 600;
        line-height: 1.8rem;
        letter-spacing: -.02em;
    }

    .svg > * {
        width: 6.4rem;
        height: 6.4rem;

        @include respond-to(xs) {
            width: 3.4rem;
            height: 3.4rem;
        }
    }

    @keyframes transform {
        0% {
            transform: translate(0, -50%);
        }

        25% {
            transform: translate(0, 50%);
        }

        50% {
            transform: translate(60%, 0);
        }

        75% {
            transform: translate(-60%, 0);
        }

        100% {
            transform: translate(0, -50%);
        }
    }

    @keyframes horizontalTransform {
        0% {
            transform: translate(60%, 0);
        }

        50% {
            transform: translate(-60%, 0);
        }

        100% {
            transform: translate(60%, 0);
        }
    }
</style>
