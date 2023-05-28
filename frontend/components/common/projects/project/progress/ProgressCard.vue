<template>
    <article
        :class="[$style.ProgressCard, {[$style['_in-modal']]: inModal}]"
        @click="onCardClick"
    >
        <div :class="$style.progressTags">
            <VTag
                v-if="progress.percent"
                color="white"
                :label="`${progress.percent}%`"
            />
            <VTag
                v-if="progress.tag"
                color="transparent"
                :label="`${progress.tag}`"
            />
        </div>

        <ImageLazy
            :class="$style.progressPhotos"
            :image="progress.image_display"
            :preview="progress.image_preview"
            relative
        />

        <div :class="$style.progressInfo">
            <VSquareButton
                size="xsmall"
                :class="$style.buttonPlus"
                role="presentation"
                tabindex="-1"
            >
                <IconArrowRight :class="$style.iconArrowRight" />
            </VSquareButton>
            <h4 :class="[$style.progressTitle, 'h4']">
                {{ progressDate }}
            </h4>
            <!--            <p :class="[$style.progressSubtitle, 'p6', 'c-base300']">-->
            <!--                Очередь 1-->
            <!--            </p>-->
            <p :class="[$style.progressShortDescription, 'p6', 'c-base300']">
                {{ contentCounter }}
            </p>
        </div>
    </article>
</template>

<script>
    import ImageLazy from '~/components/common/ImageLazy';
    import VideoPlayerModal from '~/components/layout/modals/VideoPlayerModal';
    import IconArrowRight from '~/components/icons/IconArrowRight';
    export default {
        name: 'ProgressCard',
        components: {
            IconArrowRight,
            ImageLazy,
        },

        props: {
            progress: {
                type: Object,
                default: () => ({})
            },

            inModal: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                slider: null
            };
        },

        computed: {
            progressDate() {
                return `${this.progress.month} ${this.progress.year}`;
            },

            contentCounter() {
                const photosStr = this.progress?.photos_count ? `${this.progress.photos_count} фото` : '';
                const videosStr = this.progress?.videos_count ? `${this.progress.videos_count} видео` : '';
                const connectStr = photosStr && videosStr ? ' / ' : '';

                return `${photosStr}${connectStr}${videosStr}`;
            }
        },

        methods: {
            onCardClick() {
                this.$emit('cardClicked');
            },

            openVideoPlayer(video) {
                const options = {
                    src: video.video_file || video.link,
                    title: `${this.progress.month} ${this.progress.year}`
                };
                this.$modal.open(VideoPlayerModal, options);
            }
        },
    };
</script>

<style lang="scss" module>
    .ProgressCard {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        cursor: pointer;

        @include hover {
            .navBtn,
            .pagination {
                opacity: 1;
            }
        }

        &._in-modal {
            margin-bottom: .8rem;

            .progressTags {
                @include respond-to(sm) {
                    display: none;
                }
            }

            .progressPhotos {
                @include respond-to(sm) {
                    height: 29.3rem;
                    margin-bottom: 0;
                }

                @include respond-to(xs) {
                    height: 22rem;
                }

                &:before {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    z-index: 2;
                    width: 100%;
                    border-radius: .8rem;

                    @include respond-to(sm) {
                        height: 100%;
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
                    }
                }
            }

            .progressInfo {
                @include respond-to(sm) {
                    position: absolute;
                    bottom: 2.4rem;
                    left: 1.6rem;
                    z-index: 2;
                    padding: 0;
                    background-color: transparent;
                }
            }

            .progressTitle {
                @include respond-to(sm) {
                    margin-bottom: .4rem;
                    font-size: 1.2rem;
                    line-height: 1.44rem;
                    color: $base-0;
                }
            }

            .buttonPlus {
                @include respond-to(sm) {
                    display: none;
                }
            }

            .videoPlayButton {
                @include respond-to(sm) {
                    display: none;
                }
            }
        }
    }

    .progressTags {
        position: absolute;
        top: 1.6rem;
        left: 1.6rem;
        z-index: 2;
        display: flex;

        & > * {
            margin-right: .4rem;

            &:last-child {
                margin-right: 0;
            }
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .progressPhotos {
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
            margin-bottom: 0;
        }

        &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 8.4rem;
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

        &:before {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 2;
            width: 100%;
            height: 3.5rem;
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
            opacity: .4;

            @include respond-to(xs) {
                height: 100%;
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
            }
        }
    }

    .progressImage {
        width: 100%;
        height: 100%;
    }

    .videoImage {
        width: 100%;
        height: 100%;
    }

    .progressVideo {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .slideVideo {
        @include hover {
            .videoPlayButton {
                transform: scale(1.1) translate(-50%, -50%);
            }
        }
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

        @include respond-to(xs) {
            display: none;
        }

        @include respond-to(sm) {
            width: 5.6rem;
            height: 5.6rem;
        }
    }

    .navBtn {
        position: absolute;
        top: 50%;
        left: 1.6rem;
        z-index: 2;
        opacity: 0;
        transform: translateY(-50%);
        transition: opacity .3s linear;

        @include respond-to(sm) {
            display: none;
        }

        :global(.v-square-button) {
            width: 2.4rem;
            height: 2.4rem;
        }

        &._right {
            right: 1.6rem;
            left: unset;

            .navIcon {
                transform: rotate(180deg);
            }
        }
    }

    .navIcon {
        width: 1.2rem;
        height: 1.2rem;
    }

    .progressInfo {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1 1 auto;
        width: 100%;
        min-height: 11.6rem;
        padding: 2rem 1.6rem;
        border-radius: .8rem;
        background-color: $base-50;

        @include respond-to(xs) {
            position: absolute;
            bottom: 1.6rem;
            left: 1.6rem;
            z-index: 2;
            min-height: unset;
            padding: 0;
            background-color: transparent;
        }
    }

    .progressTitle {
        text-transform: uppercase;

        @include respond-to(xs) {
            margin-bottom: .4rem;
            font-size: 1.2rem;
            line-height: 1.44rem;
            color: $base-0;
        }
    }

    .buttonPlus {
        position: absolute;
        top: 2rem;
        right: 1.6rem;

        @include respond-to(xs) {
            display: none;
        }
    }

    .iconArrowRight {
        width: 1.2rem;
        height: 1.2rem;
    }

    .progressSubtitle {
        @include respond-to(xs) {
            margin-bottom: .4rem;
            font-size: 12px;
            line-height: 16px;
            color: $base-0;
            opacity: .8;
        }
    }

    .progressShortDescription {
        @include respond-to(xs) {
            font-size: 12px;
            line-height: 16px;
            color: $base-0;
            opacity: .8;
        }
    }
</style>
