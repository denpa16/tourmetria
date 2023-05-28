<template>
    <div :class="$style.ProjectLayouts">
        <div :class="$style.head">
            <div class="container">
                <h2 v-if="layoutsCount"
                    :class="$style.title">
                    {{ layoutsCount }} {{ layoutsCount | plural(['тип', 'типа', 'типов']) }} планировок
                </h2>

                <ProjectLayoutsFilter :values="values"
                                      :specs="specs"
                                      :facets="facets"
                                      @change="handleChangeValues" />
            </div>
        </div>

        <div class="container">
            <div :class="$style.plansContainer">
                <div ref="scroll"
                     :class="$style.cards">
                    <ul :class="$style.cardsWrapper">
                        <li v-for="(layout, index) in layouts"
                            :id="`layout-${index}`"
                            :key="`layout-${layout.id}`"
                            :class="$style.cardWrapper">
                            <ProjectLayoutsCard :layout="layout"
                                                :active="index === activeIndex"
                                                @click="handleChangeActiveLayout(index)" />
                        </li>
                        <li :class="$style.moreButtonWrapper">
                            <VSquareButton
                                :class="$style.moreButtonTablet"
                                color="white"
                                aria-label="Показать больше квартир"
                                @click="showMoreFlats"
                            >
                                <IconPlus :class="$style.IconPlus" />
                            </VSquareButton>
                        </li>
                    </ul>
                    <div v-if="moreButtonText"
                         :class="$style.inner">
                        <VButton
                            :class="$style.moreButton"
                            color="white"
                            :loading="isReloading"
                            :spinner="isReloading"
                            @click="showMoreFlats"
                        >
                            {{ moreButtonText }}
                        </VButton>
                    </div>
                </div>
                <div :class="$style.plan">
                    <ProjectLayoutsInfo :layout="layouts[activeIndex]"
                                        :total-count="layouts.length"
                                        :active-index="activeIndex"
                                        @prev-click="handleClickPrev"
                                        @next-click="handleClickNext"
                                        @open-url="handleOpenUrl" />

                </div>
            </div>

            <ProjectLayoutsMobileList :class="$style.mobileList"
                                      :layouts="layouts"
                                      :is-reloading="isReloading"
                                      :more-counter="moreCounter"
                                      :is-full-list="isFullList"
                                      :is-values-changed="isValuesChanged"
                                      @show-more="showMoreFlats"
                                      @open-url="handleOpenUrl" />
        </div>
    </div>
</template>

<script>
    import {plural} from '~/assets/js/utils/textUtils';

    import ProjectLayoutsFilter from '~/components/pages/project/layouts/ProjectLayoutsFilter';
    import ProjectLayoutsCard from '~/components/pages/project/layouts/ProjectLayoutsCard';
    import ProjectLayoutsInfo from '~/components/pages/project/layouts/ProjectLayoutsInfo';
    import ProjectLayoutsMobileList from '~/components/pages/project/layouts/ProjectLayoutsMobileList';
    import VButton from '~/components/ui/buttons/VButton';
    import VSquareButton from '~/components/ui/buttons/VSquareButton';
    import IconPlus from '~/components/icons/IconPlus';

    export default {
        name: 'ProjectLayouts',

        components: {
            ProjectLayoutsFilter,
            ProjectLayoutsCard,
            ProjectLayoutsInfo,
            ProjectLayoutsMobileList,
            VButton,
            VSquareButton,
            IconPlus,
        },

        props: {
            projectSlug: {
                type: String,
                default: '',
            },

            layouts: {
                type: Array,
                default: () => [],
            },

            specs: {
                type: Object,
                default: () => ({}),
            },

            facets: {
                type: Object,
                default: () => ({}),
            },

            layoutsCount: {
                type: Number,
                default: 0,
            },

            moreCounter: {
                type: Number,
                default: 0,
            },

            isReloading: {
                type: Boolean,
                default: false,
            },

            isFullList: {
                type: Boolean,
                default: false,
            },

            isValuesChanged: {
                type: Boolean,
                default: false,
            },

            lotPageLink: {
                type: Object,
                default: () => ({}),
            },
        },

        data() {
            return {
                activeIndex: 0,

                values: {
                    rooms: [],
                    features: [],
                },
            };
        },

        computed: {
            moreButtonText() {
                return this.moreCounter ? `+${this.moreCounter} ${plural(this.moreCounter, ['тип', 'типа', 'типов'])}` : '';
            },
        },

        watch: {
            activeIndex(val) {
                this.scrollTo(val);
            },
        },

        methods: {
            handleChangeValues(values) {
                if (values?.rooms?.includes('all')) {
                    values.rooms = [];
                }

                this.values = {
                    ...this.values,
                    ...values,
                };

                const isDefault = Object.values(this.values).every(value => !value?.length);

                this.$emit('change-values', this.values, isDefault);
            },

            handleChangeActiveLayout(val) {
                this.activeIndex = val;
            },

            handleClickPrev() {
                this.activeIndex--;
            },

            handleClickNext() {
                this.activeIndex++;
            },

            scrollTo(val) {
                const el = document.getElementById(`layout-${val}`);
                el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'start',
                });
            },

            handleOpenUrl(val) {
                this.$router.push({
                    ...this.lotPageLink,
                    query: {project: this.projectSlug, layout: val},
                });
            },

            showMoreFlats() {
                this.$emit('show-more');
            },
        }
    };
</script>

<style lang="scss" module>
    .ProjectLayouts {
        background-color: $base-50;
    }

    .head {
        position: relative;
        padding-top: 19.2rem;
        background-color: $base-0;

        &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 19.2rem;
            background: url('/images/vectorTopShort.svg') no-repeat top center;
            background-size: 100%;
        }

        @include respond-to(sm) {
            padding-top: 11.8rem;

            &:before {
                height: 11.8rem;
            }
        }

        @include respond-to(sm) {
            padding-top: 7.2rem;

            &:before {
                height: 7.2rem;
            }
        }
    }

    .title {
        border-bottom: 1px solid $base-100;
        text-align: center;
        text-transform: uppercase;
        font-size: 12.8rem;
        font-weight: 600;

        @include respond-to(lg) {
            white-space: nowrap;
            font-size: 6.5vw;
        }

        @include respond-to(sm) {
            margin-bottom: 1.4rem;
        }

        @include respond-to(xs) {
            margin-bottom: 1.2rem;
            border-bottom: unset;
            font-size: 6.4vw;
        }
    }

    .plansContainer {
        display: flex;
        height: calc(100vh - #{$header-h});
        min-height: 70rem;
        padding-top: 1.7rem;
        padding-bottom: 2.5rem;

        @include respond-to(sm) {
            flex-direction: column;
            height: unset;
            padding: 1.6rem 0;
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .cards {
        overflow-y: auto;
        width: 42%;
        height: 100%;
        margin-right: 1.5rem;
        padding: 2.8rem 2.1rem;
        border-radius: 1.6rem;
        background-color: $base-0;
        scrollbar-width: 3px;

        &::-webkit-scrollbar {
            width: 3px;

            @include respond-to(sm) {
                display: none;
            }
        }

        &::-webkit-scrollbar-track {
            border: solid 3px transparent;
        }

        &::-webkit-scrollbar-thumb {
            border: solid 3px $base-300;
        }

        @include respond-to(sm) {
            overflow-x: auto;
            overflow-y: hidden;
            width: calc(100% + 2.4rem);
            margin-right: -2.4rem;
            margin-bottom: 1.6rem;
            padding: 1.6rem;
            border-radius: 1.6rem 0 0 1.6rem;
            scrollbar-width: 0;
        }
    }

    .plan {
        flex: 1;
        border-radius: 1.6rem;
        background-color: $base-0;
    }

    .cardsWrapper {
        display: flex;
        flex-wrap: wrap;
        margin: -.4rem;

        @include respond-to(sm) {
            flex-wrap: nowrap;
        }
    }

    .cardWrapper {
        width: calc(100% / 3 - .8rem);
        margin: .4rem;

        @include respond-to(sm) {
            min-width: 18.4rem;
        }
    }

    .mobileList {
        display: none;

        @include respond-to(xs) {
            display: block;
        }
    }

    .inner {
        display: flex;
        align-items: flex-end;
        justify-content: center;
    }

    .moreButton {
        width: fit-content;
        margin: 2.4rem auto 0;

        @include respond-to(sm) {
            display: none;
        }

        @include respond-to(xs) {
            display: flex;
            margin: 24px auto 0;
        }
    }

    .moreButtonWrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: .6rem;
        padding-right: .8rem;
    }

    .moreButtonTablet {
        display: none;

        @include respond-to(sm) {
            display: flex;
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .IconPlus {
        width: 1.8rem;
        height: 1.8rem;
    }
</style>
