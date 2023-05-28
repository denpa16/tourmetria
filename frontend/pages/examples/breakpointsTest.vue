<template>
    <div :class="[$style.breakpointsTest, 'page']">
        <div :class="[$style.device, $style[`_${device}`]]">
            {{ device }}
            <span>$deviceIs</span>
            <span>300px X 300px</span>
        </div>
        <div :class="$style.respond">
            <span>respond-to</span>
            <span>30rem X 30rem</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BreakpointsTest',

    data() {
        return {
            device: null,
        };
    },

    watch: {
        '$deviceIs.device'() {
            this.device = this.$deviceIs.device;
        },
    },

    mounted() {
        this.$nextTick(() => {
            this.device = this.$deviceIs.device;
        });
    },
};
</script>

<style lang="scss" module>
    .breakpointsTest {
        //
    }

    .device,
    .respond {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 6rem;
        color: white;

        & > span {
            position: absolute;
            top: 1.6rem;
            font-size: 3rem;

            &:last-of-type {
                top: auto;
                bottom: 1.6rem;
            }
        }
    }

    .device {
        width: 300px;
        height: 300px;

        &._desktop {
            background-color: red;
        }

        &._laptop {
            background-color: green;
        }

        &._tablet {
            background-color: blue;
        }

        &._mobile {
            background-color: yellow;
            color: black;
        }
    }

    .respond {
        width: 30rem;
        height: 30rem;
        margin-top: .8rem;

        @include respond-to(desktop) {
            background-color: red;

            &:after {
                content: "desktop";
            }
        }

        @include respond-to(laptop) {
            background-color: green;

            &:after {
                content: "laptop";
            }
        }

        @include respond-to(tablet) {
            background-color: blue;

            &:after {
                content: "tablet";
            }
        }

        @include respond-to(tablet-sm) {
            background-color: cadetblue;

            &:after {
                content: "tablet-sm";
            }
        }

        @include respond-to(mobile) {
            background-color: yellow;
            color: black;

            &:after {
                content: "mobile";
            }
        }
    }
</style>
