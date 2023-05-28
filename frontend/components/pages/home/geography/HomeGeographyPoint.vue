<template>
    <button :class="[$style.HomeGeographyPoint, {
                [$style._disabled]: !pin.count
            }]"
            :value="`${pin.title} ${pin.count}`"
            type="button"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
            @click="handleClick">
        <IconClock v-if="!pin.count"
                   :class="$style.iconClock" />
        <span :class="$style.text">
            <span :class="$style.title">
                {{ pin.title }}
                <span class="c-blue">
                    {{ pin.count }}
                </span>
            </span>
        </span>
    </button>
</template>

<script>
    import IconClock from '~/components/icons/IconClock';

    export default {
        name: 'HomeGeographyPoint',

        components: {
            IconClock,
        },

        props: {
            pin: {
                type: Object,
                default: () => ({}),
            },

            activeStage: {
                type: String,
                default: '',
            },
        },

        data() {
            return {};
        },

        methods: {
            handleClick() {
                if (!this.pin.count) {
                    return;
                }
                this.$emit('click', this.pin);
            },

            handleMouseEnter() {
                this.$emit('enter', this.pin);
            },

            handleMouseLeave() {
                this.$emit('leave');
            },
        }

    };
</script>

<style lang="scss" module>
    .HomeGeographyPoint {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.8rem;
        height: 2.8rem;
        border-radius: 50%;
        //border: 4px solid $base-0;
        background-color: $primary-500;
        box-shadow: 0 .4rem 4rem 2.4rem rgba(0, 158, 174, .32);
        color: $base-800;
        transition: all .2s linear;
        cursor: pointer;

        &:not(._disabled):after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            background-color: $base-0;
            transform: translate(-50%, -50%);
        }

        &._disabled {
            background-color: $base-50;
            box-shadow: none;
            opacity: .44;
            pointer-events: none;
        }

        @include respond-to(xs) {
            width: 3.2rem;
            height: 3.2rem;
        }
    }

    .count {
        padding: 1.6rem 0 1.3rem;
        font-size: 1.6rem;
        font-weight: 600;
        line-height: 1.9rem;

        @include respond-to(xs) {
            font-size: 1.2rem;
            line-height: 1.6rem;
        }
    }

    .iconClock {
        width: 1rem;
        height: 1rem;
        color: $base-800;
    }

    .text {
        position: absolute;
        bottom: 100%;
        left: 50%;
        display: inline-block;
        padding-bottom: 1.6rem;
        transform: translateX(-50%);
    }

    .title {
        width: fit-content;
        text-transform: uppercase;
        white-space: nowrap;
        font-size: 1.6rem;
        font-weight: 600;
        line-height: 1.9rem;
        color: $base-0;

        @include respond-to(sm) {
            font-size: 1.4rem;
            line-height: 120%;
        }

        @include respond-to(xs) {
            font-size: 1.2rem;
        }
    }
</style>
