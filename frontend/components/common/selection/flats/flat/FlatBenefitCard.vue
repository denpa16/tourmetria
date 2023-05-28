<template>
    <div
        :class="$style.FlatBenefit"
        @click="handleCardClicked"
    >
        <div :class="$style.imageWrap">
            <ImageLazy
                :class="$style.benefitImage"
                :image="benefit.image_display"
                :preview="benefit.image_preview"
                relative
            />
            <div :class="$style.iconFullscreenWrapper">
                <IconFullscreen :class="$style.iconFullscreen" />
            </div>
        </div>

        <h4 :class="[$style.benefitTitle, 'h4']">
            {{ firstRowTitle }}<br>
            {{ secondRowTitle }}
        </h4>
        <VSquareButton
            size="xsmall"
            :class="$style.buttonPlus"
            role="presentation"
            tabindex="-1"
        >
            <IconArrowRight :class="$style.iconArrowRight" />
        </VSquareButton>
        <p :class="[$style.benefitShortDescription, 'p6']">
            {{ benefit.subtitle }}
        </p>
    </div>
</template>

<script>
    import ImageLazy from '~/components/common/ImageLazy';
    import IconFullscreen from '~/components/icons/IconFullscreen';
    import IconArrowRight from '~/components/icons/IconArrowRight';
    export default {
        name: 'FlatBenefitCard',
        components: {
            IconArrowRight,
            IconFullscreen,
            ImageLazy,
        },

        props: {
            benefit: {
                type: Object,
                default: () => ({})
            }
        },

        data() {
            return {};
        },

        computed: {
            firstRowTitle() {
                return this.benefit.title?.split(' ')[0];
            },

            secondRowTitle() {
                return this.benefit.title?.split(' ').slice(1)
                    .join(' ');
            }
        },

        methods: {
            handleCardClicked() {
                this.$emit('cardClicked');
            },
        },
    };
</script>

<style lang="scss" module>
    .FlatBenefit {
        position: relative;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .imageWrap {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;
        border-radius: .8rem;
        transform: translateZ(0);

        @include respond-to(xs) {
            height: 16.6rem;
            margin-bottom: .8rem;
        }

        &:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 14.8rem;
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
            opacity: .5;
            transform: rotate(-180deg);

            @include respond-to(xs) {
                display: none;
            }
        }

        &:after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 14.8rem;
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
            opacity: .8;

            @include respond-to(xs) {
                height: 6rem;
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
                opacity: .72;
            }
        }
    }

    .benefitImage {
        width: 100%;
        height: 100%;
        border-radius: .8rem;
    }

    .benefitTitle {
        position: absolute;
        top: 2.4rem;
        left: 2.4rem;
        z-index: 1;
        max-width: 21.4rem;
        text-transform: uppercase;
        color: $base-0;

        @include respond-to(xs) {
            position: static;
            font-size: 1.2rem;
            line-height: 1.44rem;
            color: $base-800;
        }
    }

    .buttonPlus {
        position: absolute;
        top: 2.4rem;
        right: 2.4rem;
        z-index: 1;

        &:global(.v-square-button) {
            @include respond-to(xs) {
                display: none;
            }
        }
    }

    .iconArrowRight {
        width: 1.2rem;
        height: 1.2rem;
    }

    .benefitShortDescription {
        position: absolute;
        bottom: 2.4rem;
        left: 2.4rem;
        z-index: 1;
        max-width: 30.9rem;
        color: $base-50;

        @include respond-to(xs) {
            display: none;
        }
    }

    .iconFullscreenWrapper {
        display: none;

        @include respond-to(xs) {
            position: absolute;
            right: .8rem;
            bottom: .8rem;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: .3rem .2rem;
            border-radius: .4rem;
            background-color: rgba(255, 255, 255, .24);
        }
    }

    .iconFullscreen {
        width: 2rem;
        height: 1.8rem;
        color: $base-0;
    }
</style>
