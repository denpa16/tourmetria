<template>
    <article :class="$style.ProjectGenplanModalContentInfo">
        <div :class="$style.head">
            <div v-if="render && renderPoligons"
                 ref="imageWrapper"
                 key="render"
                 :class="$style.renderWrapper">
                <div ref="wrapper"
                     :class="$style.wrapper"
                     :style="position"
                >
                    <div :class="$style.preview"
                         :style="previewStyle"
                    >
                        <img ref="image"
                             :src="render"
                             :class="[$style.origin, {[$style._loaded] : isLoaded}]"
                             alt="Изображение генплана"
                             @load="handleImageLoad"
                        >
                    </div>

                    <svg xmlns="http://www.w3.org/2000/svg"
                         :viewBox="`0 0 ${renderWidth} ${renderHeight}`"
                         :class="$style.poligonsSvg"
                    >
                        <g ref="poligon"
                           :class="$style.poligon"
                           v-html="renderPoligons"
                        />
                    </svg>
                </div>
            </div>

            <div>
                <h3 :class="[$style.title, 'h4']">
                    {{ title }}
                </h3>
                <p v-if="subtitle"
                   :class="[$style.subtitle, 'p6', 'c-base300']">
                    {{ subtitle }}
                </p>
            </div>


            <div v-if="tags"
                 :class="$style.tags"
            >
                <VTag v-for="tag in tags"
                      :key="tag.text"
                      :class="$style.tag"
                      :color="tag.color"
                      :label="tag.label"
                />
                <slot name="customTag"></slot>
            </div>
        </div>


        <ProjectGenplanFlatList v-if="isAnyFlats"
                                :class="$style.flatsList"
                                :flats="flats" />

        <VButton color="primary"
                 :class="$style.btn"
                 :loading="isLoading"
                 :spinner="isLoading"
                 :disabled="!isAnyFlats"
                 @click="handleClick">
            {{ btnText || (nextAfterNextStepName ? `Выбрать ${nextAfterNextStepName}` : 'Выбрать') }}
        </VButton>
    </article>
</template>

<script>
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';
    import ProjectGenplanFlatList
        from '~/components/common/projects/project/genplan/flat/ProjectGenplanFlatList';

    export default {
        name: 'ProjectGenplanModalContentInfo',
        components: {ProjectGenplanFlatList},

        props: {
            title: {
                type: String,
                default: '',
            },

            subtitle: {
                type: String,
                default: '',
            },

            nextAfterNextStepName: {
                type: String,
                default: '',
            },

            tags: {
                type: Array,
                default: () => [],
            },

            flats: {
                type: Array,
                default: () => [],
            },

            isAnyFlats: {
                type: Boolean,
                default: false,
            },

            itemId: {
                type: [String, Number],
                default: ''
            },

            btnText: {
                type: String,
                default: '',
            },

            render: {
                type: String,
                default: '',
            },

            renderPreview: {
                type: String,
                default: '',
            },

            renderPoligons: {
                type: String,
                default: '',
            },

            renderWidth: {
                type: Number,
                default: 0,
            },

            renderHeight: {
                type: Number,
                default: 0,
            },

            isLoading: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                imgEl: null,
                iw: 1,
                ih: 1,
                ww: 1,
                wh: 1,
                isLoaded: false,
                isTicking: false,
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
                        transform: `scale(${this.ww / this.iw}) translate(0px, ${((this.wh * this.scaleValue) - this.ih) / 2}px)`,
                    };
                }
                return {
                    width: this.iw + 'px',
                    height: this.ih + 'px',
                    transform: `scale(${this.wh / this.ih}) translate(${((this.ww * this.scaleValue) - this.iw) / 2}px, 0px)`,

                };
            },

            scaleValue() {
                return this.windowRatio > this.imageRatio ? this.iw / this.ww : this.ih / this.wh;
            },

            previewStyle() {
                return {backgroundImage: `url(${this.renderPreview})`};
            },
        },

        mounted() {
            if (this.render) {
                this.imgEl = new Image();
                this.imgEl.addEventListener('load', this.handleImageLoad);
                this.imgEl.src = this.image;
            }

            if (this.$refs.imageWrapper) {
                addResizeListener(this.$refs.imageWrapper, this.handleResize);
            }
        },

        beforeDestroy() {
            if (this.render && this.imgEl) {
                this.imgEl.removeEventListener('load', this.handleImageLoad);
            }

            if (this.$refs.imageWrapper) {
                removeResizeListener(this.$refs.imageWrapper, this.handleResize);
            }
        },

        methods: {
            handleClick(evt) {
                this.$emit('next-step', this.itemId);
                this.$emit('click', evt);
            },

            handleImageLoad() {
                const iw = this.$refs.image?.naturalWidth;
                const ih = this.$refs.image?.naturalHeight;
                const ww = this.$refs?.imageWrapper?.offsetWidth;
                const wh = this.$refs?.imageWrapper?.offsetHeight;

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
                this.wh = this.$refs?.imageWrapper?.offsetHeight;
                this.ww = this.$refs?.imageWrapper?.offsetWidth;
                this.isTicking = false;
            },

            centerImage() {
                if (this.$refs.imageWrapper && this.$deviceIs.mobile) {
                    this.$refs.imageWrapper.scrollLeft = this.$refs.imageWrapper.offsetWidth/3.5;
                }
            },
        }
    };
</script>

<style lang="scss" module>
    .ProjectGenplanModalContentInfo {
        @include respond-to(sm) {
            padding-top: 2.4rem;
            padding-bottom: 2.4rem;
        }

        @include respond-to(xs) {
            padding-top: 2.8rem;
            padding-bottom: 1.6rem;
        }
    }

    .head {
        display: flex;
        flex-direction: column;

        @include respond-to(sm) {
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            flex-wrap: wrap;
            padding-bottom: 2.4rem;
            border-bottom: .1rem solid $base-100;
        }

        @include respond-to(xs) {
            flex-direction: column;
            padding-bottom: 1.6rem;
        }
    }

    .renderWrapper {
        overflow: hidden;
        width: 100%;
        height: 19.2rem;
        margin-bottom: .8rem;
        border-radius: .8rem;

        @include respond-to(sm) {
            order: 1;
            margin-top: 2.4rem;
            margin-bottom: 0;
        }

        @include respond-to(xs) {
            margin-top: 1.6rem;
        }
    }

    .wrapper {
        position: relative;
        width: auto;
        height: 100%;
        transform-origin: 0 0;
    }

    .preview {
        position: relative;
        width: auto;
        height: 100%;
        background-size: contain;
    }

    .origin {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity .26s linear;

        &._loaded {
            opacity: 1;
        }
    }

    .poligonsSvg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .poligon {
        position: relative;
        fill: rgba($blue, .5);
        stroke: $blue;
        stroke-width: 4px;
    }

    .title {
        text-transform: uppercase;
    }

    .subtitle {
        margin-top: .4rem;

        @include respond-to(sm) {
            margin-top: 0;
        }

        @include respond-to(xs) {
            margin-top: .4rem;
        }
    }

    .tags {
        margin-top: 1.2rem;

        @include respond-to(sm) {
            margin-top: 0;
        }

        @include respond-to(xs) {
            position: static;
            order: -1;
            margin-bottom: 2.8rem;
        }
    }

    .flatsList {
        margin-top: 3.2rem;

        @include respond-to(sm) {
            margin-top: 2.4rem;
        }

        @include respond-to(xs) {
            margin-top: 1.6rem;
        }
    }

    .btn {
        width: 100%;
        margin-top: 3.2rem;

        @include respond-to(sm) {
            margin-top: 2.4rem;
        }
    }
</style>
