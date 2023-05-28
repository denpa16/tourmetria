<template>
    <div :class="$style.VCheckboxDemo">
        <UiDemo
            :info="componentInfo"
            :options="options"
            :utils="utilsOptions"
            :code="code"
            @change="onChangeOptions"
            @change-utils="onChangeUtils"
        >
            <VSwitch
                v-bind="compData"
                @input="compData.value = !compData.value"
            >
                <template
                    v-if="!utilsData.single"
                    #falseLabel
                >
                    Выкл
                </template>

                <template #trueLabel>
                    Вкл
                </template>
            </VSwitch>
        </UiDemo>
    </div>
</template>

<script>
// Loader
const docobject = require('vue-simple-docgen-loader!/components/ui/switch/VSwitch');

// Mixins
import { uiDemo } from '~/mixins/uiDemo';

// Components
import UiDemo from '~/components/ui-starter/UiDemo';

export default {
    name: 'VSwitchDemo',

    components: { UiDemo },

    mixins: [uiDemo],

    data() {
        return {
            compData: {
                color: 'base',
                size: 'medium',
                value: false,
                trueValue: true,
                falseValue: false,
                disabled: false,

            },

            utilsData: {
                single: false,
            },

            componentInfo: docobject || {},
        };
    },

    computed: {
        code() {
            let template = '```html\n' +
                '<VSwitch\n' +
                `    color="${this.compData.color}"\n` +
                `    size="${this.compData.size}"\n` +
                '    :value="dataValue"\n' +
                `    :true-value="${this.compData.trueValue}"\n` +
                `    :false-value="${this.compData.falseValue}"\n`;

            if (this.compData.disabled) {
                template += '    disabled\n';
            }

            template += '>\n';

            if (!this.utilsData.single) {
                template += '' +
                    '    <template #falseLabel>\n' +
                    '        Выкл\n' +
                    '    </template>\n';
            }

            template += '' +
                '    <template #trueLabel>\n' +
                '        Вкл\n' +
                '    </template>\n' +
                '</VSwitch>\n' +
                '```';
            return template;
        },

        options() {
            const props = this.componentInfo.props;

            return [
                {
                    title: 'color',
                    type: 'tabs',
                    values: props.find(i => i.name === 'color').values,
                    default: this.compData.color,
                },
                {
                    title: 'size',
                    type: 'switch',
                    values: props.find(i => i.name === 'size').values,
                    default: this.compData.size,
                },
                {
                    title: 'disabled',
                    type: 'boolean',
                    default: this.compData.disabled,
                },
            ];
        },

        utilsOptions() {
            return [
                {
                    title: 'single',
                    type: 'boolean',
                    default: this.utilsData.single,
                },
            ];
        },
    },
};
</script>

<style lang="scss" module>
    .VSwitch {
        position: relative;
        display: flex;
        flex-flow: column nowrap;
    }
</style>
