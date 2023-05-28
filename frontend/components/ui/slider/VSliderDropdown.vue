<template>
    <div :class="$style.VSliderDropdown">
        <VDropdown :arrow="false">
            <div :class="$style.btn">
                <slot>
                    <span :class="['p5', $style.text]">{{ title }}</span>
                </slot>
                <IconArrowLeft :class="$style.arrow" />
            </div>

            <template #dropdown>
                <div :class="$style.rangeWrapper">
                    <VSlider
                        :min="min"
                        :max="max"
                        :value="value"
                        :step="step"
                        :range="range"
                        show-value
                        :disabled="disabled"
                        :value-format="valueFormat"
                        @input="$emit('input', $event)"
                    />
                    <slot name="additional-content"></slot>
                </div>
            </template>
        </VDropdown>
    </div>
</template>

<script>
    import {splitThousands} from '~/assets/js/utils/numberUtils';
    import IconArrowLeft from '~/components/icons/IconArrowLeft';

    export default {
        name: 'VSliderDropdown',

        components: {
            IconArrowLeft,
        },

        props: {
            title: {
                type: String,
                default: '',
            },

            min: {
                type: Number,
                default: 0,
            },

            max: {
                type: Number,
                default: 100,
            },

            step: {
                type: Number,
                default: 1,
            },

            value: {
                type: [Number, String, Array],
                default: 0,
            },

            range: {
                type: Boolean,
                default: false,
            },

            height: {
                type: String,
                default: '',
            },

            disabled: {
                type: Boolean,
                default: false,
            },

            showValue: {
                type: Boolean,
                default: false,
            },

            valueFormat: {
                type: Function,
                default: splitThousands,
            },

            tooltip: {
                type: String,
                default: 'never',
            },
        },
    };
</script>

<style lang="scss" module>
    .VSliderDropdown {
        & :global(.v-dropdown__menu) {
            top: calc(100% + .8rem);
            left: 0;
            min-width: 25rem;
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
    }

    .arrow {
        width: 1.2rem;
        height: 1.2rem;
        transform: rotate(-90deg);
        transition: transform .2s;
    }

    .rangeWrapper {
        padding: 2rem;
        border-radius: .4rem;
        background-color: $base-0;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
    }
</style>
