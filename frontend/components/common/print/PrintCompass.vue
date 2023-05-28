<template>
    <div :class="$style.PrintCompass"
         :style="rotateStyle.wrapper">
        <div :class="$style.wrapper">
            <img :class="$style.compassImg"
                 src="/images/print/lot/compass.svg"
                 alt="Компас">
            <div :class="[$style.compassSide, $style._north]"
                 :style="{fontSize: fontSizeStyle}">
                <div :style="rotateStyle.side">
                    С
                </div>
            </div>
            <div :class="[$style.compassSide, $style._east]"
                 :style="{fontSize: fontSizeStyle}">
                <div :style="rotateStyle.side">
                    В
                </div>
            </div>
            <div :class="[$style.compassSide, $style._south]"
                 :style="{fontSize: fontSizeStyle}">
                <div :style="rotateStyle.side">
                    Ю
                </div>
            </div>
            <div :class="[$style.compassSide, $style._west]"
                 :style="{fontSize: fontSizeStyle}">
                <div :style="rotateStyle.side">
                    З
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PrintCompass',
        props: {
            rotateDeg: {
                type: Number,
                default: 0,
            },

            fontSize: {
                type: Number,
                default: null,
            }
        },

        computed: {
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

            fontSizeStyle() {
                return this.fontSize ? this.fontSize + 'px' : null;
            }
        }
    };
</script>

<style lang="scss" module>
    .PrintCompass {
        //
    }

    .wrapper {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .compassImg {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .compassSide {
        position: absolute;
        font-size: 18px;
        font-weight: 500;
        line-height: 1;
        color: $base-300;

        &._north {
            top: -2px;
            left: 50%;
            transform: translate(-50%, -100%);
        }

        &._east {
            top: 50%;
            right: -6px;
            transform: translate(100%, -50%);
        }

        &._south {
            bottom: -6px;
            left: 50%;
            transform: translate(-50%, 100%);
        }

        &._west {
            top: 50%;
            left: -6px;
            transform: translate(-100%, -50%);
        }
    }
</style>
