<template>
    <div :class="$style.ProjectFinishesFilter">
        <div :class="$style.tabsWrapper">
            <VTabs 
                :class="$style.tabs"
                :facets="facetsRooms"
                :tabs="specsRooms"
                :value="values.room"
                apply-facets
                @change="$emit('change-rooms', $event)"
            />
        </div>

        <VSelect v-show="$deviceIs.mobile || $deviceIs.tablet"
                 :value="values.room"
                 :options="specsRooms"
                 :facet="facetsRooms"
                 :class="$style.roomsSelect"
                 bordered
                 apply-facets
                 modal-breakpoint="xs"
                 @input="$emit('change-rooms', $event)"
        />

        <div :class="$style.wrapper">
            <p :class="[$style.label, 'p5', 'c-base300']">
                Виды отделки
            </p>
            <VTabs
                :class="[$style.tabs, $style.right]"
                :tabs="specsFinishes"
                :facets="facetsFinishes"
                :value="values.finish"
                type="scroll"
                apply-facets
                @change="$emit('change-finishes', $event)"
            />
        </div>

        <VSelect v-show="$deviceIs.mobile"
                 :class="$style.additionalSelect"
                 :value="values.finish"
                 :options="specsFinishes"
                 :facet="facetsFinishes"
                 apply-facets
                 bordered
                 modal-breakpoint="xs"
                 @input="$emit('change-finishes', $event)"
        />
    </div>
</template>

<script>
    export default {
        name: 'ProjectFinishesFilter',

        props: {
            values: {
                type: Object,
                default: () => ({}),
            },

            finishes: {
                type: Array,
                default: () => [],
            },
        },

        computed: {
            facetsFinishes() {
                return this.finishes.map(item => item.slug);
            },

            facetsRooms() {
                const items = [];
                const finishkindarea = this.finishes.filter(elem => elem.slug === this.values.finish);
                finishkindarea.forEach(item => {
                    items.push(...item.finishkindarea_set.map(elem => elem.slug));
                });

                return items.filter((item, idx) => items.indexOf(item) === idx);
            },

            specsRooms() {
                const items = [];
                const finishkindarea = this.finishes.filter(elem => elem.slug === this.values.finish);
                finishkindarea.forEach(item => {
                    item.finishkindarea_set.forEach(elem => {
                        if (!items.find(el => el?.value === elem.slug)) {
                            items.push({
                                value: elem.slug,
                                label: elem.name,
                            });
                        }
                    });
                });

                return items;
            },

            specsFinishes() {
                const items = [];
                this.finishes.forEach(item => {
                    items.push({
                        value: item.slug,
                        label: item.name,
                    });
                });
    
                return items;
            },
        },
    };
</script>

<style lang="scss" module>
    .ProjectFinishesFilter {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2.4rem;
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
        white-space: nowrap;
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
