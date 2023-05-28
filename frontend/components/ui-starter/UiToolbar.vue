<template>
    <div :class="$style.UiToolbar">
        <!-- Selectors -->
        <template v-if="options.select && options.select.length">
            <div
                v-for="(selectItem, index) in options.select"
                :key="`select_${index}`"
                :class="$style.optWrapper"
            >
                <div :class="$style.optTitle">
                    {{ selectItem.title }}:
                </div>

                <VSelect
                    :name="selectItem.title"
                    :value="selectItem.state"
                    :specs="selectItem.values"
                    :facets="selectItem.facets"
                    :disabled="selectItem.disabled"
                    reset-label="Сбросить"
                    placeholder="Выбрать"
                    size="small"
                    :required="selectItem.required"
                    @change="onChange(selectItem.title, Object.values($event)[0], 'select')"
                />
            </div>
        </template>

        <!-- Switchers -->
        <template v-if="options.switch && options.switch.length">
            <div
                v-for="(switcher, index) in options.switch"
                :key="`switch_${index}`"
                :class="$style.optWrapper"
            >
                <div :class="$style.optTitle">{{ switcher.title }}:</div>

                <VSwitch
                    :class="$style.switch"
                    :value="switcher.state"
                    :false-value="switcher.values[0]"
                    :true-value="switcher.values[1]"
                    size="small"
                    @input="onChange(switcher.title, $event, 'switch')"
                >
                    <template #falseLabel>
                        {{ switcher.values[0] }}
                    </template>

                    <template #trueLabel>
                        {{ switcher.values[1] }}
                    </template>
                </VSwitch>
            </div>
        </template>

        <!-- Inputs -->
        <template v-if="options.input && options.input.length">
            <div
                v-for="(input, index) in options.input"
                :key="`input_${index}`"
                :class="$style.optWrapper"
            >
                <div :class="$style.optTitle">{{ input.title }}:</div>

                <VInput
                    v-model="input.value"
                    :label="input.title"
                    :disabled="input.disabled"
                    :keep-label="false"
                    size="small"
                    @input="onChange(input.title, $event, 'input')"
                />
            </div>
        </template>

        <!-- Checkboxes -->
        <div
            v-if="options.boolean && options.boolean.length"
            :class="$style.optWrapper"
        >

            <VCheckbox
                v-for="(checkbox, index) in options.boolean"
                :key="`checkbox_${index}`"
                :class="$style.checkbox"
                :value="checkbox.state"
                size="small"
                :true-value="true"
                :disabled="!!checkbox.disabled"
                @input="onChange(checkbox.title, !checkbox.state, 'boolean')"
            >
                {{ checkbox.title }}
            </VCheckbox>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UiToolbar',

    props: {
        options: {
            type: Object,
            required: true,
        },

        utils: Boolean,
    },

    methods: {
        onChange(optType, value, selectorType) {
            if (this.utils) {
                this.$emit('on-change', optType, value, selectorType, 'utilsData');
            } else {
                this.$emit('on-change', optType, value, selectorType);
            }
        },
    },
};
</script>

<style lang="scss" module>
    .UiToolbar {
        display: flex;
        flex-flow: column nowrap;

        .optTitle {
            margin-bottom: .4rem;
            text-transform: capitalize;
            color: $violet;
            user-select: none;
        }

        .optWrapper {
            display: flex;
            flex-flow: column nowrap;
        }

        .switch,
        .checkbox {
            text-transform: capitalize;
        }

        .checkbox {
            margin-bottom: .2rem;
        }

        > * {
            margin-bottom: 1.4rem;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }
</style>
