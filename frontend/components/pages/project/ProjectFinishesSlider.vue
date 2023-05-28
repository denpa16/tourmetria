<template>
    <div
        :class="$style.ProjectFinishesSlider"
    >
        <transition name="fade-slow">
            <SliderNavigation
                v-show="isFewSlides"
                ref="nav"
                :class="$style.nav"
                :color="$deviceIs.mobile ? 'gray' : 'light'"
                v-bind="sliderNavigationAttrs"
                :next-disabled="activeSlide === slides.length - 1"
                :prev-disabled="activeSlide === 0"
            >
                <div v-if="breakpoint !== 'xs'"
                     :class="[$style.slideCount, 'p6', 'c-base300']">
                    {{ activeSlide + 1 }}/{{ slides.length }}
                </div>
            </SliderNavigation>
        </transition>

        <div :class="$style.leftBottomWrapper">
            <VButton
                :class="$style.button"
                color="primary"
                @click="openModal"
            >
                {{ $deviceIs.mobile ? 'Подробнее' : 'Подробнее об отделке' }}
            </VButton>
            <!--            <VButton-->
            <!--                :class="$style.link"-->
            <!--                color="light"-->
            <!--            >-->
            <!--                3D-тур-->
            <!--            </VButton>-->
        </div>

        <div :class="$style.rightCenterWrapper">
            <ZoomControls
                v-show="!$deviceIs.mobile"
                color="white"
                :class="$style.zoomControls"
                :zoom-in-disabled="currentZoom === maxZoom"
                :zoom-out-disabled="currentZoom === minZoom"
                shadow
                @click-zoom-in="handleZoomIn"
                @click-zoom-out="handleZoomOut" />
        </div>

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
                    <div class="swiper-zoom-container">
                        <div ref="image"
                             :class="[$style.image, 'swiper-zoom-target']">
                            <ImageLazy
                                :image="slide.image_display"
                                :preview="slide.image_preview"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <HintOverlay v-show="($deviceIs.tablet || $deviceIs.mobile)"
                     animation="horizontal"
                     :text="hintOverlayText">
            <template #icon>
                <svg-icon
                    :class="$style.icon"
                    :name="iconName"
                />
            </template>
        </HintOverlay>

        <BenefitModal v-if="isModalVisible"
                      :benefit-list="finishDetails"
                      :chosen-benefit="currentFinishDetail"
                      @close="closeModal" />
    </div>
</template>

<script>
    import {lockBody, unlockBody} from '~/assets/js/utils/lockUtilsMain';
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';

    import ImageLazy from '~/components/common/ImageLazy';
    import SliderNavigation from '~/components/common/SliderNavigation';
    import ZoomControls from '~/components/common/ZoomControls';
    import HintOverlay from '~/components/common/HintOverlay';
    import BenefitModal from '~/components/common/projects/project/benefits/BenefitModal';

    export default {
        name: 'ProjectFinishesSlider',

        components: {
            ImageLazy,
            SliderNavigation,
            ZoomControls,
            HintOverlay,
            BenefitModal,
        },

        mixins: [breakpointCheck],

        props: {
            slides: {
                type: Array,
                default: () => [],
            },

            finishes: {
                type: Array,
                default: () => [],
            },

            value: {
                type: String,
                default: '',
            },

            sliderNavigationAttrs: {
                type: Object,
                default: () => ({}),
            },
        },

        data() {
            return {
                isLoaded: false,
                activeSlide: 0,
                maxZoom: 2,
                minZoom: 1,
                currentZoom: 1,
                slider: null,
                isModalVisible: false,
            };
        },

        computed: {
            isFewSlides() {
                return this.slides?.length > 1;
            },

            hintOverlayText() {
                return this.$deviceIs.mobile ? 'Перемещайтесь, <br> используя 2 пальца' : 'Двигайте фото <br> движением 2-х пальцев';
            },

            iconName() {
                return this.$deviceIs.mobile ? 'fingers' : 'thumb';
            },

            finishDetails() {
                return this.finishes.map(item => ({
                    id: item?.id,
                    image_display: item?.image_display,
                    image_preview: item?.image_preview,
                    category_title: item?.name,
                    title: item?.title,
                    first_description: item?.description,
                }));
            },

            currentFinishDetail() {
                const id = this.finishes.find(item => item.slug === this.value).id;
                return this.finishDetails.find(elem => elem.id === id);
            },
        },

        watch: {
            slides() {
                this.isLoaded = false;
                this.activeSlide = 0;
                this.update();

                if (this.slider) {
                    this.$nextTick(() => {
                        this.slider.slideToLoop(this.activeSlide);
                        this.slider.lazy.load();
                    });
                }

                setTimeout(() => {
                    this.isLoaded = true;
                }, 400);
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
                        zoom: {
                            maxRatio: 2,
                            minRatio: 1,
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

            handleZoomIn() {
                this.currentZoom++;
                this.slider.zoom.in();
            },

            handleZoomOut() {
                this.currentZoom--;
                this.slider.zoom.out();
            },

            update() {
                this.slider?.destroy();
                this.$nextTick(() => {
                    this.initSlider();
                });
            },

            openModal() {
                lockBody();
                this.isModalVisible = true;
            },

            closeModal() {
                unlockBody();
                this.isModalVisible = false;
            },
        }
    };
</script>

<style lang="scss" module>
    .ProjectFinishesSlider {
        position: relative;
        overflow: hidden;
        height: 69.8rem;
        margin-right: -2.4rem;
        margin-left: -2.4rem;
        transition: all .4s;

        @include respond-to(sm) {
            height: 83rem;
        }

        @include respond-to(xs) {
            height: 656px;
            margin-right: -16px;
            margin-left: -16px;
        }
    }

    .nav {
        position: absolute;
        right: 2.4rem;
        bottom: 2.4rem;
        z-index: 2;
        width: 11.3rem;

        @include respond-to(sm) {
            right: 16px;
            bottom: 16px;
        }

        @include respond-to(xs) {
            width: 88px;
            margin-left: 8px;
        }
    }

    .slideCount {
        width: 3rem;
        text-align: center;
        -webkit-user-select: none;
        user-select: none;
    }

    .leftBottomWrapper {
        position: absolute;
        bottom: 2.4rem;
        left: 2.4rem;
        z-index: 2;
        display: flex;

        @include respond-to(xs) {
            bottom: 16px;
            left: 16px;
            width: calc(242 / 375 * 100%);
            max-width: 247px;
        }
    }

    .rightCenterWrapper {
        position: absolute;
        top: 50%;
        right: 2.4rem;
        z-index: 2;
        transform: translateY(-50%);

        @include respond-to(xs) {
            right: 16px;
        }
    }

    .swiper {
        width: 100%;
        height: 100%;
    }

    .slide {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .image {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .button {
        position: relative;
        margin-right: .8rem;

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
        }
    }

    .icon {
        width: 11.2rem;
        height: 6.4rem;

        @include respond-to(xs) {
            width: 128px;
            height: 80px;
        }
    }
</style>
