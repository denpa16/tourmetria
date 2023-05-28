<template>
    <div :class="$style.RealtyFilter">
        <div :class="$style.filterPanel">
            <div :class="$style.left">
                <VSelect v-if="activeStage === 'projects'"
                         :value="values.city"
                         :options="cities"
                         :class="$style.filterItem"
                         bordered
                         @input="$emit('change', {city: $event})"
                >
                    <template #icon>
                        <IconLocation :class="$style.icon" />
                    </template>
                </VSelect>

                <VSelect v-if="activeStage === 'buildings' || activeStage === 'floors'"
                         :value="values.project"
                         :options="specs.project"
                         apply-facets
                         :facet="facets.project"
                         :class="$style.filterItem"
                         placeholder="Проект"
                         bordered
                         clear-btn
                         @clear-filter="$emit('clear-filter', {project: ''})"
                         @input="$emit('change', {project: $event})"
                />

                <VSelect v-if="activeStage === 'floors'"
                         :value="Number(values.building)"
                         :options="specs.building"
                         :facet="facets.building"
                         apply-facets
                         :class="$style.filterItem"
                         placeholder="Корпус"
                         bordered
                         clear-btn
                         @clear-filter="$emit('clear-filter', {building: ''})"
                         @input="$emit('change', {building: $event})"
                />

                <VRangeDropdown name="area"
                                :class="$style.filterItem"
                                :spec="specs.area"
                                :facet="facets.area"
                                :value-min="values.area_min"
                                :value-max="values.area_max"
                                :step=".1"
                                :title="area"
                                label="Площадь, м²"
                                clear-btn
                                range
                                @clear-filter="$emit('clear-filter', {area_min: '', area_max: ''})"
                                @change="$emit('change', $event)"
                />

                <VRangeDropdown name="price"
                                :class="$style.filterItem"
                                :spec="specs.price"
                                :facet="facets.price"
                                :value-min="values.price_min"
                                :value-max="values.price_max"
                                :title="price"
                                :step="10000"
                                label="Стоимость, Р"
                                clear-btn
                                @clear-filter="$emit('clear-filter', {price_min: '', price_max: ''})"
                                @change="$emit('change', $event)"
                />

                <VSelect :value="values.completion_date"
                         :options="specs.completion_date"
                         apply-facets
                         :facet="facets.completion_date"
                         :class="$style.filterItem"
                         placeholder="Срок сдачи"
                         bordered
                         @input="$emit('change', {completion_date: $event})"
                />

                <VCheckbox v-if="facets.hasOwnProperty('has_promotions')"
                           :false-value="false"
                           :value="values.has_promotions"
                           :class="$style.checkbox"
                           @input="$emit('change', {has_promotions: $event})">
                    Акции
                </VCheckbox>

                <transition name="fade-content"
                            mode="out-in">
                    <VSpinner v-if="isReloading"
                              :class="$style.spinner" />
                </transition>
            </div>

            <div :class="$style.right">
                <VButton color="light"
                         :disabled="isResetBtnDisabled"
                         @click="$emit('reset')">
                    Сбросить фильтр
                </VButton>
            </div>
        </div>

        <div :class="$style.wrapper">
            <VButton :class="$style.filterBtn"
                     color="light"
                     responsive
                     @click="$emit('open-filter')">
                Фильтр
                <template #icon>
                    <IconFilters :class="$style.filterIcon" />
                </template>
            </VButton>

            <SortSelect
                :class="$style.sortMobile"
                :options="sortOptions"
                :value="values.order"
                bordered
                @change="$emit('change', {order: $event})"
            />
        </div>

        <div v-if="activeStage !== 'floors'"
             :class="$style.sortPanel">
            <SortSelect
                :options="sortOptions"
                :value="values.order"
                label="Сортировать по"
                @change="$emit('change', {order: $event})" />

            <div v-if="activeStage === 'projects'"
                 class="p6 c-base300">
                {{ projectsCount }} {{ projectsCount | plural(['проект', 'проекта', 'проектов']) }}
            </div>

            <div v-else-if="activeStage === 'buildings'"
                 class="p6 c-base300">
                {{ buildingsCount }} {{ buildingsCount | plural(['корпус', 'корпуса', 'корпусов']) }}
            </div>
        </div>
    </div>
</template>

<script>
    import IconLocation from '~/components/icons/IconLocation';
    import SortSelect from '~/components/common/SortSelect';
    import IconFilters from '~/components/icons/IconFilters';
    import {splitMillionsToShort} from '~/assets/js/utils/numberUtils';

    export default {
        name: 'RealtyFilter',

        components: {
            IconLocation,
            SortSelect,
            IconFilters,
        },

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

            cities: {
                type: Array,
                default: () => [],
            },

            sortOptions: {
                type: Array,
                default: () => [],
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

            activeStage: {
                type: String,
                default: 'project',
            }
        },

        computed: {
            area() {
                if (this.values.area_min&&this.values.area_max) {
                    return `${this.values.area_min} м² - ${this.values.area_max} м²`;
                } else if (this.values.area_min) {
                    return `от ${this.values.area_min} м²`;
                } else if (this.values.area_max) {
                    return `до ${this.values.area_max} м²`;
                }
                return 'Площадь';
            },

            price() {
                if (this.values.price_min&&this.values.price_max) {
                    return `${splitMillionsToShort(this.values.price_min)} млн - ${splitMillionsToShort(this.values.price_max)} млн Р`;
                } else if (this.values.price_min) {
                    return `от ${splitMillionsToShort(this.values.price_min)} млн Р`;
                } else if (this.values.price_max) {
                    return `до ${splitMillionsToShort(this.values.price_max)} млн Р`;
                }
                return 'Стоимость';
            }
        },
    };
</script>

<style lang="scss" module>
    .RealtyFilter {
        //
    }

    .filterPanel {
        display: flex;
        justify-content: space-between;
        padding: 1.2rem 0;
        border-top: 1px solid $base-100;
        border-bottom: 1px solid $base-100;

        @include respond-to(sm) {
            display: none;
        }
    }

    .wrapper {
        display: none;
        width: 100%;
        padding: 1.2rem 0;
        border-top: 1px solid $base-100;
        border-bottom: 1px solid $base-100;

        @include respond-to(sm) {
            display: block;
        }

        @include respond-to(xs) {
            display: flex;
            padding-top: 0;
            padding-bottom: 1.6rem;
            border-top: unset;
        }
    }

    .filterBtn {
        &:global(.v-button--large) {
            justify-content: space-between;
            padding: 0 1.6rem;
        }

        @include respond-to(xs) {
            width: 50%;
            margin-right: 1.2rem;
        }
    }

    .sortMobile {
        display: none;
        min-width: 50%;

        @include respond-to(xs) {
            display: block;
        }
    }

    .left,
    .right {
        display: flex;
        align-items: center;
    }

    .filterItem {
        &:not(:last-child) {
            margin-right: .8rem;
        }
    }

    .checkbox {
        margin-left: 1.7rem;
    }

    .icon {
        width: 1.2rem;
        height: 1.2rem;
    }

    .spinner {
        margin-left: 2rem;
    }

    .sortPanel {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 2rem 0 3.2rem;

        @include respond-to(xs) {
            display: none;
        }
    }
</style>
