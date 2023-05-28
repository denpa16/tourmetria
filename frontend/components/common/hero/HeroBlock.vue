<template>
    <div ref="heroBlock"
         :class="$style.HeroBlock"
         :style="styles"
    >
        <SliderNavigation
            v-show="isFewSlides && !$deviceIs.mobile"
            ref="nav"
            :class="$style.nav"
            v-bind="sliderNavigationAttrs"
        >
            <div :class="[$style.slideCount, 'p6', 'c-base300']">
                {{ activeSlide + 1 }}/{{ slides.length }}
            </div>
        </SliderNavigation>

        <div v-if="$slots.rightBottomPlank"
             :class="$style.rightBottomWrapper">
            <slot name="rightBottomPlank"></slot>
        </div>

        <div v-if="$slots.rightTopPlank"
             :class="$style.rightTopWrapper">
            <slot name="rightTopPlank"></slot>
        </div>

        <div
            v-show="isFewSlides && $deviceIs.mobile"
            class="swiper-pagination-hero"
            :class="$style.pagination"
        >
        </div>

        <transition name="fade-content">
            <div v-show="isLoaded"
                 ref="slider"
                 class="swiper"
                 :class="$style.swiper"
            >
                <div class="swiper-wrapper">
                    <div v-for="(slide, idx) in slides"
                         :key="idx"
                         :class="$style.slide"
                         class="swiper-slide"
                    >
                        <div ref="image"
                             :class="$style.image">
                            <ImageLazy
                                :image="slide.image_display"
                                :preview="slide.image_preview"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <transition name="fade-content">
            <div v-show="isLoaded"
                 :class="['container', $style.container]">
                <transition-group
                    name="content-change"
                    tag="div"
                >
                    <div
                        v-for="(slide, idx) in slides"
                        v-show="idx === activeSlide"
                        :key="slide.id"
                        :class="$style.contentSlide"
                    >
                        <div :class="$style.info">
                            <h1 v-if="idx === 1"
                                :class="[$style.title, 'c-base0', 'h1']"
                                v-html="slide.title">
                            </h1>
                            <h2 v-else
                                :class="[$style.title, 'c-base0', 'h1']"
                                v-html="slide.title">
                            </h2>
                            <div :class="[$style.description, 'p1', 'c-base0']"
                                 v-html="slide.subtitle || slide.text || ''">
                            </div>
                        </div>

                        <div v-if="tags"
                             :class="$style.tags"
                        >
                            <VTag v-for="tag in tags"
                                  :key="tag.text"
                                  :class="$style.tag"
                                  :color="tag.color"
                                  :label="tag.label"
                            />
                            <slot name="customTag"></slot>
                        </div>

                        <div v-if="$slots.btns || homePage && (slide.show_submit_button || slide.buttons.length)"
                             :class="$style.btnWrapper">
                            <slot name="btns"></slot>

                            <VButton
                                v-if="slide.show_submit_button"
                                :class="[$style.btn, $style.submit]"
                                :color="$deviceIs.tablet ? 'light' : 'primary'"
                                @click="$emit('open-call-modal')"
                            >
                                Оставить заявку
                            </VButton>
                            <VButton
                                v-for="button in slide.buttons"
                                :key="button.id"
                                :class="$style.btn"
                                :color="$deviceIs.tablet ? 'primary' : 'light'"
                                :href="button.link"
                                target="_blank"
                            >
                                {{ button.text }}
                            </VButton>
                        </div>
                    </div>
                </transition-group>
            </div>
        </transition>
    </div>
</template>

<script>
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';
    import variables from '~/assets/scss/shared/_variables.scss';

    import ImageLazy from '~/components/common/ImageLazy';
    import SliderNavigation from '~/components/common/SliderNavigation';

    export default {
        name: 'HeroBlock',

        components: {
            ImageLazy,
            SliderNavigation,
        },

        mixins: [breakpointCheck],

        props: {
            slides: {
                type: Array,
                default: () => [],
            },

            tags: {
                type: Array,
                default: () => [],
            },

            sliderNavigationAttrs: {
                type: Object,
                default: () => ({}),
            },

            customHeightReduction: {
                type: Number,
                default: 0,
            },

            homePage: {
                type: Boolean,
                default: false,
            }
        },

        data() {
            return {
                isLoaded: false,
                activeSlide: 0,
            };
        },

        computed: {
            isFewSlides() {
                return this.slides?.length > 1;
            },

            styles() {
                const fullPageHeight = 'xs,sm'.includes(this.breakpoint)
                    ? 'calc(var(--vh-full-page, 100vh)'
                    : '100vh';
                const headerHeight = this.breakpoint === 'xs'
                    ? `${variables['header-mobile-h']} + ${variables['header-plank-h']}`
                    : `${variables['header-h']} + ${variables['header-plank-h']}`;

                return {
                    maxHeight: `calc(${fullPageHeight} - (${headerHeight}) - ${this.customHeightReduction || 0}px)`
                };
            },
        },

        watch: {
            activeSlide(value) {
                if (this.slider) {
                    this.$nextTick(() => {
                        this.slider.slideToLoop(value);
                        this.slider.lazy.load();
                    });
                }
            },
        },

        mounted() {
            addResizeListener(this.$refs.slider, this.update);
            this.isLoaded = true;
        },

        beforeDestroy() {
            removeResizeListener(this.$refs.slider, this.update);
            this.slider?.destroy();
        },

        methods: {
            initSlider() {
                if (this.$refs.slider) {
                    const options = {
                        speed: 1000,
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        allowTouchMove: this.isFewSlides,
                        loop: this.isFewSlides,
                        autoplay: this.isFewSlides
                            && {
                                delay: 8000,
                                disableOnInteraction: false,
                            },

                        breakpoints: {
                            1280: {
                                allowTouchMove: false,
                            },
                        },

                        pagination: {
                            el: '.swiper-pagination-hero',
                            type: 'bullets',
                            clickable: true,
                        },

                        navigation: {
                            nextEl: this.$refs.next?.$el || this.$refs.next || this.$refs.nav.$refs.next || false,
                            prevEl: this.$refs.prev?.$el || this.$refs.prev || this.$refs.nav.$refs.prev || false,
                        },
                    };

                    this.slider = new this.$Swiper(this.$refs.slider, options);

                    this.slider.on('activeIndexChange', () => {
                        if (!this.slider) {
                            return;
                        }

                        this.activeSlide = this.slider.realIndex;
                        this.slider.lazy.load();
                    });
                }
            },

            update() {
                this.slider?.destroy();
                this.$nextTick(() => {
                    this.initSlider();
                });
            },
        }
    };
</script>

<style lang="scss" module>
    .HeroBlock {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: calc(100vh - #{$header-h});
        min-height: 60rem;
        transition: all .4s;

        @include respond-to(sm) {
            height: calc(var(--vh-full-page) - #{$header-h});
        }

        @include respond-to(xs) {
            height: calc(var(--vh-full-page) - #{$header-mobile-h});
            min-height: 40rem;
        }
    }

    .nav {
        position: absolute;
        bottom: 2.4rem;
        left: 2.4rem;
        z-index: 2;
        width: 11.3rem;

        @include respond-to(sm) {
            width: 10.9rem;
        }
    }

    .slideCount {
        width: 3rem;
        text-align: center;
        -webkit-user-select: none;
        user-select: none;
    }

    .rightBottomWrapper {
        position: absolute;
        right: 2.4rem;
        bottom: 2.4rem;
        z-index: 2;
        display: flex;

        & > * {
            margin-right: .8rem;

            &:last-child {
                margin-right: 0;
            }
        }
    }

    .rightTopWrapper {
        position: absolute;
        top: 2.4rem;
        right: 2.4rem;
        z-index: 2;
    }

    .swiper {
        //position: absolute;
        //top: 0;
        //left: 0;
        width: 100%;
        height: 100%;
    }

    .slide {
        position: relative;
        width: 100%;
        height: 100%;

        &:after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 100%;
            background: radial-gradient(38.36% 79.85% at 12.29% 26.92%, rgba(10, 11, 12, .4) 0%, rgba(10, 11, 12, .356) 14.35%, rgba(10, 11, 12, .276) 25.81%, rgba(10, 11, 12, .236) 36.23%, rgba(10, 11, 12, .172) 46.64%, rgba(10, 11, 12, .124173) 55.5%, rgba(10, 11, 12, .0874852) 62.27%, rgba(10, 11, 12, .0564421) 68%, rgba(10, 11, 12, .0197547) 74.77%, rgba(10, 11, 12, 0) 78.41%, rgba(10, 11, 12, 0) 88.83%, rgba(10, 11, 12, 0) 100%);
            -webkit-transform: translateZ(0);

            @include respond-to(sm) {
                background: radial-gradient(65.76% 55.04% at 15.49% 26.77%, rgba(10, 11, 12, .4) 0%, rgba(10, 11, 12, .356) 14.35%, rgba(10, 11, 12, .276) 25.81%, rgba(10, 11, 12, .236) 36.23%, rgba(10, 11, 12, .172) 46.64%, rgba(10, 11, 12, .124173) 55.5%, rgba(10, 11, 12, .0874852) 62.27%, rgba(10, 11, 12, .0564421) 68%, rgba(10, 11, 12, .0197547) 74.77%, rgba(10, 11, 12, 0) 78.41%, rgba(10, 11, 12, 0) 88.83%, rgba(10, 11, 12, 0) 100%);
            }

            @include respond-to(xs) {
                background: radial-gradient(73.02% 68.98% at 15.49% 26.77%, rgba(10, 11, 12, .4) 0%, rgba(10, 11, 12, .356) 14.35%, rgba(10, 11, 12, .276) 25.81%, rgba(10, 11, 12, .236) 36.23%, rgba(10, 11, 12, .172) 46.64%, rgba(10, 11, 12, .124173) 55.5%, rgba(10, 11, 12, .0874852) 62.27%, rgba(10, 11, 12, .0564421) 68%, rgba(10, 11, 12, .0197547) 74.77%, rgba(10, 11, 12, 0) 78.41%, rgba(10, 11, 12, 0) 88.83%, rgba(10, 11, 12, 0) 100%);
            }
        }

        &:before {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 20rem;
            background: linear-gradient(180deg, rgba(10, 11, 12, 0) 0%, rgba(10, 11, 12, .0086472) 6.67%, rgba(10, 11, 12, .03551) 13.33%, rgba(10, 11, 12, .0816599) 20%, rgba(10, 11, 12, .147411) 26.67%, rgba(10, 11, 12, .231775) 33.33%, rgba(10, 11, 12, .331884) 40%, rgba(10, 11, 12, .442691) 46.67%, rgba(10, 11, 12, .557309) 53.33%, rgba(10, 11, 12, .668116) 60%, rgba(10, 11, 12, .768225) 66.67%, rgba(10, 11, 12, .852589) 73.33%, rgba(10, 11, 12, .91834) 80%, rgba(10, 11, 12, .96449) 86.67%, rgba(10, 11, 12, .991353) 93.33%, #0a0b0c 100%);
            opacity: .48;
            -webkit-transform: translateZ(0);

            @include respond-to(sm) {
                background: linear-gradient(180deg, rgba(10, 11, 12, 0) 0%, rgba(10, 11, 12, .0086472) 6.67%, rgba(10, 11, 12, .03551) 13.33%, rgba(10, 11, 12, .0816599) 20%, rgba(10, 11, 12, .147411) 26.67%, rgba(10, 11, 12, .231775) 33.33%, rgba(10, 11, 12, .331884) 40%, rgba(10, 11, 12, .442691) 46.67%, rgba(10, 11, 12, .557309) 53.33%, rgba(10, 11, 12, .668116) 60%, rgba(10, 11, 12, .768225) 66.67%, rgba(10, 11, 12, .852589) 73.33%, rgba(10, 11, 12, .91834) 80%, rgba(10, 11, 12, .96449) 86.67%, rgba(10, 11, 12, .991353) 93.33%, #0a0b0c 100%);
                opacity: .88;
            }

            @include respond-to(sm) {
                height: 100%;
                background: linear-gradient(180deg, rgba(10, 11, 12, 0) 0%, rgba(10, 11, 12, .0086472) 6.67%, rgba(10, 11, 12, .03551) 13.33%, rgba(10, 11, 12, .0816599) 20%, rgba(10, 11, 12, .147411) 26.67%, rgba(10, 11, 12, .231775) 33.33%, rgba(10, 11, 12, .331884) 40%, rgba(10, 11, 12, .442691) 46.67%, rgba(10, 11, 12, .557309) 53.33%, rgba(10, 11, 12, .668116) 60%, rgba(10, 11, 12, .768225) 66.67%, rgba(10, 11, 12, .852589) 73.33%, rgba(10, 11, 12, .91834) 80%, rgba(10, 11, 12, .96449) 86.67%, rgba(10, 11, 12, .991353) 93.33%, #0a0b0c 100%);
                opacity: .88;
            }
        }
    }

    .image {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .container {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .contentSlide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding-left: 2.4rem;
        opacity: 1;
        transform: translate3d(0, 0, 0);

        @include respond-to(xs) {
            display: flex;
            flex-direction: column;
            padding: 0 1.6rem 5.4rem 1.6rem;
        }

        &:global(.content-change-enter) {
            opacity: 0;
            transform: translate3d(2rem, 0, 0);

            @include respond-to(xs) {
                transform: translate3d(0, 0, 0);
            }
        }

        &:global(.content-change-leave-to) {
            opacity: 0;
            transform: translate3d(2rem, 0, 0);

            @include respond-to(xs) {
                transform: translate3d(0, 0, 0);
            }
        }

        &:global(.content-change-enter-active) {
            transition: opacity .3s ease-in 1s, transform .3s ease-in 1s;
        }

        &:global(.content-change-leave-active) {
            transition: opacity .3s ease-in, transform .3s ease-in;
        }
    }

    .info {
        padding-top: 4rem;

        @include respond-to(xs) {
            margin-top: auto;
        }
    }

    .title {
        max-width: 56rem;
        margin-bottom: 2.4rem;
        text-transform: uppercase;

        @include respond-to(xs) {
            width: 100%;
            max-width: unset;
            margin-bottom: 1.2rem;
            font-size: 2.8rem;
            font-weight: 500;
            line-height: 108%;
        }
    }

    .description {
        max-width: 27.3rem;

        @include respond-to(xs) {
            width: 100%;
            max-width: unset;
            font-size: 1.4rem;
            font-weight: 500;
            line-height: 1.8rem;
            opacity: .64;
        }
    }

    .tags {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        max-width: calc(28.6rem + .4rem);
        margin-top: calc(2.4rem - .4rem);
        margin-left: -.4rem;

        @include respond-to(xs) {
            position: absolute;
            top: 1.6rem;
            left: 1.6rem;
            max-width: 100%;
            margin-top: -.4rem;
        }

        & > * {
            margin-top: .4rem;
            margin-left: .4rem;
        }
    }

    .btnWrapper {
        display: flex;
        margin-top: 4.8rem;
        pointer-events: all;

        @include respond-to(sm) {
            position: absolute;
            right: 2.4rem;
            bottom: 2.4rem;
            flex-direction: row-reverse;
        }

        @include respond-to(xs) {
            position: unset;
            width: 100%;
            flex-direction: row;
            margin-top: 3.2rem;
        }
    }

    .btn {
        &:not(:last-child) {
            margin-right: .8rem;
        }

        @include respond-to(sm) {
            &:not(:last-child) {
                margin-right: 0;
            }

            &:last-child {
                margin-right: .8rem;
            }
        }

        @include respond-to(xs) {
            flex: 1;

            &:not(:last-child) {
                margin-right: 1.2rem;
            }

            &:last-child {
                margin-right: 0;
            }
        }

        &.submit {
            position: relative;

            &:after {
                content: "";
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: -1;
                width: 100%;
                height: 100%;
                border-radius: .4rem;
                background-color: $base-0;

                @include respond-to(sm) {
                    display: none;
                }

                @include respond-to(xs) {
                    display: block;
                }
            }
        }
    }

    .pagination {
        position: absolute;
        z-index: 2;
        text-align: center;

        &:global(.swiper-pagination-bullets.swiper-pagination-horizontal) {
            bottom: 2rem;
        }

        &:global(.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet) {
            width: .6rem;
            height: .6rem;
            border-radius: 50%;
            background-color: $white-40;
            opacity: unset;
        }

        &:global(.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet-active) {
            background-color: $base-0;
        }
    }
</style>
