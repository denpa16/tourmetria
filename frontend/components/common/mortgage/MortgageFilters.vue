<template>
    <div :class="[$style.MortgageFilters, 'mortgage-filters']">
        <div :class="[$style.filtersWrap, $style.selectsDropdown]">
            <VSelect
                :value="values.mortgageType"
                :options="specs.program"
                :class="$style.filterItem"
                :label="programSelectLabel"
                modal-breakpoint="xs"
                modal-title="Программа"
                :to-unlock-body="false"
                placeholder="Программа"
                bordered
                @input="handleChange({mortgageType:$event})"
            />
            <VSelect
                :value="values.developmentprojectSlug"
                :options="specs.projects"
                :class="$style.filterItem"
                :label="projectSelectLabel"
                modal-breakpoint="xs"
                modal-title="Проект"
                :to-unlock-body="false"
                placeholder="Проект"
                bordered
                @input="handleChange({developmentprojectSlug:$event})"
            />
        </div>

        <div :class="[$style.filtersWrap, $style.slidersDropdown]">
            <VRangeDropdown
                name="cost"
                :class="$style.filterItem"
                :spec="facets.property_price"
                :facet="facets.property_price"
                :value="Number(values.cost)"
                :title="priceDropdownTitle"
                :step="10000"
                postfix=" Р"
                single
                @change="handleChange($event)"
            />
            <VRangeDropdown
                name="initialPayment"
                :value="Number(values.initialPayment)"
                :class="$style.filterItem"
                :spec="depositSpecs"
                :facet="depositSpecs"
                title="Первый взнос"
                postfix=" Р"
                :step="10000"
                single
                @change="handleChange($event)"
            >
                <template #default>
                    <p :class="[$style.depositTitle,'p5']">
                        <span :class="[$style.rangeLabel, 'c-base300']">Первый взнос</span> {{ depositInPercents }}%
                    </p>
                </template>

                <template #rangeSinglePostfix>
                    <span :class="$style.depositPercents">
                        {{ depositInPercents }}%
                    </span>
                </template>
            </VRangeDropdown>

            <VRangeDropdown
                v-if="values.creditPeriod"
                name="creditPeriod"
                :value="Number(values.creditPeriod)"
                :class="$style.filterItem"
                :spec="termSpecs"
                :facet="termSpecs"
                :title="termDropdownTitle"
                :step="1"
                :postfix="Number(values.creditPeriod)|plural([' годa', ' лет', ' лет'])"
                single
                @change="handleChange($event)"
            >
                <template #default>
                    <p :class="'p5'">
                        <span :class="[$style.rangeLabel, 'c-base300']">Срок</span> {{ values.creditPeriod }} {{ Number(values.creditPeriod)|plural([' годa', ' лет', ' лет']) }}
                    </p>
                </template>
            </VRangeDropdown>
        </div>


        <div :class="[$style.filtersWrap, $style.slidersAdaptive]">
            <div :class="$style.filterItem">
                <p :class="$style.label">
                    Стоимость квартиры
                </p>
                <VRangeSingle
                    name="cost"
                    :class="[$style.filterItem, $style.price]"
                    :spec="facets.property_price"
                    :facet="facets.property_price"
                    :value="Number(values.cost)"
                    title="Цена квартиры"
                    :step="10000"
                    postfix=" Р"
                    single
                    @change="handleChange($event)"
                />
            </div>
            <div :class="$style.filterItem">
                <p :class="$style.label">
                    Первый взнос
                </p>
                <VRangeSingle
                    name="initialPayment"
                    :value="Number(values.initialPayment)"
                    :class="$style.filterItem"
                    :spec="depositSpecs"
                    :facet="depositSpecs"
                    title="Первый взнос"
                    postfix=" Р"
                    :step="10000"
                    @change="handleChange($event)"
                >
                    <template #postfix>
                        <span :class="$style.depositPercents">
                            {{ depositInPercents }}%
                        </span>
                    </template>
                </VRangeSingle>
            </div>
            <div :class="$style.filterItem">
                <p :class="$style.label">
                    Срок
                </p>
                <VRangeSingle
                    name="creditPeriod"
                    :value="Number(values.creditPeriod)"
                    :class="[$style.filterItem, $style.term]"
                    :spec="termSpecs"
                    :facet="termSpecs"
                    title="Срок"
                    :step="1"
                    postfix=" лет"
                    single
                    @change="handleChange($event)"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';
    import {plural} from '~/assets/js/utils/textUtils';
    import {splitThousands} from '~/assets/js/utils/numberUtils';

    export default {
        name: 'MortgageFilters',
        components: {},
        mixins: [breakpointCheck],
        props: {
            values: {
                type: Object,
                default: () => ({})
            },

            specs: {
                type: Object,
                default: () => ({})
            },

            facets: {
                type: Object,
                default: () => ({})
            },
        },

        data() {
            return {
                termSpecs: {
                    min: 1,
                    max: 30
                },
            };
        },

        computed: {
            programSelectLabel() {
                return this.breakpoint === 'xs' ? 'Программа' : '';
            },

            projectSelectLabel() {
                return this.breakpoint === 'xs' ? 'Проект' : '';
            },

            priceDropdownTitle() {
                return this.values.cost ? `Квартира за ${splitThousands(Number(this.values.cost))}Р` : 'Цена квартиры';
            },

            termDropdownTitle() {
                return this.values.creditPeriod ? `До ${this.values.creditPeriod} ${plural(Number(this.values.creditPeriod), ['года', 'лет', 'лет'])}` : 'Срок';
            },

            depositSpecs() {
                return {
                    min: (Number(this.values.cost) * (this.specs?.deposit?.min / 100)) || 0,
                    max: Number(this.values.cost) || this.specs?.price?.max
                };
            },

            depositInPercents() {
                let percent = 0;
                if (this.values.initialPayment && this.values.cost) {
                    percent = (this.values.initialPayment * 100) / this.values.cost;
                } else if (this.values.initialPayment) {
                    percent = (this.values.initialPayment* 100) / this.specs.price.min;
                }
                return Math.round(percent);
            },
        },

        methods: {
            handleChange(value) {
                if (value.cost || value.cost === '') {
                    const cost = Number(value.cost);
                    const minInitialPayment = cost * (this.specs?.deposit?.min / 100);

                    if (cost < Number(this.values.initialPayment)) {
                        this.$emit('change', {initialPayment: cost});
                    } else if (Number(this.values.initialPayment) < minInitialPayment) {
                        this.$emit('change', {initialPayment: minInitialPayment});
                    }
                }
                this.$emit('change', value);
            },
        }
    };
</script>

<style lang="scss" module>
    .MortgageFilters {
        display: flex;
        align-items: center;

        @include respond-to(sm) {
            flex-direction: column;
        }

        & > * {
            margin-right: .8rem;

            &:last-child {
                margin-right: 0;
            }

            @include respond-to(sm) {
                margin-right: 0;
                margin-bottom: 2.4rem;

                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }

    .filterItem {
        max-width: 25rem;

        @include respond-to(sm) {
            width: 100%;
            max-width: unset;
        }
    }

    .term,
    .price {
        &:global(.v-range--default) {
            & :global(.v-input-thousands__native) {
                color: $blue;
            }
        }
    }

    .filtersWrap {
        display: flex;
        align-items: center;

        @include respond-to(sm) {
            flex-direction: column;
            width: 100%;
        }

        & > * {
            margin-right: .8rem;

            &:last-child {
                margin-right: 0;
            }

            @include respond-to(sm) {
                margin-right: 0;
                margin-bottom: 2.4rem;

                &:last-child {
                    margin-bottom: 0;
                }
            }
        }

        :global(.v-select-option) {
            color: $base-800;
        }
    }

    .slidersDropdown {
        @include respond-to(sm) {
            display: none;
        }
    }

    .slidersAdaptive {
        display: none;

        @include respond-to(sm) {
            display: flex;
        }
    }

    .label {
        margin-bottom: 1.2rem;
        font-family: $accent-font-family;
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 1.6rem;
        color: $base-400;
    }

    .depositPercents {
        color: $base-300;
    }

    .rangeLabel {
        margin-right: .4rem;
    }
</style>
