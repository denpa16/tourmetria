<template>
    <component :is="elem"
               :class="$style.ProjectInfraCard"
               @click="$emit('click', $event, card.infra_category)">
        <ImageLazy :class="$style.cardImg"
                   :image="card.image_display"
                   :preview="card.image_preview" />
        <div :class="$style.cardContent">
            <h6 :class="[$style.cardTitle, 'h4', 'c-base0']">
                {{ card.title }}
            </h6>
            <VSquareButton :class="$style.cardBtn"
                           color="primary"
                           size="xsmall"
                           role="presentation"
                           tabindex="-1"
            >
                <IconArrowRight :class="$style.cardIcon" />
            </VSquareButton>
        </div>
    </component>
</template>

<script>
    import ImageLazy from '~/components/common/ImageLazy';
    import IconArrowRight from '~/components/icons/IconArrowRight';
    export default {
        name: 'ProjectInfraCard',

        components: {
            IconArrowRight,
            ImageLazy
        },

        props: {
            card: {
                type: Object,
                default: () => ({})
            },

            elem: {
                type: String,
                default: 'div'
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectInfraCard {
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 28rem;
        border-radius: .8rem;
        opacity: 1;
        transition: opacity $default-transition;
        cursor: pointer;

        @include hover {
            opacity: .7;
        }

        @include respond-to(sm) {
            height: 31.2rem;
        }

        @include respond-to(xs) {
            height: 14rem;
        }
    }

    .cardImg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        &:before {
            content: "";
            position: absolute;
            top: -30.4rem;
            left: -27rem;
            z-index: 1;
            width: 64.4rem;
            height: 64.4rem;
            background: radial-gradient(50% 50% at 50% 50%, $base-900 0%, rgba(10, 11, 12, 0) 100%);
            opacity: .72;

            @include respond-to(xs) {
                top: unset;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 9.2rem;
                background: linear-gradient(180deg, rgba(10, 11, 12, 0) 0%, rgba(10, 11, 12, .0086472) 6.67%, rgba(10, 11, 12, .03551) 13.33%, rgba(10, 11, 12, .0816599) 20%, rgba(10, 11, 12, .147411) 26.67%, rgba(10, 11, 12, .231775) 33.33%, rgba(10, 11, 12, .331884) 40%, rgba(10, 11, 12, .442691) 46.67%, rgba(10, 11, 12, .557309) 53.33%, rgba(10, 11, 12, .668116) 60%, rgba(10, 11, 12, .768225) 66.67%, rgba(10, 11, 12, .852589) 73.33%, rgba(10, 11, 12, .91834) 80%, rgba(10, 11, 12, .96449) 86.67%, rgba(10, 11, 12, .991353) 93.33%, $base-900 100%);
                opacity: .64;
            }
        }
    }

    .cardContent {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 1.6rem;

        @include respond-to(xs) {
            margin-top: auto;
        }
    }

    .cardTitle {
        width: 100%;
        text-transform: uppercase;

        @include respond-to(xs) {
            font-size: 1.2rem;
            line-height: 1.2;
        }
    }

    .cardBtn {
        margin-left: .8rem;

        @include respond-to(xs) {
            display: none;
        }
    }

    .cardIcon {
        width: 1.2rem;
        height: 1.2rem;
    }
</style>
