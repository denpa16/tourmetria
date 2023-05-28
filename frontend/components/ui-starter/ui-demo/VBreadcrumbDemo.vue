<template>
    <div :class="$style.VBreadcrumbDemo">
        <UiDemo
            :info="componentInfo"
            :options="options"
            :code="code"
            @change="onChangeOptions"
        >
            <VBreadcrumb
                v-bind="compData"
            />
        </UiDemo>
    </div>
</template>

<script>
// Loader
const docobject = require('vue-simple-docgen-loader!/components/ui/breadcrumb/VBreadcrumb.vue');

// Mixins
import { uiDemo } from '~/mixins/uiDemo';

// Components
import UiDemo from '~/components/ui-starter/UiDemo';

export default {
    name: 'VBreadcrumbDemo',

    components: { UiDemo },

    mixins: [uiDemo],

    data() {
        return {
            compData: {
                value: '',

                breadcrumbs: [
                    { title: 'Главная', link: '/' },
                    { title: 'Релизы', link: '/release/' },
                    { title: 'Компоненты', link: '/components/ui-kit/', disabled: true },
                ],

                color: 'base',
                size: 'medium',
                separator: 'point',
            },

            componentInfo: docobject || {},
        };
    },

    computed: {
        code() {
            const reg = new RegExp(/(([^{\n](?=[^{]*}))+)/, 'gm');
            let breadcrumbs = JSON.stringify(this.compData.breadcrumbs);
            breadcrumbs = [...breadcrumbs.matchAll(reg)].map(i => i[0]);

            let breadcrumbsString = '';
            breadcrumbs.forEach(i => {
                breadcrumbsString += `        {${i}},\n`;
            });

            let template = '```html\n' +
                '<VBreadcrumb\n' +
                `    separator="${this.compData.separator}"\n` +
                `    color="${this.compData.color}"\n` +
                `    size="${this.compData.size}"\n` +
                `    :specs="[\n${breadcrumbsString.replace(/"/g, '\'')}    ]"\n`;

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
                    title: 'separator',
                    type: 'select',
                    values: props.find(i => i.name === 'separator').values,
                    default: this.compData.separator,
                },
            ];
        },
    },
};
</script>

<style lang="scss" module>
    .VBreadcrumbDemo {
        position: relative;
        display: flex;
        flex-flow: column nowrap;
    }
</style>
