<template>
    <div :class="$style.ProjectInfraMapFilterCategory">
        <VScrollBox :class="$style.scrollBox">
            <ul :class="$style.filterList">
                <li key="all"
                    :class="[$style.filterItem, {[$style._active]: isAll}, 'p5']"
                    @click="resetFilter"
                >
                    <VCheckbox :false-value="false"
                               :value="isAll"
                               :class="$style.checkbox"
                    >
                        Все категории
                    </VCheckbox>
                </li>

                <li v-for="category in infrasCategories"
                    :key="category.id"
                    :class="[$style.filterItem, {[$style._active]: checkValue(category.slug)}, 'p5']"
                    @click="handleItemClick(category.slug)"
                >
                    <div :class="$style.icon"
                         :style="{color: (isAll || checkValue(category.slug)) ? category.color : colorVars['base-300']}"
                         v-html="category.icon_content"></div>
                    <span :class="$style.name">{{ category.name }}</span>
                    <span :class="[$style.count, 'c-base300']">{{ category.infra_count }}</span>
                </li>
            </ul>
        </VScrollBox>
    </div>
</template>

<script>
    import variables from '~/assets/scss/shared/_variables.scss';

    export default {
        name: 'ProjectInfraMapFilterCategory',
        components: {},


        props: {
            infrasCategories: {
                type: Array,
                default: () => []
            },

            filterValues: {
                type: Array,
                default: () => []
            }
        },

        data() {
            return {
                colorVars: variables,
            };
        },

        computed: {
            isAll() {
                return !this.filterValues?.length;
            }
        },

        methods: {
            handleItemClick(slug) {
                if (this.isAll) {
                    this.updateFilterValues([slug]);
                    return;
                }

                const findedInx = this.filterValues.findIndex(filterValue => filterValue === slug);

                if (findedInx + 1) {
                    const newValues = [...this.filterValues];
                    newValues.splice(findedInx, 1);
                    this.updateFilterValues(newValues);
                    return;
                }
                this.updateFilterValues([...this.filterValues, slug]);
            },

            checkValue(filter) {
                return this.filterValues.includes(filter);
            },

            updateFilterValues(values) {
                this.$emit('change', values);
            },

            resetFilter() {
                if (!this.isAll) {
                    this.updateFilterValues([]);
                }
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectInfraMapFilterCategory {
        width: 100%;
    }

    .filterList {
        width: calc(100% - 1.6rem);
    }

    .scrollBox {
        width: 100%;
        max-height: 35.6em;

        @include respond-to(sm) {
            max-height: 50vh;
        }
    }

    .filterItem {
        display: flex;
        align-items: center;
        width: 100%;
        height: 4.4rem;
        margin-bottom: .8rem;
        padding: 0 1.6rem;
        border-radius: .4rem;
        border: 1px solid $base-50;
        background-color: $base-50;
        transition: all $default-color-transition;
        user-select: none;
        cursor: pointer;

        &:last-child {
            margin-bottom: 0;
        }

        @include hover {
            border: 1px solid $base-100;
            background-color: $base-0;
        }

        &._active {
            border: 1px solid $base-100;
            background-color: $base-0;

            @include hover {
                background-color: $base-50;
            }
        }
    }

    .checkbox {
        margin-left: 5px;

        & :global(.v-checkbox__input) {
            background-color: inherit;
        }
    }

    .icon {
        width: 1.6rem;
        height: 1.6rem;

        & > svg {
            width: 100%;
            height: 100%;
        }
    }

    .name {
        margin-left: 1.6rem;
    }

    .count {
        margin-left: auto;
    }
</style>
