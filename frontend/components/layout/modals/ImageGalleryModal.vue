<template>
    <transition name="overlay-appear"
                @after-enter="$emit('after-enter')"
                @before-leave="$emit('before-leave')"
                @after-leave="$emit('after-leave')">
        <div v-show="visible"
             :class="['modal', $style.ImageGalleryModal]">

            <div :class="['modal-wrap', $style.wrap]"
                 @click.self="$emit('close')">
                <div :class="$style.content">
                    <div :class="$style.head">
                        <div v-show="$deviceIs.mobile">
                            <transition name="fade-content"
                                        mode="out-in">
                                <h5 v-if="!selectedImg"
                                    :class="[$style.title, 'h4']">
                                    {{ title }}
                                </h5>
                                <div v-else
                                     :class="[$style.backBtn, 'p1']"
                                     @click="handleBackBtnClick"
                                >
                                    <IconArrowLeft :class="$style.backBtnIcon" />
                                    <span>Назад</span>
                                </div>
                            </transition>
                        </div>

                        <h5 v-show="!$deviceIs.mobile"
                            :class="[$style.title, 'h4']">
                            {{ title }}
                        </h5>

                        <div :class="$style.closeBtn">
                            <VSquareButton :color="!$deviceIs.mobile ? 'light' : 'white'"
                                           :size="!$deviceIs.mobile ? 'medium' : 'small'"
                                           aria-label="Закрыть"
                                           @click="$emit('close')">
                                <IconPlus :class="$style.closeBtnIcon" />
                            </VSquareButton>
                        </div>
                    </div>

                    <transition name="fade-content">
                        <div v-show="isLoaded"
                             ref="slider"
                             class="swiper"
                             :class="$style.swiper"
                        >
                            <div class="swiper-wrapper">
                                <div v-for="(slide, i) in slides"
                                     :key="slide[image_path] + i"
                                     :class="$style.slide"
                                     class="swiper-slide"
                                >
                                    <ImageLazy
                                        :class="$style.img"
                                        :image="slide[image_path]"
                                        :preview="slide[preview_path]"
                                        contain
                                        relative
                                    />
                                </div>
                            </div>
                        </div>
                    </transition>

                    <div :class="$style.controls">
                        <SliderPagination :class="$style.pagination"
                                          :nums="[activeSlide, totalSlides]"
                                          color="gray"
                        />
                        <SliderNavigation
                            ref="nav"
                            :class="$style.nav"
                            color="gray"
                            :prev-disabled="activeSlide === 1"
                            :next-disabled="activeSlide === totalSlides"
                        />
                    </div>

                    <transition name="scroll-right">
                        <VScrollBox v-show="!selectedImg"
                                    :class="$style.scrollBox"
                                    :forced-param="visible"
                                    resizable
                        >
                            <div v-for="(slide, i) in slides"
                                 :key="slide[image_path] + i"
                                 :class="$style.imgListItem"
                                 @click="handleImgClick(slide)"
                            >
                                <ImageLazy
                                    :class="$style.img"
                                    :image="slide[image_path]"
                                    :preview="slide[preview_path]"
                                />
                            </div>
                        </VScrollBox>

                    </transition>
                    <transition name="modal-appear">
                        <ImageLazy
                            v-if="selectedImg"
                            :class="[$style.img, $style._selected]"
                            :image="selectedImg[image_path]"
                            :preview="selectedImg[preview_path]"
                            contain
                            relative
                        />
                    </transition>

                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import IconPlus from '~/components/icons/IconPlus';
    import IconArrowLeft from '~/components/icons/IconArrowLeft';
    import SliderNavigation from '~/components/common/SliderNavigation';
    import SliderPagination from '~/components/common/SliderPagination';
    import ImageLazy from '~/components/common/ImageLazy';
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';

    export default {
        name: 'ImageGalleryModal',

        components: {
            IconPlus,
            IconArrowLeft,
            ImageLazy,
            SliderNavigation,
            SliderPagination,
        },

        props: {
            visible: Boolean,

            data: {
                type: Object,
                default: () => ({}),
            },
        },

        data() {
            return {
                selectedImg: null,
                isLoaded: false,
                totalSlides: 1,
                activeSlide: 1,
                currentInitialSlide: this.data?.initialSlide || 0
            };
        },

        computed: {
            title() {
                return this.data.title || '';
            },

            slides() {
                return this.data.slides || [];
            },

            image_path() {
                return this.data.image_path || 'image_display';
            },

            preview_path() {
                return this.data.preview_path || 'preview_display';
            },
        },

        mounted() {
            addResizeListener(this.$refs.slider, this.updateSwiper);
            this.isLoaded = true;
        },

        beforeDestroy() {
            removeResizeListener(this.$refs.slider, this.updateSwiper);
            this.slider?.destroy();
        },

        methods: {
            initSlider() {
                if (this.$refs.slider) {
                    const options = {
                        speed: 1000,
                        slidesPerView: 1,
                        initialSlide: this.currentInitialSlide,
                        allowTouchMove: true,
                        breakpoints: {
                            1280: {
                                allowTouchMove: false
                            }
                        },

                        navigation: {
                            nextEl: this.$refs.next?.$el || this.$refs.next || this.$refs.nav.$refs.next || false,
                            prevEl: this.$refs.prev?.$el || this.$refs.prev || this.$refs.nav.$refs.prev || false,
                        },

                        on: {
                            init: () => {
                                this.activeSlide = (this.currentInitialSlide + 1) || 1;
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
                this.currentInitialSlide = this.activeSlide - 1;
                this.slider?.destroy();
                this.$nextTick(() => {
                    this.initSlider();
                });
            },

            handleImgClick(value) {
                this.selectedImg = value;
            },

            handleBackBtnClick() {
                this.selectedImg = null;
            }
        },
    };
</script>

<style lang="scss" module>
    .ImageGalleryModal {
        z-index: 200;
    }

    .wrap {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .content {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background-color: $base-800;

        @include respond-to(xs) {
            background-color: $base-0;
        }
    }

    .head {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 2.4rem;

        @include respond-to(xs) {
            position: static;
            padding: 1.6rem;
        }
    }

    .title {
        text-transform: uppercase;
        color: $base-0;

        @include respond-to(xs) {
            font-size: 1.6rem;
            line-height: 1;
            color: $base-800;
        }
    }

    .closeBtn {
        //
    }

    .closeBtnIcon {
        width: 1.6rem;
        height: 1.6rem;
        transform: rotate(45deg);
    }

    .img {
        width: 100%;
        height: 100%;

        &._selected {
            display: none;
            flex: 1;
            height: auto;

            @include respond-to(xs) {
                display: block;
            }
        }
    }

    .swiper {
        z-index: 0;
        width: 100%;
        height: 100%;

        &:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
            display: block;
            width: 100%;
            height: 20%;
            background: linear-gradient(180deg, rgba(10, 11, 12, 0) 0%, rgba(10, 11, 12, .0086472) 6.67%, rgba(10, 11, 12, .03551) 13.33%, rgba(10, 11, 12, .0816599) 20%, rgba(10, 11, 12, .147411) 26.67%, rgba(10, 11, 12, .231775) 33.33%, rgba(10, 11, 12, .331884) 40%, rgba(10, 11, 12, .442691) 46.67%, rgba(10, 11, 12, .557309) 53.33%, rgba(10, 11, 12, .668116) 60%, rgba(10, 11, 12, .768225) 66.67%, rgba(10, 11, 12, .852589) 73.33%, rgba(10, 11, 12, .91834) 80%, rgba(10, 11, 12, .96449) 86.67%, rgba(10, 11, 12, .991353) 93.33%, $base-900 100%);
            opacity: .64;
            transform: matrix(1, 0, 0, -1, 0, 0);
        }

        &:after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 1;
            display: block;
            width: 100%;
            height: 20%;
            background: linear-gradient(180deg, rgba(10, 11, 12, 0) 0%, rgba(10, 11, 12, .0086472) 6.67%, rgba(10, 11, 12, .03551) 13.33%, rgba(10, 11, 12, .0816599) 20%, rgba(10, 11, 12, .147411) 26.67%, rgba(10, 11, 12, .231775) 33.33%, rgba(10, 11, 12, .331884) 40%, rgba(10, 11, 12, .442691) 46.67%, rgba(10, 11, 12, .557309) 53.33%, rgba(10, 11, 12, .668116) 60%, rgba(10, 11, 12, .768225) 66.67%, rgba(10, 11, 12, .852589) 73.33%, rgba(10, 11, 12, .91834) 80%, rgba(10, 11, 12, .96449) 86.67%, rgba(10, 11, 12, .991353) 93.33%, $base-900 100%);
            opacity: .64;
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .controls {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 2.4rem;

        @include respond-to(xs) {
            display: none;
        }
    }

    .scrollBox {
        display: none;
        max-height: calc(var(--vh-full-page) - 6.4rem);
        margin-right: 1.6rem;
        margin-left: 1.6rem;

        @include respond-to(xs) {
            display: block;
        }
    }

    .imgListItem {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 32.6rem;
        margin-bottom: .8rem;
        border-radius: .8rem;
        opacity: 1;
        transition: opacity $default-transition;
        cursor: pointer;
        user-select: none;

        &:last-child {
            margin-bottom: 0;
        }

        @include hover {
            opacity: .7;
        }
    }

    .backBtn {
        display: none;
        align-items: center;
        justify-content: flex-start;
        text-transform: uppercase;
        font-size: 1.6rem;
        font-weight: 600;
        line-height: 1;
        opacity: 1;
        transition: opacity $default-transition;
        cursor: pointer;

        @include hover {
            opacity: .7;
        }

        @include respond-to(xs) {
            display: flex;
        }
    }

    .backBtnIcon {
        width: 1.6rem;
        height: 1.6rem;
        margin-right: .4rem;
        color: $blue;
    }
</style>
