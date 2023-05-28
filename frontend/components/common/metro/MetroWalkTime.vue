<template>
    <div :class="$style.MetroWalkTime">
        <div v-if="icon"
             :class="$style.walk"
             :style="styles"
             v-html="icon"></div>

        <div v-if="time"
             :class="['p6', $style.time]">
            {{ time }} мин.
        </div>
    </div>
</template>

<script>
    import variables from '~/assets/scss/shared/_variables.scss';
    export default {
        name: 'MetroWalkTime',
        props: {
            icon: {
                type: String,
                required: true,
                default: '',
            },

            time: {
                type: [Number, String],
                required: true,
                default: 0,
            },

            iconBaseColor: {
                type: [String, Number],
                default: 300,
            }
        },

        computed: {
            styles() {
                return {
                    color: variables[`base-${this.iconBaseColor}`]
                };
            }
        }
    };
</script>

<style lang="scss" module>
    .MetroWalkTime {
        display: flex;
        align-items: center;
    }

    .walk {
        flex-shrink: 0;
        line-height: 0;

        & > svg {
            width: 1.2rem;
            height: 1.2rem;
            fill: currentColor;
        }
    }

    .time {
        margin-left: .8rem;

        @include respond-to(sm) {
            margin-left: .6rem;
            font-family: inherit;
            font-size: 1.2rem;
            line-height: 1.4rem;
        }

        @include respond-to(xs) {
            font-weight: 500;
        }
    }
</style>
