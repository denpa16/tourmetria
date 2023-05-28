<template>
    <div
        ref="missionBlock"
        :class="$style.HomeMission"
    >
        <div ref="containerSticky"
             :class="$style.containerSticky">
            <h3 :class="[$style.missionTitle, 'h3']">
                {{ blockInfo.title }}
            </h3>
            <div ref="videoWrapper"
                 :class="$style.missionVideoWrapper"
                 @click="openVideoPlayer"
                 @mouseenter="handleMouseEnter"
                 @mouseleave="handleMouseLeave"
            >
                <video
                    ref="video"
                    :class="$style.missionVideo"
                    preload="none"
                    loop
                    playsinline
                    muted>
                    <source
                        :src="`${blockInfo.preview_video}#t=1`"
                        type="video/mp4">
                </video>
            </div>
            <p :class="[$style.missionDescription, 'p3']">
                {{ blockInfo.description }}
            </p>
            <IconPlayVideo
                :class="$style.videoPlayButton" />

        </div>
    </div>
</template>

<script>
    import IconPlayVideo from '~/components/icons/IconPlayVideo';
    import VideoPlayerModal from '~/components/layout/modals/VideoPlayerModal';

    export default {
        name: 'HomeMission',
        components: {IconPlayVideo},
        props: {
            blockInfo: {
                type: Object,
                default: () => ({})
            }
        },

        data() {
            return {
                missionBlockElement: null,
                prevElement: null,
                containerStickyElement: null,
                videoWrapperElement: null,
                videoRef: null,
                iconPlayElement: null,
            };
        },

        computed: {},

        mounted() {
            this.missionBlockElement = this.$refs.missionBlock;
            this.prevElement = this.missionBlockElement?.previousElementSibling;
            this.containerStickyElement = this.$refs.containerSticky;
            this.videoWrapperElement = this.$refs.videoWrapper;
            this.videoRef = this.$refs.video;
            this.iconPlayElement = document.querySelector(`.${this.$style.videoPlayButton}`);

            this.handleStartObserve();

            window.addEventListener('scroll', this.handleScroll);
        },

        beforeDestroy() {
            window.removeEventListener('scroll', this.handleScroll);
            window.removeEventListener('mousemove', this.followCursor);
        },

        methods: {
            handleMouseEnter() {
                this.iconPlayElement.style.opacity = 1;
                window.addEventListener('mousemove', this.followCursor);
            },

            handleMouseLeave() {
                this.iconPlayElement.style.opacity = 0;
                window.removeEventListener('mousemove', this.followCursor);
            },

            followCursor(e) {
                const x = e.pageX - this.containerStickyElement.offsetLeft;
                const y = e.pageY - this.missionBlockElement.offsetTop - this.containerStickyElement.offsetTop;
                this.iconPlayElement.style.left = x + 10 + 'px';
                this.iconPlayElement.style.top = y + 10 + 'px';
            },

            handleScroll() {
                const initScale = this.$deviceIs.mobile
                    ? 0.75
                    : this.$deviceIs.tablet
                        ? 0.5
                        : 0.35;

                const MAX_SCALE = 1;
                const diffScale = MAX_SCALE - initScale;
                const headerHeight = document.querySelector('#headerMenu')?.offsetHeight;
                const containerHeight = this.$refs.missionBlock?.offsetHeight;
                const containerClientRect = this.$refs.missionBlock.getBoundingClientRect();
                const currentScale = parseFloat(this.videoWrapperElement.style.transform.split('scale(')[1]);

                let scale;

                if (containerClientRect?.top >= headerHeight) {
                    scale = initScale;
                } else if (-containerClientRect?.top >= containerHeight) {
                    scale = MAX_SCALE;
                } else {
                    const startAxis = (window.innerHeight - headerHeight) / containerHeight;
                    const endAxis = 1;
                    const diffAxis = endAxis - startAxis;

                    scale = initScale + (
                        ((((window.innerHeight - containerClientRect.top) / containerHeight) - startAxis))
                        * (diffScale / diffAxis)
                    );
                }

                if (currentScale === scale) {
                    return;
                }

                this.videoWrapperElement.style.transform = `translate(-50%, -50%) scale(${Math.min(scale, MAX_SCALE)})`;
            },

            openVideoPlayer() {
                const options = {
                    src: this.blockInfo.video,
                    title: this.blockInfo.title
                };
                this.$modal.open(VideoPlayerModal, options);
            },

            handleStartObserve() {
                if (!this.missionBlockElement) {
                    return;
                }

                this.observer = new IntersectionObserver(this.onVisibleload, {
                    threshold: .1,
                });

                this.observer.observe(this.missionBlockElement);

                if (this.prevElement) {
                    this.observer.observe(this.prevElement);
                }
            },

            onVisibleload(entries) {
                const isIntersecting = entries.some(entry => entry?.isIntersecting);

                if (!isIntersecting) {
                    return;
                }

                this.videoRef.play();

                this.observer.unobserve(this.missionBlockElement);

                if (this.prevMortgageEl) {
                    this.observer.unobserve(this.prevElement);
                }
            },
        },
    };
</script>

<style lang="scss" module>
    $containerHeight: calc(100vh - #{$header-h});

    .HomeMission {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: calc(2 * #{$containerHeight});
    }

    .containerSticky {
        position: sticky;
        top: $header-h;
        left: 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: $containerHeight;
        padding: 10.4rem 0 9.6rem;

        @include respond-to(sm) {
            padding: 9.6rem 0 6.4rem;
        }

        @include respond-to(sm) {
            padding: 6.4rem 0;
        }
    }

    .missionTitle {
        text-transform: uppercase;

        @include respond-to(xs) {
            font-size: 2rem;
            line-height: 2.4rem;
        }
    }

    .missionVideoWrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 1;
        overflow: hidden;
        width: 100%;
        height: 100%;
        transform: translate(-50%, -50%) scale(.35);
        cursor: none;

        @include respond-to(sm) {
            height: unset;
            padding: 0 2.4rem;
            aspect-ratio: 16 / 8;
            transform: translate(-50%, -50%) scale(.5);
        }

        @include respond-to(xs) {
            transform: translate(-50%, -50%) scale(.75);
        }

        //Светлая маска поверх видео
        //&:after {
        //    content: "";
        //    position: absolute;
        //    top: 0;
        //    left: 0;
        //    width: 100%;
        //    height: 100%;
        //    background-color: rgba(255, 255, 255, .5);
        //}
    }

    .missionVideo {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .videoPlayButton {
        position: absolute;
        z-index: 1;
        width: 7.2rem;
        height: 7.2rem;
        color: $base-0;
        opacity: 0;
        transition: opacity $default-transition;

        @include respond-to(sm) {
            width: 5.6rem;
            height: 5.6rem;
        }
    }

    //.isVisible {
    //    opacity: 1;
    //}

    .missionDescription {
        max-width: 53.8rem;
        margin-top: auto;
        text-align: center;
        color: $base-500;
        opacity: .48;

        @include respond-to(xs) {
            font-size: 1.4rem;
            line-height: 2rem;
        }
    }

</style>
