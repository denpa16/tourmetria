<template>
    <div :class="$style.ProjectsList">
        <ProjectsFilters
            :projects-count="projects.length"
            :values="values"
            :specs="specs"
            :facets="facets"
            :cities="citiesInfo"
            :projects-page="projectsPage"
            :is-reset-btn-disabled="isResetBtnDisabled"
            :is-reloading="isReloading"
            @change="$emit('change', $event)"
            @clear-filter="$emit('clear-filter', $event)"
            @reset="$emit('reset')"
            @open-map="handleOpenMapModal"
        />

        <ProjectsListButtons ref="buttons"
                             :class="$style.btnPanel"
                             @open-filter="handleOpenFiltersModal"
                             @open-map="handleOpenMapModal" />

        <div v-if="projectsPage"
             :class="$style.sortPanel">
            <SortSelect
                :options="sortOptions"
                :value="values.order"
                label="Сортировать по"
                @change="$emit('change', {order: $event})" />

            <VButton :class="[$style.resetBtn, {[$style._disabled]: isResetBtnDisabled}]"
                     color="text"
                     size="medium"
                     icon-first
                     @click="$emit('reset')">
                Сбросить фильтр
                <template #icon>
                    <IconCross :class="$style.iconCross" />
                </template>
            </VButton>

            <p :class="['p6', 'c-base300', $style.projectsCount]">
                {{ projects.length }} {{ projects.length | plural(['проект', 'проекта', 'проектов']) }}
            </p>
        </div>

        <ProjectsCards
            :class="$style.cards"
            :projects="projects"
            :main-page="mainPage"
            :promo-list="promoList"
            @open-call-modal="$emit('open-call-modal')"
        />

        <ProjectsMapModal v-if="isMapModalVisible"
                          :project-list="projects"
                          :values="values"
                          :specs="specs"
                          :facets="facets"
                          :cities="citiesInfo"
                          @change="$emit('change', $event)"
                          @close="handleCloseMapModal"
                          @open-filters="handleOpenFiltersModal" />

        <ProjectsFiltersModal v-if="isFiltersModalVisible"
                              :projects-count="projects.length"
                              :values="values"
                              :specs="specs"
                              :facets="facets"
                              :cities="citiesInfo"
                              :projects-page="projectsPage"
                              :is-reloading="isReloading"
                              :is-reset-btn-disabled="isResetBtnDisabled"
                              @reset="$emit('reset')"
                              @change="$emit('change', $event)"
                              @close="handleCloseFiltersModal" />

        <transition name="overlay-appear">
            <Overlay v-if="isFiltersModalVisible"
                     @click="handleCloseFiltersModal" />
        </transition>

        <ProjectsListButtons v-if="!mainPage"
                             :class="[$style.stickyBtnPanel, {[$style._active]: isButtonsVisible}]"
                             @open-filter="handleOpenFiltersModal"
                             @open-map="handleOpenMapModal" />
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {lockBody, unlockBody} from '~/assets/js/utils/lockUtilsMain';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';

    import ProjectsCards from '~/components/common/projects/ProjectsCards';
    import ProjectsFilters from '~/components/common/projects/ProjectsFilters';
    import ProjectsFiltersModal from '~/components/common/projects/ProjectsFiltersModal';
    import Overlay from '~/components/layout/modals/Overlay';
    import ProjectsMapModal from '~/components/common/projects/ProjectsMapModal';
    import SortSelect from '~/components/common/SortSelect';
    import IconCross from '~/components/icons/IconCross';
    import ProjectsListButtons from '~/components/common/projects/ProjectsListButtons';

    export default {
        name: 'ProjectsList',

        components: {
            ProjectsCards,
            ProjectsFilters,
            ProjectsFiltersModal,
            Overlay,
            ProjectsMapModal,
            SortSelect,
            IconCross,
            ProjectsListButtons,
        },

        mixins: [breakpointCheck],

        props: {
            projects: {
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

            projectsPage: {
                type: Boolean,
                default: false,
            },

            sortOptions: {
                type: Array,
                default: () => [],
            },

            mainPage: {
                type: Boolean,
                default: false,
            },

            isResetBtnDisabled: {
                type: Boolean,
                default: false,
            },

            isReloading: {
                type: Boolean,
                default: false,
            },

            promoList: {
                type: Array,
                default: () => [],
            }
        },

        data() {
            return {
                isFiltersModalVisible: false,
                isMapModalVisible: false,
                isButtonsVisible: false,
            };
        },

        computed: {
            ...mapGetters({cities: 'getCities'}),

            citiesInfo() {
                return [
                    {
                        value: '',
                        label: 'Все города',
                    },
                    ...this.cities.map(city => {
                        if (city.region?.slug && city.region?.name) {
                            return {
                                value: city.slug,
                                label: city.name,
                                coordinates: {
                                    latitude: city.coordinates?.latitude ? parseFloat(city.coordinates?.latitude.trim()) : '',
                                    longitude: city.coordinates?.longitude ? parseFloat(city.coordinates?.longitude.trim()) : ''
                                },
                                group: {
                                    value: city.region.slug,
                                    label: city.region.name,
                                }
                            };
                        }

                        return {
                            value: city.slug,
                            label: city.name,
                            coords: city.coords,
                        };
                    }),
                ];
            },
        },

        mounted() {
            window.addEventListener('scroll', this.btnPanelVisibility);
        },

        beforeDestroy() {
            window.removeEventListener('scroll', this.btnPanelVisibility);
        },

        methods: {
            handleOpenMapModal() {
                this.isMapModalVisible = true;
                lockBody();
            },

            handleCloseMapModal() {
                this.isMapModalVisible = false;
                unlockBody();
            },

            handleOpenFiltersModal() {
                lockBody();
                this.isFiltersModalVisible = true;
            },

            handleCloseFiltersModal() {
                this.isFiltersModalVisible = false;
                if (!this.isMapModalVisible) {
                    unlockBody();
                }
            },

            btnPanelVisibility() {
                if (!this.mainPage && this.breakpoint === 'xs') {
                    const positionTop = this.$refs.buttons?.$el.getBoundingClientRect().top;
                    this.isButtonsVisible = positionTop < 0;
                }
            },
        }
    };
</script>

<style lang="scss" module>
    .ProjectsList {
        @include respond-to(sm) {
            & :global(.project-filters) {
                display: none;
            }
        }
    }

    .btnPanel {
        display: none;
        width: 100%;
        padding: 1.2rem 0;
        border-top: 1px solid $base-100;
        border-bottom: 1px solid $base-100;

        @include respond-to(sm) {
            display: flex;
        }

        @include respond-to(xs) {
            padding-top: 0;
            padding-bottom: 1.6rem;
            border-top: none;
        }
    }

    .cards {
        margin-top: 2.4rem;

        @include respond-to(xs) {
            margin-top: 1.6rem;
        }
    }

    .stickyBtnPanel {
        position: fixed;
        top: calc(#{$header-h} - 1px);
        left: 0;
        z-index: 10;
        width: 100%;
        padding: 1.6rem;
        background-color: $base-0;
        opacity: 0;
        transform: translateY(-100%);
        transition: all .3s linear, top 0s;

        @include respond-to(xs) {
            top: calc(#{$header-mobile-h} - 1px);
        }

        &._active {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .sortPanel {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 1.2rem;

        @include respond-to(sm) {
            margin-top: 1.6rem;
        }

        @include respond-to(xs) {
            display: none;
        }

        :global(.sort-label) {
            color: $base-800;
        }
    }

    .iconCross {
        width: .8rem;
        height: .8rem;
    }

    .resetBtn {
        margin-left: auto;
        -webkit-user-select: none;
        user-select: none;

        @include respond-to(sm) {
            display: none;
        }

        &._disabled {
            opacity: .44;
            pointer-events: none;
        }
    }

    .projectsCount {
        display: none;

        @include respond-to(sm) {
            display: block;
        }
    }
</style>
