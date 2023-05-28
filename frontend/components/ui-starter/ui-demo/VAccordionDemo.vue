<template>
    <div :class="$style.VAccordionDemo">
        <UiDemo
            :info="componentInfo"
            :options="options"
            :code="code"
            @change="onChangeOptions"
        >
            <div :class="$style.wrap">
                <VAccordion v-bind="compData">
                    <VAccordionItem
                        v-for="item in items"
                        :key="item.id"
                    >
                        <template #header-content>{{ item.header }}</template>

                        {{ item.content }}
                    </VAccordionItem>
                </VAccordion>
            </div>
        </UiDemo>
    </div>
</template>

<script>
// Loader
const docobject = require('vue-simple-docgen-loader!/components/ui/accordion/VAccordion');

// Mixins
import { uiDemo } from '~/mixins/uiDemo';

// Components
import UiDemo from '~/components/ui-starter/UiDemo';

export default {
    name: 'VAccordionDemo',

    components: { UiDemo },

    mixins: [uiDemo],

    data() {
        return {
            compData: {
                color: 'base',
                multiple: false,
                shadow: false,
            },

            componentInfo: docobject || {},

            items: [
                {
                    id: 0,
                    header: 'Header 1',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium aliquid dolor ducimus, iste obcaecati saepe similique sit! Consectetur culpa dolor excepturi nulla, porro voluptatem voluptates! Deleniti provident sit voluptas! Fugit.',
                },

                {
                    id: 1,
                    header: 'Header 2',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium aliquid dolor ducimus, iste obcaecati saepe similique sit! Consectetur culpa dolor excepturi nulla, porro voluptatem voluptates! Deleniti provident sit voluptas! Fugit.',
                },

                {
                    id: 2,
                    header: 'Header 3',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium aliquid dolor ducimus, iste obcaecati saepe similique sit! Consectetur culpa dolor excepturi nulla, porro voluptatem voluptates! Deleniti provident sit voluptas! Fugit.',
                },

                {
                    id: 3,
                    header: 'Header 4',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium aliquid dolor ducimus, iste obcaecati saepe similique sit! Consectetur culpa dolor excepturi nulla, porro voluptatem voluptates! Deleniti provident sit voluptas! Fugit.',
                },

                {
                    id: 4,
                    header: 'Header 5',
                    content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium aliquid dolor ducimus, iste obcaecati saepe similique sit! Consectetur culpa dolor excepturi nulla, porro voluptatem voluptates! Deleniti provident sit voluptas! Fugit.',
                },
            ],
        };
    },

    computed: {
        code() {
            let template = '```html\n' +
                '<VAccordion\n' +
                `    color="${this.compData.color}"\n`;

            if (this.compData.multiple) {
                template += '    multiple\n';
            }

            if (this.compData.shadow) {
                template += '    shadow\n';
            }

            template += '>\n' +
                '   <VAccordionItem\n' +
                '       v-for="item in items"\n' +
                '       :key="item.id"\n' +
                '   >\n' +
                '       <template #header-content>{{ item.header }}</template>\n' +
                '\n' +
                '       {{ item.content }}\n' +
                '   </VAccordionItem>\n' +
                '</VAccordion>\n' +
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
                    title: 'multiple',
                    type: 'boolean',
                    default: this.compData.multiple,
                },
                {
                    title: 'shadow',
                    type: 'boolean',
                    default: this.compData.shadow,
                },
            ];
        },
    },
};
</script>


<style lang="scss" module>
    .VAccordionDemo {
        position: relative;
        display: flex;
        flex-flow: column nowrap;
    }

    .wrap {
        padding: 3.2rem;
    }

    .icon {
        transform: rotateZ(90deg);
        transition: transform $default-transition;

        &._open {
            transform: rotateZ(-90deg);
        }
    }
</style>
