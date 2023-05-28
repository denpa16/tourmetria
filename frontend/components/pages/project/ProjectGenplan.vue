<template>
    <div v-if="phases || buildings"
         ref="container"
         :class="$style.ProjectGenplan"
         :style="styles">
        <transition name="fade-slow"
                    mode="out-in">
            <ProjectGenplanRender v-if="currentStepData && isRenderStepMode"
                                  :key="currentStep.name"
                                  :current-step-data="currentStepData"
                                  :filtered-items="filteredItems"
                                  :infras="infrasWithDirection"
                                  :infras-categories="infrasCategories"
                                  :current-step="currentStep"
                                  :next-step="nextStep"
                                  :next-after-next-step="nextAfterNextStep"
                                  :is-show-infra="isShowInfra"
                                  :is-loading="isLoading"
                                  @next-step="goNextStep($event)"
                                  @click.native="handleCloseModal('Filters')" />

            <ProjectGenplanFloorPlan v-else-if="currentStepData && currentStep.name === 'floor' && isSchemeStepMode"
                                     :key="currentStep.name"
                                     :current-step-data="currentStepData"
                                     :prev-step-data="prevStepData"
                                     :facets="facets"
                                     :filtered-items="filteredItems"
                                     :current-step="currentStep"
                                     :active-floor="currentStepData.number"
                                     :is-show-floors-modal="isShowFloorsModal"
                                     :is-show-view-modal="isShowViewModal"
                                     :is-loading="isLoading"
                                     @change-floor="updateCurrentHistoryData"
                                     @close-floors-modal="handleCloseModal('Floors')"
                                     @click.native="handleCloseModal('Filters')" />

            <ProjectGenplanCheckerboard v-else-if="currentStepData && isSchemeStepMode && currentStep.name === 'checkerboard'"
                                        :key="currentStepData.id"
                                        :active-building="currentStepData"
                                        :filtered-items="filteredItems"
                                        :buildings="currentPhaseBuildings"
                                        :sections="activeSections"
                                        :is-sections-move-forward="isSectionsMoveForward"
                                        :is-loading="isLoading" />

            <ProjectGenplanScheme v-else-if="currentStepData && isSchemeStepMode"
                                  key="scheme"
                                  :current-step-data="currentStepData"
                                  :filtered-items="filteredItems"
                                  :current-step="currentStep"
                                  :next-step="nextStep"
                                  :next-after-next-step="nextAfterNextStep"
                                  :is-lot-modal="false"
                                  :is-loading="isLoading"
                                  info-modal-btn-text="Перейти к выбору"
                                  rounded-border
                                  @next-step="goNextStep($event)"
                                  @click.native="handleCloseModal('Filters')" />
        </transition>

        <ProjectGenplanControls v-if="!hideControls"
                                :compass-rotate="(currentStepData && currentStepData.compass_azimuth) || 0"
                                :current-step="currentStep"
                                :active-route="activeRoute"
                                :buildings="currentPhaseBuildings"
                                :active-building-id="currentStepId"
                                :sections="currentBuildingSections"
                                :active-section-id="activeSectionId"
                                :view-mode="viewMode"
                                :is-both-modes="isBothModes"
                                :is-show-infra="isShowInfra"
                                :is-back-active="Boolean(currentStepNumber)"
                                :is-last-step="isLastStep"
                                :is-show-filters-modal="isShowFiltersModal"
                                :is-filters-changed="isFilterDirty"
                                :is-show-infra-btn="Boolean(infras.length)"
                                :sections-per-view="sectionsPerView"
                                @change-infra="handleChangeInfra"
                                @change-view-mode="handleChangeViewMode"
                                @prev-step="goPrevStep"
                                @open-floors-modal="handleOpenModal('Floors')"
                                @open-view-modal="handleOpenModal('View')"
                                @open-filters-modal="handleOpenModal('Filters')"
                                @close-filters-modal="handleCloseModal('Filters')"
                                @change-building="updateCurrentHistoryData"
                                @change-sections="handleChangeSections"
                                @sections-next="isSectionsMoveForward = true"
                                @sections-back="isSectionsMoveForward = false" />

        <HintOverlay v-show="!hideControls && ($deviceIs.tablet || $deviceIs.mobile)"
                     animation="horizontal"
                     :text="hintOverlayText">
            <template #icon>
                <IconFinger />
            </template>
        </HintOverlay>

        <ProjectGenplanModalView :class="$style.viewMobileModal"
                                 :visible="isShowViewModal"
                                 :is-show-infra="isShowInfra"
                                 :view-mode="viewMode"
                                 :is-loading="isLoading"
                                 @change-infra="handleChangeInfra"
                                 @change-view-mode="handleChangeViewMode"
                                 @close="isShowViewModal = false" />

        <ProjectGenplanModalFilters v-if="isShowFiltersModal"
                                    :class="$style.filtersModal"
                                    :facets="facets"
                                    :specs="specs"
                                    :values="filterValues"
                                    :dirty-values="dirtyFilterValues"
                                    :step-count="stepCount"
                                    :next-step-name="nextStep && nextStep.label"
                                    :is-loading="isLoading"
                                    :is-filter-dirty="isFilterDirty"
                                    :project-slug="startStepData.slug"
                                    @clear-filters="clearFilters"
                                    @change="handleChangeFilterValues"
                                    @close="handleCloseModal('Filters')" />
    </div>
</template>

<script>
    import {convertToObject} from '~/assets/js/utils/commonUtils';

    import ProjectGenplanRender from '~/components/common/projects/project/genplan/ProjectGenplanRender';
    import ProjectGenplanScheme from '~/components/common/projects/project/genplan/ProjectGenplanScheme';
    import ProjectGenplanFloorPlan from '~/components/common/projects/project/genplan/ProjectGenplanFloorPlan';
    import ProjectGenplanCheckerboard from '~/components/common/projects/project/genplan/ProjectGenplanCheckerboard';
    import ProjectGenplanControls from '~/components/common/projects/project/genplan/ProjectGenplanControls';
    import ProjectGenplanModalView from '~/components/common/projects/project/genplan/modal/content/ProjectGenplanModalView';
    import ProjectGenplanModalFilters from '~/components/common/projects/project/genplan/modal/ProjectGenplanModalFilters';
    import HintOverlay from '~/components/common/HintOverlay';
    import IconFinger from '~/components/icons/IconFinger';

    export default {
        name: 'ProjectGenplan',
        components: {
            ProjectGenplanRender,
            ProjectGenplanScheme,
            ProjectGenplanFloorPlan,
            ProjectGenplanCheckerboard,
            ProjectGenplanControls,
            ProjectGenplanModalView,
            ProjectGenplanModalFilters,
            HintOverlay,
            IconFinger,
        },

        props: {
            phases: {
                type: Object,
                default: null,
            },

            buildings: {
                type: Object,
                default: null,
            },

            projectCoordinates: {
                type: Object,
                default: () => ({}),
            },

            infras: {
                type: Array,
                default: () => [],
            },

            infrasCategories: {
                type: Array,
                default: () => [],
            },

            fullscreenHeight: {
                type: Boolean,
                default: false,
            },

            hideControls: {
                type: Boolean,
                default: false,
            },

            hideOverlay: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                hintOverlayText: 'Двигайте горизонтальную карту пальцем.<br>Выберете интересующий объект',
                isShowInfra: false,
                currentStepNumbers: {
                    render: 0,
                    scheme: 0,
                    withoutRenderSteps: 0,
                    renderWithoutPhases: 0,
                    schemeWithoutPhases: 0,
                    withoutRenderStepsBuildingsStart: 0,
                },

                history: {
                    render: [],
                    scheme: [],
                    withoutRenderSteps: [],
                    renderWithoutPhases: [],
                    schemeWithoutPhases: [],
                    withoutRenderStepsBuildingsStart: [],
                },

                currentStepId: 0,
                currentPhaseIdForCheckerboard: [],
                currentPhaseBuildings: [],
                currentBuildingSections: [],
                activeSections: [],
                isSectionsMoveForward: true,
                sectionsPerView: 2,

                viewMode: 'render',
                isShowFiltersModal: false,
                isShowFloorsModal: false,
                isShowViewModal: false,
                isLoading: false,

                stepCount: 0,
                filterValues: {
                    price_min: '',
                    price_max: '',
                    area_min: '',
                    area_max: '',
                    rooms: [],
                    property_type: '',
                },

                facets: {},
                specs: {},
                filteredItems: null,
            };
        },

        computed: {
            styles() {
                if (!this.fullscreenHeight) {
                    return {
                        height: 'unset',
                    };
                }

                return {};
            },

            startStepData() {
                return this.phases || this.buildings;
            },

            startWithPhases() {
                return Boolean(this.phases);
            },

            steps() {
                return {
                    phases: {
                        name: 'phases',
                        type: 'render',
                        filterParams: {project: this.startStepData?.slug},
                        url: {
                            specs: this.$api.phases.specs,
                            facets: this.$api.phases.facets,
                            filter: this.$api.phases.list,
                        },

                        propNames: {
                            items: 'phase',
                            render_preview: 'genplan_preview',
                            render_display: 'genplan_display',
                            render_height: 'genplan_height',
                            render_width: 'genplan_width',
                            render_hover: 'render_hover_point[0].hover',
                            render_point: 'render_hover_point[0].point',
                            scheme_preview: 'genplan_scheme_preview',
                            scheme_display: 'genplan_scheme_display',
                            scheme_height: 'genplan_scheme_height',
                            scheme_width: 'genplan_scheme_width',
                            scheme_hover: 'scheme_hover_point[0].hover',
                            scheme_point: 'scheme_hover_point[0].point',
                            infra_point: 'project_genplan_point',
                        },

                        flatsLinkParams: {
                            project: this.startStepData?.slug,
                            completion_date: '{{completion_year}}-{{completion_quarter}}',
                        }
                    },

                    phaseGenplan: {
                        name: 'phases',
                        type: 'render',
                        filterParams: {project: this.startStepData?.slug},
                        url: {
                            specs: this.$api.buildings.specs,
                            facets: this.$api.buildings.facets,
                            filter: this.$api.buildings.list,
                        },

                        propNames: {
                            items: 'buildings',
                            render_preview: 'genplan_preview',
                            render_display: 'genplan_display',
                            render_height: 'genplan_height',
                            render_width: 'genplan_width',
                            render_hover: 'render_hover_point[0].hover',
                            render_point: 'render_hover_point[0].point',
                            scheme_preview: 'genplan_scheme_preview',
                            scheme_display: 'genplan_scheme_display',
                            scheme_height: 'genplan_scheme_height',
                            scheme_width: 'genplan_scheme_width',
                            scheme_hover: 'scheme_hover_point[0].hover',
                            scheme_point: 'scheme_hover_point[0].point',
                            infra_point: 'project_genplan_point',
                        },

                        flatsLinkParams: {
                            building: '{{id}}',
                        }
                    },

                    phase: {
                        name: 'phase',
                        type: 'render',
                        label: 'очередь',
                        filterParams: {phase: this.currentStepId},
                        url: {
                            data: this.$api.phases.id(this.currentStepId),
                            specs: this.$api.buildings.specs,
                            facets: this.$api.buildings.facets,
                            filter: this.$api.buildings.list,
                        },

                        flatsLinkParams: {
                            building: '{{id}}',
                        }
                    },

                    building: {
                        name: 'building',
                        type: 'render',
                        label: 'литер',
                        filterParams: {building: this.currentStepId},
                        url: {
                            data: this.$api.buildings.id(this.currentStepId),
                            specs: this.$api.sections.specs,
                            facets: this.$api.sections.facets,
                            filter: this.$api.sections.list,
                        },

                        flatsLinkParams: {
                            section: '{{id}}',
                        },
                    },

                    section: {
                        name: 'section',
                        type: 'render',
                        label: 'подъезд',
                        filterParams: {
                            section: this.currentStepId,
                            property_type: this.filterValues?.property_type || 'flat'
                        },

                        url: {
                            data: this.$api.sections.id(this.currentStepId),
                            specs: this.$api.floors.specs,
                            facets: this.$api.floors.facets,
                            filter: this.$api.floors.list,
                        },

                        flatsLinkParams: {
                            building: this.currentRenderBuildingId,
                            floor_min: '{{number}}',
                            floor_max: '{{number}}',
                        }
                    },

                    floor: {
                        name: 'floor',
                        label: 'этаж',
                        infoModalBtnText: 'План этажа',
                        filterParams: {},
                        filterRangeParams: {
                            section: this.currentRenderSectionId,
                            property_type: this.filterValues?.property_type || 'flat'
                        },

                        filterDataPropertyName: 'property_set',
                        propNames: {
                            scheme_svg: 'layout.plan',
                            scheme_png: 'layout.plan_png',
                            scheme_height: 'layout.plan_height',
                            scheme_width: 'layout.plan_width',
                            scheme_hover: 'floor_plan_hover',
                            scheme_point: 'floor_point',
                            items: 'property_set',
                        },

                        url: {
                            data: this.$api.floors.id(this.currentStepId),
                            specs: this.$api.floors.specs,
                            facets: this.$api.floors.facets,
                            filter: this.$api.floors.id(this.currentStepId),
                        },
                    },

                    checkerboard: {
                        name: 'checkerboard',
                        label: this.startWithPhases ? 'очередь' : 'литер',
                        filterParams: {},
                        filterDataPropertyName: 'sections',
                        url: {
                            data: this.$api.buildings.checkerboard(this.currentStepId),
                            specs: this.$api.buildings.specs,
                            facets: this.$api.buildings.facets,
                            filter: this.$api.buildings?.checkerboardFilter(this.currentStepId),
                        },
                    }
                };
            },

            genplanRoutes() {
                return {
                    render: {
                        name: 'render',
                        steps: [
                            {name: 'phases', mode: 'render'},
                            {name: 'phase', mode: 'render'},
                            {name: 'building', mode: 'render'},
                            {name: 'section', mode: 'render'},
                            {name: 'floor', mode: 'scheme'},
                        ],
                    },

                    scheme: {
                        name: 'scheme',
                        steps: [
                            {name: 'phases', mode: 'scheme'},
                            {name: 'checkerboard', mode: 'scheme'},
                        ],
                    },

                    renderWithoutPhases: {
                        name: 'renderWithoutPhases',
                        steps: [
                            {name: 'phaseGenplan', mode: 'render'},
                            {name: 'building', mode: 'render'},
                            {name: 'section', mode: 'render'},
                            {name: 'floor', mode: 'scheme'},
                        ],
                    },

                    schemeWithoutPhases: {
                        name: 'scheme',
                        steps: [
                            {name: 'phaseGenplan', mode: 'scheme'},
                            {name: 'checkerboard', mode: 'scheme'},
                        ],
                    },

                    withoutRenderSteps: {
                        name: 'withoutRenderSteps',
                        steps: [
                            {name: 'phases', mode: 'render'},
                            {name: 'checkerboard', mode: 'scheme'},
                        ],
                    },

                    withoutRenderStepsBuildingsStart: {
                        name: 'withoutRenderStepsBuildingsStart',
                        steps: [
                            {name: 'phaseGenplan', mode: 'render'},
                            {name: 'checkerboard', mode: 'scheme'},
                        ],
                    }
                };
            },

            isRender() {
                return this.viewMode === 'render';
            },

            isBothModes() {
                return Boolean(this.startStepData?.genplan_scheme_display) && Boolean(this.startStepData?.genplan_display);
            },

            isOnlyScheme() {
                if (this.isBothModes) {
                    return false;
                }

                return Boolean(this.startStepData?.genplan_scheme_display) && !this.startStepData?.genplan_display;
            },

            activeRoute() {
                if (this.startWithPhases) {
                    if (this.isBothModes) {
                        return this.isRender ? this.genplanRoutes.render : this.genplanRoutes.scheme;
                    }

                    if (this.isOnlyScheme) {
                        return this.genplanRoutes.scheme;
                    }

                    return this.genplanRoutes.withoutRenderSteps;
                }

                if (this.isBothModes) {
                    return this.isRender ? this.genplanRoutes.renderWithoutPhases : this.genplanRoutes.schemeWithoutPhases;
                }

                if (this.isOnlyScheme) {
                    return this.genplanRoutes.schemeWithoutPhases;
                }

                return this.genplanRoutes.withoutRenderStepsBuildingsStart;
            },

            currentStepNumber() {
                return this.currentStepNumbers[this.activeRoute.name];
            },

            currentStep() {
                const activeRouteStep = this.activeRoute.steps[this.currentStepNumber];
                return {
                    ...this.steps[activeRouteStep?.name],
                    mode: activeRouteStep?.mode,
                };
            },

            isLastStep() {
                return this.currentStepNumber === (this.activeRoute.steps.length - 1);
            },

            nextStep() {
                if (this.isLastStep) {
                    return null;
                }
                return this.steps[this.activeRoute.steps[this.currentStepNumber + 1].name];
            },

            nextAfterNextStep() {
                if (this.isLastStep || (this.currentStepNumber + 1) === (this.activeRoute.steps.length - 1)) {
                    return null;
                }
                return this.steps[this.activeRoute.steps[this.currentStepNumber + 2].name];
            },

            prevStep() {
                if (this.currentStepNumber === 0) {
                    return null;
                }
                return this.steps[this.activeRoute.steps[this.currentStepNumber - 1].name];
            },

            isRenderStepMode() {
                return this.currentStep.mode === 'render';
            },

            isSchemeStepMode() {
                return this.currentStep.mode === 'scheme';
            },

            currentHistory() {
                return this.history[this.activeRoute?.name];
            },

            currentStepData() {
                return this.currentHistory[this.currentStepNumber];
            },

            currentRenderBuildingId() {
                if (Array.isArray(this.genplanRoutes?.render?.steps)) {
                    const buildingStepNumber = this.genplanRoutes?.render?.steps.findIndex(({name}) => name === 'building');

                    if (buildingStepNumber >= 0) {
                        return this.history?.render[buildingStepNumber]?.id;
                    }
                }

                return null;
            },

            currentRenderSectionId() {
                if (Array.isArray(this.genplanRoutes?.render?.steps)) {
                    const sectionStepNumber = this.genplanRoutes?.render?.steps.findIndex(({name}) => name === 'section');

                    if (sectionStepNumber >= 0) {
                        return this.history?.render[sectionStepNumber]?.id;
                    }
                }

                return null;
            },

            nextStepData() {
                if (!this.nextStep) {
                    return null;
                }
                return this.currentHistory[this.currentStepNumber + 1];
            },

            prevStepData() {
                if (!this.prevStep) {
                    return null;
                }
                return this.currentHistory[this.currentStepNumber - 1];
            },

            dirtyFilterValues() {
                const arrayKeys = [];

                const res = Object.fromEntries(Object.entries(this.filterValues).filter(([key, value]) => {
                    if (Array.isArray(value)) {
                        const length = value.length;
                        if (length) {
                            arrayKeys.push(key);
                        }

                        return length;
                    }

                    return value !== '';
                }));

                if (arrayKeys.length) {
                    arrayKeys.forEach(key => res[key] = res[key].join(','));
                }

                return res;
            },

            isFilterDirty() {
                return Boolean(Object.keys(this.dirtyFilterValues)?.length);
            },

            filterParams() {
                return {
                    ...this.currentStep?.filterParams,
                    ...this.dirtyFilterValues,
                };
            },

            specsUrl() {
                return this.currentStep?.url?.specs;
            },

            facetsUrl() {
                return this.currentStep?.url?.facets;
            },

            filterUrl() {
                return this.currentStep?.url?.filter;
            },

            infrasWithDirection() {
                return this.infras.map(item => {
                    const projectCoords = [parseFloat(this.projectCoordinates.latitude), parseFloat(this.projectCoordinates.longitude)];
                    const itemCoords = item.coords.split(',').map(v => parseFloat(v.trim()));

                    let quadrant = 0;
                    const initialAngle = [0, 90, 180, 270];

                    if (projectCoords[0] <= itemCoords[0] && projectCoords[1] <= itemCoords[1]) {
                        quadrant = 0;
                    } else if (projectCoords[0] > itemCoords[0] && projectCoords[1] < itemCoords[1]) {
                        quadrant = 1;
                    } else if (projectCoords[0] > itemCoords[0] && projectCoords[1] > itemCoords[1]) {
                        quadrant = 2;
                    } else if (projectCoords[0] < itemCoords[0] && projectCoords[1] > itemCoords[1]) {
                        quadrant = 3;
                    }

                    const angle = Math.atan(Math.abs(projectCoords[1] - itemCoords[1]) / Math.abs(projectCoords[0] - itemCoords[0])) * 180 / Math.PI;
                    const angleFromMain = quadrant === 1 || quadrant === 3 ? 90 - angle : angle;
                    return {
                        ...item,
                        left: (initialAngle[quadrant] + angleFromMain - (this.currentStepData?.compass_azimuth || 0)) > 180,
                    };
                });
            },

            activeSectionId() {
                return Array.isArray(this.activeSections) && this.activeSections[0]?.id;
            }
        },

        watch: {
            viewMode() {
                if (this.currentStepNumbers?.render === this.currentStepNumbers?.scheme) {
                    return;
                }
                this.currentStepId = this.currentStepData.id;
            },

            currentStepId() {
                this.updateFilterResult();
            },

            currentStepData(val) {
                if (this.currentStep?.name === 'checkerboard') {
                    this.currentBuildingSections = val?.sections;
                }
            },

            filterValues() {
                if (!this.isFilterDirty) {
                    this.filteredItems = null;
                }
            },

            currentBuildingSections(val) {
                if (!val?.length) {
                    this.activeSections = [];
                }

                this.activeSections = val.slice(0, this.sectionsPerView);
            }
        },

        created() {
            if (this.startWithPhases) {
                if (this.isBothModes) {
                    this.history.render = [this.startStepData];
                    this.history.scheme = [this.startStepData];
                } else if (this.isOnlyScheme) {
                    this.history.scheme = [this.startStepData];
                } else {
                    this.history.withoutRenderSteps = [this.startStepData];
                }
            } else if (this.isBothModes) {
                this.history.renderWithoutPhases = [this.startStepData];
                this.history.schemeWithoutPhases = [this.startStepData];
            } else if (this.isOnlyScheme) {
                this.history.schemeWithoutPhases = [this.startStepData];
            } else {
                this.history.withoutRenderStepsBuildingsStart = [this.startStepData];
            }

            this.getFilterSpecs();
            this.getFilterFacets();
        },

        methods: {
            async getNextStepData(id) {
                if (this.nextStep.name === 'checkerboard' && this.startWithPhases) {
                    this.currentPhaseIdForCheckerboard = id;
                    this.currentPhaseBuildings = this.phases.phase?.find(phase => phase.id === id)?.buildings;
                    this.currentStepId = this.currentPhaseBuildings[0];
                } else {
                    this.currentStepId = id;
                }

                try {
                    const res = await this.$axios.$get(this.nextStep?.url?.data);
                    this.currentHistory.push(res);

                    if (this.nextStep.name === 'checkerboard') {
                        this.currentBuildingSections = res?.sections;
                    }
                } catch (e) {
                    console.error(`[getNextStepData]: ${e}`);
                }
            },

            async updateCurrentHistoryData(id) {
                this.isLoading = true;
                this.currentStepId = id;

                try {
                    const res = await this.$axios.$get(this.currentStep.url.data);
                    this.currentHistory.splice(this.currentStepNumber, 1, res);
                } catch (e) {
                    console.error(`[updateCurrentHistoryData]: ${e}`);
                } finally {
                    this.isLoading = false;
                }
            },

            async getFilterSpecs() {
                try {
                    const res = await this.$axios.$get(this.specsUrl, {
                        params: this.currentStep?.filterRangeParams || this.currentStep?.filterParams,
                        progress: false,
                    });
                    if (Array.isArray(res)) {
                        this.specs = convertToObject(res);
                    }
                } catch (e) {
                    console.error(`[getFilterSpecs]: ${e}`);
                }
            },

            async getFilterFacets() {
                try {
                    const filterParams = this.currentStep?.filterRangeParams || this.currentStep?.filterParams;
                    const res = await this.$axios.$get(this.facetsUrl, {
                        params: {
                            ...filterParams,
                            ...this.dirtyFilterValues,
                        },
                        progress: false,
                    });
                    this.stepCount = res.count;

                    if (Array.isArray(res?.facets)) {
                        this.facets = convertToObject(res.facets);
                    }
                } catch (e) {
                    console.error(`[getFilterFacets]: ${e}`);
                }
            },

            async getFilterData() {
                try {
                    const res = await this.$axios.$get(this.filterUrl, {
                        params: {
                            ...this.currentStep?.filterParams,
                            ...this.dirtyFilterValues,
                        },
                        progress: false,
                    });

                    if (res && typeof res === 'object' && this.currentStep?.filterDataPropertyName) {
                        this.filteredItems = res[this.currentStep?.filterDataPropertyName];
                        return;
                    }

                    this.filteredItems = res;
                } catch (e) {
                    console.error(`[getFilterData]: ${e}`);
                }
            },

            async goNextStep(id) {
                this.isLoading = true;

                if (this.currentStepNumber === (this.currentHistory.length - 1)) {
                    await this.getNextStepData(id);
                } else if (this.nextStepData?.id !== id && (this.nextStep.name === 'checkerboard' && this.currentPhaseIdForCheckerboard !== id)) {
                    this.currentHistory.length = this.currentStepNumber + 1;
                    await this.getNextStepData(id);
                }

                if (this.currentStepNumber < (this.activeRoute?.steps?.length - 1)) {
                    this.currentStepNumbers[this.activeRoute.name] = this.currentStepNumber + 1;
                }

                await this.updateFilterResult();
                this.isLoading = false;
            },

            goPrevStep() {
                this.isLoading = true;
                this.currentStepNumbers[this.activeRoute.name] = this.currentStepNumber - 1;
                this.updateFilterResult();
                this.isLoading = false;
            },

            handleChangeInfra() {
                this.isShowInfra = !this.isShowInfra;
            },

            handleChangeViewMode(value) {
                this.viewMode = value;
            },

            handleOpenModal(name) {
                this[`isShow${name}Modal`] = true;
            },

            handleCloseModal(name) {
                this[`isShow${name}Modal`] = false;
            },

            clearFilters() {
                if (!this.isFilterDirty) {
                    return;
                }

                const clearedFilters = Object.keys(this.dirtyFilterValues).reduce((res, key) => {
                    res[key] = '';
                    return res;
                }, {});

                this.filterValues = {
                    ...this.filterValues,
                    ...clearedFilters,
                };

                this.getFilterFacets();
            },

            async updateFilterResult() {
                await this.getFilterFacets();

                if (this.isFilterDirty) {
                    await this.getFilterData();
                }
            },

            async handleChangeFilterValues(values) {
                this.isLoading = true;
                this.filterValues = {
                    ...this.filterValues,
                    ...values,
                };

                await this.updateFilterResult();
                this.isLoading = false;
            },

            handleChangeSections(sections) {
                this.activeSections = sections;
            }
        },
    };
</script>

<style lang="scss" module>
    .ProjectGenplan {
        position: relative;
        width: 100%;
        height: calc(100vh - #{$header-h});
        min-height: 60rem;
        transition: all $default-transition;

        @include respond-to(xs) {
            height: calc(100vh - #{$header-mobile-h});
            min-height: 65rem;
        }
    }

    .viewMobileModal {
        display: none;

        @include respond-to(xs) {
            display: block;
        }
    }

    .filtersModal {
        &:global(.modal-wrap-custom) {
            position: absolute;
            top: 8rem;
            right: 2.4rem;
            left: unset;
            z-index: 10;

            @include respond-to(sm) {
                position: fixed;
                top: 0;
                right: unset;
                left: 0;
                z-index: 100;
            }
        }
    }
</style>
