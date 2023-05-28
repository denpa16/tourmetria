<template>
    <div :class="$style.VPopoverDemo">
        <UiDemo
            :info="componentInfo"
            :options="options"
            :code="code"
            @change="onChangeOptions"
        >
            <VButton
                @click="isVisiblePopover = true"
            >
                Open VPopover
            </VButton>

            <VPopover
                v-if="isVisiblePopover"
                v-bind="compData"
                @close="isVisiblePopover = false"
            >
                <p>Some content here</p>
            </VPopover>
        </UiDemo>
    </div>
</template>

<script>
// Loader
const docobject = require('vue-simple-docgen-loader!/components/ui/popover/VPopover.vue');

// Mixins
import { uiDemo } from '~/mixins/uiDemo';

// Components
import UiDemo from '~/components/ui-starter/UiDemo';

export default {
    name: 'VPopoverDemo',

    components: { UiDemo },

    mixins: [uiDemo],

    data() {
        return {
            compData: {
                direction: 'left',
                width: '100%',
                height: '100%',
                background: '#fff',
                sharp: false,
                round: false,
                shadow: false,
            },

            componentInfo: docobject || {},

            isVisiblePopover: false,
        };
    },

    computed: {
        code() {
            let template = '```html\n' +
                '<VPopover\n';

            if (this.compData.direction) {
                template += `    direction="${this.compData.direction}"\n`;
            }

            if (this.compData.width) {
                template += `    width="${this.compData.width}"\n`;
            }

            if (this.compData.height) {
                template += `    height="${this.compData.height}"\n`;
            }

            if (this.compData.background) {
                template += `    background="${this.compData.background}"\n`;
            }

            if (this.compData.sharp) {
                template += '    sharp\n';
            }

            if (this.compData.round) {
                template += '    round\n';
            }

            if (this.compData.shadow) {
                template += '    shadow\n';
            }

            template += '>\n' +
                '    <p>Some content here</p>\n' +
                '</VPopover>\n' +
                '```';
            return template;
        },

        options() {
            const props = this.componentInfo.props;

            return [
                {
                    title: 'direction',
                    type: 'input',
                    values: props.find(i => i.name === 'direction').values,
                    default: this.compData.direction,
                },
                {
                    title: 'width',
                    type: 'input',
                    values: props.find(i => i.name === 'width').values,
                    default: this.compData.width,
                },
                {
                    title: 'height',
                    type: 'input',
                    values: props.find(i => i.name === 'height').values,
                    default: this.compData.height,
                },
                {
                    title: 'background',
                    type: 'input',
                    values: props.find(i => i.name === 'background').values,
                    default: this.compData.background,
                },
                {
                    title: 'sharp',
                    type: 'boolean',
                    values: props.find(i => i.name === 'sharp').values,
                    default: this.compData.sharp,
                },
                {
                    title: 'round',
                    type: 'boolean',
                    values: props.find(i => i.name === 'round').values,
                    default: this.compData.round,
                },
                {
                    title: 'shadow',
                    type: 'boolean',
                    values: props.find(i => i.name === 'shadow').values,
                    default: this.compData.shadow,
                },
            ];
        },
    },
};
</script>

<style lang="scss" module>
    .VPopoverDemo {
        position: relative;
        display: flex;
        flex-flow: column nowrap;
    }
</style>
