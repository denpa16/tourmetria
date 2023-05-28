<template>
    <transition
        name="modal"
        appear
        @after-enter="$emit('after-enter')"
        @before-leave="$emit('before-leave')"
        @after-leave="$emit('after-leave')"
    >
        <div
            v-if="visible"
            :class="$style.GalleryModal"
        >
            <VSquareButton
                :class="$style.closeButton"
                color="white"
                aria-label="Закрыть"
                @click="onClose"
            >
                <IconCross :class="$style.iconCross" />
            </VSquareButton>
            <div :class="$style.galleryLeft">
                <h4 :class="[$style.galleryTitle, 'h4']">
                    Ход строительства<br>
                    <span class="c-base300">{{ data.projectName }}</span>
                </h4>
                <div :class="$style.gallerySelects">
                    <VSelect
                        :value="yearValue"
                        :options="yearsOptions"
                        bordered
                        @input="onInputYear"
                    />
                    <VSelect
                        :value="monthValue"
                        :options="monthsOptions"
                        bordered
                        @input="onInputMonth"
                    />
                </div>
                <p :class="[$style.galleryDescription, 'p6', 'c-base300']">
                    Ежемесячный отчет приходит вам на почту, а также размещается на страницах проекта и в личном кабинете.
                    Без фотошопа, в срок и с натуральных ракурсов для каждого проекта.
                </p>
            </div>
            <div
                ref="slider"
                :class="[$style.gallerySlider, 'swiper']"
            >
                <h6 :class="$style.progressDate">
                    {{ data.month }} {{ data.year }}
                </h6>
                <div :class="[$style.sliderWrapper, {[$style._loading]: isLoading, [$style._empty]: isEmpty}, 'swiper-wrapper']">
                    <div
                        v-if="isEmpty"
                        :class="[$style.emptyMedia, 'swiper-slide']"
                    >
                        <p :class="['h4', 'c-base300', $style.emptyText]">
                            По заданным параметрам материалы не найдены.
                        </p>
                        <p :class="['h4', $style.emptyText]">
                            Измените параметры и попробуйте снова
                        </p>
                    </div>
                    <div
                        v-for="video in videos"
                        :key="`video-${video.id}`"
                        :class="[$style.slide, $style._video, 'swiper-slide']"
                        @click.stop="openVideoPlayer(video)"
                    >
                        
    
                        <ImageLazy
                            v-if="video.video_image_display"
                            :class="$style.progressImage"
                            :preview="video.video_image_preview"
                            :image="video.video_image_display"
                            relative
                        />

                        <ImageLazy
                            v-else-if="video.youtube_video_id"
                            :class="$style.progressImage"
                            :preview="`//img.youtube.com/vi/${video.youtube_video_id}/maxresdefault.jpg`"
                            :image="`//img.youtube.com/vi/${video.youtube_video_id}/maxresdefault.jpg`"
                            relative
                        />

                        <video
                            v-else
                            :class="$style.progressVideo"
                            preload="metadata"
                            loop
                            playsinline
                            muted
                        >
                            <source
                                :src="`${video.video_file || video.link}#t=1`"
                                type="video/mp4"
                            >
                        </video>
                        <IconPlayVideo :class="$style.videoPlayButton" />
                    </div>
                    <div
                        v-for="photo in photos"
                        :key="`photo-${photo.id}`"
                        :class="[$style.slide,'swiper-slide']"
                    >
                        <ImageLazy
                            :class="$style.progressImage"
                            :image="photo.image_display"
                            :preview="photo.image_preview"
                            relative
                        />
                    </div>

                    <transition name="fade-content">
                        <VSpinner v-if="isLoading"
                                  :class="$style.loader"
                                  size="large"
                                  :color="$deviceIs.pc ? 'white' : 'primary'" />
                    </transition>
                </div>
                <div v-show="videos.length || photos.length"
                     :class="$style.sliderControls">
                    <SliderNavigation
                        ref="nav"
                        :class="$style.nav"
                        color="gray"
                    />
                    <SliderPagination
                        :class="$style.pagination"
                        :nums="paginationNumbers"
                    />
                </div>
            </div>
            <transition name="overlay-appear">
                <VideoPlayerModal
                    v-if="isVideoPlayerShown"
                    :class="$style.videoPlayer"
                    :visible="isVideoPlayerShown"
                    :data="dataForVideoPlayer"
                    @close="onCloseVideoPlayer"
                />
            </transition>
        </div>
    </transition>
</template>

<script>
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';

    import IconCross from '~/components/icons/IconCross';
    import IconPlayVideo from '~/components/icons/IconPlayVideo';
    import ImageLazy from '~/components/common/ImageLazy';
    import SliderNavigation from '~/components/common/SliderNavigation';
    import SliderPagination from '~/components/common/SliderPagination';
    import VideoPlayerModal from '~/components/layout/modals/VideoPlayerModal';
    export default {
        name: 'GalleryModal',
        components: {VideoPlayerModal,
                     IconCross,
                     IconPlayVideo,
                     ImageLazy,
                     SliderNavigation,
                     SliderPagination},

        mixins: [breakpointCheck],
        props: {
            visible: Boolean,

            data: {
                type: Object,
                default: () => ({}),
            },
        },

        data() {
            return {
                isLoading: false,
                monthValue: 'январь',
                yearValue: 2022,
                slider: null,
                activeSlide: 1,
                totalSlides: 1,
                dataForVideoPlayer: {},
                isVideoPlayerShown: false,
                photos: [],
                videos: [],
            };
        },

        computed: {
            specs() {
                return this.data?.specs || {};
            },

            projectSlug() {
                return this.data?.projectSlug || '';
            },

            paginationNumbers() {
                return [this.activeSlide, this.totalSlides];
            },

            monthsOptions() {
                return this.data?.specs?.month || [];
            },

            yearsOptions() {
                return this.data?.specs?.year || [];
            },

            isEmpty() {
                return !this.isLoading && !this.videos?.length && !this.photos?.length;
            }
        },

        async mounted() {
            if (this.data?.month && this.data?.year) {
                this.monthValue = this.data.monthNumber;
                this.yearValue = this.data.year;

                await this.updateMedia();
            }
            this.$nextTick(() => {
                addResizeListener(this.$refs.slider, this.updateSwiper);
            });
        },

        beforeDestroy() {
            removeResizeListener(this.$refs.slider, this.updateSwiper);
            this.slider?.destroy();
        },

        methods: {
            onClose() {
                this.$emit('close');
            },

            initSlider() {
                if (this.$refs.slider) {
                    const options = {
                        speed: 1000,
                        slidesPerView: 1,
                        breakpoints: {
                            1280: {
                                allowTouchMove: false,
                            },

                            0: {
                                allowTouchMove: true,
                            }
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
                        if (!this.slider) {
                            return;
                        }
                        this.activeSlide = this.$refs.slider.swiper.realIndex + 1;
                        this.slider.lazy.load();
                    });
                }
            },

            async getCurrentMedia() {
                const res = await this.$axios.$get(this.$api.progress.gallery, {
                    params: {
                        project: this.projectSlug,
                        year: this.yearValue,
                        month: this.monthValue,
                    }
                });

                if (!Array.isArray(res)) {
                    this.photos = [];
                    this.videos = [];
                    return;
                }

                this.photos = res[0]?.photos || [];
                this.videos = res[0]?.videos || [];
            },

            async updateMedia() {
                this.isLoading = true;
                await this.getCurrentMedia();
                this.isLoading = false;
                this.updateSwiper();
            },

            onInputYear(val) {
                this.yearValue = val;
                this.monthValue = this.monthsOptions[0].value;
                this.updateMedia();
            },

            onInputMonth(val) {
                this.monthValue = val;
                this.updateMedia();
            },

            updateSwiper() {
                this.slider?.destroy();
                this.$nextTick(() => {
                    this.initSlider();
                });
            },

            openVideoPlayer(video) {
                this.dataForVideoPlayer = {
                    src: video.video_file || video.link,
                    title: `${this.data.month} ${this.data.year}`
                };

                if (video.youtube_video_id) {
                    this.dataForVideoPlayer.youtubeId = video.youtube_video_id;
                }

                this.isVideoPlayerShown = true;
            },

            onCloseVideoPlayer() {
                this.isVideoPlayerShown = false;
            }
        },
    };
</script>

<style lang="scss" module>
    .GalleryModal {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 3;
        display: flex;
        width: 100%;
        height: 100%;
        background-color: $base-0;

        @include respond-to(sm) {
            flex-direction: column;
        }
    }

    .closeButton {
        position: absolute;
        top: 2.4rem;
        right: 2.4rem;
        z-index: 2;

        @include respond-to(xs) {
            top: 1.6rem;
            right: 1.6rem;
            width: 4rem;
            height: 4rem;
        }
    }

    .iconCross {
        width: .9rem;
        height: .9rem;
    }

    .galleryLeft {
        width: 33%;
        height: 100%;
        padding: 2.4rem;

        @include respond-to(sm) {
            display: none;
        }
    }

    .galleryTitle {
        margin-bottom: 2.4rem;
        text-transform: uppercase;
    }

    .gallerySelects {
        margin-bottom: 2.4rem;
    }

    .gallerySlider {
        width: 67%;
        height: 100%;

        @include respond-to(sm) {
            width: 100%;
        }
    }

    .sliderWrapper {
        background-color: $base-400;

        @include respond-to(sm) {
            background-color: unset;
        }

        &._loading {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        &._empty {
            background-color: unset;
        }
    }

    .slide {
        @include respond-to(sm) {
            max-height: 53.2rem;
            margin: auto 0;
        }

        @include respond-to(xs) {
            max-height: 32rem;
        }

        &._video {
            cursor: pointer;

            @include hover {
                .videoPlayButton {
                    transform: scale(1.1) translate(-50%, -50%);
                }
            }
        }
    }

    .progressVideo {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .progressImage {
        width: 100%;
        height: 100%;
    }

    .videoPlayButton {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 1;
        width: 7.2rem;
        height: 7.2rem;
        color: $base-0;
        transform: translate(-50%, -50%);
        transition: all $default-transition;

        @include respond-to(sm) {
            width: 5.6rem;
            height: 5.6rem;
        }
    }

    .progressDate {
        display: none;

        @include respond-to(sm) {
            position: absolute;
            top: 2.4rem;
            left: 2.4rem;
            z-index: 2;
            display: block;
            text-transform: uppercase;
            font-size: 2rem;
            font-weight: 600;
            line-height: 2rem;
            color: $base-800;
        }

        @include respond-to(xs) {
            left: 1.6rem;
            font-size: 1.2rem;
            line-height: 1.2rem;
        }
    }

    .emptyMedia {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-transform: uppercase;
    }

    .sliderControls {
        position: absolute;
        bottom: 4.4rem;
        z-index: 1;
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 0 2.4rem;

        @include respond-to(xs) {
            bottom: 2.4rem;
            padding: 0 1.6rem;
        }
    }

    .videoPlayer {
        z-index: 10;
    }
</style>
