<template>
    <div
        ref="box"
        :class="classes"
        class="v-scrollbox"
        :style="styles"
    >

        <div
            ref="placeholder"
            class="v-scrollbox__placeholder"
        >
        </div>

        <div
            ref="wrapper"
            class="v-scrollbox__wrapper"
            @scroll="onScroll"
        >
            <div
                ref="content"
                class="v-scrollbox__content"
            >
                <slot></slot>
            </div>
        </div>

        <div
            v-if="isYOverflowing"
            ref="yRail"
            class="c-scrollbar _vertical"
            :class="`_${yRailPosition}`"
            @mousedown="onRailClick($event, 'y')"
        >
            <div
                ref="yThumb"
                class="c-scrollbar__thumb"
                :style="{height: `${dimensions.yThumbHeight}px`, transform: yScrollPosition}"
                @mousedown="onThumbClick($event, 'y')"
            >
            </div>
        </div>

        <div
            v-if="isXOverflowing"
            ref="xRail"
            class="c-scrollbar _horizontal"
            @mousedown="onRailClick($event, 'x')"
        >
            <div
                ref="xThumb"
                class="c-scrollbar__thumb"
                :style="{width: `${dimensions.xThumbWidth}px`, transform: xScrollPosition}"
                @mousedown="onThumbClick($event, 'x')"
            >
            </div>
        </div>
    </div>
</template>

<script>
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';
    import {getFontSize} from '~/assets/js/utils/commonUtils';

    export default {
        name: 'VScrollBox',

        props: {
            resizable: {
                type: Boolean,
                default: false,
            },

            variableWidth: {
                type: Boolean,
                default: false,
            },

            yRailPosition: {
                type: String,
                default: 'right',
            },

            railColor: {
                type: String,
                default: 'default',
            },

            railOffset: {
                type: Number,
                default: 0,
            },

            styles: {
                type: Object,
                default: () => ({}),
            },

            isAbsolute: Boolean,

            /* Параметр, необходимый для перерисовки скроллбара при изменении контента */
            forcedParam: {
                type: [Number, String, Boolean],
                default: undefined,
            },
        },

        data() {
            return {
                axis: {
                    x: {
                        clientAttr: 'clientX',
                        offsetAttr: 'left',
                        offsetSizeAttr: 'offsetWidth',
                        scrollSizeAttr: 'scrollWidth',
                        scrollOffsetAttr: 'scrollLeft',
                        scrollbarSize: 0,
                        scrollLeft: 0,
                        click: 0,
                    },

                    y: {
                        clientAttr: 'clientY',
                        offsetAttr: 'top',
                        offsetSizeAttr: 'offsetHeight',
                        scrollSizeAttr: 'scrollHeight',
                        scrollOffsetAttr: 'scrollTop',
                        scrollbarSize: 0,
                        scrollTop: 0,
                        click: 0,
                    },
                },

                dimensions: {
                    boxHeight: 0,
                    boxWidth: 0,
                    contentHeight: 0,
                    contentWidth: 0,
                    yRailHeight: 0,
                    yThumbHeight: 0,
                    xRailWidth: 0,
                    xThumbWidth: 0,
                },

                scrollXTicking: false,
                scrollYTicking: false,

                isYOverflowing: false,
                isXOverflowing: false,

                draggingAxis: null,

                eventTimeout: null,
            };
        },

        computed: {
            classes() {
                return [
                    `v-scrollbox--${this.railColor}`,
                    {'is-absolute': this.isAbsolute},
                ];
            },

            yScrollPosition() {
                if (!this.isYOverflowing) {
                    return 0;
                }

                const scrollPercentage =
                    this.axis.y.scrollTop / (this.dimensions.contentHeight - this.dimensions.boxHeight);

                const handleOffset = ~~(
                    (this.dimensions.yRailHeight - this.dimensions.yThumbHeight) *
                    scrollPercentage
                );

                return `translate3d(0, ${handleOffset}px, 0)`;
            },

            xScrollPosition() {
                if (!this.isXOverflowing) {
                    return 0;
                }

                const scrollPercentage =
                    this.axis.x.scrollLeft / (this.dimensions.contentWidth - this.dimensions.boxWidth);

                const handleOffset = ~~(
                    (this.dimensions.xRailWidth - this.dimensions.xThumbWidth) *
                    scrollPercentage
                );

                return `translate3d(${handleOffset}px, 0, 0)`;
            },
        },

        watch: {
            forcedParam() {
                this.$nextTick(() => {
                    this.update();
                });
            },
        },

        mounted() {
            if (this.resizable) {
                addResizeListener(this.$refs.content, this.update);
            } else {
                this.update();
            }

            if (this.variableWidth) {
                window.addEventListener('resize', this.closeBox);
            }

            // this.update();

            // // This is required to detect horizontal scroll. Vertical scroll only needs the resizeObserver.
            // this.mutationObserver = new window.MutationObserver(this.update);

            // this.mutationObserver.observe(this.$refs.content, {
            //     childList: true,
            //     subtree: true,
            //     characterData: true
            // });
        },

        beforeDestroy() {
            if (this.resizable) {
                removeResizeListener(this.$refs.content, this.update);
            }

            if (this.variableWidth) {
                window.removeEventListener('resize', this.closeBox);
            }
        },

        methods: {
            update() {
                const contentHeight = this.$refs.content.scrollHeight;
                const contentWidth = this.$refs.content.scrollWidth;
                // Determine placeholder size
                if (this.variableWidth) {
                    const surplus = 5.6 * getFontSize();
                    this.$refs.placeholder.style.width = `${Math.round(contentWidth + surplus)}px`;
                }
                this.$refs.placeholder.style.height = `${contentHeight}px`;

                const boxWidth = this.$refs.box.offsetWidth;
                const boxHeight = this.$refs.box.offsetHeight;

                this.isXOverflowing = contentWidth > boxWidth;
                this.isYOverflowing = contentHeight > boxHeight;

                this.$nextTick(() => {
                    this.dimensions.boxHeight = boxHeight;
                    this.dimensions.boxWidth = boxWidth;
                    this.dimensions.contentHeight = contentHeight;
                    this.dimensions.contentWidth = contentWidth;


                    if (boxHeight >= contentHeight) {
                        this.$emit('scroll-end', true);
                    } else {
                        this.$emit('scroll-end', false);
                    }

                    if (this.isYOverflowing) {
                        this.dimensions.yRailHeight = this.$refs.yRail.offsetHeight;
                        this.dimensions.yThumbHeight = this.getScrollbarSize('y');
                    }

                    if (this.isXOverflowing) {
                        this.dimensions.xRailWidth = this.$refs.xRail.offsetWidth;
                        this.dimensions.xThumbWidth = this.getScrollbarSize('x');
                    }
                });
            },

            getScrollbarSize(axis = 'y') {
                if ((axis === 'y' && this.isYOverflowing) || (axis === 'x' && this.isXOverflowing)) {
                    const contentSize = this.$refs.content[this.axis[axis].scrollSizeAttr];
                    const trackSize =
                        axis === 'y' ? this.$refs.yRail.offsetHeight : this.$refs.xRail.offsetWidth;

                    const scrollbarRatio = trackSize / contentSize;

                    return Math.max(~~(scrollbarRatio * trackSize), 20);
                }
                return 0;
            },

            onScroll() {
                const scrollPercentage =
                    this.axis.y.scrollTop / (this.dimensions.contentHeight - this.dimensions.boxHeight);
                if (scrollPercentage < 0.02 || scrollPercentage === 0) {
                    this.$emit('scroll-finish', true);
                }

                if (scrollPercentage > 0.02) {
                    this.$emit('scroll-start', true);
                }

                if (!this.scrollXTicking && this.isXOverflowing) {
                    requestAnimationFrame(() => {
                        this.axis.x.scrollLeft = this.$refs.wrapper.scrollLeft;
                        this.scrollXTicking = false;
                    });
                    this.scrollXTicking = true;
                }

                if (!this.scrollYTicking && this.isYOverflowing) {
                    requestAnimationFrame(() => {
                        this.axis.y.scrollTop = this.$refs.wrapper.scrollTop;
                        this.scrollYTicking = false;
                    });
                    this.scrollYTicking = true;

                    this.eventTimeout = setTimeout(() => {
                        clearInterval(this.eventTimeout);
                        const scrollPercentage =
                            this.axis.y.scrollTop / (this.dimensions.contentHeight - this.dimensions.boxHeight);

                        if (scrollPercentage > 0.92) {
                            this.$emit('scroll-end', true);
                        } else {
                            this.$emit('scroll-end', false);
                        }

                        if (scrollPercentage < 0.02) {
                            this.$emit('scroll-top', true);
                        } else {
                            this.$emit('scroll-top', false);
                        }

                        if (scrollPercentage > 0.02) {
                            this.$emit('scroll-start', true);
                        }
                    }, 10);
                }

                this.$emit('on-scroll');
            },

            onThumbClick(e, axis = 'y') {
                if (e.ctrlKey || e.button === 2) {
                    return;
                }
                e.stopImmediatePropagation();

                this.axis[axis].click =
                    e.currentTarget[this.axis[axis].offsetSizeAttr] -
                    (e[this.axis[axis].clientAttr] -
                        e.currentTarget.getBoundingClientRect()[this.axis[axis].offsetAttr]);
                this.draggingAxis = axis;
                document.addEventListener('mousemove', this.onMouseMove);
                document.addEventListener('mouseup', this.onMouseUp);
                document.onselectstart = () => false;
            },

            onMouseMove(e) {
                const prevPage = this.axis[this.draggingAxis].click;
                if (!prevPage) {
                    return;
                }

                const rail = this.draggingAxis === 'y' ? this.$refs.yRail : this.$refs.xRail;
                const thumb = this.draggingAxis === 'y' ? this.$refs.yThumb : this.$refs.xThumb;

                const offset =
                    (rail.getBoundingClientRect()[this.axis[this.draggingAxis].offsetAttr] -
                        e[this.axis[this.draggingAxis].clientAttr]) *
                    -1;
                const thumbClickPosition =
                    thumb[this.axis[this.draggingAxis].offsetSizeAttr] - prevPage;
                const thumbPositionPercentage =
                    ((offset - thumbClickPosition) * 100) /
                    rail[this.axis[this.draggingAxis].offsetSizeAttr];

                this.$refs.wrapper[this.axis[this.draggingAxis].scrollOffsetAttr] =
                    (thumbPositionPercentage *
                        this.$refs.wrapper[this.axis[this.draggingAxis].scrollSizeAttr]) /
                    100;
            },

            onMouseUp(e) {
                e.preventDefault();
                this.axis[this.draggingAxis].click = 0;
                this.draggingAxis = null;
                document.removeEventListener('mousemove', this.onMouseMove);
                document.removeEventListener('mouseup', this.onMouseUp);
                document.onselectstart = null;
            },

            onRailClick(e, axis = 'y') {
                const offset = Math.abs(e.target.getBoundingClientRect()[this.axis[axis].offsetAttr] - e[this.axis[axis].clientAttr]);

                const rail = axis === 'y' ? this.$refs.yRail : this.$refs.xRail;
                const thumb = axis === 'y' ? this.$refs.yThumb : this.$refs.xThumb;
                const thumbHalf = thumb[this.axis[axis].offsetSizeAttr] / 2;

                const thumbPositionPercentage =
                    ((offset - thumbHalf) * 100) / rail[this.axis[axis].offsetSizeAttr];

                this.$refs.wrapper[this.axis[axis].scrollOffsetAttr] =
                    (thumbPositionPercentage * this.$refs.wrapper[this.axis[axis].scrollSizeAttr]) /
                    100;
            },

            closeBox() {
                this.$emit('close');
            },
        },
    };
</script>

<style lang="scss">
    .v-scrollbox {
        position: relative;
        overflow: hidden;

        &.is-absolute {
            position: absolute;
        }

        /* Colors */

        &--default {
            .c-scrollbar__thumb {
                background-color: rgba($base-800, .1);
            }
        }

        /* End colors */

        &__wrapper {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 0;
            box-sizing: border-box;
            overflow: auto;
            width: auto;
            max-width: 100%;
            height: 100%;
            max-height: 100%;
            scrollbar-width: none;
            -ms-overflow-style: none;

            &::-webkit-scrollbar {
                display: none;
                -webkit-appearance: none;
                width: 0;
                height: 0;
            }

            &::-webkit-scrollbar-track {
                background-color: transparent;
            }

            &::-webkit-scrollbar-thumb {
                background-color: transparent;
            }
        }

        &__placeholder {
            width: 100%;
            max-width: 100%;
            max-height: 100%;
            pointer-events: none;
        }

        &__content {
            padding: .2rem;
        }
    }

    .c-scrollbar {
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 1;
        overflow: hidden;
        width: 4px;

        &._horizontal {
            left: 0;
            width: 100%;
            height: 1px;

            .c-scrollbar__thumb {
                bottom: 1px;
                left: 0;
                height: 1px;
            }
        }

        &._vertical {
            top: 0;

            .c-scrollbar__thumb {
                top: 0;
                right: 0;
                width: 4px;
            }

            &._right {
                right: 7px;
            }

            &._left {
                right: auto;
                left: 0;
            }
        }

        &__thumb {
            position: absolute;
            border-radius: 8px;
        }
    }
</style>
