<template>
    <div :class="$style.VRubDemo">
        <UiDemo
            :info="componentInfo"
            :options="options"
            :code="code"
            @change="onChangeOptions"
        >
            <rub v-bind="compData" />
        </UiDemo>
    </div>
</template>

<script>
// Loader
const docobject = require('vue-simple-docgen-loader!/components/ui/rub/Rub.vue');

// Mixins
import { uiDemo } from '~/mixins/uiDemo';

// Components
import UiDemo from '~/components/ui-starter/UiDemo';

export default {
    name: 'VRubDemo',

    components: { UiDemo },

    mixins: [uiDemo],

    data() {
        return {
            compData: {
                symbol: 'base',
            },

            componentInfo: docobject || {},
        };
    },

    computed: {
        code() {
            let template = '```html\n' +
                `<rub symbol="${this.compData.symbol}"`;

            template += '/>\n' +
                '```';
            return template;
        },

        options() {
            return [
                {
                    title: 'symbol',
                    type: 'select',
                    values: ['base', 'additional', 'И', 'д', 'А'],
                    default: this.compData.symbol,
                },
            ];
        },
    },
};
</script>

<style lang="scss" module>
    .VRubDemo {
        //
    }
</style>
