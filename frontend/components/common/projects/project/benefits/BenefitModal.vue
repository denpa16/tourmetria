<template>
    <ModalWrap :container-class="$style.container"
               @close="close">
        <div :class="$style.BenefitModal">
            <transition name="fade-content">
                <div v-show="isLoaded"
                     ref="slider"
                     class="swiper"
                     :class="$style.benefitSlider"
                >
                    <h4 ref="title"
                        :class="[$style.categoryTitle, 'h4']">
                        {{ currentCategoryTitle }}
                    </h4>
                    <div class="swiper-wrapper"
                         :class="$style.sliderWrapper">

                        <div v-for="benefit in benefitList"
                             :key="benefit.id"
                             class="swiper-slide"
                             :class="$style.benefitSlide"
                             :style="scrollBoxStyles">

                            <VScrollBox :class="[$style.containerScroll, {[$style._end]: isEndScroll}, {[$style._top]: isTopScroll}]"
                                        resizable
                                        :forced-param="breakpoint"
                                        @scroll-top="handleScrollTop"
                                        @scroll-end="handleScrollEnd">
                                <h4 :class="[$style.benefitTitle, $style._mobile,'h4']">
                                    {{ benefit.card_title || benefit.title }}
                                </h4>
                                <div :class="$style.imageWrap">
                                    <ImageLazy
                                        :class="$style.benefitImage"
                                        :image="benefit.image_display"
                                        :preview="benefit.image_preview"
                                        relative
                                    />
                                </div>
                                <div :class="$style.descriptionWrapper">
                                    <h6 :class="[$style.benefitTitle, 'h6']">
                                        {{ benefit.card_title || benefit.title }}
                                    </h6>
                                    <p :class="[$style.descriptionText, 'p1']"
                                       v-html=" benefit.first_description || benefit.description">
                                    </p>
                                    <p
                                        v-if="benefit.second_description"
                                        :class="[$style.descriptionText, 'p1']"
                                        v-html="benefit.second_description ">
                                    </p>
                                </div>
                            </VScrollBox>
                        </div>
                    </div>
                    <div ref="navigation"
                         :class="$style.sliderNavigation">
                        <SliderPagination
                            :class="$style.sliderPagination"
                            :nums="[activeSlide, totalSlides]"
                            color="gray" />
                        <SliderNavigation
                            ref="nav"
                            :class="$style.sliderButtons"
                            :prev-disabled="activeSlide <= 1"
                            :next-disabled="activeSlide >= totalSlides"
                            color="gray"
                        />
                    </div>
                </div>
            </transition>
        </div>
    </ModalWrap>
</template>

<script>
    import ModalWrap from '~/components/common/ModalWrap';
    import ImageLazy from '~/components/common/ImageLazy';
    import SliderNavigation from '~/components/common/SliderNavigation';
    import SliderPagination from '~/components/common/SliderPagination';

    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';

    export default {
        name: 'BenefitModal',
        components: {SliderPagination,
                     SliderNavigation,
                     ImageLazy,
                     ModalWrap},

        mixins: [breakpointCheck],
        props: {
            benefitList: {
                type: Array,
                default: () => []
            },

            chosenBenefit: {
                type: Object,
                default: () => ({})
            }
        },

        data() {
            return {
                isLoaded: false,
                slider: null,
                activeSlide: 1,
                totalSlides: 0,
                isEndScroll: false,
                isTopScroll: true,

                headerHeight: 0,
                footerHeight: 0,
            };
        },

        computed: {
            currentCategoryTitle() {
                return this.benefitList[this.activeSlide-1].category_title || 'Преимущества';
            },

            scrollBoxStyles() {
                return {
                    maxHeight: `calc(${this.$deviceIs.mobile ? 'var(--vh-full-page)' : '100%'} - ${this.headerHeight || 0}px - ${this.footerHeight || 0}px - 16px)`
                };
            }
        },

        mounted() {
            window.addEventListener('resize', this.handleResize);
            addResizeListener(this.$refs.slider, this.updateSwiper);
            this.isLoaded = true;

            this.$nextTick(this.calculateHeights);
        },

        beforeDestroy() {
            window.removeEventListener('resize', this.handleResize);
            removeResizeListener(this.$refs.slider, this.updateSwiper);
            this.slider?.destroy();
        },

        methods: {
            close() {
                this.$emit('close');
            },

            initSlider() {
                if (this.$refs.slider) {
                    const options = {
                        speed: 0,
                        slidesPerView: 1,
                        allowTouchMove: true,
                        navigation: {
                            nextEl: this.$refs.nav.$refs.next || false,
                            prevEl: this.$refs.nav.$refs.prev || false,
                        },

                        on: {
                            init: swiper => {
                                const activeBenefit = this.benefitList.findIndex(benefit => benefit.id === this.chosenBenefit.id) + 1;
                                this.activeSlide = activeBenefit || 1;
                                if (activeBenefit !== 0) {
                                    swiper.slideTo(activeBenefit - 1);
                                }
                                this.totalSlides = Math.ceil(this.$refs.slider.swiper.slides.length - this.$refs.slider.swiper.params.slidesPerView + 1);
                                swiper.params.speed = 1000;
                            },
                        },
                    };

                    this.slider = new this.$Swiper(this.$refs.slider, options);

                    this.slider.on('activeIndexChange', () => {
                        this.activeSlide = this.$refs.slider.swiper.realIndex + 1;
                    });
                }
            },

            updateSwiper() {
                this.slider?.destroy();
                this.$nextTick(() => {
                    this.initSlider();
                });
            },

            handleScrollEnd(value) {
                this.isEndScroll = value;
            },

            handleScrollTop(value) {
                this.isTopScroll = value;
            },

            handleResize() {
                requestAnimationFrame(this.calculateHeights);
            },

            calculateHeights() {
                if (this.$refs.title) {
                    this.headerHeight = this.$refs.title.offsetHeight;
                }

                if (this.$refs.navigation) {
                    this.footerHeight = this.$refs.navigation.offsetHeight;
                }
            }
        }
    };

</script>

<style lang="scss" module>
    .BenefitModal {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .container {
        @include respond-to(sm) {
            position: absolute;
            bottom: 0;
            height: auto;
        }
    }

    .benefitSlider {
        overflow-y: hidden;
        height: 100%;
        padding-top: 2.4rem;

        @include respond-to(sm) {
            padding-top: 0;
        }

        @include respond-to(sm) {
            height: auto;
        }

        @include respond-to(xs) {
            display: flex;
            flex-direction: column;
            height: var(--vh-full-page);
        }
    }

    .sliderWrapper {
        height: 100%;

        @include respond-to(xs) {
            flex: 1;
        }
    }

    .benefitSlide {
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .sliderNavigation {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 0 2.4rem 2.4rem;

        @include respond-to(sm) {
            position: static;
            margin-top: 1.6rem;
        }
    }

    .categoryTitle {
        display: none;
        padding: 2.4rem;
        text-transform: uppercase;

        @include respond-to(sm) {
            display: block;
        }

        @include respond-to(xs) {
            padding-bottom: 3rem;
            font-size: 1.2rem;
            line-height: 1.2rem;
            color: $base-300;
        }
    }

    .containerScroll {
        position: relative;
        flex: auto;
        max-height: 100vh;

        &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 4rem;
            background: linear-gradient(to bottom, #fff, transparent);
            opacity: 1;
            transition: opacity $default-transition;
        }

        &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 4rem;
            background: linear-gradient(to top, #fff, transparent);
            opacity: 1;
            transition: opacity $default-transition;
        }

        &._top {
            &:before {
                opacity: 0;
            }
        }

        &._end {
            &:after {
                opacity: 0;
            }
        }
    }

    .imageWrap {
        width: 100%;
        height: 31.9rem;
        margin-bottom: 3.2rem;
        padding: 0 2.4rem;

        @include respond-to(sm) {
            height: 19.2rem;
            margin-bottom: 2.4rem;
        }

        @include respond-to(xs) {
            padding: 0 1.6rem;
        }
    }

    .benefitImage {
        overflow: hidden;
        width: 100%;
        height: 100%;
        border-radius: .4rem;
    }

    .benefitTitle {
        margin-bottom: 1.6rem;
        text-transform: uppercase;

        @include respond-to(xs) {
            display: none;
        }

        &._mobile {
            display: none;

            @include respond-to(xs) {
                display: block;
                margin-bottom: 2.4rem;
                padding: 0 1.6rem;
            }
        }
    }

    .descriptionWrapper {
        display: flex;
        flex-direction: column;
        padding: 0 2.4rem;

        @include respond-to(xs) {
            padding: 0 1.6rem;
        }

        & > * {
            margin-bottom: 1.6rem;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    .descriptionText {
        color: $base-300;

        @include respond-to(xs) {
            font-size: 1.2rem;
            line-height: 1.6rem;
            color: $base-400;
        }

        @include reset-text-styles;
    }
</style>
