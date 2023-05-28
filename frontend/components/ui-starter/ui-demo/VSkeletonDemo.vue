<template>
    <div :class="$style.VButtonDemo">
        <UiDemo
            :info="componentInfo"
            :options="options"
            :code="code"
            shadow
            @change="onChangeOptions"
        >
            <VSkeleton
                v-bind="compData"
            >
                <p>Loaded data</p>
            </VSkeleton>
        </UiDemo>
    </div>
</template>

<script>
// Loader
const docobject = require('vue-simple-docgen-loader!/components/ui/skeleton/VSkeleton.vue');

// Mixins
import { uiDemo } from '~/mixins/uiDemo';

// Components
import UiDemo from '~/components/ui-starter/UiDemo';

export default {
    name: 'VSkeletonDemo',

    components: { UiDemo },

    mixins: [uiDemo],

    data() {
        return {
            compData: {
                width: '400px',
                height: '48px',
                background: '#aeaeae',
                highlight: '#d6dde9',
                isLoading: true,
                sharp: false,
                round: false,
            },

            componentInfo: docobject || {},
        };
    },

    computed: {
        code() {
            let template = '```html\n' +
                '<VSkeleton\n';

            if (this.compData.width) {
                template += `    width="${this.compData.width}"\n`;
            }

            if (this.compData.height) {
                template += `    height="${this.compData.height}"\n`;
            }

            if (this.compData.background) {
                template += `    background="${this.compData.background}"\n`;
            }

            if (this.compData.highlight) {
                template += `    highlight="${this.compData.highlight}"\n`;
            }

            if (this.compData.isLoading) {
                template += '    is-loading\n';
            }

            if (this.compData.sharp) {
                template += '    sharp\n';
            }

            if (this.compData.round) {
                template += '    round\n';
            }

            template += '>\n' +
                '    <p>Loaded data</p>\n' +
                '</VSkeleton>\n' +
                '```';
            return template;
        },

        options() {
            return [
                {
                    title: 'width',
                    type: 'input',
                    value: this.compData.width,
                },
                {
                    title: 'height',
                    type: 'input',
                    value: this.compData.height,
                },
                {
                    title: 'background',
                    type: 'input',
                    value: this.compData.background,
                },
                {
                    title: 'highlight',
                    type: 'input',
                    value: this.compData.highlight,
                },
                {
                    title: 'isLoading',
                    type: 'boolean',
                    default: this.compData.isLoading,
                },
                {
                    title: 'sharp',
                    type: 'boolean',
                    default: this.compData.sharp,
                },
                {
                    title: 'round',
                    type: 'boolean',
                    default: this.compData.round,
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
