<template>
    <div :class="$style.MetroInfo">
        <MetroWalkTime
            :class="$style.walk"
            :icon="metro.movement_icon_content"
            :time="metro.time"
            :icon-base-color="iconBaseColor"
        />

        <div v-if="metro.genetive_name"
             :class="['p6', $style.text]">
            до {{ metro.genetive_name }}
        </div>
    </div>
</template>

<script>
    import MetroWalkTime from '~/components/common/metro/MetroWalkTime';

    export default {
        name: 'MetroInfo',
        components: {MetroWalkTime},
        props: {
            metro: {
                type: Object,
                default: () => ({}),
            },

            iconBaseColor: {
                type: [String, Number],
                default: 300,
            }
        },
    };
</script>

<style lang="scss" module>
    .MetroInfo {
        display: flex;
        align-items: center;
    }

    .name {
        display: flex;
        align-items: center;
        margin-right: 1.2rem;

        @include respond-to(sm) {
            margin-right: .6rem;
        }
    }

    .line {
        flex-shrink: 0;
        width: 6px;
        height: 6px;
        border-radius: 50%;
    }

    .station {
        margin-left: .8rem;

        @include respond-to(sm) {
            font-family: inherit;
            font-size: 1.2rem;
            line-height: 1.4rem;
        }

        @include respond-to(xs) {
            font-weight: 500;
        }
    }

    .text {
        margin-left: .4rem;

        @include respond-to(sm) {
            margin-left: .2rem;
            font-family: inherit;
            font-size: 1.2rem;
            line-height: 1.4rem;
        }

        @include respond-to(xs) {
            font-weight: 500;
        }
    }
</style>
