<template>
    <div :class="[$style.PrintPage, 'print-page', classes]">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'PrintPage',

        props: {
            topVector: {
                type: Boolean,
                default: false,
            },

            bottomVector: {
                type: Boolean,
                default: false,
            }
        },

        computed: {
            classes() {
                return {
                    [this.$style._topVector]: this.topVector,
                    [this.$style._bottomVector]: this.bottomVector,
                };
            }
        }
    };
</script>

<style lang="scss" module>
    .PrintPage {
        -webkit-print-color-adjust: exact;
        /* stylelint-disable */
        print-color-adjust: exact;

        &._topVector {
            &:before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                z-index: -1;
                display: block;
                width: 100%;
                height: 145px;
                background: url('/images/vectorTop.svg');
                background-size: 100% 100%;
                opacity: .1;
                transform: scale(1.6);
                transform-origin: 50% 0;
            }
        }

        &._bottomVector {
            &:after {
                content: "";
                position: absolute;
                bottom: 0;
                left: 0;
                z-index: -1;
                display: block;
                width: 100%;
                height: 145px;
                background: url('/images/vectorBottom.svg');
                background-size: 100% 100%;
                opacity: .1;
                transform: scale(1.6);
                transform-origin: 50% 0;
            }
        }
    }
</style>
