<template>
    <section :class="$style.ProjectProgress">
        <h3 :class="[$style.progressTitle, 'h3']">
            Ход строительства <br>
            <span class="c-base300">
                {{ deadlineText }}
            </span>
        </h3>
        <transition name="fade-content">
            <div
                v-show="isLoaded"
                ref="slider"
                :class="[$style.progressSlider, 'swiper']"
            >
                <div :class="[$style.sliderWrapper,'swiper-wrapper']">
                    <div
                        v-for="progress in progressListToShow"
                        :key="progress.id"
                        class="swiper-slide"
                    >
                        <ProgressCard
                            :progress="progress"
                            @cardClicked="onCardClick(progress)"
                        />
                    </div>
                </div>

                <div :class="[$style.pagination, 'swiper-pagination']"></div>

                <div :class="$style.sliderControls">
                    <SliderNavigation
                        ref="nav"
                        :class="$style.nav"
                        color="gray"
                    />
                    <SliderPagination
                        :class="$style.slidePagination"
                        :nums="paginationNumbers"
                    />
                </div>
                <div :class="$style.buttonMore">
                    <VButton
                        color="light"
                        @click="onButtonClick"
                    >
                        Смотреть все
                    </VButton>
                </div>
            </div>
        </transition>

    </section>
</template>

<script>
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';
    import {isDeadlinePassed} from '~/assets/js/utils/numberUtils';
    import {convertToObject} from '~/assets/js/utils/commonUtils';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';

    import ProgressCard from '~/components/common/projects/project/progress/ProgressCard';
    import SliderPagination from '~/components/common/SliderPagination';
    import SliderNavigation from '~/components/common/SliderNavigation';
    import GalleryModal from '~/components/common/projects/project/progress/GalleryModal';
    import ProgressModal from '~/components/common/projects/project/progress/ProgressModal';

    export default {
        name: 'ProjectProgress',
        components: {ProgressCard,
                     SliderPagination,
                     SliderNavigation},

        mixins: [breakpointCheck],
        props: {
            deadlineYear: {
                type: [String, Number],
                default: ''
            },

            deadlineQuarter: {
                type: [String, Number],
                default: ''
            },

            progressList: {
                type: Array,
                default: () => []
            },

            project: {
                type: Object,
                default: () => ({})
            }
        },

        data() {
            return {
                isLoaded: false,
                totalSlides: 1,
                activeSlide: 1,
                slider: null,

                specs: {},
            };
        },

        computed: {
            progressListToShow() {
                return ['sm', 'xs'].includes(this.breakpoint) ? this.progressList.slice(0, 2) : this.progressList;
            },

            deadline() {
                let quarter = 'I';
                switch (this.deadlineQuarter) {
                    case 1:
                        quarter = 'I';
                        break;
                    case 2:
                        quarter = 'II';
                        break;
                    case 3:
                        quarter = 'III';
                        break;
                    case 4:
                        quarter = 'IV';
                        break;
                    default:
                        quarter = 'I';
                }
                return `${quarter} КВ. ${this.deadlineYear}`;
            },

            deadlineText() {
                return isDeadlinePassed(this.deadlineYear, this.deadlineQuarter) ? 'Объект сдан' : `сдача в ${this.deadline}`;
            },

            paginationNumbers() {
                return [this.activeSlide, this.totalSlides];
            },
        },

        beforeDestroy() {
            removeResizeListener(this.$refs.slider, this.updateSwiper);
            this.slider?.destroy();
        },

        mounted() {
            addResizeListener(this.$refs.slider, this.updateSwiper);
            this.isLoaded = true;
            this.getSpecs();
        },

        methods: {
            initSlider() {
                if (this.$refs.slider) {
                    const options = {
                        speed: 1000,
                        slidesPerView: 3,
                        spaceBetween: 16,
                        breakpoints: {
                            1280: {
                                spaceBetween: 16,
                            },

                            768: {
                                slidesPerView: 2,
                                spaceBetween: 16,
                                allowTouchMove: false
                            },

                            320: {
                                slidesPerView: 2,
                                slidesPerGroup: 2,
                                spaceBetween: 12,
                            },
                        },

                        pagination: {
                            el: `.${this.$style.pagination}`,
                            type: 'bullets',
                            clickable: true,
                        },

                        navigation: {
                            nextEl: this.$refs.next?.$el || this.$refs.next || this.$refs.nav.$refs.next || false,
                            prevEl: this.$refs.prev?.$el || this.$refs.prev || this.$refs.nav.$refs.prev || false,
                        },

                        on: {
                            init: () => {
                                this.activeSlide = 1;
                                this.totalSlides = Math.ceil(this.$refs.slider.swiper.slides.length - this.$refs.slider.swiper.params.slidesPerView + 1);
                                if (this.totalSlides < 1) {
                                    this.totalSlides = 1;
                                }
                            },
                        },
                    };

                    this.slider = new this.$Swiper(this.$refs.slider, options);

                    this.slider.on('activeIndexChange', () => {
                        this.activeSlide = this.$refs.slider.swiper.realIndex + 1;
                    });
                }
            },

            async getSpecs() {
                this.specs = convertToObject(await this.$axios.$get(this.$api.progress.specs, {
                    params: {project: this.project?.slug}
                }));
            },

            updateSwiper() {
                if (this.breakpoint !== 'xs') {
                    this.monthValue = '';
                    this.yearValue = 0;
                }
                this.slider?.destroy();
                this.$nextTick(() => {
                    this.initSlider();
                });
            },

            onCardClick(progress) {
                this.$modal.open(GalleryModal, {
                    monthNumber: progress.month_number,
                    month: progress.month,
                    year: progress.year,
                    specs: this.specs,
                    projectName: this.project.name,
                    projectSlug: this.project.slug,
                    deadline: this.deadline
                });
            },

            onButtonClick() {
                this.$modal.open(ProgressModal, {
                    progressList: this.progressList,
                    deadline: this.deadline,
                    specs: this.specs,
                    projectSlug: this.project.slug,
                });
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectProgress {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: $container-width;
        margin: 0 auto;
        padding: 6.4rem 0 4rem;

        @include respond-to(sm) {
            padding: 6.4rem 0 3.2rem;
        }
    }

    .progressTitle {
        margin-bottom: 6.4rem;
        text-align: center;
        text-transform: uppercase;

        @include respond-to(sm) {
            margin-bottom: 3.2rem;
        }

        @include respond-to(xs) {
            margin-bottom: 2.4rem;
            font-size: 2rem;
            line-height: 2.8rem;
        }
    }

    .progressSlider {
        width: 100%;

        &:global(.swiper) {
            padding: 0 2.4rem;

            @include respond-to(xs) {
                padding: 0 1.6rem;
            }
        }
    }

    .sliderWrapper {
        margin-bottom: 4rem;

        @include respond-to(sm) {
            margin-bottom: 3.2rem;
        }

        @include respond-to(xs) {
            margin-bottom: 2.4rem;
        }
    }

    .sliderControls {
        display: flex;
        justify-content: space-between;

        @include respond-to(sm) {
            display: none;
        }
    }

    .pagination {
        position: static;
        display: none;
        width: 100%;
        margin-top: 2.4rem;
        text-align: center;
        transition: opacity .3s linear;

        @include respond-to(xs) {
            display: block;
            margin-bottom: 2.4rem;
        }

        &:global(.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet) {
            width: .6rem;
            height: .6rem;
            border-radius: 50%;
            background-color: $base-400;
            opacity: .4;
        }

        &:global(.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet-active) {
            background-color: #000;
            opacity: 1;
        }
    }

    .buttonMore {
        display: none;

        @include respond-to(sm) {
            display: flex;
            justify-content: center;
            width: 100%;
        }

        @include respond-to(xs) {
            :global(.v-button) {
                width: 100%;
            }
        }
    }
</style>
