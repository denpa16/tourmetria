<template>
    <div :class="[$style.FlatsFilters, 'selection-filters']">
        <div :class="$style.filtersSelect">
            <VSelect
                v-if="values.city"
                :class="[$style.filterItem, $style.project]"
                :value="values.city"
                :options="specs.city"
                :facet="facets.city"
                :label="isAdaptive ? 'Город' : ''"
                modal-breakpoint="xs"
                :to-unlock-body="false"
                modal-title="Город"
                placeholder="Город"
                apply-facets
                bordered
                clear-btn
                @open="$emit('disable-scrollbox-overflow')"
                @close="$emit('enable-scrollbox-overflow')"
                @clear-filter="handleChange({city:[]})"
                @input="handleChange({city:$event})"
            />

            <VSelect
                :class="[$style.filterItem, $style.project]"
                :value="values.project"
                :options="projectSpecs"
                :facet="facets.project"
                :label="isAdaptive ? 'Проект' : ''"
                modal-breakpoint="xs"
                :to-unlock-body="false"
                modal-title="Проект"
                :placeholder="isAdaptive ? 'Все проекты' : 'Проект'"
                apply-facets
                bordered
                multiple
                clear-btn
                @open="$emit('disable-scrollbox-overflow')"
                @close="$emit('enable-scrollbox-overflow')"
                @clear-filter="handleChange({project:[]})"
                @input="handleChange({project:$event})"
            />

            <VSelect
                :class="[$style.filterItem, $style.rooms, $style._desktop]"
                :value="values.rooms"
                :options="roomsOptions"
                :facet="facets.rooms"
                :placeholder="roomsPlaceholder"
                :postfix="(values.rooms.length === 1 && values.rooms.includes(0)) ? '' : '-комн.'"
                select-type="rooms"
                apply-facets
                bordered
                multiple
                clear-btn
                @clear-filter="handleChange({rooms:[]})"
                @input="handleChange({rooms: $event})"
            />

            <div :class="[$style.filterItem, $style._adaptive]">
                <p :class="$style.label">
                    Комнатность
                </p>
                <VTabs
                    :tabs="roomsOptions"
                    :value="values.rooms"
                    :facets="facets.rooms"
                    label-name="name"
                    apply-facets
                    @change="handleChange({rooms: $event})"
                />
            </div>

            <VRangeDropdown
                name="area"
                :class="[$style.filterItem, $style._desktop]"
                :spec="specs.area"
                :facet="facets.area"
                :value-min="values.area_min"
                :value-max="values.area_max"
                :step="1"
                :title="areaTitle"
                dropdown-title="Площадь, м²"
                range
                clear-btn
                @clear-filter="handleChange({area_min:'',area_max:''})"
                @change="handleChange($event)"
            />

            <div :class="[$style.filterItem, $style._adaptive]">
                <p :class="$style.label">
                    Площадь
                </p>
                <VRange
                    name="area"
                    :spec="specs.area"
                    :facet="facets.area"
                    :value-min="values.area_min"
                    :value-max="values.area_max"
                    :step="1"
                    range
                    postfix=" м²"
                    @change="handleChange($event)"
                />
            </div>

            <VRangeDropdown
                name="price"
                :class="[$style.filterItem, $style._desktop]"
                :spec="priceSpecs"
                :facet="priceFacets"
                :value-min="values.price_min/1000000"
                :value-max="values.price_max/1000000"
                :title="priceTitle"
                :step="1"
                dropdown-title="Стоимость, млн. руб."
                clear-btn
                @clear-filter="handleChange({price_min:'',price_max:''})"
                @change="handleChange($event)"
            />

            <div :class="[$style.filterItem, $style._adaptive]">
                <p :class="$style.label">
                    Стоимость
                </p>
                <VRange
                    name="price"
                    :spec="specs.price"
                    :facet="facets.price"
                    :value-min="values.price_min"
                    :value-max="values.price_max"
                    :step="10000"
                    postfix=" Р"
                    @change="handleChange($event)"
                />
            </div>

            <VSelect
                :value="values.completion_date"
                :options="specs.completion_date"
                :class="[$style.filterItem,$style.completionDate, $style._desktop]"
                apply-facets
                :facet="facets.completion_date"
                placeholder="Срок сдачи"
                bordered
                multiple
                clear-btn
                @clear-filter="handleChange({completion_date:[]})"
                @input="handleChange( {completion_date: $event})"
            />

            <div :class="[$style.filterItem, $style._adaptive]">
                <p :class="$style.label">
                    Срок сдачи
                </p>
                <VTabs
                    :tabs="specs.completion_date"
                    :value="values.completion_date"
                    :facets="facets.completion_date"
                    apply-facets
                    @change="handleChange({completion_date: $event})"
                />
            </div>

            <VRangeDropdown
                name="floor"
                :class="[$style.filterItem, $style.floor,$style._desktop]"
                :spec="specs.floor"
                :facet="facets.floor"
                :value-min="values.floor_min"
                :value-max="values.floor_max"
                :title="floorTitle"
                :step="1"
                clear-btn
                :decimal-count="0"
                @clear-filter="handleChange({floor_min:'',floor_max:'', floorTabs:[]})"
                @change="handleChange($event)"
            >
                <template #additional-content>
                    <VTabs :class="$style.floorTabs"
                           :tabs="floorTabs"
                           :value="currentFloorTabs"
                           @change="handleTabsValueChange" />
                </template>
            </VRangeDropdown>
            <div :class="[$style.filterItem, $style._adaptive]">
                <p :class="$style.label">
                    Этаж
                </p>
                <VRange
                    name="floor"
                    :spec="specs.floor"
                    :facet="facets.floor"
                    :value-min="values.floor_min"
                    :value-max="values.floor_max"
                    :step="1"
                    @change="handleChange($event)"
                />

                <VTabs
                    :class="$style.floorTabs"
                    :tabs="floorTabs"
                    :value="currentFloorTabs"
                    @change="handleTabsValueChange"
                />
            </div>
            <div :class="[$style.filterItem, $style._adaptive]">
                <p :class="[$style.label, 'p5', 'c-base400']">
                    Дополнительно
                </p>
                <VCheckbox
                    :false-value="false"
                    :value="values.has_promotions"
                    no-checkbox
                    @input="handleChange({has_promotions: $event})"
                >
                    Акции
                </VCheckbox>
            </div>
        </div>
        <div :class="$style.filtersCheckbox">
            <VCheckbox
                :false-value="false"
                :value="values.has_promotions"
                @input="handleChange({has_promotions: $event})"
            >
                Акции
            </VCheckbox>
        </div>
    </div>
</template>

<script>
    import {splitMillionsToShort} from '~/assets/js/utils/numberUtils';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';

    import VTabs from '~/components/ui/tabs/VTabs';
    import VCheckbox from '~/components/ui/checkbox/VCheckbox';

    export default {
        name: 'FlatsFilters',

        components: {
            VTabs,
            VCheckbox
        },

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

            isAdaptive: {
                type: Boolean,
                default: false
            },

            currentFloorTabs: {
                type: Array,
                default: () => [],
            },
        },

        data() {
            return {
                floorTabs: [
                    {
                        label: 'Не первый',
                        value: 'not_first'
                    },
                ],

                priceSpecs: {
                    min: Math.floor(this.specs.price.min / 1000000),
                    max: Math.ceil(this.specs.price.max / 1000000),
                },

                priceFacets: {
                    min: Math.floor(this.facets.price.min / 1000000),
                    max: Math.ceil(this.facets.price.max / 1000000),
                },
            };
        },

        computed: {
            roomsPlaceholder() {
                if (this.values.rooms.length) {
                    return this.values.rooms.map(item => {
                        if (!item.label && typeof item === 'number' && item === 0) {
                            return 'Студия';
                        } else if (!item.label && typeof item === 'number' && item === 4) {
                            return '4';
                        }
                        return item.label || item;
                    }).join(', ');
                }

                return this.specs.rooms.map(item => item.displayName || item.label).join(', ')
                    .concat('-комн');
            },

            areaTitle() {
                if (this.values.area_min&&this.values.area_max) {
                    return `${this.values.area_min} м² - ${this.values.area_max} м²`;
                } else if (this.values.area_min) {
                    return `от ${this.values.area_min} м²`;
                } else if (this.values.area_max) {
                    return `до ${this.values.area_max} м²`;
                }
                return 'Площадь';
            },

            priceTitle() {
                if (this.values.price_min&&this.values.price_max) {
                    return `${splitMillionsToShort(this.values.price_min)} млн - ${splitMillionsToShort(this.values.price_max)} млн Р`;
                } else if (this.values.price_min) {
                    return `от ${splitMillionsToShort(this.values.price_min)} млн Р`;
                } else if (this.values.price_max) {
                    return `до ${splitMillionsToShort(this.values.price_max)} млн Р`;
                }
                return 'Стоимость';
            },

            floorTitle() {
                let floorTitle = '';
                if (this.values.floor_min && this.values.floor_max) {
                    floorTitle = `${this.values.floor_min} - ${this.values.floor_max}`;
                } else if (this.values.floor_min) {
                    floorTitle = `от ${this.values.floor_min}`;
                } else if (this.values.floor_max) {
                    floorTitle = `до ${this.values.floor_max}`;
                }

                if (this.values?.floorTabs?.length !== 0) {
                    floorTitle = `${floorTitle}${this.values?.floorTabs?.includes('not_first') ? ', не первый': ''}`;
                }
                return floorTitle || 'Этаж';
            },

            roomsOptions() {
                if (!this.specs.rooms.length) {
                    return [];
                }

                const items = [];

                this.specs.rooms.forEach(element => {
                    items.push({value: element.value, label: element.label.split('-')[0], name: this.getOption(element.label)});
                });

                return items;
            },

            projectSpecs() {
                const items = [];

                this.specs.city.forEach(item => {
                    const array = item.projects.filter(project => {
                        let values = [];
                        values = this.facets.project.filter(elem => elem.value === project.value);
                        return values.length;
                    });

                    if (array.length) {
                        items.push({
                            label: item.label,
                            value: item.value,
                            type: 'city',
                        });

                        item.projects.forEach(project => {
                            const projects = this.facets.project.filter(elem => elem.value === project.value);
                            projects.forEach(item => {
                                items.push({
                                    label: item.label,
                                    value: item.value,
                                });
                            });
                        });
                    }
                });

                return items;
            },
        },

        methods: {
            handleChange(value) {
                if (value.floor_min === '' || value.floor_max === '') {
                    if (value.floor_min === '' && this.values?.floorTabs.includes('not_first')) {
                        this.$emit('change', {floorTabs: this.values?.floorTabs.filter(value => value !== 'not_first')});
                    }
                }
                if (value.has_promotions === false && this.values.publications) {
                    this.$emit('change', {...value, publications: false});
                    return;
                }
                if (value.project && value.project.length < this.values.project.length) {
                    this.$emit('change', {...value, building: []});
                    return;
                }
                this.$emit('change', value);
            },

            handleTabsValueChange(tabs) {
                if (tabs.includes('not_first') && (!this.values.floor_min || this.values.floor_min === this.specs.floor.min)) {
                    this.handleChange({floor_min: this.specs.floor.min + 1, floorTabs: tabs});
                } else {
                    this.handleChange({floor_min: this.specs.floor.min, floorTabs: tabs});
                }
            },

            getOption(item) {
                let room;

                switch (item) {
                    case 'Студия':
                        room = 'Студии';
                        break;
                    case '1-комнатная':
                        room = '1к';
                        break;
                    case '2-комнатная':
                        room = '2к';
                        break;
                    case '3-комнатная':
                        room = '3к';
                        break;
                    case '4-комнатная':
                        room = '4к';
                        break;
                    default:
                        room = '1к';
                }

                return room;
            },
        },
    };
</script>

<style lang="scss" module>
    .FlatsFilters {
        display: flex;
    }

    .filtersSelect {
        display: flex;
        margin-right: calc(2.4rem - .4rem);
        margin-left: -.4rem;

        @include respond-to(sm) {
            flex-direction: column;
            width: 100%;
            margin-right: 0;
        }
    }

    .filtersCheckbox {
        display: flex;
        align-items: center;

        @include respond-to(sm) {
            display: none;
        }
    }

    .filterItem {
        margin-right: .4rem;
        margin-left: .4rem;

        @include respond-to(sm) {
            margin: 0 0 2.4rem;
        }

        &._desktop {
            @include respond-to(sm) {
                display: none;
            }
        }

        &._adaptive {
            display: none;

            @include respond-to(sm) {
                display: flex;
                flex-direction: column;
                margin-bottom: 2.4rem;
            }
        }
    }

    .rooms,
    .completionDate {
        max-width: 15rem;
    }

    .project {
        max-width: 20rem;

        @include respond-to(sm) {
            max-width: unset;

            & :global(.v-select__clear-box) {
                transform: translateY(.25rem) rotate(0);
            }
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

    .floorTabs {
        padding-top: 1.6rem;

        &:global(.v-tabs .v-tabs__wrapper) {
            flex-wrap: nowrap;
        }

        :global(.v-tab__label) {
            white-space: nowrap;
        }

        :global(.v-tab--square) {
            width: 100%;
        }
    }

    .filterFeatures {
        width: 60%;

        @include respond-to(sm) {
            width: 100%;
        }
    }
</style>
