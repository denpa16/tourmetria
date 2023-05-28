<template>
    <div :class="$style.VFileDemo">
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
                <VFile
                    v-model="value"
                    v-bind="compData"
                    :class="$style.input"
                />
            </transition>
        </UiDemo>
    </div>
</template>

<script>
// Mixins
import { uiDemo } from '~/mixins/uiDemo';

// Components
import UiDemo from '~/components/ui-starter/UiDemo';

// Loader
const docobject = require('vue-simple-docgen-loader!/components/ui/input/VFile');

export default {
    name: 'VFileDemo',

    components: { UiDemo },

    mixins: [uiDemo],

    data() {
        return {
            value: '',
            required: true,

            compData: {
                placeholder: 'Выберите файл',
                color: 'base',
                size: 'medium',
                border: true,
                disabled: false,
            },

            utilsData: {
                required: false,
            },

            componentInfo: docobject || {},
        };
    },

    computed: {
        code() {
            let template = '```html\n' +
                '<VFile\n' +
                '    v-model="inputVal"\n' +
                `    size="${this.compData.size}"\n` +
                `    color="${this.compData.color}"\n` +
                `    placeholder="${this.compData.placeholder}"\n`;

            if (this.compData.maxFilesCount) {
                template += `    max-files-count="${this.compData.maxFilesCount}"\n`;
            }

            if (this.compData.border) {
                template += '    border\n';
            }


            if (this.compData.disabled) {
                template += '    disabled\n';
            }

            template += '/>\n```';
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
                    title: 'placeholder',
                    type: 'input',
                    value: this.compData.placeholder,
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
            ];
        },
    },
};
</script>

<style lang="scss" module>
    .VFileDemo {
        position: relative;
        display: flex;
        flex-flow: column nowrap;

        .input {
            width: 30rem;

            @include respond-to(mobile) {
                width: 100%;
                margin: 0 20px;
            }
        }
    }
</style>
