<template>
    <div :class="[$style.TheLoader, classes]"></div>
</template>

<script>
    export default {
        name: 'TheLoader',

        props: {
            size: {
                type: String,
                default: 'medium',
                validator(value) {
                    return ['large', 'medium', 'small', 'xsmall'].indexOf(value) !== -1;
                },
            },
        },

        computed: {
            classes() {
                return {
                    [this.$style[`_${this.size}`]]: this.size,
                };
            },
        }
    };
</script>

<style lang="scss" module>
    .TheLoader {
        position: relative;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        text-indent: -9999em;
        transform: translateZ(0);
        animation: mulShdSpin 1.1s infinite ease;

        &._medium {
            font-size: .4rem;
        }
    }

    @keyframes mulShdSpin {
        0%,
        100% {
            box-shadow: 0 -2.6em 0 0 $blue, 1.8em -1.8em 0 0 rgba($blue, .2), 2.5em 0 0 0 rgba($blue, .2), 1.75em 1.75em 0 0 rgba($blue, .2), 0 2.5em 0 0 rgba($blue, .2), -1.8em 1.8em 0 0 rgba($blue, .2), -2.6em 0 0 0 rgba($blue, .5), -1.8em -1.8em 0 0 rgba($blue, .7);
        }

        12.5% {
            box-shadow: 0 -2.6em 0 0 rgba($blue, .7), 1.8em -1.8em 0 0 $blue, 2.5em 0 0 0 rgba($blue, .2), 1.75em 1.75em 0 0 rgba($blue, .2), 0 2.5em 0 0 rgba($blue, .2), -1.8em 1.8em 0 0 rgba($blue, .2), -2.6em 0 0 0 rgba($blue, .2), -1.8em -1.8em 0 0 rgba($blue, .5);
        }

        25% {
            box-shadow: 0 -2.6em 0 0 rgba($blue, .5), 1.8em -1.8em 0 0 rgba($blue, .7), 2.5em 0 0 0 $blue, 1.75em 1.75em 0 0 rgba($blue, .2), 0 2.5em 0 0 rgba($blue, .2), -1.8em 1.8em 0 0 rgba($blue, .2), -2.6em 0 0 0 rgba($blue, .2), -1.8em -1.8em 0 0 rgba($blue, .2);
        }

        37.5% {
            box-shadow: 0 -2.6em 0 0 rgba($blue, .2), 1.8em -1.8em 0 0 rgba($blue, .5), 2.5em 0 0 0 rgba($blue, .7), 1.75em 1.75em 0 0 $blue, 0 2.5em 0 0 rgba($blue, .2), -1.8em 1.8em 0 0 rgba($blue, .2), -2.6em 0 0 0 rgba($blue, .2), -1.8em -1.8em 0 0 rgba($blue, .2);
        }

        50% {
            box-shadow: 0 -2.6em 0 0 rgba($blue, .2), 1.8em -1.8em 0 0 rgba($blue, .2), 2.5em 0 0 0 rgba($blue, .5), 1.75em 1.75em 0 0 rgba($blue, .7), 0 2.5em 0 0 $blue, -1.8em 1.8em 0 0 rgba($blue, .2), -2.6em 0 0 0 rgba($blue, .2), -1.8em -1.8em 0 0 rgba($blue, .2);
        }

        62.5% {
            box-shadow: 0 -2.6em 0 0 rgba($blue, .2), 1.8em -1.8em 0 0 rgba($blue, .2), 2.5em 0 0 0 rgba($blue, .2), 1.75em 1.75em 0 0 rgba($blue, .5), 0 2.5em 0 0 rgba($blue, .7), -1.8em 1.8em 0 0 $blue, -2.6em 0 0 0 rgba($blue, .2), -1.8em -1.8em 0 0 rgba($blue, .2);
        }

        75% {
            box-shadow: 0 -2.6em 0 0 rgba($blue, .2), 1.8em -1.8em 0 0 rgba($blue, .2), 2.5em 0 0 0 rgba($blue, .2), 1.75em 1.75em 0 0 rgba($blue, .2), 0 2.5em 0 0 rgba($blue, .5), -1.8em 1.8em 0 0 rgba($blue, .7), -2.6em 0 0 0 $blue, -1.8em -1.8em 0 0 rgba($blue, .2);
        }

        87.5% {
            box-shadow: 0 -2.6em 0 0 rgba($blue, .2), 1.8em -1.8em 0 0 rgba($blue, .2), 2.5em 0 0 0 rgba($blue, .2), 1.75em 1.75em 0 0 rgba($blue, .2), 0 2.5em 0 0 rgba($blue, .2), -1.8em 1.8em 0 0 rgba($blue, .5), -2.6em 0 0 0 rgba($blue, .7), -1.8em -1.8em 0 0 $blue;
        }
    }
</style>
