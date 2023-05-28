<template>
    <div :class="[$style.SliderPagination, classes]">
        <span :class="[$style.num, 'p5', 'c-base300']">
            {{ nums[0] }}
        </span>

        <span v-if="$slots.default">
            <slot></slot>
        </span>
        <span
            v-else
            :class="$style.verticalLine"
        ></span>

        <span :class="[$style.num, 'p5', 'c-base300']">
            {{ nums[1] }}
        </span>
    </div>
</template>

<script>
    export default {
        name: 'SliderPagination',

        props: {
            color: {
                type: String,
                default: 'light',
                validator(value) {
                    return ['light', 'blur', 'gray', 'custom'].indexOf(value) !== -1;
                },
            },

            nums: {
                type: Array,
                default: () => [1, 1],
                validator(value) {
                    return Array.isArray(value) && value.length === 2 && value.every(num => typeof num === 'number' || typeof num === 'string');
                }
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
    .SliderPagination {
        display: flex;
        align-items: center;
        border-radius: .4rem;

        &._light {
            background-color: $base-50;

            .btn {
                color: $base-300;

                @include hover {
                    color: $blue;
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
            }
        }

        &._gray {
            background-color: $base-50;
            filter: drop-shadow(0 0 4px rgba(0, 0, 0, .04)) drop-shadow(0 4px 8px rgba(0, 0, 0, .06));

            .btn {
                color: $base-800;

                @include hover {
                    color: $base-300;
                }
            }
        }
    }

    .num {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4.4rem;
        height: 4.4rem;
    }

    .verticalLine {
        height: 1.6rem;
        margin: 0 auto;
        border-left: .1rem solid rgba(0, 0, 0, .24);
        transform: translateX(50%);
    }
</style>
