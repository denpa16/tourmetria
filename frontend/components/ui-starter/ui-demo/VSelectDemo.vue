<template>
    <div :class="$style.VSelectDemo">
        <UiDemo
            :info="componentInfo"
            :options="options"
            :code="code"
            @change="onChangeOptions"
        >
            <VSelect
                v-bind="compData"
                :value="compData.value"
                @change="val => onChangeOptions({ value: val })"
            />
        </UiDemo>
    </div>
</template>

<script>
// Loader
const docobject = require('vue-simple-docgen-loader!/components/ui/select/VSelect.vue');

// Mixins
import { uiDemo } from '~/mixins/uiDemo';

// Components
import UiDemo from '~/components/ui-starter/UiDemo';

export default {
    name: 'VSelectDemo',

    components: { UiDemo },

    mixins: [uiDemo],

    data() {
        return {
            compData: {
                value: '',

                specs: [
                    { label: 'Санкт-Петербург', value: 'spb' },
                    { label: 'Москва', value: 'moscow' },
                    { label: 'Екатеринбург', value: 'ekt' },
                ],

                facets: ['spb', 'moscow', 'ekt'],

                color: 'base',
                size: 'medium',
                multiple: false,
                hideSelected: false,
                border: true,
                disabled: false,
                placeholder: 'Все',
                resetLabel: 'Сбросить',
                required: false,
            },

            componentInfo: docobject || {},
        };
    },

    computed: {
        code() {
            const reg = new RegExp(/(([^{\n](?=[^{]*}))+)/, 'gm');
            let specs = JSON.stringify(this.compData.specs);
            specs = [...specs.matchAll(reg)].map(i => i[0]);

            let specsString = '';
            specs.forEach(i => {
                specsString += `        {${i}},\n`;
            });

            let template = '```html\n' +
                '<VSelect\n' +
                '    name="zone"\n' +
                `    color="${this.compData.color}"\n` +
                `    size="${this.compData.size}"\n`;

            if (Array.isArray(this.compData.value)) {
                template += `    :value="[${this.compData.value}]"\n`;
            } else {
                template += `    value="${this.compData.value}"\n`;
            }

            template += '' +
                `    placeholder="${this.compData.placeholder}"\n` +
                `    reset-label="${this.compData.resetLabel}"\n` +
                `    :specs="[\n${specsString.replace(/"/g, '\'')}    ]"\n` +
                `    :facets="[${this.compData.facets}]"\n`;

            if (this.compData.multiple) {
                template += '    multiple\n';
            }

            if (this.compData.hideSelected) {
                template += '    hide-selected\n';
            }

            if (this.compData.border) {
                template += '    border\n';
            }

            if (this.compData.required) {
                template += '    required\n';
            }

            if (this.compData.disabled) {
                template += '    disabled\n';
            }

            template += '/>\n' +
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
                    type: 'select',
                    values: props.find(i => i.name === 'size').values,
                    default: this.compData.size,
                },
                {
                    title: 'multiple',
                    type: 'boolean',
                    reset: ['value', 'hideSelected', 'required'],
                    readonly: ['hideSelected', 'required'],
                    default: this.compData.multiple,
                },
                {
                    title: 'hideSelected',
                    type: 'boolean',
                    reset: ['multiple', 'required'],
                    readonly: ['multiple', 'required'],
                    disabled: false,
                    default: this.compData.hideSelected,
                },
                {
                    title: 'border',
                    type: 'boolean',
                    default: this.compData.border,
                },
                {
                    title: 'disabled',
                    type: 'boolean',
                    default: this.compData.disabled,
                },
                {
                    title: 'required',
                    type: 'boolean',
                    default: this.compData.required,
                },
                {
                    title: 'placeholder',
                    value: this.compData.placeholder,
                    type: 'input',
                },
                {
                    title: 'resetLabel',
                    value: this.compData.resetLabel,
                    type: 'input',
                },
            ];
        },
    },
};
</script>

<style lang="scss" module>
    .VSelectDemo {
        position: relative;
        display: flex;
        flex-flow: column nowrap;
    }
</style>
