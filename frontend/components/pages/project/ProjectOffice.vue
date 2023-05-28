<template>
    <div v-if="offices.length"
         :class="$style.ProjectOffice">
        <div id="officeMap"
             ref="map"
             :class="$style.map">
            <ZoomControls :class="$style.zoomControls"
                          :zoom-in-disabled="map && map._zoom && map._zoom === maxZoom"
                          :zoom-out-disabled="map && map._zoom && map._zoom === minZoom"
                          @click-zoom-in="onClickZoom"
                          @click-zoom-out="onClickZoom(false)"
            />

            <RadioButtonsGroup v-if="validOffices.length > 1"
                               :class="$style.radioBtns"
                               :style="radioBtnsStyles"
                               :btn-list="typeBtns"
                               :value="currentOffice.id"
                               color="white"
                               shadow
                               @change="changeOffice" />
        </div>

        <div v-if="currentOffice"
             ref="info"
             :class="$style.info">
            <div :class="$style.slider">
                <ProjectOfficeSlider :slides="currentOffice.saleoffice_image"
                                     :slider-bottom="sliderBottom" />
            </div>
            <div ref="content"
                 :class="$style.content">
                <transition :name="isShowRouteForm ? 'scroll-left' : 'scroll-right'"
                            mode="out-in">
                    <div v-if="!isShowRouteForm"
                         :key="'contacts' + currentOffice.id"
                         :class="$style.contentWrapper">
                        <div :class="$style.contentHeader">
                            <div>
                                <h2 :class="[$style.title, 'h5']">
                                    {{ currentOffice.title }}
                                </h2>
                                <a :href="`tel:${currentOffice.phone}`"
                                   :class="[$style.title, 'h5', 'c-blue', 'roistat__phone-changer']">
                                    {{ prettyPhoneNumber }}
                                </a>
                            </div>

                            <div :class="$style.imgWrapper"
                                 @click="openPhotosModal">
                                <ImageLazy :class="$style.img"
                                           :image="mainOfficeImg.image_display"
                                           :preview="mainOfficeImg.image_preview"
                                />
                                <IconZoomUp :class="$style.imgIcon" />
                            </div>
                        </div>

                        <p :class="[$style.text, 'p6', 'c-base300']"
                           v-html="currentOffice.address"></p>

                        <p :class="[$style.text, 'p6', 'c-base300']"
                           v-html="currentOffice.work_time"></p>

                        <div :class="$style.btns">
                            <VButton :class="$style.btn"
                                     color="primary"
                                     @click="openForm"
                            >
                                Записаться
                            </VButton>
                            <VButton :class="$style.btn"
                                     color="dark"
                                     @click="isShowRouteForm = true">
                                Построить маршрут
                            </VButton>
                        </div>
                    </div>

                    <div v-else
                         key="route"
                         :class="$style.contentWrapper">
                        <div :class="$style.backBtn"
                             @click="isShowRouteForm = false">
                            <IconArrowLeft :class="$style.backBtnIcon" />
                            <span :class="[$style.backBtnText, 'p6']">Назад к офису</span>
                        </div>
                        <ProjectMapRoute
                            :address="addressValue"
                            :project-name="currentOffice.fullTitle || currentOffice.title"
                            :route-duration="routeDuration"
                            :transport-type="transportType"
                            :is-route-loading="isRouteLoading"
                            @update-address="updateAddress"
                            @build-route="buildRoute"
                            @reset-route="resetRoute"
                            @update-transport-type="updateTransportType"
                        />
                    </div>
                </transition>
            </div>

            <TemplateBottomModal :visible="isShowPhotos"
                                 :data="{title: 'Фото офиса Краснодар'}"
                                 @close="closePhotosModal"
            >
                <ProjectOfficeSlider v-if="currentOffice"
                                     :class="$style.modalSlider"
                                     :slides="currentOffice.saleoffice_image" />
            </TemplateBottomModal>

            <transition name="overlay-appear">
                <Overlay v-if="isShowPhotos"
                         @click="closePhotosModal" />
            </transition>
        </div>
    </div>
</template>

<script>
    import {
        apiKey, endWaypointPinTemplate,
        rLocationProjectPinTemplate,
    } from '~/assets/js/utils/ya-maps';
    import ymapsLoader from 'ymaps';
    import {clearDoubleSpaces, prettyPhone} from '~/assets/js/utils/commonUtils';

    import ZoomControls from '~/components/common/ZoomControls';
    import ImageLazy from '~/components/common/ImageLazy';
    import IconZoomUp from '~/components/icons/IconZoomUp';
    import IconArrowLeft from '~/components/icons/IconArrowLeft';
    import FormModal from '~/components/layout/modals/forms/FormModal';
    import ProjectOfficeSlider from '~/components/common/projects/project/office/ProjectOfficeSlider';
    import TemplateBottomModal from '~/components/layout/modals/templates/TemplateBottomModal';
    import Overlay from '~/components/layout/modals/Overlay';
    import ProjectMapRoute from '~/components/common/projects/project/ProjectMapRoute';
    import RadioButtonsGroup from '~/components/common/RadioButtonsGroup';

    export default {
        name: 'ProjectOffice',

        components: {
            RadioButtonsGroup,
            IconArrowLeft,
            ProjectMapRoute,
            TemplateBottomModal,
            ProjectOfficeSlider,
            ImageLazy,
            IconZoomUp,
            ZoomControls,
            Overlay,
        },

        props: {
            offices: {
                type: Array,
                default: () => []
            },

            projectName: {
                type: String,
                default: '',
            },

            projectCityName: {
                type: String,
                default: '',
            },
        },

        data() {
            return {
                currentOffice: null,

                sliderBottom: 0,
                lastResolution: this.$deviceIs.device,
                isShowPhotos: false,
                radioBtnsStyles: {},

                // Карта
                inited: false,
                ymaps: null,
                map: null,
                objectManager: null,
                zoomMargin: [128, 128, 128, 350],
                zoom: 16,
                minZoom: 5,
                maxZoom: 20,
                center: [],

                // Построение маршрутов
                isShowRouteForm: false,
                multiRoute: null,
                transportType: null,
                routeDuration: '',
                isRouteLoading: false,
                addressValue: '',
                fullAddress: '',
            };
        },

        computed: {
            validOffices() {
                return this.offices
                    .filter(office => office?.coordinates?.latitude && office?.coordinates?.longitude)
                    .map(office => {
                        if (office?.title) {
                            return office;
                        }

                        office.title = office?.is_main ? 'Офис "Неометрии"' : 'Офис продаж';
                        office.fullTitle = office.title === 'Офис продаж' ? `Офис продаж ${this.projectName}` : '';
                        return office;
                    });
            },

            officeCoords() {
                if (!this.validOffices.length) {
                    return [];
                }

                if (this.currentOffice) {
                    return this.convertCoordinates(this.currentOffice.coordinates);
                }

                return this.convertCoordinates(this.validOffices[0].coordinates);
            },

            prettyPhoneNumber() {
                return prettyPhone(this.currentOffice?.phone || '');
            },

            mainOfficeImg() {
                if (this.currentOffice?.saleoffice_image && this.currentOffice?.saleoffice_image.length) {
                    return this.currentOffice?.saleoffice_image[0];
                }
                return {};
            },

            typeBtns() {
                return this.validOffices.map(office => (
                    {
                        key: office.id,
                        name: office.is_main ? 'Главный офис' : 'Офис проекта',
                    }
                ));
            },
        },

        created() {
            this.currentOffice = this.validOffices[0];
        },

        mounted() {
            window.addEventListener('resize', this.handleResize);

            if (!this.inited) {
                this.loadMap();
            }

            this.$nextTick(() => {
                this.updateSliderBottom();
                this.calculateRadioBtnsPos();
            });
        },

        beforeDestroy() {
            window.removeEventListener('resize', this.handleResize);

            if (this.map) {
                this.map.destroy();
            }

            this.inited = false;
            this.map = null;
            this.ymaps = null;
        },

        methods: {
            loadMap() {
                const langDic = {
                    ru: 'ru_RU',
                    en: 'en_US',
                };

                if (window.innerWidth < 1281) {
                    this.zoomMargin = 128;
                    this.clusterZoomMargin = 128;
                }

                ymapsLoader.load(`https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=${langDic['ru']}`).then(maps => {
                    this.ymaps = maps;
                    this.initMap();
                })
                    .catch(error => console.log('Failed to load Yandex Maps', error));
            },

            initMap() {
                if (!this.currentOffice) {
                    return;
                }

                this.map = new this.ymaps.Map('officeMap', {
                    center: this.officeCoords,
                    zoom: this.zoom,
                    behaviors: ['drag'],
                    controls: [],
                }, {
                    minZoom: this.minZoom,
                    maxZoom: this.maxZoom,
                    maxAnimationZoomDifference: 50,
                    suppressMapOpenBlock: true,
                });

                this.addOffices();
                this.updateMapCenter();

                if (this.validOffices?.length > 1) {
                    this.setBounds();
                }


                this.inited = true;
            },

            addOffices() {
                this.initObjectManager();
                this.initOffices();
            },

            initObjectManager() {
                this.objectManager = new this.ymaps.ObjectManager({
                    clusterize: false,
                    gridSize: 256,
                    clusterHideIconOnBalloonOpen: false,
                    openBalloonOnClick: false,
                    zoomMargin: this.clusterZoomMargin,
                    useMapMargin: true,
                });

                this.map.geoObjects.add(this.objectManager);
            },

            initOffices() {
                this.validOffices.forEach(this.addPin);
                this.objectManager.objects.events.add(['click'], this.handleClickPin);
                this.objectManager.objects.events.add(['mouseenter', 'mouseleave'], this.handleHoverPin);
            },

            addPin(newOffice) {
                const office = {
                    ...newOffice.saleoffice_image[0],
                    id: newOffice.id,
                    name: newOffice.title,
                    disabled: newOffice.id !== this.currentOffice.id,
                };

                if (!this.officeCoords.length) {
                    console.warn('not found office coords');
                    return;
                }

                // Установка шаблона пина
                const options = {
                    active: false,
                    iconLayout: rLocationProjectPinTemplate(this.ymaps, office, 'image_display'),
                };

                const officePin = {
                    type: 'Feature',
                    id: office.id,
                    geometry: {
                        type: 'Point',
                        coordinates: this.convertCoordinates(newOffice.coordinates),
                    },

                    properties: {
                        id: office.id,
                        name: office.name,
                    },

                    options: {...options},
                };

                this.objectManager.add(officePin);
            },

            handleClickPin(event) {
                const id = event.get('objectId');
                this.changeOffice(id);
            },

            handleHoverPin(event) {
                if (!this.$refs.map) {
                    return;
                }

                const id = event.get('objectId');
                const type = event.get('type');
                const currentPin = this.$refs.map.querySelector(`.r-location-shield[data-pk="${id}"]`);

                if (!currentPin) {
                    return;
                }

                if (type === 'mouseenter') {
                    currentPin.classList.add('_hover');
                } else if (type === 'mouseleave') {
                    currentPin.classList.remove('_hover');
                }
            },

            changeOffice(id) {
                if (!this.$refs.map) {
                    return;
                }

                const currentPin = this.$refs.map.querySelector(`.r-location-shield[data-pk="${id}"]`);

                if (id === this.currentOffice?.id || !currentPin) {
                    return;
                }

                const pins = this.$refs.map.querySelectorAll('.r-location-shield');

                pins.forEach(pin => {
                    if (Number(pin.dataset.pk) !== id) {
                        pin.classList.add('_disabled');
                    } else {
                        pin.classList.remove('_disabled');
                    }
                });

                this.currentOffice = this.validOffices.find(validOffice => validOffice.id === id);
            },

            onClickZoom(zoomIn = true) {
                if (this.map) {
                    const newZoom = zoomIn ? this.map.getZoom() + 1 : this.map.getZoom() - 1;
                    this.map.setZoom(newZoom, {
                        smooth: true,
                        checkZoomRange: true,
                        duration: 300,
                    });
                }
            },

            setBounds() {
                this.map.setBounds(this.map.geoObjects.getBounds(), {
                    checkZoomRange: true,
                    useMapMargin: false,
                    zoomMargin: this.zoomMargin,
                    preciseZoom: true,
                    duration: 300,
                });
            },

            updateMapCenter() {
                if (!this.map || this.lastResolution === this.$deviceIs.device) {
                    return;
                }

                if (this.$deviceIs.tablet) {
                    const [officeY, officeX] = this.officeCoords;
                    const bounds = this.map.getBounds();
                    const rightBottom = bounds[1];
                    const offsetRightX = officeX - ((rightBottom[1] - officeX) / 2);

                    this.center = [officeY, offsetRightX];
                    this.map.setCenter(this.center);
                    return;
                }

                if (this.center[0] === this.officeCoords[0] && this.center[1] === this.officeCoords[1]) {
                    return;
                }

                this.map.setCenter(this.officeCoords);
            },

            handleResize() {
                requestAnimationFrame(() => {
                    this.updateMapCenter();
                    this.updateSliderBottom();
                    this.calculateRadioBtnsPos();
                    this.lastResolution = this.$deviceIs.device;
                });
            },

            openForm() {
                const orderData = {
                    formTitle: `Записаться на встречу в офис продаж. Проект - ${this.projectName || 'страница проекта'}`,
                    formSource: `Страница ${this.project?.name}: Офис продаж`,
                    formComment: clearDoubleSpaces(`
                        Проект: ${this.projectName || ''};
                        Город проекта: ${this.projectCityName || ''};
                        Выбранный офис: ${this.currentOffice?.address};
                    `),
                };

                this.$modal.open(FormModal, {
                    ...orderData,
                    type: 'meeting',
                    title: 'Записаться на встречу',
                    btnText: 'Записаться',
                    additionalInputs: [
                        {
                            id: 'meeting',
                            placeholder: 'Тип встречи',
                            type: 'select',
                            vModel: '',
                            error: false,
                            errorMsg: '',
                            isFocus: false,
                            required: true,
                            bordered: true,
                            options: [
                                {
                                    value: 'first',
                                    label: 'Первая'
                                },
                                {
                                    value: 'second',
                                    label: 'Повторная'
                                }
                            ]
                        }
                    ]
                });
            },

            openPhotosModal() {
                this.isShowPhotos = true;
            },

            closePhotosModal() {
                this.isShowPhotos = false;
            },

            updateSliderBottom() {
                if (this.$refs.info) {
                    if (this.lastResolution !== this.$deviceIs.device) {
                        this.sliderBottom = this.$refs.info.offsetHeight - this.$refs.content.offsetHeight - 16;
                    }
                }
            },

            // Маршруты

            updateAddress(value) {
                this.addressValue = value;
            },

            buildRoute() {
                if (this.addressValue === this.fullAddress) {
                    return;
                }

                const address = this.addressValue;
                const locationShield = document.querySelector('.r-location-shield');

                if (this.multiRoute) {
                    this.resetRoute();
                }

                this.isRouteLoading = true;
                this.multiRoute = new this.ymaps.multiRouter.MultiRoute({
                    // Точки маршрута. Точки могут быть заданы как координатами, так и адресом.
                    referencePoints: [
                        this.officeCoords,
                        address,
                    ]
                }, {
                    // Автоматически устанавливать границы карты так,
                    // чтобы маршрут был виден целиком.
                    boundsAutoApply: true,

                    // Внешний вид линии маршрута.
                    routeActiveStrokeWidth: 4,
                    routeActiveStrokeColor: '#38ADC2',
                    routeActiveWalkSegmentStrokeColor: '#38ADC2',
                    wayPointStartVisible: false,

                    // Иконка для финальной точки
                    wayPointFinishIconLayout: endWaypointPinTemplate(this.ymaps, 'auto'),
                    type: 'car'
                });

                if (locationShield) {
                    locationShield.classList.add('_without-marker');
                }
                this.map.geoObjects.add(this.multiRoute);

                this.multiRoute.model.events.add('requestsuccess', this.handleRouteSuccess);
                this.multiRoute.model.events.add('requestfail', this.handleRouteFail);
            },

            resetRoute() {
                if (!this.multiRoute) {
                    return;
                }
                const locationShield = document.querySelector('.r-location-shield');
                if (locationShield) {
                    locationShield.classList.remove('_without-marker');
                }

                this.map.geoObjects.remove(this.multiRoute);
                this.routeDuration = '';
                this.transportType = '';
                this.addressValue = '';
                this.fullAddress = '';
                this.isRouteLoading = false;
                this.multiRoute = null;
            },

            updateTransportType(value) {
                this.isRouteLoading = true;
                this.transportType = value;
                this.multiRoute.model.setParams({
                    routingMode: this.transportType,
                });
                this.changeEndWaypointIcon();
            },

            changeEndWaypointIcon() {
                const el = document.querySelector('.end-waypoint');
                const activeIcon = el.querySelector('._active');
                const currentIcon = el.querySelector(`.end-waypoint__icon_${this.transportType}`);

                if (activeIcon) {
                    activeIcon.classList.remove('_active');
                }
                if (currentIcon) {
                    currentIcon.classList.add('_active');
                }
            },

            handleRouteSuccess() {
                const activeRoute = this.multiRoute.getActiveRoute();
                if (activeRoute) {
                    const type = activeRoute.properties.get('type');
                    this.routeDuration = activeRoute.properties.get('duration').text;
                    this.transportType = type === 'driving' ? 'auto' : this.transportType;
                    this.fullAddress = this.multiRoute?.model?.properties?.get('waypoints')[1]?.address;
                    this.addressValue = this.fullAddress;
                } else {
                    console.warn('[multiRoute] No active route');
                }

                this.isRouteLoading = false;
            },

            handleRouteFail() {
                console.error('[multiRoute] Route building error');
                this.isRouteLoading = false;
            },

            convertCoordinates(coordinates) {
                return [Number(coordinates.latitude), Number(coordinates.longitude)];
            },

            calculateRadioBtnsPos() {
                if (this.$refs.info && this.$refs.map) {
                    const infoClientRect = this.$refs.info.getBoundingClientRect();
                    this.radioBtnsStyles = {
                        right: this.$deviceIs.mobile
                            ? '50%'
                            : ((this.$refs.map.offsetWidth - (infoClientRect.left + infoClientRect.width)) / 2) + 'px',
                    };
                    return;
                }

                this.radioBtnsStyles = {
                    right: '50%',
                };
            },
        }
    };
</script>

<style lang="scss" module>
    .ProjectOffice {
        position: relative;
        width: 100%;
        height: 61rem;

        @include respond-to(xs) {
            height: auto;
        }
    }

    .map {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: $base-50;

        & * {
            touch-action: auto;
        }

        @include respond-to(xs) {
            height: 32rem;
        }
    }

    .zoomControls {
        position: absolute;
        top: 50%;
        right: 2.4rem;
        z-index: 1;
        transform: translateY(-50%);
    }

    .radioBtns {
        position: absolute;
        top: 2.4rem;
        right: 50%;
        z-index: 1;
        transform: translateX(50%);

        @include respond-to(xs) {
            top: 1.6rem;
        }
    }

    .info {
        position: absolute;
        top: 2.4rem;
        bottom: 2.4rem;
        left: 2.4rem;
        z-index: 1;
        overflow: hidden;
        width: 38.1rem;
        border-radius: .8rem;
        background: linear-gradient(0deg, rgba(15, 17, 17, 1) 0%, rgba(15, 17, 17, 1) 50%, rgba(15, 17, 17, 0) 100%);

        @include respond-to(sm) {
            width: 36rem;
        }

        @include respond-to(xs) {
            position: static;
            width: 100%;
            border-radius: unset;
        }
    }

    .slider {
        position: relative;
        width: 100%;
        height: 34.5rem;

        @include respond-to(xs) {
            display: none;
        }
    }

    .modalSlider {
        width: 100%;
        height: 35rem;
        margin-bottom: 2.4rem;
        padding-bottom: 3rem;
    }

    .content {
        position: absolute;
        right: 1.6rem;
        bottom: 1.6rem;
        left: 1.6rem;
        z-index: 2;
        overflow: hidden;
        padding: 2rem 1.6rem;
        border-radius: .8rem;
        background-color: $base-0;

        @include respond-to(xs) {
            position: static;
            padding: 2.4rem 1.6rem;
            border-radius: unset;
        }
    }

    .contentHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;

        @include respond-to(xs) {
            padding-bottom: 1.6rem;
            border-bottom: 1px solid $base-100;
        }
    }

    .imgWrapper {
        position: relative;
        overflow: hidden;
        display: none;
        width: 6.4rem;
        height: 6.4rem;
        border-radius: .8rem;
        cursor: pointer;

        &:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 100%;
            background-color: $base-800;
            opacity: 0;
            transition: opacity $default-transition;
        }

        &:hover:before {
            opacity: .4;
        }

        @include respond-to(xs) {
            display: block;
        }
    }

    .imgIcon {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 2;
        width: 2.4rem;
        height: 2.4rem;
        color: $base-0;
        transform: translateX(-50%) translateY(-50%);
    }

    .title {
        display: block;
        text-transform: uppercase;
        font-weight: 600;
    }

    .text {
        margin-top: 1.2rem;
    }

    .btns {
        display: flex;
        margin-top: 2.4rem;
    }

    .btn {
        flex: 1;
        margin-right: .8rem;

        &:last-child {
            margin-right: 0;
        }
    }

    .backBtn {
        display: flex;
        align-items: center;
        margin-bottom: 1.6rem;
        cursor: pointer;
    }

    .backBtnIcon {
        width: 1.2rem;
        height: 1.2rem;
        color: $blue;
    }

    .backBtnText {
        margin-top: .3rem;
        margin-left: 1.2rem;
        color: $base-500;
    }
</style>
