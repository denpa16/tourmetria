<template>
    <article :class="$style.ProjectBenefit"
             @click="handleCardClicked">
        <div :class="$style.benefitTags">
            <VTag
                v-if="benefit.tag && benefit.tag.tag"
                color="white"
                :label="benefit.tag.tag" />
            <VTag
                v-if="benefit.tag && benefit.tag.description"
                color="transparent"
                :label="benefit.tag.description" />
        </div>
        <div :class="$style.imageWrap">
            <ImageLazy
                :class="$style.benefitImage"
                :image="benefit.image_display"
                :preview="benefit.image_preview"
                relative
            />
            <transition name="fade-slow">
                <HintTouch v-if="isHintVisible"
                           :class="$style.benefitHint" />
            </transition>
        </div>
        <div :class="$style.benefitInfo">
            <div>
                <h4 :class="[$style.benefitTitle, 'h4']">
                    {{ benefit.card_title }}
                </h4>
                <p :class="[$style.benefitShortDescription, 'p6', 'c-base300']">
                    {{ benefit.short_description }}
                </p>
            </div>
            <VSquareButton
                size="xsmall"
                :class="$style.buttonPlus"
                role="presentation"
                tabindex="-1"
            >
                <IconArrowRight :class="$style.iconArrowRight" />
            </VSquareButton>
        </div>
    </article>
</template>

<script>
    import ImageLazy from '~/components/common/ImageLazy';
    import HintTouch from '~/components/common/HintTouch';
    import IconArrowRight from '~/components/icons/IconArrowRight';

    export default {
        name: 'ProjectBenefitCard',
        components: {
            IconArrowRight,
            HintTouch,
            ImageLazy,
        },

        props: {
            benefit: {
                type: Object,
                default: () => ({})
            },

            isHintVisible: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {};
        },

        computed: {},
        methods: {
            handleCardClicked() {
                this.$emit('cardClicked');
            },
        },
    };
</script>

<style lang="scss" module>
    .ProjectBenefit {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .benefitTags {
        position: absolute;
        top: 1.6rem;
        left: 1.6rem;
        z-index: 1;
        display: flex;

        @include respond-to(xs) {
            display: none;
        }

        & > * {
            margin-right: .4rem;

            &:last-child {
                margin-right: 0;
            }
        }
    }

    .imageWrap {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 43.2rem;
        margin-bottom: .8rem;
        border-radius: .8rem;

        @include respond-to(sm) {
            height: 37.4rem;
        }

        @include respond-to(xs) {
            height: 14rem;
            margin-bottom: .8rem;
        }

        &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 8.4rem;
            border-radius: .8rem;
            background:
                linear-gradient(
                    180deg,
                    rgba(10, 11, 12, 0) 0%,
                    rgba(10, 11, 12, .0086472) 6.67%,
                    rgba(10, 11, 12, .03551) 13.33%,
                    rgba(10, 11, 12, .0816599) 20%,
                    rgba(10, 11, 12, .147411) 26.67%,
                    rgba(10, 11, 12, .231775) 33.33%,
                    rgba(10, 11, 12, .331884) 40%,
                    rgba(10, 11, 12, .442691) 46.67%,
                    rgba(10, 11, 12, .557309) 53.33%,
                    rgba(10, 11, 12, .668116) 60%,
                    rgba(10, 11, 12, .768225) 66.67%,
                    rgba(10, 11, 12, .852589) 73.33%,
                    rgba(10, 11, 12, .91834) 80%,
                    rgba(10, 11, 12, .96449) 86.67%,
                    rgba(10, 11, 12, .991353) 93.33%,
                    #0a0b0c 100%
                );
            opacity: .64;
            transform: matrix(1, 0, 0, -1, 0, 0);

            @include respond-to(xs) {
                display: none;
            }
        }
    }

    .benefitImage {
        width: 100%;
        height: 100%;
    }

    .benefitHint {
        position: absolute;
        top: 0;
        left: 0;
    }

    .benefitInfo {
        position: relative;
        display: flex;
        justify-content: space-between;
        flex: 1 1 auto;
        width: 100%;
        padding: 2rem 1.6rem;
        border-radius: .8rem;
        background-color: $base-50;

        @include respond-to(xs) {
            padding: 0;
            background-color: unset;
        }
    }

    .benefitTitle {
        margin-bottom: 3.2rem;
        text-transform: uppercase;

        @include respond-to(xs) {
            margin-bottom: 0;
            font-size: 1.2rem;
            line-height: 1.44rem;
        }
    }

    .buttonPlus {
        min-width: 2.4rem;
        margin-left: .8rem;

        @include respond-to(xs) {
            display: none;
        }
    }

    .iconArrowRight {
        width: 1.2rem;
        height: 1.2rem;
    }

    .benefitShortDescription {
        margin-top: auto;

        @include respond-to(xs) {
            display: none;
        }
    }
</style>
