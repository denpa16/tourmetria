<template>
    <div :class="$style.VIconDemo">
        <UiDemo
            :info="componentInfo"
            :options="options"
            :code="code"
            @change="onChangeOptions"
        >
            <VIcon
                v-bind="compData"
                :class="$style.icon"
            />
        </UiDemo>
    </div>
</template>

<script>
// Loader
const docobject = require('vue-simple-docgen-loader!/components/ui/icon/VIcon');

// Mixins
import { uiDemo } from '~/mixins/uiDemo';

// Components
import UiDemo from '~/components/ui-starter/UiDemo';

export default {
    name: 'VIconDemo',

    components: { UiDemo },

    mixins: [uiDemo],

    data() {
        return {
            compData: {
                name: 'checkbox',
                size: 'medium',
            },

            componentInfo: docobject || {},
        };
    },

    computed: {
        code() {
            let template = '```html\n' +
                '<VIcon\n' +
                `    name="${this.compData.name}"\n` +
                `    size="${this.compData.size}"\n`;

            template += '/>\n' +
                '```';
            return template;
        },

        options() {
            const props = this.componentInfo.props;

            return [
                {
                    title: 'size',
                    type: 'select',
                    values: props.find(i => i.name === 'size').values,
                    default: this.compData.size,
                },
            ];
        },
    },
};
</script>

<style lang="scss" module>
    .VIconDemo {
        //
    }

    .icon {
        color: $blue;
    }
</style>
