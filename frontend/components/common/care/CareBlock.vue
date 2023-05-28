<template>
    <div v-if="blocks && blocks.length"
         ref="careBlock"
         :class="$style.CareBlock"
    >
        <div v-show="$deviceIs.pc"
             ref="stickyBlockPc"
             :class="[$style.stickyContainer, {[$style._withBtn]: isActiveBlockInteractive}]"
        >
            <h2 :class="[$style.title, 'h3', 'c-base0']">
                <span class="c-blue">NEO-забота</span><br>
                больше, чем сервис
            </h2>
            <transition :name="isScrollDown ? 'scroll-down' : 'scroll-up'"
                        mode="out-in">
                <CareDescription
                    v-if="activeBlock"
                    :key="activeBlock.title"
                    :class="$style.description"
                    :block="activeBlock"
                />
            </transition>
        </div>
        <div ref="wrapper"
             :class="$style.wrapper"
             @scroll="handleBlockScroll"
             @mouseenter="handleMouseEnter"
             @mouseleave="handleMouseLeave">
            <div ref="content"
                 :class="$style.content">
                <div v-show="!$deviceIs.pc"
                     ref="stickyBlock"
                     :class="$style.stickyContainer"
                >
                    <h2 :class="[$style.title, 'h3', 'c-base0']">
                        <span class="c-blue">NEO-забота</span><br>
                        больше, чем сервис
                    </h2>
                    <transition :name="isScrollDown ? 'scroll-down' : 'scroll-up'"
                                mode="out-in">
                        <CareDescription
                            v-if="activeBlock"
                            :key="activeBlock.title"
                            :class="$style.description"
                            :block="activeBlock"
                        />
                    </transition>
                </div>

                <div :class="$style.scrollContainer">
                    <h2 :class="[$style.title, $style._mobile, 'h3', 'c-base0']">
                        <span class="c-blue">NEO-забота</span><br>
                        создает комфорт<br>
                        до и после покупки
                    </h2>

                    <div v-for="(block, i) in blocks"
                         :key="block.title + i"
                         :class="$style.card"
                    >
                        <ImageLazy
                            ref="img"
                            :class="$style.img"
                            :image="block.image_display"
                            :preview="block.image_preview"
                            :data-index="i"
                            relative
                        />
                        <CareDescription
                            :class="[$style.description, $style._mobile]"
                            :block="block"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div :class="[$style.tooltipButton, {[$style._active]: isShowTooltip}]"
             :style="tooltipPos">
            <transition name="fade"
                        mode="out-in">
                <IconScrollDown v-if="!scrollBlockTop"
                                :class="$style.iconScroll" />
                <IconScrollUp v-else-if="scrollBlockTop === scrollBlockHeight"
                              :class="$style.iconScroll" />
                <IconScroll v-else
                            :class="$style.iconScroll" />
            </transition>
        </div>
    </div>
</template>

<script>
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';
    import ImageLazy from '~/components/common/ImageLazy';
    import CareDescription from '~/components/common/care/CareDescription';
    import IconScroll from '~/components/icons/IconScroll';
    import IconScrollDown from '~/components/icons/IconScrollDown';
    import IconScrollUp from '~/components/icons/IconScrollUp';

    export default {
        name: 'CareBlock',
        components: {IconScrollUp, IconScrollDown, IconScroll, ImageLazy, CareDescription},
        mixins: breakpointCheck,

        props: {
            blocks: {
                type: Array,
                default: () => []
            }
        },

        data() {
            return {
                activeBlockIndex: 0,
                oldScrollBlockTop: 0,
                scrollBlockTop: 0,
                scrollBlockHeight: 0,
                isScrollDown: true,
                oldScroll: 0,
                observer: null,
                isShowTooltip: false,
                tooltipPos: {left: 0, top: 0}
            };
        },

        computed: {
            activeBlock() {
                return this.blocks[this.activeBlockIndex];
            },

            isActiveBlockInteractive() {
                return Boolean(this.activeBlock?.buttons?.text);
            },
        },

        mounted() {
            this.observer = new IntersectionObserver(this.handleObserver, {threshold: [.55, .6, .7, .8, .9, 1]});
            window.addEventListener('scroll', this.handleWindowScroll);
            window.addEventListener('resize', this.updateStickyBlockLeft);
            this.updateStickyBlockLeft();
            this.calculateScrollBlockHeight();

            if (this.$refs.img) {
                this.$refs.img.forEach(img => {
                    if (img.$el) {
                        this.observer.observe(img.$el);
                    } else {
                        this.observer.observe(img);
                    }
                });
            }
        },

        beforeDestroy() {
            this.observer.disconnect();
            window.removeEventListener('scroll', this.handleWindowScroll);
            window.removeEventListener('resize', this.updateStickyBlockLeft);
        },

        methods: {
            handleWindowScroll() {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                this.isScrollDown = currentScroll >= this.oldScroll;
                this.oldScroll = currentScroll;
            },

            handleObserver(e) {
                if (e.length === this.blocks.length) {
                    this.activeBlockIndex = this.findVisibleBlockIndex(e);
                }

                const nextIndex = e.length === 1 ? Number(e[0]?.target?.dataset?.index) : this.findVisibleBlockIndex(e);

                if (this.activeBlockIndex === nextIndex) {
                    return;
                }

                if (this.isScrollDown) {
                    if (nextIndex > this.activeBlockIndex) {
                        this.activeBlockIndex = nextIndex;
                    }
                    return;
                }

                if (nextIndex < this.activeBlockIndex) {
                    this.activeBlockIndex = nextIndex;
                }
            },

            findVisibleBlockIndex(blocks) {
                const blocksLastIndex = blocks.length - 1;
                const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

                if (blocks[0].boundingClientRect.top >= viewportHeight) {
                    return 0;
                }

                if (blocks[blocksLastIndex].boundingClientRect.bottom < 0) {
                    return blocksLastIndex;
                }

                return blocks.reduce((res, block) => {
                    if (block.intersectionRatio > res.intersectionRatio) {
                        return {
                            intersectionRatio: block.intersectionRatio,
                            index: Number(block.target.dataset.index)
                        };
                    }
                    return res;
                }, {
                    intersectionRatio: 0,
                    index: 0
                }).index;
            },

            handleBlockScroll(e) {
                const {target} = e;

                this.oldScrollBlockTop = this.scrollBlockTop;
                this.scrollBlockTop = target?.scrollTop || 0;

                this.isScrollDown = this.scrollBlockTop >= this.oldScrollBlockTop;
            },

            updateStickyBlockLeft() {
                const stickyBlock = this.$refs.stickyBlockPc;
                const content = this.$refs.content;

                if (!stickyBlock || !content) {
                    return;
                }

                if (this.$deviceIs.pc) {
                    const contentClientRect = content.getBoundingClientRect();
                    stickyBlock.style.left = contentClientRect?.left + 'px';
                    this.calculateScrollBlockHeight();
                } else {
                    stickyBlock.style.left = 0;
                }
            },

            calculateScrollBlockHeight() {
                if (!this.$refs.wrapper) {
                    this.scrollBlockHeight = 0;
                }
                this.scrollBlockHeight = this.$refs.wrapper.scrollHeight - this.$refs.wrapper.offsetHeight;
            },

            handleMouseEnter() {
                this.isShowTooltip = true;
                window.addEventListener('mousemove', this.followCursor);
            },

            handleMouseLeave() {
                this.isShowTooltip = false;
                window.removeEventListener('mousemove', this.followCursor);
            },

            followCursor(e) {
                const x = e.pageX - this.$refs.careBlock?.offsetLeft;
                const y = e.pageY - this.$refs.careBlock?.offsetTop;
                this.tooltipPos = {
                    left: x + 10 + 'px',
                    top: y + 10 + 'px',
                };
            },
        }
    };
</script>

<style lang="scss" module>
    $stickyContentHeight: 41.6rem;
    $stickyContentHeightTablet: 75vh;
    $stickyContentMaxHeightTablet: 34.9rem;

    .CareBlock {
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 46.4rem;
        min-height: 46.4rem;
        background-color: $base-800;

        @include respond-to(sm) {
            overflow: unset;
            height: auto;
            min-height: 64.7rem;
        }
    }

    .wrapper {
        position: relative;
        z-index: 1;
        overflow: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 2.4rem;
        -ms-overflow-style: none;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }

        @include respond-to(sm) {
            position: static;
            overflow: unset;
            padding: 6.4rem 2.4rem;
            -ms-overflow-style: unset;
            scrollbar-width: unset;

            &::-webkit-scrollbar {
                display: unset;
            }
        }

        @include respond-to(xs) {
            padding: 4rem 1.6rem;
        }
    }

    .content {
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        width: 100%;
        max-width: 105.5rem;
        height: 100%;

        @include respond-to(sm) {
            justify-content: space-between;
        }

        @include respond-to(xs) {
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
        }
    }

    .stickyContainer {
        position: absolute;
        top: 50%;
        left: 0;
        z-index: 0;
        display: flex;
        flex-direction: column;
        height: $stickyContentHeight;
        padding: 3.6rem 0;
        transform: translateY(-50%);

        @include respond-to(sm) {
            position: sticky;
            top: calc(50% - #{$stickyContentMaxHeightTablet} / 2 + #{$header-h} / 2);
            z-index: unset;
            height: $stickyContentMaxHeightTablet;
            padding: 2.8rem 0;
            transform: unset;
        }

        @include respond-to(xs) {
            display: none;
        }

        &._withBtn {
            z-index: 2;

            @include respond-to(sm) {
                z-index: unset;
            }
        }
    }

    .title {
        max-width: 48.3rem;
        text-transform: uppercase;

        @include respond-to(sm) {
            font-size: 2rem;
            line-height: 2.8rem;
        }

        @include respond-to(xs) {
            margin-bottom: 3.2rem;
        }
    }

    .description {
        max-width: 39.7rem;
        margin-top: auto;

        @include respond-to(xs) {
            margin-top: 2.4rem;
        }
    }

    .scrollContainer {
        width: 45.3rem;
        padding-bottom: 2.4rem;

        @include respond-to(sm) {
            width: 34.9rem;
            margin-left: 3.6rem;
            padding-bottom: 0;
        }

        @include respond-to(xs) {
            width: 100%;
            max-width: 35rem;
            margin-left: 0;
        }
    }

    .card {
        margin-bottom: 6.4rem;

        &:last-child {
            margin-bottom: 0;
        }

        @include respond-to(xs) {
            margin-bottom: 4.8rem;
        }
    }

    .img {
        overflow: hidden;
        width: 100%;
        height: $stickyContentHeight;
        border-radius: .8rem;

        @include respond-to(sm) {
            height: $stickyContentHeightTablet;
            max-height: $stickyContentMaxHeightTablet;
        }

        @include respond-to(xs) {
            height: 53vh;
            max-height: 38rem;
        }
    }

    ._mobile {
        display: none;

        @include respond-to(xs) {
            display: block;
        }
    }

    .tooltipButton {
        position: absolute;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 0;
        height: 0;
        border-radius: 50%;
        background-color: $base-0;
        -webkit-backdrop-filter: blur(20px);
        backdrop-filter: blur(20px);
        opacity: 0;
        transition: opacity $default-transition, width .5s ease, height .5s ease;

        @include respond-to(sm) {
            display: none;
        }

        &._active {
            width: 8.2rem;
            height: 8.2rem;
            opacity: .75;
        }
    }

    .iconScroll {
        width: 100%;
        height: 100%;
    }
</style>
