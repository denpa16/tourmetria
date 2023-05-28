<template>
    <div :class="$style.VRangeDemo">
        <UiDemo
            :info="componentInfo"
            :options="options"
            :code="code"
            @change="onChangeOptions"
        >
            <transition
                name="fade-fast"
                mode="out-in"
            >
                <VRange
                    :key="`range_${compData.single}`"
                    v-bind="vrangeBind"
                    :class="$style.range"
                    :values="compData.values"
                    @change="val => onChangeOptions({ values: val })"
                />
            </transition>
        </UiDemo>
    </div>
</template>

<script>
// Loader
const docobject = require('vue-simple-docgen-loader!/components/ui/range/VRange');

// Mixins
import { uiDemo } from '~/mixins/uiDemo';

// Components
import UiDemo from '~/components/ui-starter/UiDemo';

export default {
    name: 'VRangeDemo',

    components: { UiDemo },

    mixins: [uiDemo],

    data() {
        return {
            compData: {
                color: 'base',
                size: 'medium',
                specs: { min: 197007, max: 9000000 },
                facets: { min: 1000000, max: 6000000 },
                labels: ['от', 'до'],
                valueMin: '',
                valueMax: '',
                postfix: '<span class=\'rub\'>И</span>',
                showLabel: true,
                single: false,
                disabled: false,
                positiveOnly: true,
            },

            componentInfo: docobject || {},
        };
    },

    computed: {
        vrangeBind() {
            const data = { ...this.compData };

            if (this.compData.single) {
                delete data.facets;
                delete data.valueMax;
            }

            data.name = this.compData.single ? 'valueMin' : ['valueMin', 'valueMax'];

            return data;
        },

        code() {
            let nameString = '';
            let name = '';

            if (this.compData.single) {
                name += `:name="${this.vrangeBind.name}"`;
            } else {
                this.vrangeBind.name.forEach(i => {
                    nameString += `        '${i}',\n`;
                    name = `:name="[\n${nameString.replace(/"/g, '\'')}    ]"`;
                });
            }

            let template = '```html\n' +
                '<VRange\n' +
                `    ${name}\n` +
                `    color="${this.compData.color}"\n` +
                `    size="${this.compData.size}"\n`;

            template += `    :labels="${JSON.stringify(this.compData.labels)
                .replace(/"/g, '\'')}"\n`;

            template += `    value-min="${this.compData.valueMin}"\n`;
            if (!this.compData.single) {
                template += `    value-max="${this.compData.valueMax}"\n`;
            }

            template += '' +
                `    :specs="${JSON.stringify(this.compData.specs)
                    .replace(/"/g, '\'')}"\n`;

            if (this.vrangeBind.facets) {
                template += `    :facets="${JSON.stringify(this.compData.facets)
                    .replace(/"/g, '\'')}"\n`;
            }

            template += `    postfix="${this.compData.postfix}"\n`;

            if (this.compData.single) {
                template += '    single\n';
            }

            if (this.compData.showLabel) {
                template += '    show-label\n';
            }

            if (this.compData.positiveOnly) {
                template += '    positive-only\n';
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
                    title: 'single',
                    type: 'boolean',
                    reset: ['valueMin', 'valueMax', 'showLabel', 'positiveOnly'],
                    readonly: ['showLabel', 'positiveOnly'],
                    default: this.compData.single,
                },
                {
                    title: 'showLabel',
                    type: 'boolean',
                    default: this.compData.showLabel,
                },
                {
                    title: 'positiveOnly',
                    type: 'boolean',
                    default: this.compData.positiveOnly,
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
    .VRangeDemo {
        position: relative;
        display: flex;
        flex-flow: column nowrap;
    }

    .range {
        width: 30rem;

        @include respond-to(mobile) {
            width: 100%;
            margin: 0 20px;
        }
    }
</style>
