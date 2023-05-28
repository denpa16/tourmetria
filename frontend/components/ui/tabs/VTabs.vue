<template>
    <div :class="classes">
        <div v-if="label"
             class="v-tabs__label"
        >
            {{ label }}
        </div>

        <ul class="v-tabs__wrapper">
            <VTab
                v-for="(tab, index) in tabs"
                :key="tab.value + tab.label + index"
                class="v-tabs__tab"
                :tab="tab"
                :active="Array.isArray(value) ? value.includes(tab.value) : value === tab.value"
                :disabled="isDisabled(tab)"
                :type="type"
                :active-color="activeColor"
                :size="size"
                :fill="fill"
                :label-name="labelName"
                @click="onClick(tab.value)"
            />

            <li v-if="$slots.default"
                class="v-tabs__additional"
            >
                <slot></slot>
            </li>
        </ul>
    </div>
</template>

<script>
    import VTab from '~/components/ui/tabs/VTab';

    export default {
        name: 'VTabs',

        components: {
            VTab,
        },

        props: {
            tabs: {
                type: Array,
                default: () => [],
            },

            facets: {
                type: Array,
                default: () => [],
            },

            value: {
                type: [String, Number, Array, Boolean],
                required: true,
            },

            isRequired: {
                type: Boolean,
                default: false,
            },

            label: {
                type: String,
                default: '',
            },

            type: {
                type: String,
                default: 'square',
                validator(value) {
                    return ['ellipse', 'square', 'transparent', 'custom', 'scroll'].indexOf(value) !== -1;
                },
            },

            activeColor: {
                type: String,
                default: 'primary',
            },

            size: {
                type: String,
                default: 'medium',
                validator(value) {
                    return ['medium', 'small'].indexOf(value) !== -1;
                },
            },

            fill: {
                type: Boolean,
                default: false,
            },

            applyFacets: {
                type: Boolean,
                default: false,
            },

            labelName: {
                type: String,
                default: 'label',
            },
        },

        computed: {
            classes() {
                return [
                    'v-tabs',
                    `v-tabs--${this.type}`,
                ];
            },
        },

        methods: {
            onClick(value) {
                if (Array.isArray(this.value)) {
                    if (this.value.includes(value) && !this.isRequired) {
                        const newValue = [...this.value];
                        newValue.splice(this.value.indexOf(value), 1);
                        this.$emit('change', newValue);
                    } else {
                        this.$emit('change', [...this.value, value]);
                    }
                } else if (this.value === value && !this.isRequired) {
                    this.$emit('change', '');
                } else {
                    this.$emit('change', value);
                }
            },

            isDisabled(val) {
                if (!this.applyFacets) {
                    return false;
                }

                if (!Array.isArray(this.facets)) {
                    return this.facets !== val.value;
                }

                return !this.facets.some(item => item.value === val.value || item === val.value || item === Number(val.value));
            },
        }
    };
</script>

<style lang="scss">
    .v-tabs {
        &--scroll {
            .v-tabs__wrapper {
                overflow-x: scroll;
                overflow-y: hidden;
                flex-wrap: nowrap;
                white-space: nowrap;
                -ms-overflow-style: none;  /* Internet Explorer 10+ */
                scrollbar-width: none;  /* Firefox */

                &::-webkit-scrollbar {
                    display: none;  /* Safari and Chrome */
                }
            }
        }

        &__label {
            margin-bottom: 1.2rem;
            font-family: $accent-font-family;
            font-size: 1.2rem;
            font-weight: 500;
            line-height: 1.6rem;
            color: $base-400;
            transition: $default-color-transition;
        }

        &__wrapper {
            display: flex;
            flex-wrap: wrap;
            width: calc(100% + (.4rem * 2));
            margin: -.4rem;
        }

        &__tab {
            margin: .4rem;
            white-space: nowrap;
        }
    }
</style>
