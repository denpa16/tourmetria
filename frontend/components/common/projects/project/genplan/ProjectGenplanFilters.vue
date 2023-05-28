<template>
    <div :class="[$style.ProjectGenplanFilters, 'selection-filters']">
        <div v-show="!$deviceIs.pc"
             :class="$style.filterItem">
            <VSelect :value="values.property_type"
                     :options="specs.property_type"
                     apply-facets
                     :facet="facets.property_type"
                     :class="$style.filterItem"
                     placeholder="Тип недвижимости"
                     bordered
                     @input="$emit('change', {property_type: $event})"
            />
        </div>

        <div :class="$style.filterItem">
            <p :class="$style.label">
                Комнатность
            </p>
            <VTabs
                :class="[$style.values, {[$style._studio]: isHaveStudio}]"
                :tabs="specs.rooms"
                :facets="facets.rooms"
                :value="values.rooms"
                apply-facets
                @change="$emit('change', {rooms: $event})"
            />
        </div>

        <div :class="$style.filterItem">
            <p :class="$style.label">
                Площадь
            </p>
            <VRange
                :class="$style.values"
                name="area"
                :spec="specs.area"
                :facet="facets.area"
                :value-min="values.area_min"
                :value-max="values.area_max"
                :step="1"
                range
                postfix=" м²"
                @change="$emit('change', $event)"
            />
        </div>

        <div :class="$style.filterItem">
            <p :class="$style.label">
                Стоимость
            </p>
            <VRange
                :class="$style.values"
                name="price"
                :spec="specs.price"
                :facet="facets.price"
                :value-min="values.price_min"
                :value-max="values.price_max"
                :step="10000"
                postfix=" Р"
                @change="$emit('change', $event)"
            />
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ProjectGenplanFilters',
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
        },

        computed: {
            isHaveStudio() {
                if (!this.specs?.rooms) {
                    return false;
                }

                return this.specs.rooms.some(spec => spec?.value === 0);
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectGenplanFilters {
        width: 100%;
        padding-top: 2.4rem;
    }

    .filterItem {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: .1rem solid $base-100;

        &:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }

        @include respond-to(sm) {
            display: block;
            margin-bottom: 2.4rem;
            padding-bottom: 0;
            border-bottom: none;
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

    .values {
        width: 32.9rem;

        @include respond-to(sm) {
            width: 100%;
        }

        & :global(.v-tab) {
            flex: 1;
            padding: 0;

            @include respond-to(sm) {
                flex: unset;
                padding: 0 2.4rem;
            }
        }

        &._studio :global(.v-tab):first-child {
            flex: 1.6;

            @include respond-to(sm) {
                flex: unset;
            }
        }
    }
</style>
