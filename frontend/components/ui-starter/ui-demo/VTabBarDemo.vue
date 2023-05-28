<template>
    <div :class="$style.VButtonDemo">
        <UiDemo
            :info="componentInfo"
            :options="options"
            :code="code"
            @change="onChangeOptions"
        >
            <VTabBar
                v-if="tabs && Object.keys(tabs).length"
                :class="$style.infoTabsWrapper"
                :tag="compData.tag"
                :slider="compData.slider"
                :tabs="tabs"
                :color="compData.color"
                :size="compData.size"
                :close="compData.close"
            />
        </UiDemo>
    </div>
</template>

<script>
// Loader
const docobject = require('vue-simple-docgen-loader!/components/ui/tabs/VTabBar.vue');

// Mixins
import { uiDemo } from '~/mixins/uiDemo';

// Components
import UiDemo from '~/components/ui-starter/UiDemo';

export default {
    name: 'VTabBarDemo',

    components: { UiDemo },

    mixins: [uiDemo],

    data() {
        return {
            compData: {
                slider: false,
                color: 'grey',
                size: 'medium',
                close: true,
            },

            componentInfo: docobject || {},
        };
    },

    computed: {
        tabs() {
            return [
                {
                    label: 'Small',
                    value: 'props',
                    active: false,
                    // disabled: !this.infoProps?.length,
                },
                {
                    label: 'Longer',
                    value: '1',
                    active: false,
                    disabled: true,
                },
                {
                    label: 'Longer than all combined',
                    value: '232',
                    active: true,
                    // disabled: !this.infoEvents?.length,
                },
            ];
        },


        code() {
            let template = '```html\n' +
                '<VTabBar\n' +
                `    tag="${this.compData.tag}"\n` +
                `    color="${this.compData.color}"\n` +
                `    size="${this.compData.size}"\n` +
                `    close="${this.compData.close}"\n` +
                '    :tabs="tabs"\n';

            if (this.compData.slider) {
                template += '    slider\n';
            }

            template += '/>\n' +
                '```';
            return template;
        },

        options() {
            const props = this.componentInfo.props;

            return [
                {
                    title: 'size',
                    type: 'switch',
                    values: props.find(i => i.name === 'size').values,
                    default: this.compData.size,
                },
                {
                    title: 'close',
                    type: 'boolean',
                    default: this.compData.close,
                },
                {
                    title: 'slider',
                    type: 'boolean',
                    default: this.compData.slider,
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
