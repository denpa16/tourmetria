<template>
    <div :class="[$style.SortSelect, 'sort-select']">
        <p :class="[$style.sortLabel, 'sort-label']"
           class="p6 c-base300">
            {{ label }}
        </p>
        <VSelect
            :class="$style.select"
            :placeholder="placeholder"
            :options="options"
            :value="value"
            :bordered="bordered"
            :display-name="displayName"
            :modal-title="modalTitle"
            :modal-breakpoint="['xs','sm']"
            :modal-width="$deviceIs.tablet ? '54.6rem' : '100%'"
            :checkbox="checkbox"
            :is-tabs="isTabs"
            :is-tabs-required="isTabsRequired"
            active-color="secondary"
            @input="handleChangeSort"
        >
            <template #icon>
                <IconSort :class="[$style.iconSort, {[$style._rotated]: value === '-price' || value === '-flat_min_price'}]" />
            </template>
        </VSelect>
    </div>
</template>

<script>
    import IconSort from '~/components/icons/IconSort';
    export default {
        name: 'SortSelect',
        components: {IconSort},
        props: {
            options: {
                type: Array,
                default: () => [],
            },

            /**
             * @param {String} Текущее значение.
             */
            value: {
                type: [String, Number, Array, Boolean],
                default: '',
            },

            placeholder: {
                type: String,
                default: '',
            },

            bordered: {
                type: Boolean,
                default: false,
            },

            label: {
                type: String,
                default: ''
            },

            displayName: {
                type: String,
                default: 'displayName',
            },

            isTabs: {
                type: Boolean,
                default: true,
            },

            isTabsRequired: {
                type: Boolean,
                default: true,
            },

            checkbox: {
                type: Boolean,
                default: true,
            },

            modalTitle: {
                type: String,
                default: 'Сортировка'
            },
        },

        data() {
            return {};
        },

        computed: {
            valueStr() {
                if (!this.value) {
                    if (this.placeholder) {
                        return this.placeholder;
                    }
                    return '';
                }

                if (this.options.length) {
                    const chosenOption = this.options.find(option => option.value === this.value);
                    return chosenOption?.[this.displayName] ? chosenOption[this.displayName] : chosenOption.label;
                }
                return '';
            },
        },

        methods: {
            handleChangeSort(val) {
                this.$emit('change', val);
            },
        },
    };
</script>

<style lang="scss" module>
    .SortSelect {
        display: flex;
        align-items: center;

        :global(.v-select) {
            width: 100%;
        }

        :global(.v-tab) {
            flex: 1;
        }

        :global(.v-select--medium .v-select__wrapper) {
            min-width: fit-content;
        }

        :global(.v-select--medium .v-select__value.is-arrow) {
            padding-right: 1.6rem;
        }

        :global(.v-tabs .v-tabs__wrapper) {
            flex-wrap: nowrap;
        }

        :global(.v-select__tabs) {
            border: none;
        }

        :global(.v-tab__label) {
            white-space: nowrap;
        }
    }

    .sortLabel {
        margin-right: .6rem;
        white-space: nowrap;

        @include respond-to(xs) {
            display: none;
        }
    }

    .iconSort {
        width: 1.1rem;
        height: .5rem;
        color: $primary-500;
        transition: transform .3s ease;

        &._rotated {
            transform: rotateX(180deg);
        }
    }
</style>
