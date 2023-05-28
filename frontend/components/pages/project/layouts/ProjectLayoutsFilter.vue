<template>
    <div :class="$style.ProjectLayoutsFilter">
        <div :class="$style.tabsWrapper">
            <VTab
                :class="$style.tab"
                :tab="tabAllRooms"
                :active="tabActive"
                tag="button"
                @click="onTabClick(tabAllRooms.value)"
            />
            <VTabs 
                :class="$style.tabs"
                :facets="facets.rooms"
                :tabs="tabsRooms"
                :value="values.rooms"
                apply-facets
                @change="$emit('change', {rooms: $event})"
            />
        </div>

        <VSelect :value="values.rooms"
                 :options="specsRooms"
                 :facet="facets.rooms"
                 :placeholder="roomsPlaceholder"
                 :postfix="(values.rooms.length === 1 && values.rooms.includes('0')) ? '' : '-комн.'"
                 :class="$style.roomsSelect"
                 bordered
                 multiple
                 modal-breakpoint="xs"
                 @input="$emit('change', {rooms: $event})"
        />

        <div :class="$style.wrapper">
            <div :class="[$style.label, 'p5', 'c-base300']">
                Подборки
            </div>
            <VTabs
                :class="[$style.tabs, $style.right]"
                :tabs="tabsFeatures"
                :facets="facets.features"
                :value="values.features"
                type="scroll"
                apply-facets
                @change="$emit('change',{features: $event})"
            />
        </div>

        <VSelect :value="values.features"
                 :options="specs.features"
                 :facet="facets.features"
                 apply-facets
                 placeholder="Особенности"
                 :class="$style.additionalSelect"
                 bordered
                 multiple
                 modal-breakpoint="xs"
                 @input="$emit('change', {features: $event})"
        />
    </div>
</template>

<script>
    import VTab from '~/components/ui/tabs/VTab';

    export default {
        name: 'ProjectLayoutsFilter',

        components: {
            VTab,
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
        },

        data() {
            return {
                targetFeatures: ['кухня-гостиная', 'квартира на 2 стороны', '2 санузла'],
                tabActive: false,
            };
        },

        computed: {
            roomsPlaceholder() {
                if (this.values.rooms.length) {
                    return this.values.rooms.map(item => {
                        if (item === 0) {
                            return 'Студия';
                        }
                        return item;
                    }).join(', ');
                }

                return this.specs.rooms.filter(item => this.facets.rooms.includes(item.value)).map(item => {
                    if (item.value === 0) {
                        return 'Студия';
                    }
                    return item.value;
                })
                    .join(', ')
                    .concat('-комн');
            },

            tabAllRooms() {
                return {
                    label: 'Все',
                    value: 'all',
                };
            },

            tabsRooms() {
                return this.specs.rooms.map(el => ({
                    value: el.value,
                    label: el.value === 0 ? 'Студия' : `${el.value} комн`,
                }));
            },

            specsRooms() {
                return [
                    {
                        label: 'Все',
                        value: 'all',
                    },
                    ...this.specs.rooms,
                ];
            },

            tabsFeatures() {
                if (Array.isArray(this.targetFeatures)) {
                    return this.specs.features.filter(feature => this.targetFeatures
                        .includes(feature.label.toLowerCase()));
                }

                return this.specs.features.slice(0, 3);
            },
        },

        watch: {
            'values.rooms'(values) {
                if (values.length) {
                    this.tabActive = false;
                }
            },
        },

        methods: {
            onTabClick(value) {
                this.tabActive = !this.tabActive;
                if (this.tabActive) {
                    this.$emit('change', {rooms: value});
                }
            },
        },
    };
</script>

<style lang="scss" module>
    .ProjectLayoutsFilter {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.2rem 0;
    }

    .wrapper {
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 50%;

        @include respond-to(sm) {
            width: auto;
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .label {
        margin-right: 2.4rem;
    }

    .tabsWrapper {
        display: flex;
        align-items: center;
        width: 50%;

        @include respond-to(sm) {
            display: none;
        }
    }

    .tab {
        margin-right: .8rem;
    }

    .tabs {
        width: auto;
    }

    .right {
        min-width: auto;

        @include respond-to(sm) {
            max-width: 60%;
        }
    }

    .roomsSelect {
        display: none;

        @include respond-to(sm) {
            display: block;
            max-width: 15rem;
        }

        @include respond-to(xs) {
            width: 48%;
            max-width: 48%;
            margin-right: 1.2rem;
        }
    }

    .additionalSelect {
        display: none;

        @include respond-to(xs) {
            display: block;
            width: 48%;
            max-width: 48%;
        }
    }
</style>
