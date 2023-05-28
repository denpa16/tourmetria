<template>
    <div ref="container"
         :class="[$style.HomeGeographySubjects, {[$style._modal]: isModal}]">
        <div :class="$style.topContent"
             :style="{top: `${titleHeight}px`}">
            <transition-group name="fade-content"
                              mode="out-in">

                <button
                    v-if="activeStage === 'cities' && !activeCityId"
                    :key="activeStage"
                    :class="[$style.backBtn, {[$style._inactive]: isInfoCardShown}]"
                    value="Вернуться к выбору области"
                    @click="handleChangeActiveStage"
                >
                    <IconArrowBig :class="$style.iconArrow" />
                    <span class="p6">Вернуться к выбору области</span>
                </button>
            </transition-group>
        </div>

        <transition name="fade"
                    mode="out-in">
            <div
                v-if="activeStage === 'districts' && !activePin"
                :key="activeStage"
                :class="$style.hint"
            >
                Выберите область, чтобы <br> посмотреть города и проекты
            </div>

            <HomeGeographyInfoCard
                v-if="activeStage === 'cities' && !activePin"
                :key="activeStage"
                :class="$style.infoCard"
                :pin="activeDistrict"
                :active-stage="activeStage"
            />

            <HomeGeographyInfoCard
                v-if="isInfoCardShown"
                :key="activePin.id"
                :class="$style.infoCard"
                :pin="activePin"
                :active-stage="activeStage"
            />
        </transition>


        <transition name="fade-slow"
                    mode="out-in">
            <HomeGeographyMap
                v-if="activeStage === 'districts'"
                :key="activeStage"
                :preview="districtPreview"
                :image="districtImage"
                :image-width="imageWidth"
                :image-height="imageHeight"
                :points="regions"
                :active-stage="activeStage"
                :is-modal="isModal"
                @pointEnter="onPointEnter"
                @pointLeave="onPointLeave"
                @click="fetchCities"
            />

            <HomeGeographyMap
                v-if="activeStage === 'cities'"
                :key="activeStage"
                :preview="citiesPreview"
                :image="citiesImage"
                :image-width="imageWidth"
                :image-height="imageHeight"
                :points="cities"
                :active-stage="activeStage"
                :is-modal="isModal"
                @pointEnter="onPointEnter"
                @pointLeave="onPointLeave"
                @click="handleClickCity"
            />
        </transition>

        <transition name="fade-slow"
                    mode="out-in">
            <div v-if="!isModal && activeCityId && projects.length"
                 :class="$style.projectsContainer">
                <HomeGeographyProjects :projects="projects" />
            </div>
        </transition>

        <p
            v-if="isModal"
            :class="$style.mobileHint"
        >
            Выберите {{ activeStage === 'districts' ? 'область' : 'город' }}, чтобы <br>
            посмотреть {{ activeStage === 'districts' ? 'города и проекты' : 'проекты' }}
        </p>

        <ProjectsMapListModal :visible="projectModal"
                              :data="{projects: projects, geographyModal: true}"
                              @close="handleCloseModal" />

        <transition name="fade">
            <Overlay v-if="projectModal" />
        </transition>
    </div>
</template>

<script>
    import HomeGeographyMap from '~/components/pages/home/geography/HomeGeographyMap';
    import HomeGeographyProjects from '~/components/pages/home/geography/HomeGeographyProjects';
    import IconArrowBig from '~/components/icons/IconArrowBig';
    import HomeGeographyInfoCard from '~/components/pages/home/geography/HomeGeographyInfoCard';
    import ProjectsMapListModal from '~/components/common/projects/ProjectsMapListModal';
    import Overlay from '~/components/layout/modals/Overlay';

    export default {
        name: 'HomeGeographySubjects',

        components: {
            HomeGeographyMap,
            HomeGeographyProjects,
            IconArrowBig,
            HomeGeographyInfoCard,
            ProjectsMapListModal,
            Overlay,
        },

        props: {
            districtImage: {
                type: String,
                default: '',
            },

            districtPreview: {
                type: String,
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

            regions: {
                type: Array,
                default: () => [],
            },

            titleHeight: {
                type: Number,
                default: 0,
            },

            isModal: {
                type: Boolean,
                default: false,
            }
        },

        data() {
            return {
                cities: [],
                citiesImage: '',
                citiesPreview: '',
                activeStage: 'districts',
                activeCityId: null,
                activeCity: null,
                projects: [],
                projectModal: false,
                isInfoCardShown: false,
                activePin: null,
                activeDistrict: null,
            };
        },

        methods: {
            async fetchCities(val) {
                try {
                    const res = await this.$axios.$get(this.$api.regions.slug(val.slug));
                    this.activeDistrict = val;
                    this.cities = res.cities;
                    this.citiesPreview = res.geography_image_preview;
                    this.citiesImage = res.geography_image_display;
                    this.activeStage = 'cities';
                } catch (e) {
                    console.log('[homeGeographyCities]:', e);
                }
            },

            async handleClickCity(val) {
                if (this.$deviceIs.tablet || this.$deviceIs.mobile) {
                    await this.fetchProjects(val.slug);
                    this.projectModal = true;
                } else {
                    this.$router.push({path: '/projects', query: {city: val.slug}});
                }
            },

            async fetchProjects(slug) {
                try {
                    const res = await this.$axios.$get(this.$api.cities.slug(slug));
                    this.projects = res.project_set || [];
                } catch (e) {
                    console.log('[homeGeographyProjects]:', e);
                }
            },

            handleChangeActiveStage() {
                this.activeStage = 'districts';
            },

            handleCloseModal() {
                this.projectModal = false;
            },

            onPointEnter(value) {
                this.isInfoCardShown = true;
                this.activePin = value;
                this.$emit('pointEnter');
            },

            onPointLeave() {
                this.isInfoCardShown = false;
                this.activePin = null;
                this.$emit('pointLeave');
            }
        }
    };
</script>

<style lang="scss" module>
    .HomeGeographySubjects {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;
    }

    .topContent {
        position: absolute;
        left: 0;
        z-index: 1;
        display: inline-block;
        padding: 2.4rem 2.4rem 0;

        @include respond-to(sm) {
            padding: 4rem 2.4rem 0;
        }

        @include respond-to(xs) {
            padding: 3rem 2.4rem 0;
        }
    }

    .hint {
        position: absolute;
        right: 2.4rem;
        bottom: 2.4rem;
        z-index: 1;
        width: 35.8rem;
        padding: 1.6rem;
        border-radius: .8rem;
        background-color: $base-50;
        font-family: $accent-font-family;
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 1.6rem;
        color: $base-300;

        @include respond-to(sm) {
            display: none;
        }
    }

    .infoCard {
        position: absolute;
        right: 2.4rem;
        bottom: 2.4rem;
        z-index: 2;

        @include respond-to(sm) {
            display: none;
        }
    }

    .backBtn {
        position: relative;
        display: flex;
        align-items: center;
        color: $base-0;
        transition: opacity $default-transition;
        cursor: pointer;

        @include hover {
            .iconArrow {
                transform: rotate(180deg) translateX(.5rem);
            }
        }

        &._inactive {
            opacity: .45;
        }
    }

    .iconArrow {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 1rem;
        margin-bottom: .2rem;
        color: $blue;
        transform: rotate(180deg);
        transition: transform .2s;
    }

    .projectsContainer {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 2;
        display: flex;
        align-items: flex-end;
        width: 100%;
        padding: 2.4rem;

        @include respond-to(sm) {
            display: none;
        }
    }

    .mobileHint {
        position: absolute;
        bottom: 4.8rem;
        left: 2.4rem;
        z-index: 1;
        width: fit-content;
        font-family: $accent-font-family;
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 1.6rem;
        color: $base-300;

        @include respond-to(xs) {
            bottom: 3.6rem;
            left: 2rem;
            color: $base-0;
        }
    }
</style>
