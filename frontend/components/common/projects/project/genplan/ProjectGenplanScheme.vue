<template>
    <div ref="mainWrapper"
         :class="[
             $style.ProjectGenplanScheme,
             {
                 [$style._hiddenTop]: hiddenTopOverlay,
                 [$style._hiddenBottom]: hiddenBottomOverlay
             }
         ]"
         @click="clearAllItems">
        <h2 v-if="titleText"
            :class="[$style.title, 'c-base0', 'p6']">
            {{ titleText }}
        </h2>
        <transition name="fade-slow"
                    mode="out-in">
            <ZoomBox :key="currentStepData.id"
                     :value="zoom"
                     :force-scroll-to-top="forceScrollZoomboxToTop"
                     :zoom-step="zoomStep"
                     :min-zoom="minZoom"
                     :max-zoom="$deviceIs.mobile ? maxZoomMobile : maxZoom"
                     :first-zoom="firstZoom"
                     :zoom-controls-class="$style.zoomControls"
                     :hidden-controls="hiddenControls"
                     @change-zoom="zoom = $event"
                     @change-position="zoomPos = $event">
                <div ref="schemeWrapper"
                     :class="[
                         $style.schemeWrapper,
                         {
                             [$style._roundedBorder]: roundedBorder,
                             [$style._withoutImage]: !scheme
                         }
                     ]"
                     :style="wrapperSizes">

                    <img v-if="scheme && !$slots.scheme"
                         ref="image"
                         :class="[$style.img, {[$style._loaded]: isLoaded}]"
                         :src="scheme"
                         alt="Схема генплана"
                         @load="handleImageLoad">
                    <slot name="scheme"
                          :activeItem="activeItem"
                          :handleClickLot="openLotModal"
                          :handleClickInfoItem="openInfoModal"></slot>

                    <div v-if="scheme && filledItems && filledItems.length"
                         :class="$style.poligons">
                        <svg xmlns="http://www.w3.org/2000/svg"
                             :viewBox="`0 0 ${schemeWidth} ${schemeHeight}`"
                             :class="$style.poligonsSvg"
                        >
                            <template v-for="item in filledItems">
                                <g
                                    v-if="(showEmptyStep || item.flat_count) && item.status"
                                    :key="item.id"
                                    :class="[$style.poligon, {[$style._active]: item.id === hoverItemId || item.id === activeItemId}]"
                                    :data-item-id="item.id"
                                    @mouseenter="setHoverItem(item)"
                                    @mouseleave="clearHoverItem"
                                    @click.stop="isLotModal ? openLotModal(item) : openInfoModal(item)"
                                    v-html="item.poligon"
                                />
                            </template>
                        </svg>
                    </div>

                    <div v-if="scheme && filledItems.length"
                         :class="$style.pins">
                        <div v-for="item in filledItems"
                             :key="item.id"
                             :class="$style.pinWrapper"
                             :style="{top: `${item.pinPoint.top}%`, left: `${item.pinPoint.left}%`, transform: `scale(${$deviceIs.pc ? 1 : scaleValue * 1.5})`}"
                        >
                            <ProjectGenplanPin
                                v-if="(showEmptyStep || item.flat_count) && item.status"
                                :class="$style.pin"
                                :pin-info="item"
                                :is-active="item.id === hoverItemId || item.id === activeItemId"
                                :data-item-id="item.id"
                                :is-filtered="Boolean(filteredItems && filteredItems.length)"
                                @mouseenter="setHoverItem(item)"
                                @mouseleave="clearHoverItem"
                                @click="isLotModal ? openLotModal(item) : openInfoModal(item)"
                            />
                        </div>
                    </div>
                </div>
            </ZoomBox>
        </transition>

        <ProjectGenplanModalLot ref="lotModal"
                                :class="$style.lotModal"
                                :lot="activeLot"
                                @open-form="handleOpenForm"
                                @close="clearAllItems" />

        <ProjectGenplanModalInfo ref="infoModal"
                                 :class="$style.itemInfoModal"
                                 :visible="Boolean(activeItem)"
                                 :item="activeItem"
                                 :filter-params="currentStep && currentStep.flatsLinkParams"
                                 :btn-text="infoModalBtnText"
                                 :next-step-name="nextStep && nextStep.label"
                                 :next-after-next-step-name="nextAfterNextStep && nextAfterNextStep.label"
                                 :is-loading="isLoading"
                                 @click="$emit('modal-info-click', $event)"
                                 @next-step="handleNextStep"
                                 @close="clearAllItems" />
        <slot></slot>
    </div>
</template>

<script>
    import {getFlatTitle, isDeadlinePassed, quaterToRoman, splitThousands} from '~/assets/js/utils/numberUtils';
    import {clearDoubleSpaces, getStatus, getValueByPath} from '~/assets/js/utils/commonUtils';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';
    import variables from '~/assets/scss/shared/_variables.scss';

    import ProjectGenplanPin from '~/components/common/projects/project/genplan/ProjectGenplanPin';
    import ProjectGenplanModalLot from '~/components/common/projects/project/genplan/modal/ProjectGenplanModalLot';
    import FormModal from '~/components/layout/modals/forms/FormModal';
    import ZoomBox from '~/components/common/ZoomBox';
    import ProjectGenplanModalInfo
        from '~/components/common/projects/project/genplan/modal/ProjectGenplanModalInfo';

    export default {
        name: 'ProjectGenplanScheme',

        components: {
            ZoomBox,
            ProjectGenplanPin,
            ProjectGenplanModalLot,
            ProjectGenplanModalInfo,
        },

        mixins: [breakpointCheck],

        props: {
            currentStepData: {
                type: Object,
                default: () => ({}),
            },

            filteredItems: {
                type: Array,
                default: null,
            },

            roundedBorder: {
                type: Boolean,
                default: false,
            },

            infoModalBtnText: {
                type: String,
                default: ''
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

            isLotModal: {
                type: Boolean,
                default: false,
            },

            hiddenControls: {
                type: Boolean,
                default: false,
            },

            hiddenTopOverlay: {
                type: Boolean,
                default: false,
            },

            hiddenBottomOverlay: {
                type: Boolean,
                default: false,
            },

            showEmptyStep: {
                type: Boolean,
                default: false,
            },

            // Zoom settings

            initialZoom: {
                type: Number,
                default: 1,
            },

            firstZoom: {
                type: Number,
                default: 1.5,
            },

            zoomStep: {
                type: Number,
                default: .1,
            },

            minZoom: {
                type: Number,
                default: 1,
            },

            maxZoom: {
                type: Number,
                default: 2.5,
            },

            maxZoomMobile: {
                type: Number,
                default: 5,
            },

            forceScrollZoomboxToTop: {
                type: [Number, String, Boolean],
                default: 0,
            },

            isLoading: {
                type: Boolean,
                default: false,
            },

            isDisabledMobileAutoZoom: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                // Image
                iw: 0,
                ih: 0,
                ww: 0,
                wh: 0,
                isTicking: null,
                isLoaded: false,

                zoom: this.initialZoom || 1,

                // scheme
                activeItem: null,
                hoverItem: null,
                activeLot: null,

                hoverItemTimer: null,
            };
        },

        computed: {
            propNames() {
                return this.currentStep?.propNames || {};
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

            display() {
                return (this.propNames?.scheme_display
                    ? getValueByPath(this.currentStepData, this.propNames?.scheme_display)
                    : this.currentStepData?.scheme_display) || '';
            },

            preview() {
                return (this.propNames?.scheme_preview
                    ? getValueByPath(this.currentStepData, this.propNames?.scheme_preview)
                    : this.currentStepData?.scheme_preview) || '';
            },

            scheme_svg() {
                return (this.propNames?.scheme_svg
                    ? getValueByPath(this.currentStepData, this.propNames?.scheme_svg)
                    : this.currentStepData?.scheme_svg) || '';
            },

            scheme_png() {
                return (this.propNames?.scheme_png
                    ? getValueByPath(this.currentStepData, this.propNames?.scheme_png)
                    : this.currentStepData?.scheme_png) || '';
            },

            schemeWidth() {
                return (this.propNames?.scheme_width
                    ? getValueByPath(this.currentStepData, this.propNames?.scheme_width)
                    : this.currentStepData?.scheme_width) || 0;
            },

            schemeHeight() {
                return (this.propNames?.scheme_height
                    ? getValueByPath(this.currentStepData, this.propNames?.scheme_height)
                    : this.currentStepData?.scheme_height) || 0;
            },

            scheme() {
                return this.display || this.scheme_svg || this.scheme_png;
            },

            imageRatio() {
                return this.iw / this.ih;
            },

            windowRatio() {
                return this.ww / this.wh;
            },

            scaleValue() {
                return this.windowRatio > this.imageRatio ? this.ww / this.iw : this.wh / this.ih;
            },

            wrapperSizes() {
                const headerHeight = this.breakpoint === 'xs' ? variables['header-mobile-h'] : variables['header-h'];

                return {
                    maxHeight: this.scheme ? `calc(100vh - ${headerHeight} - 20rem - 4.4rem)` : null,
                    maxWidth: this.scheme ? `calc(${this.imageRatio} * (100vh - ${headerHeight} - 20rem  - 4.4rem))` : null
                };
            },

            filledItems() {
                return this.items.map(item => {
                    const poligon = this.propNames?.scheme_hover
                        ? getValueByPath(item, this.propNames?.scheme_hover)
                        : item[this.poligonRenderName];

                    const point = (this.propNames?.scheme_point
                        ? getValueByPath(item, this.propNames?.scheme_point)
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

            activeLotId() {
                return this.activeLot?.id;
            },
        },

        watch: {
            initialZoom(val) {
                if (val > 1 && this.zoom === 1) {
                    this.zoom = val;
                }
            }
        },

        mounted() {
            this.updateZoom();
            window.addEventListener('resize', this.handleResize);
        },

        beforeDestroy() {
            window.removeEventListener('resize', this.handleResize);
        },

        methods: {
            handleImageLoad() {
                const iw = this.$refs.image?.naturalWidth;
                const ih = this.$refs.image?.naturalHeight;
                const ww = this.$refs.schemeWrapper?.offsetWidth;
                const wh = this.$refs.schemeWrapper?.offsetHeight;

                this.iw = iw;
                this.ih = ih;
                this.ww = ww;
                this.wh = wh;

                this.$nextTick(() => {
                    this.isLoaded = true;
                    this.$emit('load');
                });
            },

            handleResize() {
                this.updateZoom();

                if (this.scheme && !this.isTicking) {
                    this.isTicking = true;
                    requestAnimationFrame(this.updateWindowSize);
                }
            },

            updateWindowSize() {
                this.wh = this.$refs.schemeWrapper?.offsetHeight;
                this.ww = this.$refs.schemeWrapper?.offsetWidth;
                this.isTicking = false;
            },

            updateZoom() {
                if (this.isDisabledMobileAutoZoom) {
                    return;
                }

                if (this.$deviceIs.mobile) {
                    if (this.zoom === this.minZoom) {
                        this.zoom = 2;
                    }
                } else if (this.zoom === 2) {
                    this.zoom = this.minZoom;
                }
            },

            setModalPosition(id, modalName, isSetTop = false) {
                const pin = this.$refs.schemeWrapper.querySelector(`div[data-item-id="${id}"]`);
                const modal = this.$refs[modalName]?.$el;
                const mainWrapper = this.$refs.mainWrapper;

                if (!modal) {
                    console.warn('[setModalPosition]: invalid modal name');
                    return;
                }

                const pinClientRect = pin.getBoundingClientRect();
                const mainWrapperClientRect = mainWrapper.getBoundingClientRect();

                const modalWidth = parseFloat(window.getComputedStyle(modal).minWidth) || parseFloat(window.getComputedStyle(modal).width);

                let left = 'unset';
                let top = 'unset';

                if (pinClientRect.left < (24 + modalWidth + 8)) {
                    left = pinClientRect.left + pinClientRect.width + 8 + 'px';
                } else {
                    left = pinClientRect.left - modalWidth - 8 + 'px';
                }

                if (isSetTop) {
                    top = pinClientRect.top - mainWrapperClientRect.top + 'px';
                    modal.style.top = top;
                    modal.style.transform = 'unset';
                }

                modal.style.left = left;
            },

            clearAllItems() {
                this.activeItem = null;
                this.activeLot = null;
            },

            setHoverItem(item) {
                this.hoverItem = item;
            },

            clearHoverItem(item) {
                this.hoverItem = item;
            },

            openModal(options) {
                if (!options || typeof options !== 'object') {
                    return;
                }

                const {item, modalName, itemName, isSetTop, cb} = options;

                if (this.$deviceIs.pc) {
                    setTimeout(() => {
                        this[itemName] = item;
                        this.setModalPosition(item?.id, modalName, isSetTop);

                        if (cb && typeof cb === 'function') {
                            cb();
                        }
                    }, 100);
                    return;
                }

                this[itemName] = item;

                if (cb && typeof cb === 'function') {
                    cb();
                }
            },

            openInfoModal(item, isSetTop = false) {
                this.clearAllItems();
                const options = {
                    item,
                    modalName: 'infoModal',
                    itemName: 'activeItem',
                    isSetTop,
                };
                this.openModal(options);
            },

            openLotModal(item, isSetTop = false) {
                this.clearAllItems();
                const options = {
                    item,
                    modalName: 'lotModal',
                    itemName: 'activeLot',
                    isSetTop,
                };
                this.openModal(options);
            },

            handleOpenForm() {
                const data = {
                    formTitle: 'Забронировать квартиру - шахматка генплан',
                    formSource: 'Страница проекта: Шахматка генплана',
                    formComment: clearDoubleSpaces(`
                        Тип:
                        Название планировки:
                        Цена:
                        Площадь:
                        Апартаменты: ${this.activeLot?.project_name || ''}
                        Литер: ${this.activeLot?.building || ''}
                        Код планировки:
                        Этаж: ${this.activeLot?.floor || ''}
                        Квартира ${this.activeLot?.rooms ? getFlatTitle(this.activeLot.rooms)?.fullNumber : ''}
                        Общая площадь: ${this.activeLot?.area || ''}
                        IP пользователя:
                        Стоимость квартиры: ${this.activeLot?.price ? splitThousands(this.activeLot?.original_price || this.activeLot.price) : ''}
                        Номер:
                    `),
                };

                this.$modal.open(FormModal, data);
            },

            handleNextStep() {
                this.$emit('next-step', this.activeItemId);
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectGenplanScheme {
        position: relative;
        width: 100%;
        height: 100%;

        &:before {
            content: "";
            position: absolute;
            top: -.1rem;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 10rem;
            background: linear-gradient(180deg, $base-0 66.79%, rgba(255, 255, 255, 0) 100%);
        }

        &._hiddenTop:before {
            display: none;
        }

        &:after {
            content: "";
            position: absolute;
            bottom: -.1rem;
            left: 0;
            width: 100%;
            height: 10rem;
            background: linear-gradient(0deg, $base-0 66.79%, rgba(255, 255, 255, 0) 100%);
        }

        &._hiddenBottom:after {
            display: none;
        }
    }

    .title {
        position: absolute;
        top: 3.8rem;
        left: 50%;
        z-index: 1;
        color: $base-800;
        transform: translateX(-50%);

        @include respond-to(xs) {
            display: none;
        }
    }

    .schemeWrapper {
        position: relative;
        overflow: hidden;
        max-width: 80vw;
        max-height: calc(100vh - #{$header-h} - 10rem);

        &._withoutImage {
            overflow: unset;
            max-width: unset;
            max-height: unset;
        }

        &._roundedBorder {
            border-radius: 1.6rem;
        }
    }

    .img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        opacity: 0;
        transition: opacity .26s linear;

        &._loaded {
            opacity: 1;
        }
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

    .lotModal {
        position: absolute;
        top: 50%;
        left: 2.4rem;
        z-index: 5;
        transform: translateY(-50%);

        @include respond-to(sm) {
            position: fixed;
            top: unset;
            left: unset;
            z-index: 100;
            transform: unset;
        }
    }

    .itemInfoModal {
        position: absolute;
        top: 50%;
        z-index: 5;
        transform: translateY(-50%);

        @include respond-to(sm) {
            position: fixed;
            top: unset;
            z-index: 100;
            transform: unset;
        }
    }

    .zoomControls {
        z-index: 5;

        @include respond-to(sm) {
            top: unset;
            bottom: calc(4.4rem + 2.4rem + 4rem);
            transform: unset;
        }

        @include respond-to(xs) {
            bottom: 8.4rem;
        }
    }
</style>
