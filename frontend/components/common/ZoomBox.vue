<template>
    <div ref="component"
         :class="$style.ZoomBox">
        <div ref="zoomWrapper"
             :class="[
                 $style.zoomWrapper,
                 {
                     [$style._zoomActive]: currentZoom !== minZoom,
                     [$style._grabbing]: isGrabbing,
                 }
             ]"
             :style="zoomWrapperStyles"
             @mousedown="onMouseDown"
             @touchstart="onMouseDown">

            <slot></slot>
        </div>

        <ZoomControls v-if="!hiddenControls"
                      color="white"
                      :class="[$style.zoomControls, zoomControlsClass]"
                      :zoom-in-disabled="roundedZoom === maxZoom"
                      :zoom-out-disabled="roundedZoom === minZoom"
                      shadow
                      @click-zoom-in="handleZoomIn"
                      @click-zoom-out="handleZoomOut" />
    </div>
</template>

<script>
    import ZoomControls from '~/components/common/ZoomControls';

    export default {
        name: 'ZoomBox',

        components: {
            ZoomControls,
        },

        props: {
            value: {
                type: Number,
                default: 0,
            },

            forceScrollToTop: {
                type: [Number, String, Boolean],
                default: 0,
            },

            initialTop: {
                type: Number,
                default: 0,
            },

            initialLeft: {
                type: Number,
                default: 0,
            },

            zoomStep: {
                type: Number,
                default: 0.1
            },

            minZoom: {
                type: Number,
                default: 1
            },

            maxZoom: {
                type: Number,
                default: 3
            },

            firstZoom: {
                type: Number,
                default: 0
            },

            zoomControlsClass: {
                type: String,
                default: ''
            },

            hiddenControls: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                isGrabbing: false,
                wrapper: null,
                component: null,

                shiftX: 0,
                shiftY: 0,
                offsetX: 0,
                offsetY: 0,

                zoom: this.value || 1,
                left: 0,
                top: this.initialTop,
                lastForceTopCount: 0,
            };
        },

        computed: {
            currentZoom: {
                get() {
                    return this.value || this.zoom;
                },

                set(newVal) {
                    this.zoom = newVal;
                    this.$emit('change-zoom', newVal);
                }
            },

            roundedZoom() {
                return this.roundFloat(this.currentZoom);
            },

            zoomWrapperStyles() {
                return {
                    transform: `scale(${this.currentZoom})`,
                    top: this.top + 'px',
                    left: this.left + 'px',
                };
            },
        },

        watch: {
            value(val) {
                if (val <= this.minZoom
                    && (
                        parseInt(this.wrapper?.style?.left, 10) || parseInt(this.wrapper?.style?.top, 10)
                    )
                ) {
                    this.left = 0;
                    this.top = 0;
                }
            },

            forceScrollToTop() {
                this.scrollToTop();
            },

            initialTop(val) {
                this.top = val;
            }
        },

        mounted() {
            if (this.$refs.zoomWrapper) {
                this.wrapper = this.$refs.zoomWrapper;
            }

            if (this.$refs.component) {
                this.component = this.$refs.component;
            }

            this.scrollToTop();
        },

        methods: {
            roundFloat(num) {
                return Math.round(num * 10) / 10;
            },

            handleZoomIn() {
                if (this.roundedZoom === this.maxZoom) {
                    return;
                }

                if (this.firstZoom && this.roundedZoom === this.minZoom) {
                    this.currentZoom = this.firstZoom;
                } else {
                    this.currentZoom += this.zoomStep;
                }
            },

            handleZoomOut() {
                if (this.roundedZoom === this.minZoom) {
                    return;
                }

                if (this.firstZoom && this.roundedZoom <= this.firstZoom) {
                    this.currentZoom = this.minZoom;
                    this.left = 0;
                    this.top = 0;
                } else {
                    this.currentZoom -= this.zoomStep;
                }
            },


            onMouseDown(evt) {
                if (!this.currentZoom === this.minZoom) {
                    return false;
                }

                if (!this.$deviceIs.pc && !evt.touches?.length) {
                    return;
                }

                this.isGrabbing = true;

                if (!this.$deviceIs.pc) {
                    this.shiftX = evt.touches[0].clientX - window.scrollX;
                    this.shiftY = evt.touches[0].clientY - window.scrollY;
                } else {
                    this.shiftX = evt.clientX - window.scrollX;
                    this.shiftY = evt.clientY - window.scrollY;
                }

                this.offsetX = this.wrapper.offsetLeft;
                this.offsetY = this.wrapper.offsetTop;

                if (!this.$deviceIs.pc) {
                    document.addEventListener('touchmove', this.onMouseMove);
                    document.addEventListener('touchend', this.onMouseUp);
                } else {
                    document.addEventListener('mousemove', this.onMouseMove);
                    document.addEventListener('mouseup', this.onMouseUp);
                }
            },

            onMouseMove(evt) {
                const zoomedImageWidth = this.wrapper.offsetWidth / 2 * (this.currentZoom - 1);
                const zoomedImageHeight = this.wrapper.offsetHeight / 2 * (this.currentZoom - 1);

                let newX; let newY;

                if (!this.$deviceIs.pc) {
                    if (evt.touches?.length === 0) {
                        return;
                    }
                    newX = evt.touches[0].clientX - this.shiftX - window.scrollX + this.offsetX;
                    newY = evt.touches[0].clientY - this.shiftY - window.scrollY + this.offsetY;
                } else {
                    newX = evt.clientX - this.shiftX - window.scrollX + this.offsetX;
                    newY = evt.clientY - this.shiftY - window.scrollY + this.offsetY;
                }


                if (newX <= -zoomedImageWidth) {
                    newX = -zoomedImageWidth;
                } else if (newX >= zoomedImageWidth) {
                    newX = zoomedImageWidth;
                }

                if (newY <= -zoomedImageHeight) {
                    newY = -zoomedImageHeight;
                } else if (newY >= zoomedImageHeight) {
                    newY = zoomedImageHeight;
                }

                this.left = newX;
                this.top = newY;
            },

            onMouseUp() {
                this.isGrabbing = false;
                if (!this.$deviceIs.pc) {
                    document.removeEventListener('touchmove', this.onMouseMove);
                    document.removeEventListener('touchend', this.onMouseUp);
                } else {
                    document.removeEventListener('mousemove', this.onMouseMove);
                    document.removeEventListener('mouseup', this.onMouseUp);
                }
            },

            scrollToTop() {
                if (
                    !this.forceScrollToTop
                    || this.currentZoom <= this.minZoom
                    || !this.component
                    || !this.wrapper
                ) {
                    return;
                }

                let contentHeight = 0;
                const maxTop = ((this.wrapper.offsetHeight * this.currentZoom) - this.component.offsetHeight) / 2;

                if (this.wrapper.firstChild) {
                    contentHeight = this.wrapper.firstChild.offsetHeight;
                } else {
                    contentHeight = this.wrapper.offsetHeight;
                }

                this.top = Math.max(Math.min(((contentHeight - this.component.offsetHeight) / 2) + 100, maxTop), 0);
            }
        }
    };
</script>

<style lang="scss" module>
    .ZoomBox {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;
        user-select: none;
    }

    .zoomWrapper {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        transform: scale(1);
        transition: transform $default-transition;
        touch-action: none;

        &._zoomActive {
            cursor: grab;
        }

        &._grabbing {
            cursor: grabbing;
        }
    }

    .zoomControls {
        position: absolute;
        top: 50%;
        right: 2.4rem;
        z-index: 1;
        transform: translateY(-50%);

        @include respond-to(xs) {
            right: 1.6rem;
        }
    }
</style>
