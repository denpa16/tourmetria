<template>
    <ModalWrap @close="close">
        <div :class="$style.ModalFilters">
            <div :class="[$style.modalHeader, {[$style._fogging]: modalTitle === 'Фильтр'}, {[$style._scroll]: isScrollStart}]">
                <button
                    :class="[$style.resetButton, $style._mobile, 'p6', 'c-blue']"
                    value="Сбросить"
                    @click.stop="resetFilters"
                >
                    Сбросить
                </button>
                <h4 :class="[$style.modalTitle, 'h4']">
                    {{ modalTitle }}
                </h4>
            </div>
            <VScrollBox :class="[$style.filtersScroll, {[$style._overflowDisable]: isDisableScrollboxOverflow}]"
                        @scroll-start="onScrollStart"
                        @scroll-finish="onScrollFinish">
                <div :class="$style.filtersContainer">
                    <FlatsFilters
                        :values="values"
                        :specs="specs"
                        :facets="facets"
                        :is-adaptive="isAdaptive"
                        :current-floor-tabs="currentFloorTabs"
                        @disable-scrollbox-overflow="hideScrollboxOverflow"
                        @enable-scrollbox-overflow="showScrollboxOverflow"
                        @change="handleChange"
                    />

                    <details :class="$style.advancedFilters"
                             open>
                        <summary :class="$style.advancedSummary"
                                 @click="onSummaryClick">
                            {{ summaryTitle }}
                            <IconArrowUp :class="$style.iconArrow" />
                        </summary>
                        <div :class="[$style.filterItem, {[$style.isDisabled]: isBuildingSelectDisabled}]">
                            <p :class="[$style.filterLabel, 'p5', 'c-base400']">
                                Корпус
                            </p>
                            <VSelect
                                :class="$style.filterSelect"
                                :value="values.building"
                                :options="buildingOptions"
                                :facet="facets.building"
                                apply-facets
                                modal-breakpoint="xs"
                                :to-unlock-body="false"
                                modal-title="Корпус"
                                :disabled="isBuildingSelectDisabled"
                                :placeholder="isBuildingSelectDisabled ? 'Сначала выберите проект' : 'Любой корпус'"
                                bordered
                                multiple
                                @input="handleChange({building: $event})"
                            />
                        </div>
                        <!--                        <div :class="$style.filterItem">-->
                        <!--                            <p :class="[$style.filterLabel, 'p5', 'c-base400']">-->
                        <!--                                Отделка-->
                        <!--                            </p>-->
                        <!--                            <VSelect-->
                        <!--                                :class="$style.filterSelect"-->
                        <!--                                :value="values.furnish"-->
                        <!--                                :options="specs.furnish"-->
                        <!--                                :facet="facets.furnish"-->
                        <!--                                apply-facets-->
                        <!--                                modal-breakpoint="xs"-->
                        <!--                                :to-unlock-body="false"-->
                        <!--                                modal-title="Отделка"-->
                        <!--                                placeholder="Не важно"-->
                        <!--                                bordered-->
                        <!--                                multiple-->
                        <!--                                @input="handleChange({furnish: $event})"-->
                        <!--                            />-->
                        <!--                        </div>-->
                        <div v-if="facets.features"
                             :class="$style.filterAdditional">
                            <p :class="[$style.filterLabel, 'p5', 'c-base400']">
                                Дополнительно
                            </p>
                            <VTabs
                                :class="$style.filterFeatures"
                                :tabs="specs.features"
                                :value="values.features"
                                :facets="facets.features"
                                apply-facets
                                @change="handleChange({features: $event})"
                            />
                        </div>
                    </details>
                </div>
            </VScrollBox>
            <div :class="$style.modalFooter">
                <VButton
                    :class="$style.resetButton"
                    :color="resetButtonColor"
                    icon-first
                    @click.stop="resetFilters"
                >
                    Сбросить <span v-if="!isAdaptive">фильтр</span>
                    <template v-if="!isAdaptive"
                              #icon>
                        <IconCross :class="$style.iconCross" />
                    </template>
                </VButton>
                <VButton
                    :class="$style.applyButton"
                    @click="close"
                >
                    {{ applyButtonText }}
                </VButton>
            </div>
        </div>
    </ModalWrap>
</template>

<script>
    import {plural} from '~/assets/js/utils/textUtils';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';

    import ModalWrap from '~/components/common/ModalWrap';
    import FlatsFilters from '~/components/common/selection/flats/FlatsFilters';
    import VButton from '~/components/ui/buttons/VButton';
    import IconCross from '~/components/icons/IconCross';
    import VScrollBox from '~/components/ui/scrollbox/VScrollBox';
    import IconArrowUp from '~/components/icons/IconArrowUp';

    export default {
        name: 'FlatsFiltersModal',
        components: {IconArrowUp,
                     VScrollBox,
                     VButton,
                     FlatsFilters,
                     ModalWrap,
                     IconCross},

        mixins: [breakpointCheck],
        props: {
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

            flatsCount: {
                type: [String, Number],
                default: 0
            },

            currentFloorTabs: {
                type: Array,
                default: () => [],
            },
        },

        data() {
            return {
                isAdvancedFiltersOpen: true,
                isScrollStart: false,
                isDisableScrollboxOverflow: false,
            };
        },

        computed: {
            modalTitle() {
                return ['sm', 'xs'].includes(this.breakpoint) ? 'Фильтр' : 'Расширенный фильтр';
            },

            summaryTitle() {
                if (this.breakpoint !== 'xs') {
                    return 'Расширенный';
                }

                return this.isAdvancedFiltersOpen ? 'Свернуть фильтр' : 'Расширенный фильтр';
            },

            isAdaptive() {
                return ['sm', 'xs'].includes(this.breakpoint);
            },

            resetButtonColor() {
                return this.isAdaptive ? 'light' : 'text';
            },

            applyButtonText() {
                return this.isAdaptive ? `Показать ${this.flatsCounter}` : 'Применить фильтры';
            },

            flatsCounter() {
                return `${this.flatsCount} ${plural(this.flatsCount, ['квартиру', 'квартиры', 'квартир'])}`;
            },

            buildingOptions() {
                return this.specs.building.filter(building => this.values.project.includes(building.project_slug));
            },

            isBuildingSelectDisabled() {
                return !this.values.project.length;
            }
        },

        methods: {
            close() {
                this.$emit('close');
            },

            handleChange(val) {
                this.$emit('change', val);
            },

            onSummaryClick() {
                this.isAdvancedFiltersOpen = !this.isAdvancedFiltersOpen;
            },

            resetFilters() {
                this.$emit('resetFilters');
            },

            onScrollStart() {
                if (this.isScrollStart) {
                    return;
                }
                this.isScrollStart = true;
            },

            onScrollFinish() {
                if (!this.isScrollStart) {
                    return;
                }
                this.isScrollStart = false;
            },

            hideScrollboxOverflow() {
                if (!this.$deviceIs.pc) {
                    this.isDisableScrollboxOverflow = true;
                }
            },

            showScrollboxOverflow() {
                if (this.isDisableScrollboxOverflow) {
                    this.isDisableScrollboxOverflow = false;
                }
            },
        },
    };
</script>

<style lang="scss" module>
    .ModalFilters {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;

        :global(.selection-filters) {
            display: none;

            @include respond-to(sm) {
                display: flex;
            }
        }
    }

    .modalHeader {
        margin-bottom: .8rem;
        padding: 2.4rem 2.4rem 0;

        &._fogging {
            position: relative;
            transition: opacity $default-color-transition, transform .4s ease;

            &:after {
                content: '';
                position: absolute;
                top: 7.7rem;
                left: 0;
                width: 100%;
                height: 7rem;
                background: linear-gradient(180deg, #f6f6f6 0%, rgba(246, 246, 246, 0) 100%);
                opacity: 0;
                transform: translateY(-100%);

                @include respond-to(xs) {
                    top: 60px;
                }
            }
        }

        &._scroll {
            &:after {
                z-index: 7;
                opacity: 1;
                transform: translateY(0);

                @include respond-to(xs) {
                    z-index: 5;
                }
            }
        }

        @include respond-to(sm) {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2.4rem;
            border-bottom: 1px solid $base-100;
        }
    }

    .modalTitle {
        text-transform: uppercase;

        @include respond-to(xs) {
            font-size: 1.2rem;
            line-height: 1.2rem;
        }
    }

    .filterItem {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 2rem 0;
        border-bottom: 1px solid $base-100;

        &.isDisabled {
            cursor: not-allowed;
        }

        @include respond-to(sm) {
            flex-direction: column;
            align-items: start;
            margin-bottom: 2.4rem;
            padding: 0;
            border: unset;
        }
    }

    .filterSelect {
        width: 75%;

        @include respond-to(sm) {
            width: 100%;
        }
    }

    .filterLabel {
        @include respond-to(sm) {
            margin-bottom: 1.2rem;
            font-family: $accent-font-family;
            font-weight: 500;
            line-height: 1.6rem;
        }
    }

    .advancedFilters {
        width: 100%;

        &:not(&[open]) > summary {
            .iconArrow {
                transform: rotate(180deg);
            }
        }

        &[open] {
            & > .advancedSummary {
                color: $blue;
            }
        }
    }

    .advancedSummary {
        display: none;

        @include respond-to(sm) {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2.4rem;
            font-size: 1.2rem;
            font-weight: 500;
            font-style: $accent-font-family;
            line-height: 1.6rem;
            color: $base-400;
            cursor: pointer;
        }

        @include respond-to(xs) {
            justify-content: unset;
            text-transform: uppercase;
            font-weight: 600;
            color: $base-800;

            svg {
                margin-top: -2px;
            }
        }
    }

    .iconArrow {
        width: .8rem;
        height: .4rem;

        @include respond-to(xs) {
            margin-left: .8rem;
        }
    }

    .filterAdditional {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 2rem 0;

        @include respond-to(sm) {
            flex-direction: column;
            align-items: start;
            padding: 0;
        }
    }

    .filterFeatures {
        width: 75%;

        @include respond-to(sm) {
            width: 100%;
        }
    }

    .filtersScroll {
        position: relative;
        z-index: 5;
        flex: auto;

        &._overflowDisable {
            overflow: unset;
        }
    }

    .filtersContainer {
        padding: 0 2.4rem 2.4rem;

        @include respond-to(sm) {
            padding: 2.4rem;
        }

        @include respond-to(xs) {
            padding: 1.6rem;
        }
    }

    .modalFooter {
        margin-left: auto;
        padding: 2.4rem;

        @include respond-to(sm) {
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            justify-content: space-between;
            height: fit-content;
            margin: 0;
            border-top: 1px solid $base-100;
        }

        @include respond-to(xs) {
            padding: 1.6rem;
        }

        & > *:not(:last-child) {
            @include respond-to(sm) {
                margin-left: 1.6rem;
            }
        }
    }

    .resetButton {
        @include respond-to(sm) {
            width: 50%;
        }

        @include respond-to(xs) {
            display: none;
        }

        &._mobile {
            display: none;

            @include respond-to(xs) {
                position: absolute;
                top: 2.4rem;
                left: 1.6rem;
                z-index: 5;
                display: block;
                width: fit-content;
                margin: -10px 0;
                padding: 10px 0;
            }
        }
    }

    .applyButton {
        @include respond-to(sm) {
            width: 50%;
        }

        @include respond-to(xs) {
            width: 100%;
        }
    }

    .iconCross {
        width: .8rem;
        height: .8rem;
    }
</style>
