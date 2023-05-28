<template>
    <div :class="$style.VCheckboxDemo">
        <UiDemo
            :code="code"
            :info="componentInfo"
            :options="options"
            @change="onChangeOptions"
        >
            <VCheckbox
                v-bind="compData"
                @input="compData.value = !compData.value"
            >
                Make Awesome
            </VCheckbox>
        </UiDemo>
    </div>
</template>

<script>
// Loader
const docobject = require('vue-simple-docgen-loader!/components/ui/checkbox/VCheckbox');

// Mixins
import { uiDemo } from '~/mixins/uiDemo';

// Components
import UiDemo from '~/components/ui-starter/UiDemo';

export default {
    name: 'VCheckboxDemo',

    components: { UiDemo },

    mixins: [uiDemo],

    data() {
        return {
            compData: {
                color: 'base',
                size: 'medium',
                value: false,
                disabled: false,
                radio: false,
                coloredLabel: false,
            },

            componentInfo: docobject || {},
        };
    },

    computed: {
        code() {
            let template = '```html\n' +
                '<VCheckbox\n' +
                `    color="${this.compData.color}"\n` +
                `    size="${this.compData.size}"\n`;

            if (this.compData.radio) {
                template += '    radio\n';
            }

            if (this.compData.coloredLabel) {
                template += '    colored-label\n';
            }

            if (this.compData.disabled) {
                template += '    disabled\n';
            }

            template += '>\n' +
                '    Make Awesome\n' +
                '</VCheckbox>\n' +
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
                    title: 'radio',
                    type: 'boolean',
                    default: this.compData.radio,
                },
                {
                    title: 'coloredLabel',
                    type: 'boolean',
                    default: this.compData.coloredLabel,
                },
                {
                    title: 'disabled',
                    type: 'boolean',
                    default: this.compData.disabled,
                },
            ];
        },
    },
};
</script>

<style lang="scss" module>
    .VCheckboxDemo {
        position: relative;
        display: flex;
        flex-flow: column nowrap;
    }
</style>
