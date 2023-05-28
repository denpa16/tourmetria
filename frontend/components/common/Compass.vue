<template>
    <div :class="[$style.Compass, classes]">
        <div :style="rotateStyle.wrapper"
             :class="$style.wrapper">
            <IconCompassBase v-show="!sunActive" />
            <IconCompassBaseWithSun v-show="sunActive" />
            <div :class="[$style.side, $style._north]">
                <div :style="rotateStyle.side">
                    С
                </div>
            </div>
            <div :class="[$style.side, $style._east]">
                <div :style="rotateStyle.side">
                    В
                </div>
            </div>
            <div :class="[$style.side, $style._south, {[$style._sun]: sunActive}]">
                <div :style="rotateStyle.side">
                    Ю
                </div>
            </div>
            <div :class="[$style.side, $style._west]">
                <div :style="rotateStyle.side">
                    З
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import IconCompassBase from '~/components/icons/IconCompassBase';
    import IconCompassBaseWithSun from '~/components/icons/IconCompassBaseWithSun';

    export default {
        name: 'Compass',

        components: {IconCompassBaseWithSun, IconCompassBase},

        props: {
            rotateDeg: {
                type: Number,
                default: 0,
            },

            size: {
                type: String,
                default: 'medium',
            },

            sunActive: {
                type: Boolean,
                default: false,
            },
        },

        computed: {
            classes() {
                return {
                    [this.$style[`_${this.size}`]]: this.size,
                };
            },

            rotateStyle() {
                if (isNaN(this.rotateDeg)) {
                    return {
                        transform: 'rotate(0deg)',
                    };
                }

                return {
                    wrapper: {
                        transform: `rotate(${this.rotateDeg}deg)`,
                    },

                    side: {
                        transform: `rotate(-${this.rotateDeg}deg)`,
                    },
                };
            },
        }
    };
</script>

<style lang="scss" module>
    .Compass {
        &._large {
            .wrapper {
                width: 6rem;
                height: 6rem;
            }

            .side {
                font-size: 1.6rem;

                &._north {
                    top: -.8rem;
                }

                &._east {
                    right: -.8rem;
                }

                &._south {
                    bottom: -.8rem;
                }

                &._west {
                    left: -.8rem;
                }
            }
        }

        &._medium {
            .wrapper {
                width: 4rem;
                height: 4rem;
            }

            .side {
                font-size: 1rem;
            }
        }

        &._small {
            .wrapper {
                width: 2.9rem;
                height: 2.9rem;
            }

            .side {
                font-size: .8rem;
            }
        }
    }

    .wrapper {
        position: relative;
        color: $base-200;

        svg {
            width: 100%;
            height: 100%;
        }
    }

    .side {
        position: absolute;
        font-weight: 600;
        line-height: 1.2rem;
        color: $base-300;
        transition: color $default-color-transition;

        &._north {
            top: -.4rem;
            left: 49%;
            transform: translate(-50%, -100%);
        }

        &._east {
            top: 52%;
            right: -.4rem;
            transform: translate(100%, -50%);
        }

        &._south {
            bottom: -.4rem;
            left: 49%;
            transform: translate(-50%, 100%);
        }

        &._west {
            top: 52%;
            left: -.4rem;
            transform: translate(-100%, -50%);
        }

        &._sun {
            color: #ffc700;
        }
    }
</style>
