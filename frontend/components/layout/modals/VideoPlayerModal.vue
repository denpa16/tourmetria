<template>
    <transition name="overlay-appear"
                @after-leave="$emit('after-leave')">
        <div v-if="visible"
             :class="$style.VideoPlayer">
            <div ref="videoHeader"
                 :class="$style.videoHeader">
                <h4 v-if="data.title && !youtubeId"
                    :class="[$style.videoTitle, 'h4']">
                    {{ data.title }}
                </h4>
                <VSquareButton
                    :class="$style.closeButton"
                    color="white"
                    size="small"
                    aria-label="Закрыть"
                    @click="closeModal"
                >
                    <IconCross :class="$style.iconCross" />
                </VSquareButton>
            </div>
            <video v-if="!youtubeId"
                   ref="video"
                   :poster="data.preview"
                   class="video-js"
                   autoplay
            >
                <source
                    v-if="data.src"
                    :src="data.src"
                    type="video/mp4"
                >
            </video>

            <iframe v-else
                    :class="$style.ytVideo"
                    type="text/html"
                    :src="`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&&color=white&origin=${domain}`"
                    allowfullscreen
                    frameborder="0"></iframe>
        </div>
    </transition>
</template>

<script>
    import {mapGetters} from 'vuex';
    import VSquareButton from '~/components/ui/buttons/VSquareButton';
    import IconCross from '~/components/icons/IconCross';

    export default {
        name: 'VideoPlayerModal',
        components: {IconCross,
                     VSquareButton},

        props: {
            visible: Boolean,

            data: {
                type: Object,
                default: () => ({}),
            },

        },

        data() {
            return {
                player: null,
                defaultOptions: {
                    controls: true,
                    playToggle: true,
                    controlBar: {
                        children: [
                            'currentTimeDisplay',
                            'progressControl',
                            'durationDisplay',
                            'volumePanel',
                            'volumeLevel'
                        ],

                        volumePanel: {
                            inline: false,
                        },
                    },

                    fluid: true,
                },

                options: null
            };
        },

        computed: {
            ...mapGetters('domain', {domain: 'getDomainAddress'}),

            youtubeId() {
                return this.data?.youtubeId || '';
            },
        },

        mounted() {
            this.options = this.data?.options;
            this.$nextTick(this.playerInit);
        },

        beforeDestroy() {
            if (this.player) {
                this.player.dispose();
            }
        },

        methods: {
            playerInit() {
                if (!this.$refs.video) {
                    return;
                }

                this.player = this.$videojs(this.$refs.video, {
                    ...this.defaultOptions,
                    ...this.options,
                });
                const playToggleElement = document.querySelector('.video-js .vjs-play-control');
                const videoHeaderElement = this.$refs.videoHeader;
                this.player.on('useractive', () => {
                    playToggleElement.style.opacity = 1;
                    videoHeaderElement.style.opacity = 1;
                });
                this.player.on('userinactive', () => {
                    if (this.player.paused()) {
                        return;
                    }
                    playToggleElement.style.opacity = 0;
                    videoHeaderElement.style.opacity = 0;
                });
            },

            closeModal() {
                this.$emit('close');
            }
        },
    };
</script>

<style lang="scss" module>
    .VideoPlayer {
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
        width: 100%;
        height: 100%;
        background-color: black;

        :global(.video-js.vjs-fluid) {
            height: 100%;
            padding: 0;
        }

        :global(.video-js .vjs-tech) {
            max-height: 100vh;
        }

        :global(.video-js .vjs-big-play-button) {
            display: none;
        }

        :global(.video-js .vjs-control-bar) {
            display: flex;
            align-items: center;
            height: unset;
            padding: 2.4rem 2.4rem 2.4rem 6.8rem;
            background: unset;
            transition: all $default-transition;

            @include respond-to(xs) {
                padding: 0 1.6rem 1.6rem .4rem;
            }
        }

        :global(.vjs-has-started.vjs-user-inactive.vjs-playing .vjs-control-bar) {
            transition: all $default-transition;
        }

        :global(.video-js button) {
            position: relative;
            display: flex;
            align-items: center;
            width: 4.4rem;
            height: 4.4rem;
            border-radius: .4rem;
            background-color: $base-0;

            @include respond-to(xs) {
                width: 4rem;
                height: 4rem;
            }

            @include hover {
                background-color: $blue;
            }
        }

        :global(.video-js button .vjs-icon-placeholder) {
            position: relative;
            width: 100%;
            height: 100%;

            &:before {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                line-height: unset;
                color: #000;
            }
        }

        :global(.video-js .vjs-current-time),
        :global(.video-js .vjs-duration) {
            position: absolute;
            top: 3.2rem;
            z-index: 1;
            display: block;

            @include respond-to(xs) {
                top: .8rem;
            }

            span {
                font-family: $base-font;
                font-size: 12px;
                font-weight: 600;
                line-height: 16px;
                color: $base-800;
            }
        }

        :global(.video-js .vjs-current-time) {
            left: 8rem;

            @include respond-to(xs) {
                left: 1.8rem;
            }

            span {
                color: $base-800;
            }
        }

        :global(.video-js .vjs-duration) {
            right: 7.5rem;

            @include respond-to(xs) {
                right: 6.8rem;
            }

            span {
                color: $base-300;
            }
        }

        :global(.video-js .vjs-progress-holder) {
            height: 4.4rem;
            border-radius: .4rem;

            @include respond-to(xs) {
                height: 4rem;
            }
        }

        :global(.video-js .vjs-play-progress) {
            position: relative;
            border-radius: .4rem 0 0 .4rem;
            border-bottom: .3rem solid $blue;
            background-color: $base-50;

            &:before {
                display: none;
            }
        }

        :global(.video-js .vjs-progress-holder .vjs-load-progress div) {
            border-radius: .4rem 0 0 .4rem;
        }

        :global(.video-js .vjs-volume-panel.vjs-volume-panel-vertical) {
            max-height: 4.4rem;

            @include respond-to(xs) {
                max-height: 4rem;
            }
        }

        :global(.video-js .vjs-volume-panel .vjs-volume-control.vjs-volume-vertical) {
            width: 4.4rem;
            border-radius: .4rem;
            background-color: $base-0;

            @include respond-to(xs) {
                width: 4rem;
            }
        }

        :global(.video-js .vjs-volume-panel .vjs-volume-control) {
            margin-left: -.9rem;

            @include respond-to(xs) {
                margin-left: -.5rem;
            }
        }

        :global(.video-js .vjs-volume-vertical) {
            bottom: 12rem;
        }

        :global(.vjs-volume-bar.vjs-slider-vertical) {
            //overflow: hidden;
            width: 100%;
            height: 11.1rem;
            margin: 0;
            border-radius: .4rem;
            background-color: $base-0;
        }

        :global(.vjs-slider-vertical .vjs-volume-level) {
            overflow: hidden;
            width: 100%;
            border-radius: 0 0 .4rem .4rem;
            border-right: 3px solid $blue;
            background-color: $base-50;

            &:before {
                display: none;
            }
        }

        :global(.video-js .vjs-play-control) {
            position: absolute;
            bottom: 2.4rem;
            left: 2.4rem;
            transition: all $default-transition;

            @include respond-to(xs) {
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }

    .videoHeader {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 2.4rem;
        transition: all $default-transition;

        @include respond-to(xs) {
            padding: 1.6rem;
        }
    }

    .videoTitle {
        text-transform: uppercase;
        color: $base-0;

        @include respond-to(xs) {
            font-size: 2rem;
            line-height: 2rem;
        }
    }

    .closeButton {
        margin-left: auto;
    }

    .iconCross {
        width: .8rem;
        height: .8rem;
        color: #000;
    }

    .video-js {
        position: absolute;
        top: 0;
        left: 0;
        max-width: 100vw;
        max-height: 100vh;
    }

    .ytVideo {
        width: 100%;
        height: 100%;

        @include respond-to(sm) {
            position: absolute;
            top: 50%;
            width: 100vw;
            height: 50vw;
            transform: translateY(-50%);
        }
    }
</style>
