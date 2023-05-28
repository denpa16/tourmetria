<template>
    <div :class="$style.ProjectsMap">
        <div id="map"
             ref="container"
             :class="$style.map">

            <ZoomControls :class="$style.controls"
                          :zoom-in-disabled="map._zoom && map._zoom === maxZoom"
                          :zoom-out-disabled="map._zoom && map._zoom === minZoom"
                          @click-zoom-in="onClickZoom"
                          @click-zoom-out="onClickZoom(false)"
            />

            <div :class="$style.projects">
                <div :class="$style.btnPanel">
                    <VSelect
                        :class="[$style.citySelect, 'p6']"
                        :options="cities"
                        :value="getCurrentCity.value"
                        margin-dropdown="3rem"
                        min-width-dropdown="49.6rem"
                        :is-tabs="isAnyRegions"
                        bordered
                        modal-breakpoint="xs"
                        @input="handleInput"
                    >
                        <template #icon>
                            <IconLocation :class="$style.icon" />
                        </template>
                    </VSelect>
                    <VSquareButton aria-label="Фильтр"
                                   @click="$emit('open-filters')">
                        <IconFilters :class="$style.iconFilters" />
                    </VSquareButton>
                </div>
                <div ref="list"
                     :class="$style.cards">
                    <ProjectsMapList :project-list="projectList"
                                     :active-id="activeProjectId"
                                     @scroll-to="scrollToElement"
                                     @change-id="changeActiveId" />
                </div>
            </div>

            <div :class="$style.mobileBtnPanel">
                <VButton @click="$emit('open-filters')">
                    Фильтр
                </VButton>
                <VSelect
                    ref="select"
                    :class="[$style.citySelect, 'p6']"
                    :options="cities"
                    :value="getCurrentCity.value"
                    margin-dropdown="3rem"
                    min-width-dropdown="49.6rem"
                    :is-tabs="isAnyRegions"
                    bordered
                    modal-breakpoint="xs"
                    @input="handleInput"
                >
                    <template #icon>
                        <IconLocation :class="$style.icon" />
                    </template>
                </VSelect>
            </div>

            <HintOverlay v-show="($deviceIs.tablet || $deviceIs.mobile)"
                         animation="move" />
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';

    let ymaps = '';

    // Utils
    import ymapsLoader from 'ymaps';
    import {
        apiKey,
        r_getClusterProjectTemplate,
        h_getClusterProjectTemplate,
        r_projectPinTemplate,
    } from 'assets/js/utils/ya-maps';

    import ZoomControls from '~/components/common/ZoomControls';
    import ProjectsMapList from '~/components/common/projects/ProjectsMapList';
    import IconLocation from '~/components/icons/IconLocation';
    import IconFilters from '~/components/icons/IconFilters';
    import ProjectsMapListModal from '~/components/common/projects/ProjectsMapListModal';
    import HintOverlay from '~/components/common/HintOverlay';

    export default {
        name: 'ProjectsMap',

        components: {
            ZoomControls,
            ProjectsMapList,
            IconLocation,
            IconFilters,
            HintOverlay,
        },

        props: {
            projectList: {
                type: Array,
                default: () => [],
                required: true,
            },

            coordsName: {
                type: String,
                default: 'coordinates',
            },

            values: {
                type: Object,
                default: () => ({}),
            },

            specs: {
                type: Object,
                default: () => ({}),
            },

            facets: {
                type: Object,
                default: () => ({}),
            },

            cities: {
                type: Array,
                default: () => [],
            },
        },

        data() {
            return {
                inited: false,
                map: '',
                markers: [],
                objectCollection: null,
                UAMob: null,
                objectManager: null,
                zoomMargin: [128, 128, 128, 350],
                clusterZoomMargin: [128, 128, 128, 350],
                zoom: 8,
                minZoom: 3,
                maxZoom: 18,
                activeProjectId: null,
                center: [45.035470, 38.975313],
            };
        },

        computed: {
            ...mapGetters({
                getCurrentCity: 'getCurrentCity',
            }),

            isAnyRegions() {
                return this.cities.some(city => city.group);
            },
        },

        watch: {
            projectList() {
                if (this.map) {
                    this.map.destroy();
                }

                this.inited = false;

                if (!this.inited) {
                    this.loadMap();
                }
            },
        },

        mounted() {
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
            ...mapActions(['setCurrentCity']),
            ...mapActions('projects', ['fetchCurrentCityProject', 'setParams']),

            handleInput(value) {
                const city = this.cities.find(city => (city.value === value) || (city.value === value?.value)) || this.cities[0];
                this.setCurrentCity(city);
                this.fetchCurrentCityProject(city);
            },

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
                    ymaps = maps;
                    this.initMap();
                })
                    .catch(error => console.log('Failed to load Yandex Maps', error));
            },

            initMap() {
                this.map = new ymaps.Map('map', {
                    center: [45.035470, 38.975313],
                    zoom: 8,
                    controls: [],
                }, {
                    minZoom: this.minZoom,
                    maxZoom: this.maxZoom,
                    maxAnimationZoomDifference: 50,
                    suppressMapOpenBlock: true,
                });

                // this.map.behaviors.disable('scrollZoom');
                this.addProjects();
                this.activateMarkers(this.projectList);
                this.inited = true;
            },

            addProjects() {
                this.objectManager = new ymaps.ObjectManager({
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

                    zoomMargin: this.clusterZoomMargin,
                    useMapMargin: true,
                    clusterIconLayout: r_getClusterProjectTemplate(ymaps),
                });

                this.map.geoObjects.add(this.objectManager);

                this.projectList.forEach(project => {
                    this.addProject(project);
                });

                /* Вешаем эвенты */
                this.objectManager.objects.events.add('click', this.onPinClick);
                this.objectManager.objects.events.add(['mouseenter', 'mouseleave'], this.handleHoverPin);
                this.objectManager.clusters.events.add(['mouseenter', 'mouseleave'], this.handleHoverCluster);
                this.map.events.add('click', this.closeSelect);
            },

            addProject(project) {
                if (!project[this.coordsName]) {
                    console.warn('not found project coords');
                    return;
                }

                // let coords;
                // if (typeof project[this.coordsName] === 'string' || project[this.coordsName] instanceof String) {
                //     coords = project[this.coordsName].split(',');
                // } else {
                //     coords = project[this.coordsName];
                // }

                // Установка шаблона пина
                const options = {
                    active: false,
                    iconLayout: r_projectPinTemplate(ymaps, project),
                };

                const projectPin = {
                    type: 'Feature',
                    id: project.id,
                    geometry: {
                        type: 'Point',
                        coordinates: [project[this.coordsName]?.latitude?.trim(), project[this.coordsName]?.longitude?.trim()],
                    },

                    properties: {
                        id: project.id,
                        name: project.name,
                    },

                    options: {...options},
                };

                if (project[this.coordsName]?.latitude && project[this.coordsName]?.longitude) {
                    this.objectManager.add(projectPin);
                    this.markers.push(projectPin);
                }
            },

            onPinClick(event) {
                let id;

                if (!event?.id) {
                    id = event.get('objectId');
                } else {
                    id = event.id;
                }

                if (this.$deviceIs.tablet || this.$deviceIs.mobile) {
                    this.activeProjectId = id;

                    this.$modal.open(ProjectsMapListModal, {
                        projects: this.activeProjectId ? this.reorderedProjects() : this.projectList,
                        activeProjectId: this.activeProjectId,
                        changeId: event => this.changeActiveId(event),
                    });
                } else {
                    this.changeActiveId(id);
                }
            },

            handleHoverPin(event) {
                if (!this.$refs.container) {
                    return;
                }

                const id = event.get('objectId');
                const type = event.get('type');
                const currentPin = this.$refs.container.querySelector(`.js-project-pin[data-pk="${id}"]`);

                if (!currentPin) {
                    return;
                }

                if (type === 'mouseenter') {
                    currentPin.classList.add('_hover');
                } else if (type === 'mouseleave') {
                    currentPin.classList.remove('_hover');
                }
            },

            handleHoverCluster(event) {
                if (!this.$refs.container) {
                    return;
                }

                const type = event.get('type');
                const objectId = event.get('objectId');

                if (type == 'mouseenter') {
                    setTimeout(() => {
                        this.objectManager.clusters.setClusterOptions(objectId, {
                            clusterIconLayout: h_getClusterProjectTemplate(ymaps),
                        });
                    }, 100);
                } else {
                    setTimeout(() => {
                        this.objectManager.clusters.setClusterOptions(objectId, {
                            clusterIconLayout: r_getClusterProjectTemplate(ymaps),
                        });
                    }, 100);
                }
            },

            reorderedProjects() {
                const filteredProjects = this.projectList.filter(el => el.id !== this.activeProjectId);
                const index = this.projectList.findIndex(el => el.id === this.activeProjectId);

                return [this.projectList[index]].concat(filteredProjects);
            },

            activateMarkers(projects) {
                if (!this.objectManager) {
                    return;
                }

                const projectsId = projects.map(project => project.id);

                this.objectManager.setFilter(object => projectsId.includes(object.properties.id));

                if (!this.inited) {
                    this.setBounds();
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

            async changeActiveId(val) {
                if (this.activeProjectId === val) {
                    this.activeProjectId = null;
                    this.setBounds();
                } else {
                    this.activeProjectId = val;
                    const coords = this.projectList.find(item => item.id === val).coordinates;

                    await this.map.panTo([
                        [coords.latitude, coords.longitude],
                        [coords.latitude, coords.longitude]
                    ], {
                        checkZoomRange: true,
                        delay: 0,
                        duration: 300,
                        flying: false,
                        safe: true
                    });

                    if (this.$deviceIs.laptop || this.$deviceIs.desktop) {
                        this.map.setZoom(15, {duration: 0});
                    }
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
        },
    };
</script>

<style lang="scss" module>
    .ProjectsMap {
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

    .projects {
        position: absolute;
        top: 50%;
        left: 2.4rem;
        z-index: 1;
        width: 36rem;
        height: calc(100% - 5rem);
        padding: 1.6rem 1.6rem 0;
        border-radius: .8rem;
        background-color: $base-0;
        transform: translateY(-50%);

        @include respond-to(sm) {
            display: none;
        }
    }

    .cards {
        overflow: auto;
        width: 100%;
        height: calc(100% - 5.2rem);
        scrollbar-color: $base-100 $base-0;
        scrollbar-width: thin;
        scroll-behavior: smooth;

        &::-webkit-scrollbar {
            width: 0;
        }
    }

    .icon {
        width: 1.2rem;
        height: 1.2rem;
    }

    .iconFilters {
        width: 1.6rem;
        height: 1.6rem;
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
</style>
