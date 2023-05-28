<template>
    <div :class="[$style.ProjectsFilters, 'project-filters']">
        <div :class="$style.left">
            <VSelect
                v-show="$deviceIs.pc"
                :class="[$style.filterItem, $style.select, 'p6']"
                :options="cities"
                :value="values.city || getCurrentCity.value"
                margin-dropdown="3rem"
                min-width-dropdown="49.6rem"
                bordered
                :is-tabs="isAnyRegions"
                @input="handleInput"
            >
                <template #icon>
                    <IconLocation :class="$style.icon" />
                </template>
            </VSelect>

            <VSelect :value="values.property_type"
                     :options="specs.property_type"
                     :facet="facets.property_type"
                     :class="$style.filterItem"
                     placeholder="Тип недвижимости"
                     bordered
                     clear-btn
                     @clear-filter="$emit('clear-filter', {property_type: ''})"
                     @input="$emit('change', {property_type: $event})"
            />

            <VRangeDropdown v-if="facets.area.min && facets.area.max"
                            name="area"
                            :class="$style.filterItem"
                            :spec="specs.area"
                            :facet="facets.area"
                            :value-min="values.area_min"
                            :value-max="values.area_max"
                            :step="1"
                            :title="area"
                            label="Площадь, м²"
                            clear-btn
                            range
                            @clear-filter="$emit('clear-filter', {area_min: '', area_max: ''})"
                            @change="$emit('change', $event)"
            />

            <VSelect v-if="facets.rooms.length"
                     :value="values.rooms"
                     :options="roomsOptions"
                     :placeholder="roomsPlaceholder"
                     :postfix="(values.rooms.length === 1 && values.rooms.includes(0)) ? '' : '-комн.'"
                     :class="[$style.filterItem, $style.rooms]"
                     select-type="rooms"
                     bordered
                     multiple
                     clear-btn
                     @clear-filter="$emit('clear-filter', {rooms: []})"
                     @input="$emit('change', {rooms: $event})"
            />

            <VRangeDropdown name="price"
                            :class="$style.filterItem"
                            :spec="priceSpecs"
                            :facet="priceFacets"
                            :value-min="values.price_min/1000000"
                            :value-max="values.price_max/1000000"
                            :title="price"
                            :step="0.1"
                            dropdown-title="Стоимость, млн. руб."
                            clear-btn
                            @clear-filter="$emit('clear-filter', {price_min: '', price_max: ''})"
                            @change="$emit('change', $event)"
            />

            <VSelect :value="values.completion_date"
                     :options="specs.completion_date"
                     :class="$style.filterItem"
                     apply-facets
                     :facet="facets.completion_date"
                     placeholder="Срок сдачи"
                     bordered
                     clear-btn
                     @clear-filter="$emit('clear-filter', {completion_date: ''})"
                     @input="$emit('change', {completion_date: $event})"
            />

            <VCheckbox v-if="facets.hasOwnProperty('promo')"
                       :false-value="false"
                       :value="values.promo"
                       :class="$style.checkbox"
                       @input="$emit('change', {promo: $event})">
                Акции
            </VCheckbox>

            <transition name="fade-content"
                        mode="out-in">
                <VSpinner v-if="isReloading"
                          :class="$style.spinner" />
            </transition>
        </div>
        <div :class="$style.right">
            <VButton v-if="!projectsPage"
                     color="light"
                     :disabled="isResetBtnDisabled"
                     :class="$style.resetBtn"
                     @click="$emit('reset')">
                Сбросить
            </VButton>

            <p v-if="projectsPage && projectsCount"
               :class="['p6', 'c-base300', $style.projectsCount]">
                {{ projectsCount }} {{ projectsCount | plural(['проект', 'проекта', 'проектов']) }}
            </p>

            <VButton :class="$style.btn"
                     :color="projectsPage ? 'light' : 'primary'"
                     @click="$emit('open-map')">
                На карте
            </VButton>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';

    import IconLocation from '~/components/icons/IconLocation';
    import {splitMillionsToShort} from '~/assets/js/utils/numberUtils';
    import VRangeDropdown from '~/components/ui/range/VRangeDropdown';

    export default {
        name: 'ProjectsFilters',

        components: {
            VRangeDropdown,
            IconLocation,
        },

        props: {
            projectsCount: {
                type: Number,
                default: 0,
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

            cities: {
                type: Array,
                default: () => [],
            },

            projectsPage: {
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
            }
        },

        data() {
            return {
                priceSpecs: {
                    min: Math.floor(this.specs.price.min / 100000) / 10,
                    max: Math.ceil(this.specs.price.max / 100000) / 10,
                },

                priceFacets: {
                    min: Math.floor(this.facets.price.min / 100000) / 10,
                    max: Math.ceil(this.facets.price.max / 100000) / 10,
                },
            };
        },

        computed: {
            ...mapGetters({
                getCurrentCity: 'getCurrentCity',
            }),

            isAnyRegions() {
                return this.cities.some(city => city.group);
            },

            roomsOptions() {
                return this.specs.rooms.map(item => ({
                    label: item.value === 0 ? 'Студия' : item.value,
                    name: item.label,
                    value: item.value,
                }));
            },

            roomsPlaceholder() {
                if (this.values.rooms.length) {
                    return this.values.rooms.map(item => {
                        if (item === 0) {
                            return 'Студия';
                        }
                        return item;
                    }).join(', ');
                }

                return this.specs.rooms.map(item => {
                    if (item.value === 0) {
                        return 'Студия';
                    }
                    return item.value;
                }).join(', ')
                    .concat('-комн');
            },

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
            },
        },

        methods: {
            ...mapActions(['setCurrentCity']),
            ...mapActions('projects', ['fetchCurrentCityProject', 'setParams']),

            handleInput(value) {
                const city = this.cities.find(city => (city.value === value) || (city.value === value?.value)) || this.cities[0];
                this.setCurrentCity(city);
                this.fetchCurrentCityProject(city);
            },
        },
    };
</script>

<style lang="scss" module>
    .ProjectsFilters {
        display: flex;
        justify-content: space-between;
        padding: 1.2rem 0;
        border-top: 1px solid $base-100;
        border-bottom: 1px solid $base-100;
    }

    .icon {
        width: 1.2rem;
        height: 1.2rem;
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

    .select {
        min-width: 16.1rem;
    }

    .checkbox {
        margin-left: 2.4rem;
    }

    .resetBtn {
        margin-right: .8rem;
    }

    .projectsCount {
        margin-right: 4.8rem;
    }

    .btn {
        &:not(:last-child) {
            margin-right: .8rem;
        }
    }

    .spinner {
        margin-left: 2rem;
    }
</style>
