<template>
    <div ref="imageContainer"
         :class="$style.ProjectGenplanRender">
        <h2 :class="[$style.title, 'c-base0', 'p6']">
            {{ titleText }}
        </h2>
        <div :class="$style.body">
            <div ref="wrapper"
                 :class="$style.wrapper"
                 :style="position"
                 @click="clearAllModals"
            >
                <div :class="$style.wrapperBackgroundPlank"
                     :style="backgroundPlankStyles"></div>
                <div :class="$style.preview"
                     :style="previewStyle"
                >
                    <img ref="image"
                         :src="image"
                         :class="[$style.origin, {[$style._loaded] : isLoaded}]"
                         alt="Изображение генплана"
                         @load="handleImageLoad"
                    >
                </div>

                <transition name="fade-slow">
                    <ProjectGenplanInfrasList v-if="infraLists.render && infraLists.render.length && isShowInfra"
                                              key="renderInfra"
                                              :class="[$style.infrasList, $style._render]"
                                              :infras="infraLists.render"
                                              :point-property-name="infraPointPropertyName"
                                              :scale-value="scaleValue"
                                              render
                                              @click="handleClickInfraItem" />
                </transition>

                <transition name="fade-content"
                            mode="out-in">
                    <div v-if="filledItems && filledItems.length"
                         :key="filledItems.length"
                         :class="$style.pins">
                        <div v-for="item in filledItems"
                             :key="item.id"
                             :class="$style.pinWrapper"
                             :style="{top: `${item.pinPoint.top}%`, left: `${item.pinPoint.left}%`, transform: `scale(${scaleValue})`}"
                        >
                            <ProjectGenplanPin
                                :key="item.id"
                                :class="$style.pin"
                                :pin-info="item"
                                :is-active="item.id === hoverItemId || item.id === activeItemId"
                                :direction="currentStep !== 'sections' ? 'bottom' : 'right'"
                                :data-item-id="item.id"
                                :is-filtered="Boolean(filteredItems && filteredItems.length)"
                                @mouseenter="setHoverItem(item)"
                                @mouseleave="clearHoverItem"
                                @click="openInfoModal(item)"
                            />
                        </div>
                    </div>
                </transition>

                <div v-if="items && items.length"
                     :class="$style.poligons">
                    <svg xmlns="http://www.w3.org/2000/svg"
                         :viewBox="`0 0 ${renderWidth} ${renderHeight}`"
                         :class="$style.poligonsSvg"
                    >
                        <template v-for="item in filledItems">
                            <g :key="item.id"
                               :class="[$style.poligon, {[$style._active]: item.id === hoverItemId || item.id === activeItemId}]"
                               :data-item-id="item.id"
                               @mouseenter="setHoverItem(item)"
                               @mouseleave="clearHoverItem"
                               @click.stop="openInfoModal(item)"
                               v-html="item.poligon"
                            />
                        </template>
                    </svg>
                </div>


            </div>

            <ProjectGenplanModalInfo
                ref="infoModal"
                :class="$style.itemInfoModal"
                :visible="Boolean(activeItem)"
                :item="activeItem"
                :filter-params="currentStep && currentStep.flatsLinkParams"
                :next-step-name="nextStep && nextStep.label"
                :next-after-next-step-name="nextAfterNextStep && nextAfterNextStep.label"
                :btn-text="currentStep && currentStep.infoModalBtnText"
                :is-loading="isLoading"
                @click="$emit('modal-info-click', $event)"
                @next-step="handleNextStep"
                @close="closeInfoModal" />

            <ProjectGenplanModalInfra
                ref="infraModal"
                :class="$style.itemInfraModal"
                :visible="Boolean(activeInfraItem)"
                :item="activeInfraItem"
                :infras-categories="infrasCategories"
                @close="clearInfraActiveItem" />
        </div>

        <transition name="fade-slow">
            <ProjectGenplanInfrasList v-if="infraLists.left && infraLists.left.length && isShowInfra"
                                      key="leftInfra"
                                      :class="[$style.infrasList, $style._left]"
                                      :infras="infraLists.left"
                                      :max-height="infrasMaxHeight"
                                      left
                                      @click="handleClickInfraItem" />
        </transition>

        <transition name="fade-slow">
            <ProjectGenplanInfrasList v-if="infraLists.right && infraLists.right.length && isShowInfra"
                                      key="rightInfra"
                                      :class="[$style.infrasList, $style._right]"
                                      :infras="infraLists.right"
                                      :max-height="infrasMaxHeight"
                                      right
                                      @click="handleClickInfraItem" />
        </transition>
    </div>
</template>

<script>
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';
    import {getFlatTitle, isDeadlinePassed, quaterToRoman} from '~/assets/js/utils/numberUtils';
    import {getStatus, getValueByPath} from '~/assets/js/utils/commonUtils';

    import ProjectGenplanPin from '~/components/common/projects/project/genplan/ProjectGenplanPin';
    import ProjectGenplanModalInfo
        from '~/components/common/projects/project/genplan/modal/ProjectGenplanModalInfo';
    import ProjectGenplanInfrasList
        from '~/components/common/projects/project/genplan/ProjectGenplanInfrasList';
    import ProjectGenplanModalInfra
        from '~/components/common/projects/project/genplan/modal/ProjectGenplanModalInfra';

    export default {
        name: 'ProjectGenplanRender',
        components: {
            ProjectGenplanModalInfra,
            ProjectGenplanInfrasList,
            ProjectGenplanModalInfo,
            ProjectGenplanPin,
        },

        mixins: [breakpointCheck],

        props: {
            currentStepData: {
                type: Object,
                default: () => ({}),
                required: true,
            },

            filteredItems: {
                type: Array,
                default: null,
            },

            infras: {
                type: Array,
                default: () => [],
            },

            infrasCategories: {
                type: Array,
                default: () => [],
            },

            currentStep: {
                type: Object,
                default: () => ({}),
            },

            nextStep: {
                type: Object,
                default: () => ({}),
            },

            nextAfterNextStep: {
                type: Object,
                default: () => ({}),
            },

            nextStepName: {
                type: String,
                default: '',
            },

            currentStepName: {
                type: String,
                default: '',
            },

            isShowInfra: {
                type: Boolean,
                default: false,
            },

            showEmptyStep: {
                type: Boolean,
                default: false,
            },

            isLoading: {
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

                activeItem: null,
                hoverItem: null,
                activeInfraItem: null,

                renderScrollLeft: 0,
            };
        },

        computed: {
            propNames() {
                return this.currentStep?.propNames || {};
            },

            titleText() {
                const quarter = quaterToRoman(this.currentStepData.deadline_quarter || this.currentStepData.completion_quarter);
                const year = this.currentStepData.deadline_year || this.currentStepData.completion_year;

                if (isDeadlinePassed(year, quarter)) {
                    return 'Объект сдан';
                }

                if (quarter && year) {
                    return `Сдача в ${quarter} кв. ${year}`;
                }

                if (year) {
                    return `Сдача в ${year}`;
                }

                return '';
            },

            items() {
                if (this.filteredItems) {
                    return this.filteredItems;
                }

                if (this.propNames?.items) {
                    return getValueByPath(this.currentStepData, this.propNames?.items);
                }

                return this.currentStepData[this.nextStep?.name + 's'] || this.currentStepData[this.nextStep?.name] || [];
            },

            image() {
                return (this.propNames?.render_display
                    ? getValueByPath(this.currentStepData, this.propNames?.render_display)
                    : this.currentStepData?.render_display) || '';
            },

            preview() {
                return (this.propNames?.render_preview
                    ? getValueByPath(this.currentStepData, this.propNames?.render_preview)
                    : this.currentStepData?.render_preview) || '';
            },

            renderWidth() {
                return (this.propNames?.render_width
                    ? getValueByPath(this.currentStepData, this.propNames?.render_width)
                    : this.currentStepData?.render_width) || 0;
            },

            renderHeight() {
                return (this.propNames?.render_height
                    ? getValueByPath(this.currentStepData, this.propNames?.render_height)
                    : this.currentStepData?.render_height) || 0;
            },

            poligonRenderName() {
                return `${this.currentStep?.name}_render_hover`;
            },

            imageRatio() {
                return this.iw / this.ih;
            },

            windowRatio() {
                return this.ww / this.wh;
            },

            scale() {
                if (this.windowRatio > this.imageRatio) {
                    return `${this.ww / this.iw}`;
                }
                return `${this.wh / this.ih}`;
            },

            translateX() {
                if (this.windowRatio > this.imageRatio) {
                    return '0px';
                }

                return !'sm,xs'.includes(this.breakpoint)
                    ? `${(this.ww - (this.iw * this.wh / this.ih)) / 2}px`
                    : '0px';
            },

            translateY() {
                if (this.windowRatio > this.imageRatio) {
                    return !'sm,xs'.includes(this.breakpoint)
                        ? `${(this.wh - (this.ih * this.ww / this.iw)) / 2}px`
                        : '0px';
                }
                return '0px';
            },

            position() {
                return {
                    width: this.iw + 'px',
                    height: this.ih + 'px',
                    transform: !'sm,xs'.includes(this.breakpoint)
                        ? `scale(${this.scale}) translate(${this.translateX}, ${this.translateY})`
                        : `scale(${this.scale})`,
                };
            },

            backgroundPlankStyles() {
                return {
                    height: `calc(14.8rem * ${this.scaleValue})`,
                    transform: `translateY(calc((-1) * ${this.translateY})) rotate(180deg)`,
                };
            },

            scaleValue() {
                return this.windowRatio > this.imageRatio ? this.iw / this.ww : this.ih / this.wh;
            },

            offsetTop() {
                if (this.windowRatio > this.imageRatio) {
                    return ((this.wh - (this.ih * this.ww / this.iw)) / 2) * (1 / this.scaleValue);
                }

                return 0;
            },

            previewStyle() {
                return {backgroundImage: `url(${this.preview})`};
            },

            filledItems() {
                return this.items.map(item => {
                    const poligon = this.propNames?.render_hover
                        ? getValueByPath(item, this.propNames?.render_hover)
                        : item[this.poligonRenderName];

                    const point = (this.propNames?.render_point
                        ? getValueByPath(item, this.propNames?.render_point)
                        : item.point) || [];

                    return {
                        ...item,
                        poligon,
                        pinLabel: this.nextStep?.label ? `${item?.number} ${this.nextStep.label}` : getFlatTitle(item?.rooms).short,
                        pinPoint: {
                            left: point[0] || 0,
                            top: point[1] || 0,
                        },
                        status: item.status !== undefined && item.status !== null ? getStatus(item.status)?.isFree : true,
                    };
                });
            },

            activeItemId() {
                return this.activeItem?.id;
            },

            hoverItemId() {
                return this.hoverItem?.id;
            },

            infraPointPropertyName() {
                return this.currentStep?.propNames?.infra_point || `${this.currentStep?.name}_render_point`;
            },

            infraLists() {
                const lists = {
                    left: [],
                    right: [],
                    render: [],
                };

                if (!this.infras.length) {
                    return lists;
                }

                return this.infras.reduce((res, infra) => {
                    const point = infra && infra[this.infraPointPropertyName];

                    if (point?.length === 2 && point[0] && point[1]) {
                        res.render.push(infra);
                    } else if (infra.left) {
                        res.left.push(infra);
                    } else {
                        res.right.push(infra);
                    }
                    return res;
                }, lists);
            },

            infrasMaxHeight() {
                return !this.$deviceIs.mobile ? this.wh - (112 * 2) - (36 * 2) : this.wh - (84 * 2) - (24 * 2);
            },
        },

        watch: {
            isShowInfra(val) {
                if (!val) {
                    this.activeInfraItem = null;
                }
            }
        },

        mounted() {
            this.imgEl = new Image();
            this.imgEl.addEventListener('load', this.handleImageLoad);
            this.imgEl.src = this.image;

            if (this.$refs.imageContainer) {
                addResizeListener(this.$refs.imageContainer, this.handleResize);
            }
        },

        beforeDestroy() {
            this.imgEl.removeEventListener('load', this.handleImageLoad);

            if (this.$refs.imageContainer) {
                removeResizeListener(this.$refs.imageContainer, this.handleResize);
            }
        },

        methods: {
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
                    requestAnimationFrame(() => {
                        this.updateWindowSize();
                        if (!'sm,xs'.includes(this.breakpoint)) {
                            this.clearActiveItem();

                            if (this.renderScrollLeft) {
                                this.$refs.imageContainer.scroll(0, 0);
                            }
                        }
                    });
                }
            },

            updateWindowSize() {
                this.wh = this.$parent.$refs?.container?.offsetHeight;
                this.ww = this.$parent.$refs?.container?.offsetWidth;
                this.isTicking = false;
            },

            centerImage() {
                if (this.$refs.imageContainer && this.$deviceIs.mobile) {
                    this.$refs.imageContainer.scrollLeft = this.$refs.imageContainer.offsetWidth/3.5;
                }
            },

            setModalPosition(id, modalName) {
                const pin = this.$refs.imageContainer.querySelector(`[data-item-id="${id}"]`);
                const modal = this.$refs[modalName].$el;
                const pinClientRect = pin.getBoundingClientRect();
                const wrapperClientRect = this.$refs.wrapper.getBoundingClientRect();
                const modalWidth = parseFloat(window.getComputedStyle(modal).width);

                let left = 'unset';
                let top = 'unset';
                let bottom = 'unset';

                if (pinClientRect.left < (24 + modalWidth + 8)) {
                    left = pinClientRect.left + pinClientRect.width + 8 + 'px';
                } else {
                    left = pinClientRect.left - modalWidth - 8 + 'px';
                }

                if ((pinClientRect.top - wrapperClientRect.top) < (wrapperClientRect.bottom - pinClientRect.bottom)) {
                    top = (pinClientRect.top - wrapperClientRect.top) + this.offsetTop + 'px';
                } else {
                    bottom = (wrapperClientRect.bottom - pinClientRect.bottom) + 'px';
                }

                modal.style.left = left;
                modal.style.top = top;
                modal.style.bottom = bottom;
            },

            setHoverItem(item) {
                this.hoverItem = item;
            },

            clearHoverItem() {
                this.hoverItem = null;
            },

            setActiveItem(item) {
                this.activeItem = item;
            },

            clearActiveItem() {
                this.activeItem = null;
            },

            clearInfraActiveItem() {
                this.activeInfraItem = null;
            },

            clearAllModals() {
                this.clearActiveItem();
                this.clearInfraActiveItem();
            },

            openInfoModal(item) {
                this.clearAllModals();
                if (this.$deviceIs.pc) {
                    setTimeout(() => {
                        this.setModalPosition(item?.id, 'infoModal');
                        this.setActiveItem(item);
                    }, 100);
                    return;
                }

                this.setActiveItem(item);
            },

            closeInfoModal() {
                this.clearActiveItem();
            },

            handleClickInfraItem(item) {
                this.clearAllModals();

                if (this.$deviceIs.pc) {
                    setTimeout(() => {
                        this.setModalPosition('infra' + item.id, 'infraModal');
                        this.activeInfraItem = item;
                    }, 100);
                    return;
                }

                this.activeInfraItem = item;
            },

            handleNextStep(id) {
                this.$emit('next-step', id);
            },
        },
    };
</script>

<style lang="scss" module>
    .ProjectGenplanRender {
        overflow: hidden;
        width: 100%;
        height: 100%;

        @include respond-to(sm) {
            overflow-x: scroll;

            .pin {
                pointer-events: auto;
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
    }

    .wrapperBackgroundPlank {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        display: block;
        width: 100%;
        height: 14.8rem;
        background: linear-gradient(180deg, rgba(10, 11, 12, 0) 0%, rgba(10, 11, 12, .0086472) 6.67%, rgba(10, 11, 12, .03551) 13.33%, rgba(10, 11, 12, .0816599) 20%, rgba(10, 11, 12, .147411) 26.67%, rgba(10, 11, 12, .231775) 33.33%, rgba(10, 11, 12, .331884) 40%, rgba(10, 11, 12, .442691) 46.67%, rgba(10, 11, 12, .557309) 53.33%, rgba(10, 11, 12, .668116) 60%, rgba(10, 11, 12, .768225) 66.67%, rgba(10, 11, 12, .852589) 73.33%, rgba(10, 11, 12, .91834) 80%, rgba(10, 11, 12, .96449) 86.67%, rgba(10, 11, 12, .991353) 93.33%, #0a0b0c 100%);
        opacity: .62;
        transform: rotate(180deg);

        @include respond-to(xs) {
            display: none;
        }
    }

    .title {
        position: absolute;
        top: 3.8rem;
        left: 50%;
        z-index: 1;
        transform: translateX(-50%);

        @include respond-to(xs) {
            display: none;
        }
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

    .pins {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .pin {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 5;

        @include respond-to(sm) {
            pointer-events: none;
        }
    }

    .pinWrapper {
        position: absolute;
        z-index: 2;
    }

    .poligons {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
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
        opacity: 1;
        fill: rgba($blue, .12);
        stroke: $blue;
        stroke-width: 4px;
        transition: fill .2s ease-out, opacity $default-transition;
        cursor: pointer;

        &._active {
            fill: rgba($blue, .36);
        }
    }

    .infrasList {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);

        &._left {
            left: 2.4rem;
        }

        &._right {
            right: 2.4rem;
        }

        &._render {
            top: 0;
            left: 0;
            display: block;
            width: 100%;
            height: 100%;
            transform: unset;
        }
    }

    .itemInfoModal {
        position: absolute;
        z-index: 5;

        @include respond-to(sm) {
            position: fixed;
            z-index: 100;
        }
    }

    .itemInfraModal {
        position: absolute;
        z-index: 5;

        @include respond-to(sm) {
            position: fixed;
            z-index: 100;
        }
    }
</style>
