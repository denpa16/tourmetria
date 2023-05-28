<template>
    <div :class="$style.VButtonDemo">
        <UiDemo
            :info="componentInfo"
            :options="options"
            :code="code"
            shadow
            @change="onChangeOptions"
        >
            <VButton
                v-bind="compData"
                @click="compData.active = !compData.active"
            >
                Color: {{ compData.color }}
            </VButton>
        </UiDemo>
    </div>
</template>

<script>
// Loader
const docobject = require('vue-simple-docgen-loader!/components/ui/button/VButton.vue');

// Mixins
import { uiDemo } from '~/mixins/uiDemo';

// Components
import UiDemo from '~/components/ui-starter/UiDemo';

export default {
    name: 'VButtonDemo',

    components: { UiDemo },

    mixins: [uiDemo],

    data() {
        return {
            compData: {
                tag: 'button',
                color: 'base',
                size: 'medium',
                active: false,
                disabled: false,
                round: false,
                border: true,
            },

            componentInfo: docobject || {},
        };
    },

    computed: {
        code() {
            let template = '```html\n' +
                '<VButton\n' +
                `    tag="${this.compData.tag}"\n` +
                `    color="${this.compData.color}"\n` +
                `    size="${this.compData.size}"\n`;

            if (this.compData.border) {
                template += '    border\n';
            }

            if (this.compData.round) {
                template += '    round\n';
            }

            if (this.compData.disabled) {
                template += '    disabled\n';
            }

            if (this.compData.active) {
                template += '    active\n';
            }

            template += '>\n' +
                `    color: ${this.compData.color}\n` +
                '</VButton>\n' +
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
                    title: 'border',
                    type: 'boolean',
                    default: this.compData.border,
                },
                {
                    title: 'round',
                    type: 'boolean',
                    default: this.compData.round,
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
    .VButtonDemo {
        position: relative;
        display: flex;
        flex-flow: column nowrap;
    }
</style>
