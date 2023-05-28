<template>
    <div :class="$style.ProjectGenplanControls">
        <div :class="$style.leftTop">
            <VButton key="backBtn"
                     :class="[$style.backBtn, {[$style._active]: isBackActive}]"
                     :color="isLastStep ? 'light' : 'white-additional'"
                     shadow
                     icon-first
                     @click="$emit('prev-step')">
                <template #icon>
                    <IconArrowLeft />
                </template>
                <template #default>
                    Назад
                </template>
            </VButton>
            <transition name="fade">
                <RadioButtonsGroup v-if="!isLastStep && isBothModes"
                                   :class="$style.viewBtns"
                                   :btn-list="viewBtns"
                                   :value="viewMode"
                                   shadow
                                   @change-view="handleChangeView" />
            </transition>
        </div>


        <div :class="$style.filters">
            <!--            <transition name="fade">-->
            <!--                <RadioButtonsGroup v-if="!isLastStep"-->
            <!--                                   :class="$style.lotTypeBtns"-->
            <!--                                   :btn-list="lotTypeBtns"-->
            <!--                                   shadow-->
            <!--                                   @change-lot-type="$emit('change-lot-type', $event)" />-->
            <!--            </transition>-->

            <VButton :class="$style.filterBtn"
                     :color="isFiltersChanged ? 'white' : 'primary'"
                     shadow
                     @click="isShowFiltersModal ? $emit('close-filters-modal') : $emit('open-filters-modal')">
                Фильтр
            </VButton>

            <VButton v-if="!isLastStep && isBothModes"
                     :class="[$style.filterBtn, $style._mobile]"
                     color="white-additional"
                     shadow
                     @click="$emit('open-view-modal')">
                Вид генплана
            </VButton>

            <VButton v-show="isShowInfraBtn && currentStep.mode === 'render' && !isBothModes"
                     :class="[$style.btnWithCheckbox, $style._mobile]"
                     color="white-additional"
                     shadow
                     @click="$emit('change-infra')">
                <VCheckbox :false-value="false"
                           :value="isShowInfra"
                           :class="$style.checkbox"
                           readonly
                >
                    Инфраструктура
                </VCheckbox>
            </VButton>

            <VButton v-if="isShowFloorsBtn"
                     :class="[$style.filterBtn, $style._mobile, $style._floors]"
                     color="light"
                     shadow
                     @click="$emit('open-floors-modal')">
                <template #default>
                    Этаж
                </template>
                <template #icon>
                    <IconArrowLeft :class="$style.filterBtnArrowIcon" />
                </template>
            </VButton>

            <ProjectGenplanNavigation v-show="isShowCheckerboardNavigation && $deviceIs.mobile"
                                      :class="$style.sectionNavigation"
                                      :items="sections"
                                      :active-item-id="activeSectionId"
                                      :items-per-view="sectionsPerView"
                                      label="Подъезд"
                                      @change-items="handleSectionsChange"
                                      @next="$emit('sections-next')"
                                      @back="$emit('sections-back')" />
        </div>

        <transition name="fade">
            <div v-show="!isLastStep || !$deviceIs.pc"
                 :class="$style.links">
                <transition name="fade">
                    <RadioButtonsGroup v-if="!isLastStep && isBothModes"
                                       :class="[$style.viewBtns, $style._tablet]"
                                       :btn-list="viewBtns"
                                       :value="viewMode"
                                       shadow
                                       @change-view="handleChangeView" />
                </transition>
                <VButton v-show="isShowInfraBtn && viewMode === 'render' && (!isLastStep || $deviceIs.pc)"
                         :class="$style.btnWithCheckbox"
                         color="white-additional"
                         shadow
                         @click="$emit('change-infra')">
                    <VCheckbox :false-value="false"
                               :value="isShowInfra"
                               :class="$style.checkbox"
                               readonly
                    >
                        Инфраструктура
                    </VCheckbox>
                </VButton>
                <!--                <VButton :class="$style.btnLink"-->
                <!--                         color="white-additional"-->
                <!--                         shadow>-->
                <!--                    Панорама-->
                <!--                </VButton>-->
                <!--                <VButton :class="$style.btnLink"-->
                <!--                         color="white-additional"-->
                <!--                         shadow>-->
                <!--                    Онлайн-камеры-->
                <!--                </VButton>-->
            </div>
        </transition>

        <transition name="fade">
            <div v-if="isShowCompass"
                 :class="[$style.compassWrapper, {[$style._shadow]: !isLastStep}]"
                 :style="{ backgroundColor: isLastStep ? 'transparent' : null }">
                <Compass :rotate-deg="compassRotate"
                         :size="$deviceIs.mobile ? 'small' : 'medium'" />
            </div>
        </transition>

        <ProjectGenplanNavigation v-show="isShowCheckerboardNavigation && !$deviceIs.mobile"
                                  :class="$style.sectionNavigation"
                                  :items="sections"
                                  :active-item-id="activeSectionId"
                                  :items-per-view="sectionsPerView"
                                  label="Подъезд"
                                  @change-items="handleSectionsChange"
                                  @next="$emit('sections-next')"
                                  @back="$emit('sections-back')" />

        <ProjectGenplanNavigation v-show="isShowCheckerboardNavigation"
                                  :class="$style.buildingNavigation"
                                  :items="buildings"
                                  :active-item-id="activeBuildingId"
                                  label="Литер"
                                  @change-items="handleBuildingsChange" />
    </div>
</template>

<script>
    import RadioButtonsGroup from '~/components/common/RadioButtonsGroup';
    import Compass from '~/components/common/Compass';
    import VButton from '~/components/ui/buttons/VButton';
    import IconArrowLeft from '~/components/icons/IconArrowLeft';
    import ProjectGenplanNavigation from '~/components/common/projects/project/genplan/ProjectGenplanNavigation';

    export default {
        name: 'ProjectGenplanControls',

        components: {
            ProjectGenplanNavigation,
            VButton,
            Compass,
            RadioButtonsGroup,
            IconArrowLeft,
        },

        props: {
            currentStep: {
                type: Object,
                default: () => ({}),
            },

            activeRoute: {
                type: Object,
                default: () => ({}),
            },

            buildings: {
                type: Array,
                default: () => [],
            },

            activeBuildingId: {
                type: [String, Number],
                default: '',
            },

            sections: {
                type: Array,
                default: () => [],
            },

            activeSectionId: {
                type: [String, Number],
                default: '',
            },

            viewMode: {
                type: String,
                default: '',
            },

            compassRotate: {
                type: Number,
                default: 0,
            },

            sectionsPerView: {
                type: Number,
                default: 1,
            },

            isBothModes: {
                type: Boolean,
                default: false,
            },

            isShowInfra: {
                type: Boolean,
                default: false,
            },

            isBackActive: {
                type: Boolean,
                default: false,
            },

            isLastStep: {
                type: Boolean,
                default: false,
            },

            isShowFiltersModal: {
                type: Boolean,
                default: false,
            },

            isFiltersChanged: {
                type: Boolean,
                default: false,
            },

            isShowInfraBtn: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                viewBtns: [
                    {
                        key: 'render',
                        name: 'Рендер',
                        eventName: 'change-view',
                        eventValues: ['key'],
                    },
                    {
                        key: 'scheme',
                        name: 'Схема',
                        eventName: 'change-view',
                        eventValues: ['key'],
                    }
                ],

                lotTypeBtns: [
                    {
                        key: 'flat',
                        name: 'Квартиры',
                        eventName: 'change-lot-type',
                        eventValues: ['key'],
                    },
                    {
                        key: 'parking',
                        name: 'Паркинг',
                        eventName: 'change-lot-type',
                        eventValues: ['key'],
                    },
                    {
                        key: 'larder',
                        name: 'Кладовые',
                        eventName: 'change-lot-type',
                        eventValues: ['key'],
                    }
                ],
            };
        },

        computed: {
            isShowCompass() {
                return this.currentStep?.name !== 'checkerboard';
            },

            isShowCheckerboardNavigation() {
                return this.currentStep?.name === 'checkerboard';
            },

            isShowFloorsBtn() {
                return this.currentStep?.name === 'floor';
            }
        },

        methods: {
            handleChangeView(value) {
                this.$emit('change-view-mode', value);
            },

            handleBuildingsChange(buildings) {
                this.$emit('change-building', buildings[0]);
            },

            handleSectionsChange(sections) {
                this.$emit('change-sections', sections);
            },
        },
    };
</script>

<style lang="scss" module>
    .ProjectGenplanControls {
        //
    }

    .viewBtns {
        @include respond-to(sm) {
            display: none;
        }

        &._tablet {
            display: none;

            @include respond-to(sm) {
                display: inline-flex;
            }
        }
    }

    .leftTop {
        position: absolute;
        top: 2.4rem;
        left: 2.4rem;
        z-index: 1;
        display: inline-flex;

        @include respond-to(xs) {
            top: 1.6rem;
            left: 1.6rem;
        }
    }

    .backBtn {
        visibility: hidden;
        overflow: hidden;
        width: 0;
        margin-right: 0;
        padding-right: 0;
        padding-left: 0;
        opacity: 0;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
        transition: all $default-transition;

        &._active {
            visibility: visible;
            width: auto;
            margin-right: 1rem;
            padding-right: 2.4rem;
            padding-left: 1.6rem;
            opacity: 1;
        }
    }

    .filters {
        position: absolute;
        top: 2.4rem;
        right: 2.4rem;
        z-index: 1;
        display: flex;
        align-items: flex-start;

        @include respond-to(sm) {
            top: unset;
            right: unset;
            bottom: 2.4rem;
            left: 2.4rem;
        }

        @include respond-to(xs) {
            bottom: 1.6rem;
            left: 1.6rem;
            width: calc(100% - 1.6rem * 2);
        }

        & > * {
            margin-right: 1rem;

            @include respond-to(xs) {
                margin-right: .8rem;
            }

            &:last-child {
                margin-right: 0;
            }
        }
    }

    .filterBtn {
        flex: 1;

        &._floors {
            display: flex;
            justify-content: space-between;
        }

        &._mobile {
            display: none;

            @include respond-to(xs) {
                display: inline-flex;
            }
        }
    }

    .filterBtnArrowIcon {
        width: 1.2rem;
        height: 1.2rem;
        color: $base-800;
        transform: rotate(-90deg);
    }

    .lotTypeBtns {
        @include respond-to(sm) {
            display: none;
        }
    }

    .links {
        position: absolute;
        bottom: 2.4rem;
        left: 2.4rem;
        z-index: 1;
        display: flex;

        @include respond-to(sm) {
            right: 2.4rem;
            left: unset;
        }

        @include respond-to(xs) {
            display: none;
        }

        & > * {
            margin-right: .8rem;

            &:last-child {
                margin-right: 0;
            }
        }
    }

    .btnWithCheckbox {
        :global(.v-checkbox__label) {
            margin-top: .2rem;
        }

        &:hover :global(.v-checkbox__label) {
            color: $base-0;

            @include respond-to(sm) {
                color: $base-800;
            }
        }

        &._mobile {
            display: none;

            @include respond-to(xs) {
                display: inline-flex;
                flex: 1;
            }
        }
    }

    .btnLink {
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);

        @include respond-to(sm) {
            display: none;
        }
    }

    .compassWrapper {
        position: absolute;
        right: 2.4rem;
        bottom: 2.4rem;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 8.8rem;
        height: 8.8rem;
        border-radius: .8rem;
        background-color: $base-0;
        transition: all $default-transition;

        @include respond-to(sm) {
            top: 2.4rem;
            bottom: unset;
        }

        @include respond-to(xs) {
            top: 1.6rem;
            right: 1.6rem;
            width: 6.8rem;
            height: 6.8rem;
        }

        &._shadow {
            box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
        }
    }

    .sectionNavigation {
        position: absolute;
        bottom: 2.4rem;
        left: 50%;
        z-index: 1;
        transform: translateX(-50%);

        @include respond-to(xs) {
            position: static;
            flex: 1;
            transform: unset;
        }
    }

    .buildingNavigation {
        position: absolute;
        right: 2.4rem;
        bottom: 2.4rem;
        z-index: 1;

        @include respond-to(xs) {
            top: 1.6rem;
            right: 1.6rem;
            bottom: unset;
        }
    }
</style>
