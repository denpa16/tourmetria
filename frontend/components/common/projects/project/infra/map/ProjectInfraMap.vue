<template>
    <div :class="$style.ProjectsInfraMap">
        <div id="map"
             :class="$style.map">

            <ZoomControls v-if="!hideControls"
                          :class="$style.controls"
                          :zoom-in-disabled="map._zoom && map._zoom === maxZoom"
                          :zoom-out-disabled="map._zoom && map._zoom === minZoom"
                          @click-zoom-in="onClickZoom"
                          @click-zoom-out="onClickZoom(false)"
            />

            <ProjectInfraMapControlBox
                v-if="!hideControls"
                :class="$style.boxControl"
                :filters="filters"
                :infras-categories="infrasCategories"
                :time-specs="timeSpecs"
                :project-name="project.name"
                :address="address"
                :route-duration="routeDuration"
                :transport-type="transportType"
                :is-route-loading="isRouteLoading"
                @transport-activated="resetTimeFilter"
                @update-filters="updateFilters"
                @update-address="updateAddress"
                @build-route="buildRoute"
                @reset-route="resetRoute"
                @update-transport-type="updateTransportType"
            />

            <div v-if="!hideControls"
                 :class="[$style.btns, $style._top]">
                <VButton :class="[$style.btn, $style._infra]"
                         color="primary"
                         @click="handleOpenModal('category')"
                >
                    <template #default>
                        Показать инфраструктуру
                    </template>
                    <template #icon>
                        <IconRoute />
                    </template>
                </VButton>
                <VButton :class="[$style.btn, $style._white]"
                         color="light"
                         :disabled="Boolean(fullAddress)"
                         @click="handleOpenTimeModal"
                >
                    <template #default>
                        <IconWalk :class="$style.walkIcon" />
                        Радиус доступности
                        <span v-show="filters.time.values.length"
                              :class="[$style.walkTextAccent, 'c-blue']">
                            {{ filters.time.values[1] }} мин
                        </span>
                    </template>
                    <template #icon>
                        <IconArrowLeft :class="$style.arrowIcon" />
                    </template>
                </VButton>
            </div>

            <div v-if="!hideControls"
                 :class="[$style.btns, $style._bottom]">
                <VButton :class="$style.btn"
                         color="primary"
                         @click="handleOpenModal('category')"
                >
                    <template #default>
                        Категории
                    </template>
                    <template #icon>
                        <IconFilters />
                    </template>
                </VButton>
                <VButton :class="[$style.btn, $style._white]"
                         color="light"
                         @click="handleOpenModal('route')"
                >
                    <template #default>
                        Маршрут
                    </template>
                    <template #icon>
                        <IconTwoPoints />
                    </template>
                </VButton>
            </div>

            <div v-show="fullAddress"
                 :class="$style.addressLine">
                <IconMap :class="$style.addressIcon" />
                <span class="p6">{{ fullAddress }}</span>
            </div>

            <HintOverlay v-show="!hideOverlay && ($deviceIs.tablet || $deviceIs.mobile)"
                         animation="move">
                <template #icon>
                    <IconFinger />
                </template>
            </HintOverlay>

            <ProjectInfraMapFilterCategoryModal
                :class="$style.modal"
                :visible="modals.category.visible"
                :modal-data="modals.category.data"
                :value="filters.category.values"
                :infras-categories="infrasCategories"
                @update-filters="updateFilters"
                @open-route-modal="handleOpenModal('route')"
                @close="handleCloseModal"
            />

            <ProjectInfraMapRouteModal
                :class="$style.modal"
                :visible="modals.route.visible"
                :modal-data="modals.route.data"
                :project-name="project.name"
                :address="address"
                :route-duration="routeDuration"
                :transport-type="transportType"
                :is-route-loading="isRouteLoading"
                @update-address="updateAddress"
                @build-route="buildRoute"
                @reset-route="resetRoute"
                @update-transport-type="updateTransportType"
                @close="handleCloseModal"
            />

            <transition name="overlay-appear">
                <Overlay v-if="openedModal"
                         :class="$style.overlay"
                         @click="handleCloseModal" />
            </transition>
        </div>
    </div>
</template>

<script>
    let ymaps = '';

    // Utils
    import ymapsLoader from 'ymaps';
    import {
        apiKey, endWaypointPinTemplate, infraPinTemplate,
        r_getClusterProjectTemplate,
        rLocationProjectPinTemplate,
    } from '~/assets/js/utils/ya-maps';
    import {lockBody, unlockBody} from '~/assets/js/utils/lockUtilsMain';

    import ZoomControls from '~/components/common/ZoomControls';
    import HintOverlay from '~/components/common/HintOverlay';
    import Overlay from '~/components/layout/modals/Overlay';
    import SelectModal from '~/components/layout/modals/SelectModal';
    import ProjectInfraMapFilterCategoryModal from '~/components/common/projects/project/infra/map/filter/ProjectInfraMapFilterCategoryModal';
    import ProjectInfraMapRouteModal from '~/components/common/projects/project/infra/map/ProjectInfraMapRouteModal';
    import ProjectInfraMapControlBox from '~/components/common/projects/project/infra/map/ProjectInfraMapControlBox';
    import IconMap from '~/components/icons/IconMap';
    import IconFinger from '~/components/icons/IconFinger';
    import IconRoute from '~/components/icons/IconRoute';
    import IconWalk from '~/components/icons/IconWalk';
    import IconArrowLeft from '~/components/icons/IconArrowLeft';
    import IconFilters from '~/components/icons/IconFilters';
    import IconTwoPoints from '~/components/icons/IconTwoPoints';

    export default {
        name: 'ProjectsInfraMap',

        components: {
            ProjectInfraMapRouteModal,
            IconTwoPoints,
            IconFilters,
            IconArrowLeft,
            ZoomControls,
            HintOverlay,
            Overlay,
            ProjectInfraMapFilterCategoryModal,
            ProjectInfraMapControlBox,
            IconMap,
            IconFinger,
            IconRoute,
            IconWalk
        },

        props: {
            project: {
                type: Object,
                default: () => ({}),
                required: true,
            },

            coordsName: {
                type: String,
                default: 'coordinates',
            },

            infraCoordsName: {
                type: String,
                default: 'coords',
            },

            infras: {
                type: Array,
                default: () => []
            },

            infrasCategories: {
                type: Array,
                default: () => []
            },

            initialCategories: {
                type: Array,
                default: () => []
            },

            hideOverlay: {
                type: Boolean,
                default: false,
            },

            hideControls: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                inited: false,
                map: '',
                markers: [],
                circle: null,
                circleRadius: 0,
                currentTime: 0,
                objectCollection: null,
                UAMob: null,
                objectManagerProjects: null,
                objectManagerMarks: null,
                objectManagerCircleTooltip: null,
                zoomMargin: [64, 64, 24, 350],
                zoomMarginMobile: [64, 16, 64, 16],
                clusterZoomMargin: [256, 256, 256, 700],
                clusterZoomMarginMobile: 128,
                zoom: 15,
                minZoom: 1,
                maxZoom: 25,
                activeProjectId: null,
                center: [Number(this.project.coordinates.latitude), Number(this.project.coordinates.longitude)],
                multiRoute: null,
                transportType: null,
                routeDuration: '',
                isRouteLoading: false,
                address: '',
                fullAddress: '',
                filters: {
                    category: {
                        type: 'select',
                        values: this.initialCategories || []
                    },

                    time: {
                        type: 'range',
                        values: []
                    }
                },

                modals: {
                    category: {
                        visible: false,
                        data: {
                            title: 'инфраструктура',
                            subtitle: this.project.name
                        }
                    },

                    time: false,
                    route: {
                        visible: false,
                        data: {
                            title: 'Транспорт',
                        }
                    },
                },

                openedModal: ''
            };
        },

        computed: {
            coordsRangeSpecsFixated() {
                return {
                    5: (5 / 60) * 5 * 1000,
                    10: (10 / 60) * 5 * 1000,
                    15: (15 / 60) * 5 * 1000,
                    30: (30 / 60) * 5 * 1000,
                    45: (45 / 60) * 5 * 1000,
                };
            },

            timeSpecs() {
                return Object.keys(this.coordsRangeSpecsFixated).map(Number);
            },

            timeSpecsForModal() {
                return this.timeSpecs.map(value => ({value: value, label: `${value} мин.`}));
            }
        },

        watch: {
            project() {
                if (this.map) {
                    this.map.destroy();
                }

                this.inited = false;

                if (!this.inited) {
                    this.loadMap();
                }
            },

            filters: {
                handler: function(newVal) {
                    this.onChangeFilters(newVal);
                },

                deep: true
            },

            'modals.route.visible'(newVal) {
                if (newVal) {
                    this.resetTimeFilter();
                }
            },
        },

        beforeMount() {
            if (!this.inited) {
                this.loadMap();
            }
        },

        beforeDestroy() {
            if (this.map) {
                this.map.destroy();
            }

            this.inited = false;
            this.map = null;
        },

        methods: {
            loadMap() {
                const langDic = {
                    ru: 'ru_RU',
                    en: 'en_US',
                };

                ymapsLoader.load(`https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=${langDic['ru']}`).then(maps => {
                    ymaps = maps;
                    this.initMap();
                })
                    .catch(error => console.log('Failed to load Yandex Maps', error));
            },

            initMap() {
                if (!Object.keys(this.project).length) {
                    return;
                }

                this.map = new ymaps.Map('map', {
                    center: this.center,
                    zoom: this.zoom,
                    controls: [],
                }, {
                    minZoom: this.minZoom,
                    maxZoom: this.maxZoom,
                    maxAnimationZoomDifference: 50,
                    suppressMapOpenBlock: true,
                });

                this.addProject();
                this.initInfras();
                this.inited = true;

                this.map.panes.get('places').getElement().classList.add('_custom');
                this.onChangeFilters(this.filters);
            },

            addProject() {
                this.initObjectManager();
                this.initProject(this.project);
            },

            initObjectManager() {
                this.objectManagerProjects = new ymaps.ObjectManager({
                    clusterize: true,
                    gridSize: 256,
                    clusterHideIconOnBalloonOpen: false,
                    openBalloonOnClick: false,
                    minClusterSize: 2,
                    clusterIconOffset: [-48, -52],
                    clusterIconShape: {
                        type: 'Rectangle',
                        coordinates: [
                            [0, 0], [48, 52],
                        ],
                    },

                    zoomMargin: this.$deviceIs.pc ? this.clusterZoomMargin : this.clusterZoomMarginMobile,
                    useMapMargin: true,
                    clusterIconLayout: r_getClusterProjectTemplate(ymaps),
                });

                this.objectManagerMarks = new ymaps.ObjectManager({
                    clusterize: true,
                    gridSize: 128,
                    clusterHideIconOnBalloonOpen: false,
                    openBalloonOnClick: false,
                    minClusterSize: 2,

                    zoomMargin: this.$deviceIs.pc ? this.clusterZoomMargin : this.clusterZoomMarginMobile,
                    useMapMargin: false,
                    clusterIconLayout: 'default#pieChart',
                    clusterIconPieChartRadius: 20,
                    clusterIconPieChartCoreRadius: 15,
                    clusterIconPieChartStrokeWidth: 1,
                    hasBalloon: false
                });

                this.objectManagerCircleTooltip = new ymaps.ObjectManager({
                    clusterize: false,
                    useMapMargin: true,
                    hasBalloon: false
                });

                this.map.geoObjects.add(this.objectManagerProjects);
                this.map.geoObjects.add(this.objectManagerMarks);
                this.map.geoObjects.add(this.objectManagerCircleTooltip);
            },

            initProject(project) {
                if (!project[this.coordsName]) {
                    console.warn('not found project coords');
                    return;
                }

                // Установка шаблона пина
                const options = {
                    active: false,
                    iconLayout: rLocationProjectPinTemplate(ymaps, project, 'image_in_map_display'),
                };

                const projectPin = {
                    type: 'Feature',
                    id: project.id,
                    geometry: {
                        type: 'Point',
                        coordinates: [project[this.coordsName].latitude.trim(), project[this.coordsName].longitude.trim()],
                    },

                    properties: {
                        id: project.id,
                        name: project.name,
                    },

                    options: {...options},
                };

                this.objectManagerProjects.add(projectPin);
                this.markers.push(projectPin);
            },

            addInfra(infra) {
                if (!infra[this.infraCoordsName]) {
                    console.warn('not found infra coords');
                    return;
                }

                // Установка шаблона пина
                const options = {
                    active: false,
                    iconLayout: infraPinTemplate(ymaps, infra, infra.category_color),
                    iconColor: infra.category_color
                };

                const coords = infra[this.infraCoordsName].split(',').map(item => Number(item.trim()));

                const infraPin = {
                    type: 'Feature',
                    id: infra.id,
                    geometry: {
                        type: 'Point',
                        coordinates: coords,
                    },

                    properties: {
                        id: infra.id,
                        name: infra.name,
                        category: infra.category,
                        time: infra.time
                    },

                    options: {...options},
                };

                this.objectManagerMarks.add(infraPin);
                this.markers.push(infraPin);
            },

            initInfras() {
                this.infras.forEach(infra => this.addInfra(infra));
                this.objectManagerMarks.objects.events.add(['mouseenter', 'mouseleave', 'click'], this.handleInfraEvent);
                this.map.events.add('click', () => {
                    if (this.$deviceIs.tablet || this.$deviceIs.mobile) {
                        this.closeActivePin();
                    }
                });
            },

            closeActivePin() {
                const shields = document.querySelectorAll('.location-shield._active');
                const projects = document.querySelectorAll('.project-d-location-map__marker._active');
                const items = [...shields, ...projects];

                if (items.length) {
                    items.forEach(item => item.classList.remove('_active'));
                }
            },

            handleInfraEvent(event) {
                const id = event.get('objectId');
                const elem = document.querySelector(`.location-shield[data-pk="${id}"]`)
                    || document.querySelector(`.project-d-location-map__marker[data-pk="${id}"]`);

                if (this.$deviceIs.tablet || this.$deviceIs.mobile) {
                    if (event.get('type') === 'click') {
                        if (!elem.classList.contains('_active')) {
                            this.closeActivePin();
                        }
                        elem.classList.toggle('_active');
                    }
                    return;
                }

                if (event.get('type') === 'mouseenter') {
                    elem.classList.add('_active');
                } else if (event.get('type') === 'mouseleave') {
                    elem.classList.remove('_active');
                }
            },

            reorderedProjects() {
                const filteredProjects = this.projectList.filter(el => el.id !== this.activeProjectId);
                const index = this.projectList.findIndex(el => el.id === this.activeProjectId);

                return [this.projectList[index]].concat(filteredProjects);
            },

            filterMarkers(filters, objectManager) {
                if (!objectManager) {
                    return;
                }

                const filterEntries = Object.entries(this.filters).filter(filter => filter[1].values.length);

                objectManager.setFilter(object => filterEntries.every(([filterName, data]) => {
                    if (data.type === 'select') {
                        return data.values.includes(object.properties[filterName]);
                    } else if (data.type === 'range') {
                        const [min, max] = data.values;
                        return object.properties[filterName] >= min && object.properties[filterName] <= max;
                    }
                    console.warn('[Function/filterMarkers]: filter type is not defined');
                    return true;
                }));
            },

            onChangeFilters(newVal) {
                const timeValue = newVal.time.values[1];
                this.filterMarkers(this.filters, this.objectManagerMarks);
                if (this.currentTime !== timeValue) {
                    this.initRangeCircle(timeValue);
                }
                this.setBounds();
            },

            setBounds() {
                this.map.setBounds(this.map.geoObjects.getBounds(), {
                    checkZoomRange: true,
                    useMapMargin: false,
                    zoomMargin: this.$deviceIs.pc ? this.zoomMargin : this.zoomMarginMobile,
                    preciseZoom: true,
                    duration: 300,
                });
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

            scrollToElement(val) {
                if (this.$deviceIs.laptop || this.$deviceIs.desktop) {
                    setTimeout(() => {
                        const el = document.getElementById(val);
                        el.scrollIntoView({behavior: 'smooth', block: 'start'});
                    }, 500);
                }
            },

            closeSelect() {
                this.$refs.select.onClickOutside();
            },

            createCircle() {
                const circle = new ymaps.Circle([
                    // Координаты центра круга.
                    this.center,
                    // Радиус круга в метрах.
                    this.circleRadius,
                ], {}, {
                    // Цвет заливки.
                    fillImageHref: require('/static/images/project/infra/circle-bg.svg'),
                    fillMethod: 'stretch',
                    fillOpacity: 1,
                    // Цвет обводки.
                    strokeColor: '#38adc2',
                    strokeOpacity: 0.9,
                    strokeWidth: 2,
                });
                this.map.geoObjects.add(circle);
                this.circle = circle;
            },

            initRangeCircle(time) {
                this.currentTime = time;
                if (this.circle) {
                    this.destroyRangeCircles();
                }
                if (!time) {
                    return;
                }

                this.circleRadius = this.coordsRangeSpecsFixated[time];
                this.createCircle();
            },

            destroyRangeCircles() {
                if (this.circle) {
                    this.map.geoObjects.remove(this.circle);
                }
            },

            updateFilters(filterName, value) {
                this.filters[filterName].values = value;
            },

            resetTimeFilter() {
                this.updateFilters('time', []);
            },

            updateAddress(value) {
                this.address = value;
            },

            buildRoute() {
                if (this.address === this.fullAddress) {
                    return;
                }

                const address = this.address;
                const locationShield = document.querySelector('.r-location-shield');

                if (this.multiRoute) {
                    this.resetRoute();
                }

                this.isRouteLoading = true;

                this.multiRoute = new ymaps.multiRouter.MultiRoute({
                    // Точки маршрута. Точки могут быть заданы как координатами, так и адресом.
                    referencePoints: [
                        this.center,
                        address
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
                    wayPointFinishIconLayout: endWaypointPinTemplate(ymaps, 'auto'),
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
                this.multiRoute.model.events.remove('requestsuccess', this.handleRouteSuccess);
                this.multiRoute.model.events.remove('requestfail', this.handleRouteFail);
                this.map.geoObjects.remove(this.multiRoute);
                this.routeDuration = '';
                this.transportType = '';
                this.address = '';
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
                    this.address = this.fullAddress;
                } else {
                    console.warn('[multiRoute] No active route');
                }

                this.isRouteLoading = false;
            },

            handleRouteFail() {
                console.error('[multiRoute] Route building error');
                this.isRouteLoading = false;
            },

            handleOpenModal(name) {
                this.handleCloseModal();
                lockBody();
                this.modals[name].visible = true;
                this.openedModal = name;
            },

            handleCloseModal() {
                if (!this.openedModal) {
                    return;
                }
                unlockBody();
                this.modals[this.openedModal].visible = false;
                this.openedModal = '';
            },

            handleOpenTimeModal() {
                this.$modal.open(SelectModal, {
                    title: 'Радиус доступности',
                    options: this.timeSpecsForModal,
                    value: this.filters?.time.values[1],
                    type: 'value',
                    filter: value => {
                        this.updateFilters('time', [0, value?.value]);
                    },
                    btns: [
                        {
                            text: 'Сбросить',
                            color: 'dark',
                            handler: () => {
                                this.updateFilters('time', []);
                                this.$modal.close(SelectModal);
                            }
                        }
                    ]
                });
            }
        },
    };
</script>

<style lang="scss" module>
    .ProjectsInfraMap {
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
    }

    .map {
        z-index: 1;
        width: 100%;
        height: 100%;
        background-color: $base-50;

        & * {
            touch-action: auto;
        }
    }

    .controls {
        position: absolute;
        top: 50%;
        right: 2.4rem;
        z-index: 1;
        transform: translateY(-50%);

        @include respond-to(xs) {
            right: 1.6rem;
        }
    }

    .boxControl {
        position: absolute;
        top: 2.4rem;
        left: 2.4rem;
        z-index: 1;
    }

    .icon {
        width: 1.2rem;
        height: 1.2rem;
    }

    .btnPanel {
        display: flex;
        padding-bottom: .8rem;
    }

    .citySelect {
        flex: 1;
        margin-right: .8rem;

        @include respond-to(sm) {
            flex: unset;
            width: 27rem;

            &:global(.v-select--default.is-bordered .v-select__field) {
                border-color: $base-0;
                background-color: $base-0;
            }
        }

        @include respond-to(xs) {
            flex: 1;
            width: unset;
            margin-right: 0;
            margin-left: .7rem;

            &:global(.v-select--medium.is-bordered .v-select__field) {
                height: 4rem;
            }
        }
    }

    .mobileBtnPanel {
        position: absolute;
        top: 2.4rem;
        left: 2.4rem;
        z-index: 2;
        display: none;

        @include respond-to(sm) {
            display: block;
        }

        @include respond-to(xs) {
            top: unset;
            bottom: 0;
            left: unset;
            display: flex;
            width: 100%;
            padding: 1.6rem;

            & :global(.v-button--large) {
                height: 4rem;
            }
        }
    }

    .addressLine {
        position: absolute;
        bottom: 2.4rem;
        left: 2.4rem;
        z-index: 1;
        height: 3.6rem;
        padding: 1rem 1.6rem;
        border-radius: .4rem;
        background-color: $base-0;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);

        @include respond-to(sm) {
            display: none;
        }
    }

    .btns {
        position: absolute;
        left: 2.4rem;
        z-index: 1;
        display: none;

        @include respond-to(sm) {
            display: flex;
        }

        @include respond-to(xs) {
            left: 1.6rem;
        }

        &._top {
            top: 2.4rem;

            @include respond-to(xs) {
                top: 1.6rem;
                width: calc(100% - 1.6rem * 2 - 4rem - .8rem);
            }
        }

        &._bottom {
            top: unset;
            right: 1.6rem;
            bottom: 1.6rem;
            display: none;

            @include respond-to(xs) {
                display: flex;
            }
        }
    }

    .btn {
        justify-content: space-between;
        margin-right: 1.2rem;
        padding: 0 1.6rem;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);

        @include respond-to(xs) {
            flex: 1;
            height: 4rem;
        }

        &:last-child {
            margin-right: 0;
        }

        &._infra {
            @include respond-to(xs) {
                display: none;
            }
        }

        &._white {
            background-color: $base-0;
        }
    }

    .walkIcon {
        width: 1.4rem;
        height: 1.4rem;
        margin-right: 1rem;
        color: $base-300;
    }

    .walkTextAccent {
        margin-left: .4rem;
    }

    .arrowIcon {
        transform: rotate(-90deg);
    }

    .addressIcon {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 1rem;
        color: $base-800;
    }

    .modal {
        display: none;

        @include respond-to(sm) {
            display: block;
        }
    }

    .overlay {
        display: none;

        @include respond-to(sm) {
            display: block;
        }
    }
</style>
