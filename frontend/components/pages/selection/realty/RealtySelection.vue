<template>
    <div :class="[$style.RealtySelection, 'container']">
        <p v-if="activeStage === 'projects' || activeStage === 'buildings'"
           :class="['p6', 'c-base300', $style.hint]">
            Выберите {{ activeStage === 'projects' ? 'проект' : 'корпус' }}
        </p>

        <!--Временно скрыла, пока редиректим на старый сайт-->
        <!--        <RealtyFilter :class="$style.filter"
                      :values="values"
                      :specs="specs"
                      :facets="facets"
                      :cities="listCities"
                      :sort-options="sortOptions"
                      :projects-count="projectsCount"
                      :buildings-count="buildingsCount"
                      :lots-count="lotsCount"
                      :active-stage="activeStage"
                      :is-reset-btn-disabled="isResetBtnDisabled"
                      :is-reloading="isReloading"
                      @clear-filter="$emit('clear-filter', $event)"
                      @change="$emit('change', $event)"
                      @reset="$emit('reset')"
                      @open-filter="handleOpenFiltersModal" />-->

        <RealtyProjectsList :items="items"
                            :realty-type="realtyType"
                            :active-stage="activeStage"
                            :class="$style.list"
                            @card-click="$emit('card-click', $event)" />

        <ProjectsFiltersModal v-if="isFiltersModalVisible"
                              :projects-count="items.length"
                              :buildings-count="buildingsCount"
                              :lots-count="lotsCount"
                              :values="values"
                              :specs="specs"
                              :facets="facets"
                              :cities="listCities"
                              :is-reloading="isReloading"
                              :is-reset-btn-disabled="isResetBtnDisabled"
                              page="realty"
                              :realty-type="realtyType"
                              :active-stage="activeStage"
                              @reset="$emit('reset')"
                              @change="$emit('change', $event)"
                              @close="handleCloseFiltersModal" />

        <transition name="overlay-appear">
            <Overlay v-if="isFiltersModalVisible"
                     @click="handleCloseFiltersModal" />
        </transition>

    </div>
</template>

<script>
    // import RealtyFilter from '~/components/pages/selection/realty/RealtyFilter';
    import RealtyProjectsList from '~/components/pages/selection/realty/RealtyProjectsList';
    import ProjectsFiltersModal from '~/components/common/projects/ProjectsFiltersModal';
    import Overlay from '~/components/layout/modals/Overlay';
    import {lockBody, unlockBody} from '~/assets/js/utils/lockUtilsMain';

    export default {
        name: 'RealtySelection',

        components: {
            // RealtyFilter,
            RealtyProjectsList,
            ProjectsFiltersModal,
            Overlay,
        },

        props: {
            items: {
                type: Array,
                default: () => [],
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

            projectsCount: {
                type: Number,
                default: 0,
            },

            buildingsCount: {
                type: Number,
                default: 0,
            },

            lotsCount: {
                type: Number,
                default: 0,
            },

            isResetBtnDisabled: {
                type: Boolean,
                default: false,
            },

            isReloading: {
                type: Boolean,
                default: false,
            },

            sortOptions: {
                type: Array,
                default: () => [],
            },

            realtyType: {
                type: String,
                default: 'parking',
            },

            activeStage: {
                type: String,
                default: 'projects',
            }
        },

        data() {
            return {
                isFiltersModalVisible: false,
            };
        },

        computed: {
            listCities() {
                return [
                    {label: 'Все города', value: ''},
                    ...this.specs.city,
                ];
            },
        },

        methods: {
            handleOpenFiltersModal() {
                this.isFiltersModalVisible = true;
                lockBody();
            },

            handleCloseFiltersModal() {
                this.isFiltersModalVisible = false;
                unlockBody();
            },
        }


    };
</script>

<style lang="scss" module>
    .RealtySelection {
        margin-top: .8rem;
    }

    .hint {
        text-align: center;
    }

    .filter {
        margin-top: 4rem;

        @include respond-to(xs) {
            margin-top: 2.4rem;
            margin-bottom: 1.6rem;
        }
    }

    .list {
        margin-top: 4rem;
    }
</style>
