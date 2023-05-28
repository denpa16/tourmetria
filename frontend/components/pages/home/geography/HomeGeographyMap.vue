<template>
    <div
        ref="imageContainer"
        :class="[$style.HomeGeographyMap, {[$style._modal]: isModal}]"
    >
        <component
            :is="component"
            resizible
            :forced-param="windowRatio"
            :class="$style.body"
        >
            <div ref="wrapper"
                 :class="$style.wrapper"
                 :style="position"
            >
                <div :class="$style.preview"
                     :style="previewStyle"
                >
                    <img ref="image"
                         :src="image"
                         :class="[$style.origin, {[$style._loaded] : isLoaded}]"
                         alt="Карта"
                         @load="handleImageLoad"
                    >
                </div>

                <div
                    v-for="point in cssPoints"
                    :ref="`point-${point.id}`"
                    :key="point.id"
                    :class="$style.pinWrapper"
                    :style="{top: `${point.top}%`, left: `${point.left}%`, transform: `scale(${scaleValue})`}"
                >
                    <HomeGeographyPoint
                        :class="$style.pin"
                        :active="point.id === activePointId"
                        :pin="point"
                        :active-stage="activeStage"
                        @enter="onPointEnter"
                        @leave="onPointLeave"
                        @click="onPointClick($event)"
                    />
                </div>
                <transition
                    name="fade-slow"
                    mode="out-in"
                >
                    <div
                        v-if="activePin && activePin.polygon"
                        :key="`polygon-${activePin.id}`"
                        :class="$style.polygonWrapper"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg"
                             :viewBox="`0 0 ${imageWidth} ${imageHeight}`"
                             :class="$style.polygonSvg"
                        >
                            <g
                                :class="$style.polygon"
                                v-html="activePin.polygon"
                            />
                        </svg>
                    </div>
                </transition>
            </div>
        </component>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';
    import HomeGeographyPoint from '~/components/pages/home/geography/HomeGeographyPoint';

    export default {
        name: 'HomeGeographyMap',

        components: {HomeGeographyPoint},

        props: {
            preview: {
                type: String,
                required: true,
                default: '',
            },

            image: {
                type: String,
                required: true,
                default: '',
            },

            imageWidth: {
                type: Number,
                default: 0
            },

            imageHeight: {
                type: Number,
                default: 0
            },

            points: {
                type: Array,
                required: true,
                default: () => [],
            },

            activeStage: {
                type: String,
                default: '',
            },

            isModal: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                iw: 1,
                ih: 1,
                ww: 1,
                wh: 1,
                isLoaded: false,
                isTicking: false,
                activePointId: null,
                activePin: null,
                timer: null
            };
        },

        computed: {
            imageRatio() {
                return this.iw / this.ih;
            },

            windowRatio() {
                return this.ww / this.wh;
            },

            position() {
                if (this.windowRatio > this.imageRatio) {
                    return {
                        width: this.iw + 'px',
                        height: this.ih + 'px',
                        transform: `scale(${this.ww / this.iw}) translate(0px, ${(this.wh - (this.ih * this.ww / this.iw)) / 2}px)`,
                    };
                }
                return {
                    width: this.iw + 'px',
                    height: this.ih + 'px',
                    transform: `scale(${this.wh / this.ih})`,
                    // translate(${(this.ww - (this.iw * this.wh / this.ih)) / 2}px, 0px)
                };
            },

            scaleValue() {
                return this.windowRatio > this.imageRatio ? this.iw / this.ww : this.ih / this.wh;
            },

            previewStyle() {
                return {backgroundImage: `url(${this.preview})`};
            },

            cssPoints() {
                return this.points.map((point, i) => ({
                    id: point?.id || i,
                    title: point?.name,
                    slug: point?.slug,
                    left: this.activeStage === 'districts' ? point?.main_page_geography_point[0] : point?.region_geography_point[0],
                    top: this.activeStage === 'districts' ? point?.main_page_geography_point[1] : point?.region_geography_point[1],
                    count: point?.total_projects,
                    secondCount: this.activeStage === 'districts' ? point?.total_cities : point?.total_flats,
                    polygon: this.activeStage === 'districts' ? point?.main_page_geography_hover : point?.region_geography_hover,
                    type: this.activeStage === 'districts' ? 'districts' : 'cities',
                }));
            },

            component() {
                return this.isModal ? 'VScrollBox' : 'div';
            }
        },

        mounted() {
            this.imgEl = new Image();
            this.imgEl.addEventListener('load', this.handleImageLoad);
            this.imgEl.src = this.image;
            window.addEventListener('resize', this.handleResize);
        },

        beforeDestroy() {
            this.imgEl.removeEventListener('load', this.handleImageLoad);
            window.removeEventListener('resize', this.handleResize);
        },

        methods: {
            ...mapActions(['setCurrentCity']),

            changeCity(slug, title) {
                const city = {
                    value: slug ?? '',
                    label: title ?? '',
                };

                this.setCurrentCity(city);
            },

            handleImageLoad() {
                const iw = this.$refs.image?.naturalWidth;
                const ih = this.$refs.image?.naturalHeight;
                const ww = this.$parent.$refs?.container?.offsetWidth;
                const wh = this.$parent.$refs?.container?.offsetHeight;

                this.iw = iw;
                this.ih = ih;
                this.ww = ww;
                this.wh = wh;

                this.$nextTick(() => {
                    this.isLoaded = true;
                    this.$emit('load');
                });

                this.centerImage();
            },

            handleResize() {
                if (!this.isTicking) {
                    this.isTicking = true;
                    requestAnimationFrame(this.updateWindowSize);
                }
            },

            updateWindowSize() {
                this.wh = this.$parent.$refs?.container?.offsetHeight;
                this.ww = this.$parent.$refs?.container?.offsetWidth;
                this.isTicking = false;
            },

            handleMousePointHover(id) {
                this.activePointId = id;
            },

            centerImage() {
                if (this.$refs.imageContainer && this.$deviceIs.mobile) {
                    this.$refs.imageContainer.scrollLeft = this.$refs.imageContainer.offsetWidth/3.5;
                }
            },

            onPointClick(event) {
                clearTimeout(this.timer);
                this.$emit('click', event);

                if (event.type === 'cities') {
                    this.changeCity(event?.slug, event?.title);
                }
            },

            onPointEnter(pin) {
                clearTimeout(this.timer);
                this.activePin = pin;
                const pointElement = this.$refs[`point-${pin.id}`];
                if (pointElement) {
                    pointElement[0].style.zIndex = 2;
                }
                this.$emit('pointEnter', pin);
            },

            onPointLeave() {
                const pointElement = this.$refs[`point-${this.activePin.id}`];

                this.timer = setTimeout(() => {
                    if (pointElement[0]) {
                        pointElement[0].style.zIndex = 1;
                    }
                }, 300);
                this.activePin = null;
                this.$emit('pointLeave');
            }
        },

    };
</script>

<style lang="scss" module>
    .HomeGeographyMap {
        overflow: hidden;
        width: 100%;
        height: 100%;
        scrollbar-width: none;
        -ms-overflow-style: none;

        &::-webkit-scrollbar {
            display: none;
        }

        &._modal {
            @include respond-to(sm) {
                overflow-x: scroll;

                .pin {
                    pointer-events: auto;
                }
            }

            .wrapper {
                position: relative;
            }

            :global(.v-scrollbox__content) {
                padding: 0;
            }

            :global(.c-scrollbar) {
                bottom: 2.4rem;

                @include respond-to(xs) {
                    bottom: 1.6rem;
                }
            }

            :global(.v-scrollbox__wrapper) {
                overflow-x: auto;
                overflow-y: hidden;
            }

            :global(.c-scrollbar._horizontal) {
                width: calc(100% - 4.8rem);
                height: .4rem;
                margin-left: 2.4rem;
                border-radius: .4rem;
                background: rgba(255, 255, 255, .32);

                @include respond-to(xs) {
                    width: calc(100% - 4rem);
                    margin-left: 2rem;
                }
            }

            :global(.c-scrollbar._horizontal .c-scrollbar__thumb) {
                height: .4rem;
                border-radius: .4rem;
                background: $base-200;
            }
        }
    }

    .body {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .wrapper {
        position: absolute;
        top: 0;
        left: 0;
        transform-origin: 0 0;

        &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 28rem;
            background: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0) 100%);
        }
    }

    .preview {
        width: auto;
        height: 100%;
        background-size: contain;
    }

    .origin {
        display: block;
        height: 100%;
        opacity: 0;
        transition: opacity .26s linear;

        &._loaded {
            opacity: 1;
        }
    }

    .pin {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);

        @include respond-to(sm) {
            pointer-events: none;
        }
    }

    .pinWrapper {
        position: absolute;
        // top: -10000px;
        // left: -10000px;

        //&:hover {
        //    z-index: 2;
        //}
    }

    .polygonWrapper {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .65);
    }

    .polygonSvg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .polygon {
        position: relative;
        box-shadow: 0 0 80px rgba(0, 158, 174, .32), inset 0 0 83px rgba(47, 174, 196, .3);
        fill: #183b41;
        stroke: $primary-500;
        stroke-width: 2px;
        transition: fill .2s ease-out, opacity $default-transition;
        cursor: pointer;
    }
</style>
