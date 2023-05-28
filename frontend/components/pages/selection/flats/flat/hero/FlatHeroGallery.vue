<template>
    <div :class="[$style.FlatHeroGallery, {[$style._modal]: isModal}]">
        <transition name="fade"
                    mode="out-in">
            <Compass v-if="activeViewTab !== 'genplan'"
                     :rotate-deg="lot.layout && lot.layout.compass_azimuth"
                     :class="$style.compass"
                     :sun-active="isSunActive" />
        </transition>

        <div v-if="!isModal"
             :class="$style.btnZoom">
            <VSquareButton aria-label="Открыть на весь экран"
                           @click="$emit('open-gallery', activeViewTab)">
                <IconLoupe :class="$style.iconLoupe" />
            </VSquareButton>
        </div>

        <transition name="fade-content"
                    mode="out-in">
            <FlatHeroPlan v-if="activeViewTab === 'plan'"
                          key="plan"
                          :lot="lot"
                          :is-modal="isModal"
                          @open-plan="$emit('open-plan')"
                          @change-plan="$emit('change-plan', $event)"
                          @show-sun="isSunActive = true"
                          @hide-sun="isSunActive = false" />

            <FlatHeroFloor v-if="activeViewTab === 'floor'"
                           key="floor"
                           :lot="lot"
                           :class="$style.floor" />

            <FlatHeroGenplan v-if="activeViewTab === 'genplan'"
                             key="genplan"
                             :lot="lot"
                             :plan-view-angle="planViewAngle"
                             @change-genplan-view="$emit('change-genplan-view', $event)" />
        </transition>

        <div :class="$style.tabsPanel">
            <div :class="$style.viewPanel">
                <transition name="fade-content"
                            mode="out-in">
                    <VButton v-if="isModal && activeViewTab === 'plan'"
                             :class="$style.btnDownload"
                             color="light"
                             icon-first
                             :link="planLink"
                             target="_blank">
                        Скачать планировку
                        <template #icon>
                            <IconDownload :class="$style.iconDownload" />
                        </template>
                    </VButton>

                    <SliderNavigation v-else
                                      color="gray"
                                      @prev-click="prevView"
                                      @next-click="nextView">
                        <span :class="$style.mobileCount">{{ activeViewIndex + 1 }}/{{ viewTabs.length }}</span>
                    </SliderNavigation>
                </transition>

                <div :class="$style.tabs">
                    <template v-for="(tab, index) in viewTabs">
                        <VButton v-if="tab.link"
                                 :key="tab.label + index"
                                 :class="[$style.tab, tab.class]"
                                 :link="tab.link"
                                 :color="tab.color || 'primary'"
                                 target="_blank">
                            {{ tab.label }}
                        </VButton>
                        <VTab v-else
                              :key="tab.value + tab.label + index"
                              :tab="tab"
                              :active="index === activeViewIndex"
                              :class="[$style.tab, tab.class]"
                              @click="handleChangeActiveView(index, tab)" />
                    </template>
                </div>

                <SliderNavigation color="gray"
                                  :class="$style.tabsCount">
                    <template #left>
                        <span class="p5 c-base300">{{ activeViewIndex + 1 }}</span>
                    </template>
                    <template #right>
                        <span class="p5 c-base300">{{ viewTabs.length }}</span>
                    </template>
                </SliderNavigation>
            </div>
        </div>
    </div>
</template>

<script>
    import FlatHeroPlan from '~/components/pages/selection/flats/flat/hero/FlatHeroPlan';
    import FlatHeroFloor from '~/components/pages/selection/flats/flat/hero/FlatHeroFloor';
    import FlatHeroGenplan from '~/components/pages/selection/flats/flat/hero/FlatHeroGenplan';
    import Compass from '~/components/common/Compass';
    import SliderNavigation from '~/components/common/SliderNavigation';
    import IconLoupe from '~/components/icons/IconLoupe';
    import IconDownload from '~/components/icons/IconDownload';

    export default {
        name: 'FlatHeroGallery',

        components: {
            FlatHeroPlan,
            FlatHeroFloor,
            FlatHeroGenplan,
            Compass,
            SliderNavigation,
            IconLoupe,
            IconDownload,
        },

        props: {
            lot: {
                type: Object,
                default: () => ({}),
            },

            isModal: {
                type: Boolean,
                default: false,
            },

            activeTab: {
                type: String,
                default: '',
            },

            planLink: {
                type: String,
                default: ''
            },

            planViewAngle: {
                type: Boolean,
                default: false,
            }
        },

        data() {
            return {
                activeViewIndex: 0,
                activeViewTab: 'plan',
                isSunActive: false,
            };
        },

        computed: {
            viewTabs() {
                const tabs = [];

                if (this.lot?.window_view) {
                    tabs.push({
                        link: {
                            path: '/view',
                            query: {link: this.lot.window_view, backLink: this.$route.path}
                        },
                        label: 'Вид из окна',
                    });
                }

                tabs.push({value: 'plan', label: 'План 2D'});

                if (this.lot?.tour_link) {
                    tabs.push({
                        link: {path: '/view', query: {link: this.lot.tour_link, backLink: this.$route.path}},
                        label: '3D-тур',
                        color: 'light',
                        class: this.$style.tourLink,
                    });
                }

                if (this.lot?.layout_on_floor?.plan_on_floor) {
                    tabs.push({value: 'floor', label: 'Этаж'});
                }

                if (this.lot.genplan_display) {
                    tabs.push({value: 'genplan', label: 'Генплан'});
                }

                return tabs;
            },
        },

        mounted() {
            if (this.activeTab) {
                this.activeViewIndex = this.viewTabs.findIndex(item => item.value === this.activeTab);
                this.activeViewTab = this.activeTab;
            }
        },

        methods: {
            handleChangeActiveView(val, tab) {
                this.activeViewIndex = val;
                this.activeViewTab = tab.value;
            },

            prevView() {
                if (this.activeViewIndex === 0) {
                    this.activeViewIndex = this.viewTabs.length - 1;
                } else {
                    this.activeViewIndex--;
                }
                this.activeViewTab = this.viewTabs[this.activeViewIndex].value;
            },

            nextView() {
                if (this.activeViewIndex + 1 === this.viewTabs.length) {
                    this.activeViewIndex = 0;
                } else {
                    this.activeViewIndex++;
                }
                this.activeViewTab = this.viewTabs[this.activeViewIndex].value;
            },
        }


    };
</script>

<style lang="scss" module>
    .FlatHeroGallery {
        position: relative;
        padding-bottom: 10.3rem;
        border-radius: 1.6rem;
        background-color: $base-0;

        @include hover {
            .btnZoom {
                opacity: 1;
            }
        }

        &._modal {
            .compass {
                top: 14.8rem;
                right: 14.8rem;
            }

            .floor {
                width: 69%;
            }
        }
    }

    .compass {
        position: absolute;
        top: 4.4rem;
        right: 4.4rem;

        @include respond-to(sm) {
            top: 4rem;
            right: 4rem;
        }
    }

    .tabsPanel {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 2.4rem;
        border-radius: 1.6rem;
        background-color: $base-0;
    }

    .viewPanel {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        @include respond-to(sm) {
            flex-direction: row-reverse;
        }
    }

    .tab {
        &:not(:last-child) {
            margin-right: .8rem;
        }
    }

    .tourLink {
        @include hover {
            /* stylelint-disable */
            background-color: $base-0 !important;
            border-color: $blue !important;
            color: $blue !important;
            /* stylelint-enable */
        }
    }

    .tabsCount {
        @include respond-to(sm) {
            display: none;
        }
    }

    .mobileCount {
        display: none;

        @include respond-to(sm) {
            display: block;
        }
    }

    .btnDownload {
        &:global(.v-button--large) {
            padding: 0 1.6rem;
        }

        &:global(.v-button.is-icon-first .v-button__icon-wrap) {
            margin-right: 1.6rem;
        }
    }

    .iconDownload {
        width: 1.2rem;
        height: 1.2rem;
    }

    .floor {
        width: 90%;
        height: 100%;
        padding-top: 11rem;
    }

    .btnZoom {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 2;
        border-radius: .8rem;
        background-color: $base-0;
        opacity: 0;
        transform: translate(-50%, -50%);
        transition: opacity $default-color-transition;

        @include respond-to(sm) {
            display: none;
        }
    }

    .iconLoupe {
        width: 1.6rem;
        height: 1.6rem;
    }
</style>
