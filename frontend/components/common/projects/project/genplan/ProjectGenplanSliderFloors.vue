<template>
    <div :class="$style.ProjectGenplanSliderFloors">
        <VSquareButton ref="top"
                       :class="[$style.navBtn, $style._top]"
                       :disabled="!nextAvailableFloor"
                       color="light"
                       aria-label="Следующий этаж"
                       shadow
                       @click="nextFloor"
        >
            <IconArrowLeft :class="$style.navIcon" />
        </VSquareButton>

        <transition name="fade-content">
            <div v-show="isLoaded"
                 :style="sliderStyles"
                 :class="$style.sliderWrapper">
                <div ref="floorSlider"
                     class="swiper"
                     :class="$style.slider">
                    <div :class="[$style.wrapper, 'swiper-wrapper']">
                        <div v-for="(slide) in reversedSlides"
                             :key="slide.value"
                             :class="[
                                 $style.slide,
                                 {
                                     [$style._active]: activeFloor === slide.label,
                                     [$style._disabled]: !slide.flat_count,
                                 },
                                 'swiper-slide'
                             ]"
                             @click="changeFloor(slide.label)">
                            <span>{{ slide.label }}</span>
                            <transition name="fade-content">
                                <span v-show="slide.label <= activeFloor + 1 && slide.label >= activeFloor - 1"
                                      :class="[$style.slideProperties, activeFloor === slide.label ? 'c-base300' : 'c-base200']">
                                    {{ slide.flat_count }} кв
                                </span>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <VSquareButton ref="bottom"
                       :class="[$style.navBtn, $style._bottom]"
                       :disabled="!prevAvailableFloor"
                       color="light"
                       aria-label="Предыдущий этаж"
                       shadow
                       @click="prevFloor"
        >
            <IconArrowLeft :class="$style.navIcon" />
        </VSquareButton>

        <ProjectGenplanSliderFloorsTooltip :class="$style.tooltip"
                                           :active-floor="activeFloor"
                                           :next-floor="nextAvailableFloor ? nextAvailableFloor.label : 0"
                                           :prev-floor="prevAvailableFloor ? prevAvailableFloor.label : 0" />
    </div>
</template>

<script>
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';
    import IconArrowLeft from '~/components/icons/IconArrowLeft';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';
    import ProjectGenplanSliderFloorsTooltip
        from '~/components/common/projects/project/genplan/ProjectGenplanSliderFloorsTooltip';

    export default {
        name: 'ProjectGenplanSliderFloors',

        components: {
            ProjectGenplanSliderFloorsTooltip,
            IconArrowLeft,
        },

        mixins: [breakpointCheck],

        props: {
            slides: {
                type: Array,
                default: () => []
            },

            initialFloorNumber: {
                type: Number,
                default: 1
            }
        },

        data() {
            return {
                slider: null,
                isLoaded: false,
                activeFloor: this.initialFloorNumber || 1,
            };
        },

        computed: {
            reversedSlides() {
                const reversedSlides = [...this.slides];
                reversedSlides.reverse();
                return reversedSlides;
            },

            floorsPerView() {
                return this.$deviceIs.mobile || this.$deviceIs.tablet
                    ? 3
                    : this.slides.length > 7
                        ? 7
                        : this.slides.length;
            },

            totalSlides() {
                return Math.ceil(this.slides.length - this.floorsPerView + 1);
            },

            activeSlide() {
                const bottomFloorInView = this.activeFloor - Math.round(this.floorsPerView / 2);

                if (bottomFloorInView > this.totalSlides) {
                    return this.totalSlides;
                }

                if (bottomFloorInView <= 0) {
                    return 0;
                }

                return bottomFloorInView;
            },

            reversedActiveSlide() {
                return (this.totalSlides - 1) - this.activeSlide || 0;
            },

            nextAvailableFloor() {
                return this.slides.slice(this.activeFloor).find(({flat_count}) => flat_count);
            },

            prevAvailableFloor() {
                return this.slides.slice(0, this.activeFloor - 1).reverse()
                    .find(({flat_count}) => flat_count);
            },

            sliderStyles() {
                return {
                    height: this.$deviceIs.pc ? (this.floorsPerView * 4.4) + 'rem' : '4.4rem',
                    width: this.$deviceIs.pc ? '4.4rem' : (this.floorsPerView * 4.4) + 'rem',
                };
            }
        },

        watch: {
            slides() {
                this.updateSwiper();
            },
        },

        mounted() {
            addResizeListener(this.$refs.floorSlider, this.updateSwiper);
            this.isLoaded = true;
        },

        beforeDestroy() {
            removeResizeListener(this.$refs.floorSlider, this.updateSwiper);
            this.slider?.destroy();
        },

        methods: {
            initSlider() {
                if (this.$refs.floorSlider) {
                    const options = {
                        direction: 'horizontal',
                        speed: 1000,
                        slidesPerView: this.floorsPerView,
                        breakpoints: {
                            1280: {
                                direction: 'vertical',
                            },
                        },

                        allowTouchMove: false,
                        initialSlide: this.reversedActiveSlide,
                    };

                    this.slider = new this.$Swiper(this.$refs.floorSlider, options);
                }
            },

            updateSwiper() {
                this.slider?.destroy();
                this.$nextTick(() => {
                    this.initSlider();
                });
            },

            changeFloor(floor) {
                if (!floor.flat_count) {
                    return;
                }
                this.activeFloor = floor.label;
                this.slider.slideTo(this.reversedActiveSlide);
                this.$emit('change', floor.value);
            },

            nextFloor() {
                const nextFloor = this.activeFloor === this.slides.length || !this.nextAvailableFloor ? this.activeFloor : this.nextAvailableFloor;
                if (nextFloor !== this.activeFloor) {
                    this.changeFloor(nextFloor);
                }
            },

            prevFloor() {
                const prevFloor = this.activeFloor === 1 || !this.prevAvailableFloor ? this.activeFloor : this.prevAvailableFloor;
                if (prevFloor !== this.activeFloor) {
                    this.changeFloor(prevFloor);
                }
            },
        }
    };
</script>

<style lang="scss" module>
    .ProjectGenplanSliderFloors {
        position: relative;

        @include respond-to(sm) {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .sliderWrapper {
        @include respond-to(sm) {
            margin-right: .8rem;
            margin-left: .8rem;
        }
    }

    .slider {
        width: 100%;
        height: 100%;
        padding-right: 12rem;

        @include respond-to(sm) {
            margin-right: 0;
            margin-left: 0;
            padding-right: 0;
            border-radius: .4rem;
            box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
        }
    }

    .slide {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4.4rem;
        height: 4.4rem;
        background-color: $base-50;
        transition: all $default-color-transition;
        user-select: none;
        cursor: pointer;

        @include hover {
            color: $blue;
        }

        &._active {
            border-radius: .4rem;
            background-color: $blue;
            font-weight: 600;
            color: $base-0;
        }

        &._disabled {
            color: $base-200;
            cursor: not-allowed;
        }
    }

    .slideProperties {
        position: absolute;
        top: 50%;
        right: -.8rem;
        padding: 1.3rem 1.2rem 1.1rem;
        white-space: nowrap;
        transform: translateX(100%) translateY(-50%);

        @include respond-to(sm) {
            display: none;
        }
    }

    .navigation {
        position: absolute;
        top: 50%;
        left: 0;
        z-index: 2;
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 0 1.6rem;
        transform: translateY(-50%);

        @include respond-to(xs) {
            display: none;
        }
    }

    .navBtn {
        &._top {
            margin-bottom: .8rem;

            @include respond-to(sm) {
                margin-bottom: 0;
            }

            .navIcon {
                transform: rotate(90deg);

                @include respond-to(sm) {
                    transform: rotate(0);
                }
            }
        }

        &._bottom {
            margin-top: .8rem;

            @include respond-to(sm) {
                margin-top: 0;
            }

            .navIcon {
                transform: rotate(-90deg);

                @include respond-to(sm) {
                    transform: rotate(180deg);
                }
            }
        }
    }

    .navIcon {
        width: 1.2rem;
        height: 1.2rem;
    }

    .tooltip {
        position: absolute;
        top: -1.6rem;
        left: 50%;
        display: none;
        transform: translateY(-100%) translateX(-50%);

        @include respond-to(sm) {
            display: flex;
        }
    }
</style>
