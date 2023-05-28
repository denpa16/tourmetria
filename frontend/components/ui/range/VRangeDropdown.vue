<template>
    <div :class="$style.VRangeDropdown">
        <VDropdown :arrow="false">
            <div :class="$style.btn">
                <slot>
                    <span :class="['p5', $style.text]">
                        <span>{{ title }}</span>
                    </span>
                </slot>
                <span v-if="clearBtn&&(valueMin || valueMax || value)"
                      :class="$style.clearBtn"
                      @click="$emit('clear-filter')">
                    <svg :class="$style.cross"
                         viewBox="0 0 12 12"
                         fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 5.11125L9.11125 2L10 2.88875L6.88875 6L10 9.11125L9.11125 10L6 6.88875L2.88875 10L2 9.11125L5.11125 6L2 2.88875L2.88875 2L6 5.11125Z"
                              fill="currentColor" />
                    </svg>
                </span>
                <IconArrowLeft v-else
                               :class="$style.arrow" />
            </div>

            <template #dropdown>
                <div :class="$style.rangeWrapper">
                    <p v-show="dropdownTitle"
                       :class="[$style.dropdownTitle, 'p6']">
                        {{ dropdownTitle }}
                    </p>
                    <VRange
                        v-if="!single"
                        :name="name"
                        :spec="spec"
                        :postfix="postfix"
                        :facet="facet"
                        :label="label"
                        :value-min="valueMin"
                        :value-max="valueMax"
                        :range="range"
                        :step="step"
                        :disabled="disabled"
                        :show-value="showValue"
                        :decimal-count="decimalCount"
                        @change="$emit('change', $event)"
                    />
                    <VRangeSingle
                        v-else
                        :value="value"
                        :name="name"
                        :spec="spec"
                        :postfix="postfix"
                        :facet="facet"
                        :label="label"
                        :step="step"
                        :disabled="disabled"
                        @change="$emit('change', $event)"
                    >
                        <template #postfix>
                            <slot name="rangeSinglePostfix">
                            </slot>
                        </template>
                    </VRangeSingle>
                    <slot name="additional-content"></slot>
                </div>
            </template>
        </VDropdown>
    </div>
</template>

<script>
    import IconArrowLeft from '~/components/icons/IconArrowLeft';

    export default {
        name: 'VRangeDropdown',

        components: {
            IconArrowLeft,
        },

        props: {
            name: {
                type: String,
                default: '',
            },

            value: {
                type: [String, Number],
                default: '',
            },

            title: {
                type: String,
                default: ''
            },

            dropdownTitle: {
                type: String,
                default: ''
            },

            postfix: {
                type: String,
                default: '',
            },

            spec: {
                type: Object,
                required: true,
                default: () => ({min: 1, max: 100}),
            },

            facet: {
                type: Object,
                required: true,
                default: () => ({}),
            },

            valueMin: {
                type: [Number, String],
                default: '',
            },

            valueMax: {
                type: [Number, String],
                default: '',
            },

            label: {
                type: String,
                default: '',
            },

            step: {
                type: Number,
                default: 100,
            },

            disabled: {
                type: Boolean,
                default: false,
            },

            range: {
                type: Boolean,
                default: true,
            },

            showValue: {
                type: Boolean,
                default: true,
            },

            clearBtn: {
                type: Boolean,
                default: false,
            },

            single: {
                type: Boolean,
                default: false
            },

            decimalCount: {
                type: Number,
                default: 2,
            },
        },
    };
</script>

<style lang="scss" module>
    .VRangeDropdown {
        & :global(.v-dropdown__menu) {
            top: calc(100% + .8rem);
            left: 0;
            min-width: 27rem;
            transform: translateY(0);

            &:global(.select-menu-enter-active) {
                transition: opacity .3s ease-in-out, transform .3s ease-in-out;
            }

            &:global(.select-menu-leave-active) {
                transition: opacity .15s ease-in-out, transform .15s ease-in-out;
            }

            &:global(.select-menu-enter),
            &:global(.select-menu-leave-active) {
                opacity: 0;
                transform: translateY(16px);
            }
        }

        & :global(.is-opened) {
            .arrow {
                width: 1.2rem;
                height: 1.2rem;
                transform: rotate(90deg);
            }

            .btn {
                border-color: $base-0;
                background-color: $base-0;
                color: $base-800;
                box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
            }
        }
    }

    .btn {
        display: flex;
        align-items: center;
        height: 4.4rem;
        padding: 0 1.6rem;
        border-radius: .4rem;
        border: 1px solid $base-50;
        background-color: $base-50;
        transition: all $default-color-transition;

        @include hover {
            border: 1px solid $blue;
            background-color: $base-0;
            color: $blue;
        }
    }

    .text {
        margin-right: 1.6rem;
        white-space: nowrap;
    }

    .arrow {
        width: 1.2rem;
        height: 1.2rem;
        transform: rotate(-90deg);
        transition: transform .2s;
    }

    .clearBtn {
        display: flex;
        color: $base-800;
        transition: $default-color-transition;

        @include hover {
            color: $blue;
        }
    }

    .cross {
        width: 1.2rem;
        height: 1.2rem;
    }

    .rangeWrapper {
        padding: 2rem;
        border-radius: .4rem;
        background-color: $base-0;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
    }

    .dropdownTitle {
        margin-bottom: 1.6rem;
        color: $base-400;
    }
</style>
