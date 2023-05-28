<template>
    <div :class="$style.ProjectAbout">
        <div :class="[$style.wrapper, 'container']">
            <h3 id="projectAboutTitleMobile"
                :class="[$style.title, $style._mobile, 'h3']">
                <span :class="[$style.titleName, 'c-blue']">{{ name }}</span>
                <span v-if="title"
                      v-html="title"></span>
            </h3>

            <div :class="$style.images">
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
                                <ImageLazy
                                    :class="$style.img"
                                    :image="slide.image_display"
                                    :preview="slide.image_preview"
                                    relative
                                />
                            </div>
                        </div>
                        <div
                            class="swiper-pagination"
                            :class="$style.pagination"
                        >
                        </div>
                    </div>
                </transition>
                <SliderNavigation
                    ref="nav"
                    :class="$style.nav"
                    color="gray"
                    :prev-disabled="activeSlide === 1"
                    :next-disabled="activeSlide === totalSlides"
                >
                    <div :class="[$style.slideCount, 'p6', 'c-base300']">
                        {{ activeSlide }}/{{ totalSlides }}
                    </div>
                </SliderNavigation>
                <VSquareButton :class="$style.fullscreenBtn"
                               :color="$deviceIs.mobile ? 'primary' : 'light'"
                               aria-label="Открыть фотогалерею на весь экран"
                               @click="openImageGalleryModal"
                >
                    <IconFullscreen v-show="!$deviceIs.mobile"
                                    :class="$style.btnIcon" />
                    <IconZoomUp v-show="$deviceIs.mobile"
                                :class="$style.btnIcon" />
                </VSquareButton>
            </div>

            <div ref="description"
                 :class="$style.description">
                <VScrollBox ref="scrollBox"
                            :class="$style.scrollBox"
                            is-relative
                            resizable
                >
                    <h3 id="projectAboutTitle"
                        :class="[$style.title, 'h3']">
                        <span :class="[$style.titleName, 'c-blue']">{{ name }}</span>
                        <span v-html="title"></span>
                    </h3>
                    <p ref="descriptionText"
                       :class="[$style.text, 'p4', 'c-base300']">
                        <transition name="fade-content"
                                    mode="out-in">
                            <span v-if="!isFullDescriptionLoaded || (descriptionFull && !isShowScrollBtn) || isFullDescription"
                                  key="full">{{ descriptionFull }}</span>
                            <span v-else
                                  key="short">{{ descriptionShort }}</span>
                        </transition>
                    </p>
                </VScrollBox>
                <div ref="btns"
                     :class="$style.btns">
                    <VButton v-show="isShowScrollBtn"
                             :class="[$style.btn, $style._mobileResponsive]"
                             :color="$deviceIs.mobile ? 'primary' : 'light'"
                             @click="handleClickMoreBtn">
                        {{ !isFullDescription ? 'Читать больше' : 'Свернуть' }}
                    </VButton>
                    <VButton v-if="video || youtubeId"
                             :class="$style.btn"
                             color="light"
                             @click="openVideoPlayer">
                        Смотреть видео
                    </VButton>
                    <VButton v-if="tourLink"
                             :class="$style.btn"
                             color="light"
                             :link="{ path: '/view', query: { link: tourLink, backLink: $route.path }}"
                             target="_blank">
                        3D-тур
                    </VButton>
                    <VButton v-if="brochure"
                             :class="[$style.btn, $style._mobile, $style._mobileResponsive]"
                             color="dark"
                             :href="brochure"
                             blank>
                        Брошюра по проекту
                    </VButton>
                </div>
                <ul v-if="features && features.length"
                    ref="cards"
                    :class="$style.cards">
                    <li v-for="(item, idx) in features"
                        :key="item.title + idx"
                        :class="$style.card">
                        <div :class="$style.cardHeader">
                            <div :class="$style.cardHeaderIcon"
                                 v-html="item.icon_content"></div>
                            <h6 :class="[$style.cardHeaderTitle, 'p6', 'c-base300']">
                                {{ item.title }}
                            </h6>
                        </div>
                        <p :class="[$style.cardDescription, 'p2']"
                           v-html="item.description"></p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';
    import {scrollTo} from '~/assets/js/utils/commonUtils';
    import variables from '~/assets/scss/shared/_variables.scss';

    import SliderNavigation from '~/components/common/SliderNavigation';
    import ImageLazy from '~/components/common/ImageLazy';
    import VSquareButton from '~/components/ui/buttons/VSquareButton';
    import IconFullscreen from '~/components/icons/IconFullscreen';
    import IconZoomUp from '~/components/icons/IconZoomUp';
    import ImageGalleryModal from '~/components/layout/modals/ImageGalleryModal';
    import VideoPlayerModal from '~/components/layout/modals/VideoPlayerModal';
    import VButton from '~/components/ui/buttons/VButton';

    export default {
        name: 'ProjectAbout',
        components: {
            VButton,
            IconFullscreen,
            IconZoomUp,
            VSquareButton,
            ImageLazy,
            SliderNavigation,
        },

        props: {
            name: {
                type: String,
                default: ''
            },

            title: {
                type: String,
                default: ''
            },

            descriptionShort: {
                type: String,
                default: ''
            },

            descriptionFull: {
                type: String,
                default: ''
            },

            features: {
                type: Array,
                default: () => []
            },

            video: {
                type: String,
                default: ''
            },

            youtubeId: {
                type: String,
                default: ''
            },

            brochure: {
                type: String,
                default: ''
            },

            tourLink: {
                type: String,
                default: ''
            },

            slides: {
                type: Array,
                default: () => [],
            }
        },

        data() {
            return {
                isLoaded: false,
                totalSlides: 1,
                activeSlide: 1,
                isFullDescription: false,
                isFullDescriptionLoaded: false,
                isCheckDescriptionScroll: true,
                isFullDescriptionHaveScroll: false,
            };
        },

        computed: {
            isShowScrollBtn() {
                return Boolean((this.descriptionShort && this.descriptionFull)
                    && this.descriptionShort !== this.descriptionFull
                    && (
                        this.isFullDescriptionLoaded
                        && (!this.isCheckDescriptionScroll || this.isFullDescriptionHaveScroll)
                    ));
            },
        },

        mounted() {
            if (!this.$deviceIs.pc) {
                this.isCheckDescriptionScroll = false;
            } else {
                this.checkScrollForDescription();
            }
            this.calculateScrollBoxHeight();

            this.isLoaded = true;
            this.isFullDescriptionLoaded = true;

            window.addEventListener('resize', this.handleResize);

            if (this.$refs.slider) {
                addResizeListener(this.$refs.slider, this.updateSwiper);
            }
        },

        beforeDestroy() {
            window.removeEventListener('resize', this.handleResize);
            if (this.$refs.slider) {
                removeResizeListener(this.$refs.slider, this.updateSwiper);
            }
            this.slider?.destroy();
        },

        methods: {
            initSlider() {
                if (this.$refs.slider) {
                    const options = {
                        speed: 1000,
                        slidesPerView: 1,
                        allowTouchMove: true,
                        breakpoints: {
                            1280: {
                                allowTouchMove: false
                            }
                        },

                        pagination: {
                            el: '.swiper-pagination',
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

            calculateScrollBoxHeight() {
                if (!this.$refs.scrollBox) {
                    return;
                }

                if (this.$deviceIs.tablet || this.$deviceIs.mobile) {
                    this.$refs.scrollBox.$el.style.maxHeight = 'unset';
                    return;
                }

                this.$refs.scrollBox.$el.style.maxHeight = this.calculateVisibleScrollboxHeight + 'px';
            },

            handleClickMoreBtn() {
                this.isFullDescription = !this.isFullDescription;
                this.calculateScrollBoxHeight();

                if (!this.isFullDescription) {
                    let headerHeight = this.$deviceIs.mobile ? variables['header-mobile-h'] : variables['header-h'];

                    if (headerHeight.includes('rem')) {
                        headerHeight = parseFloat(headerHeight) * 10;
                    } else {
                        headerHeight = parseFloat(headerHeight);
                    }

                    if (this.$deviceIs.tablet) {
                        scrollTo('projectAboutTitle', headerHeight);
                        return;
                    }

                    if (this.$deviceIs.mobile) {
                        scrollTo('projectAboutTitleMobile', headerHeight);
                    }
                }
            },

            openImageGalleryModal() {
                this.$modal.open(ImageGalleryModal, {
                    slides: this.slides,
                    title: this.name,
                    initialSlide: this.activeSlide,
                    image_path: 'image_display',
                    preview: 'image_preview',
                });
            },

            openVideoPlayer() {
                this.$modal.open(VideoPlayerModal, {
                    src: this.video,
                    title: this.name,
                    youtubeId: this.youtubeId,
                });
            },

            calculateVisibleScrollboxHeight() {
                if (this.$refs.description && this.$refs.btns && this.$refs.cards) {
                    return this.$refs.description.offsetHeight - this.$refs.btns.offsetHeight - this.$refs.cards.offsetHeight;
                }
            },

            checkScrollForDescription() {
                if (this.$refs.descriptionText) {
                    this.isFullDescriptionHaveScroll = this.$refs.descriptionText.offsetHeight > this.calculateVisibleScrollboxHeight();
                }
            },

            handleResize() {
                requestAnimationFrame(() => {
                    if (!this.isCheckDescriptionScroll) {
                        return;
                    }

                    this.isCheckDescriptionScroll = false;
                });
            }
        },
    };
</script>

<style lang="scss" module>
    .ProjectAbout {
        //
    }

    .wrapper {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        height: 74.1rem;
        padding-top: 2.4rem;
        padding-bottom: 2.4rem;

        @include respond-to(sm) {
            height: auto;
            flex-direction: column;
        }

        @include respond-to(xs) {
            padding-top: 4rem;
            padding-bottom: 4rem;
        }
    }

    .btnIcon {
        width: 1.6rem;
        height: 1.6rem;
    }

    .images {
        position: relative;
        overflow: hidden;
        width: 40%;
        height: 100%;
        margin-right: 7.2rem;
        border-radius: .8rem;

        @include respond-to(sm) {
            width: 100%;
            height: 57vh;
            margin-right: 0;
            margin-bottom: 3.2rem;
        }

        @include respond-to(xs) {
            height: 40vh;
        }
    }

    .swiper {
        width: 100%;
        height: 100%;
    }

    .pagination {
        position: absolute;
        z-index: 2;
        display: none;
        text-align: center;
        opacity: 1;

        &:global(.swiper-pagination-bullets.swiper-pagination-horizontal) {
            bottom: 1.2rem;
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

        @include respond-to(xs) {
            display: block;
        }
    }

    .nav {
        position: absolute;
        right: 2.4rem;
        bottom: 2.4rem;
        z-index: 1;

        @include respond-to(xs) {
            display: none;
        }
    }

    .fullscreenBtn {
        position: absolute;
        bottom: 2.4rem;
        left: 2.4rem;
        z-index: 1;

        @include respond-to(xs) {
            right: 1.2rem;
            bottom: 1.2rem;
            left: unset;
        }
    }

    .img {
        width: 100%;
        height: 100%;

        &:after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            display: none;
            width: 100%;
            height: 6rem;
            background: linear-gradient(180deg, rgba(10, 11, 12, 0) 0%, rgba(10, 11, 12, .0086472) 6.67%, rgba(10, 11, 12, .03551) 13.33%, rgba(10, 11, 12, .0816599) 20%, rgba(10, 11, 12, .147411) 26.67%, rgba(10, 11, 12, .231775) 33.33%, rgba(10, 11, 12, .331884) 40%, rgba(10, 11, 12, .442691) 46.67%, rgba(10, 11, 12, .557309) 53.33%, rgba(10, 11, 12, .668116) 60%, rgba(10, 11, 12, .768225) 66.67%, rgba(10, 11, 12, .852589) 73.33%, rgba(10, 11, 12, .91834) 80%, rgba(10, 11, 12, .96449) 86.67%, rgba(10, 11, 12, .991353) 93.33%, $base-900 100%);
            opacity: .72;

            @include respond-to(xs) {
                display: block;
            }
        }
    }

    .description {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        flex: 1;
        height: 100%;

        @include respond-to(sm) {
            flex: unset;
            width: 100%;
            height: auto;
        }
    }

    .scrollBox {
        width: 100%;
        max-height: 100%;

        @include respond-to(xs) {
            order: 2;
        }
    }

    .title {
        width: 100%;
        margin-bottom: 2.4rem;
        text-transform: uppercase;

        @include respond-to(xs) {
            display: none;
            font-size: 2.4rem;
            line-height: 2.8rem;
        }

        &._mobile {
            display: none;

            @include respond-to(xs) {
                display: block;
                margin-bottom: 3.2rem;
            }
        }
    }

    .titleName {
        display: block;
    }

    .text {
        white-space: pre-line;

        @include respond-to(xs) {
            font-size: 1.6rem;
        }
    }

    .btns {
        display: flex;
        margin: -.4rem;
        padding-top: 2.4rem;

        @include respond-to(xs) {
            flex-wrap: wrap;
            order: 3;
            width: 100%;
        }
    }

    .btn {
        margin: .4rem;

        @include respond-to(xs) {
            flex: 1;
        }

        &._mobileResponsive {
            @include respond-to(xs) {
                flex: unset;
                order: 10;
                width: 100%;
            }
        }

        &._mobile {
            display: none;

            @include respond-to(xs) {
                display: inline-flex;
            }
        }
    }

    .cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: .8rem;
        width: 100%;
        padding-top: 4.8rem;

        @include respond-to(xs) {
            order: 1;
            grid-template-columns: repeat(2, 1fr);
            margin-bottom: 2.4rem;
            padding-top: 0;
        }
    }

    .card {
        display: flex;
        flex-direction: column;
        min-height: 10.7rem;
        padding: 1.6rem;
        border-radius: 1rem;
        background-color: $base-50;

        @include respond-to(xs) {
            min-height: 9.6rem;
        }
    }

    .cardHeader {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .cardHeaderTitle {
        margin-left: .8rem;
    }

    .cardDescription {
        margin-top: auto;
        color: $base-600;

        @include respond-to(xs) {
            font-size: 1.2rem;
            line-height: 1.6rem;
        }
    }
</style>
