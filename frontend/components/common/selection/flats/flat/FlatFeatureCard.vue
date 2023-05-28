<template>
    <article :class="$style.FlatFeatureCard">
        <div :class="$style.featureHeader">
            <div :class="$style.featureIconWrapper">
                <img
                    :src="feature.icon"
                    alt="Иконка преимущества"
                >
            </div>
            <VTooltip
                v-if="feature.additional_info"
                left
            >
                <template #activator>
                    <span :class="$style.iconTooltip">
                        ?
                    </span>
                </template>
                <div :class="$style.tooltip">
                    {{ feature.additional_info }}
                </div>
            </VTooltip>
        </div>
        <div :class="$style.featureText">
            <h6 :class="[$style.featureTitle,'h6']">
                {{ feature.title }}
            </h6>
            <p
                v-if="feature.subtitle"
                :class="[$style.featureSubtitle, 'p6', 'c-base300']"
            >
                {{ feature.subtitle }}
            </p>
        </div>
    </article>
</template>

<script>
    export default {
        name: 'FlatFeatureCard',
        components: {},
        props: {
            feature: {
                type: Object,
                default: () => ({})
            }
        },

        data() {
            return {};
        },

        computed: {},
        methods: {},
    };
</script>

<style lang="scss" module>
    .FlatFeatureCard {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        padding: 2.4rem;
        border-radius: .8rem;
        background-color: $base-50;
    }

    .featureHeader {
        display: flex;
        justify-content: space-between;
    }

    .featureIconWrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 6.8rem;
        height: 6.8rem;
        margin-bottom: 1.6rem;
        border-radius: 50%;
        background-color: $base-0;
    }

    .iconTooltip {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 50%;
        border: 1px solid $base-100;
        background-color: $base-0;
        font-size: .9rem;
        font-weight: 600;
        color: $base-800;
        transition: all $default-transition;
        cursor: pointer;

        @include hover {
            border-color: $base-800;
        }
    }

    .tooltip {
        max-width: 22.5rem;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
        padding: 1.6rem;
        border-radius: .8rem;
        background-color: $base-0;
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 1.6rem;
        color: $base-400;
    }

    .featureTitle {
        max-width: 20rem;
        text-transform: uppercase;

        @include respond-to(xs) {
            font-size: 1.2rem;
            line-height: 1.44rem;
        }
    }

    .featureSubtitle {
        padding-top: .8rem;
    }
</style>
