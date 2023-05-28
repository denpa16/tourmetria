<template>
    <div :class="$style.VInputSelectDemo">
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
                <VInputSelect
                    v-model="value"
                    :class="$style.input"
                    v-bind="compData"
                    @input="debouncedOnInput"
                />
            </transition>
        </UiDemo>
    </div>
</template>

<script>
// Loader
const docobject = require('vue-simple-docgen-loader!/components/ui/input-select/VInputSelect');

// Mixins
import { uiDemo } from '~/mixins/uiDemo';

// utils
import { debounce } from '~/assets/js/utils/common-utils';

// Components
import UiDemo from '~/components/ui-starter/UiDemo';

// ymaps
import ymapsLoader from 'ymaps';

// ! личный ключ чисто для демки, никуда больше не вставлять, на проектах не использовать!
const ymapsApiKey = 'd69b70f5-c5c6-4239-ac03-19ff9ebd45a7';

export default {
    name: 'VInputSelectDemo',

    components: { UiDemo },

    mixins: [uiDemo],

    data() {
        return {
            compData: {
                label: 'Введите адрес',
                color: 'base',
                size: 'medium',
                border: true,
                keepLabel: true,
                autocomplete: false,
                specs: [],
            },

            value: '',

            componentInfo: docobject || {},

            ymaps: null,
            debouncedOnInput: debounce(this.onInput, 500),
        };
    },

    computed: {
        code() {
            let template = '```html\n' +
                '<VInputSelect\n' +
                '    v-mode="inputVal"\n' +
                `    size="${this.compData.size}"\n` +
                `    color="${this.compData.color}"\n` +
                `    label="${this.compData.label}"\n`;

            if (this.compData.border) {
                template += '    border\n';
            }

            if (this.compData.keepLabel) {
                template += '    keep-label\n';
            }

            if (this.compData.autocomplete) {
                template += '    autocomplete\n';
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
                    title: 'border',
                    type: 'boolean',
                    default: this.compData.border,
                },
                {
                    title: 'label',
                    type: 'input',
                    value: this.compData.label,
                },
                {
                    title: 'keepLabel',
                    type: 'boolean',
                    default: this.compData.keepLabel,
                },
                {
                    title: 'disabled',
                    type: 'boolean',
                    default: this.compData.disabled,
                },
            ];
        },
    },

    async mounted() {
        await this.loadYmaps();
    },

    methods: {
        async onInput(val) {
            if (!this.ymaps) {
                return;
            }

            if (!val) {
                this.compData.specs = [];
                return;
            }

            try {
                const specs = await this.ymaps.suggest(val);
                this.compData.specs = specs.map(el => ({
                    label: el.displayName,
                    value: el.value,
                }));
            } catch (err) {
                console.warn('[MapRouter/onInput] request failed: ', err);
            }
        },

        async loadYmaps() {
            try {
                this.ymaps = await ymapsLoader.load(`https://api-maps.yandex.ru/2.1/?apikey=${ymapsApiKey}&lang=ru_RU`);
            } catch (e) {
                console.warn('[VInputSelectDemo] Failed to load ymaps');
            }
        },
    },
};
</script>

<style lang="scss" module>
    .VInputSelectDemo {
        //

        .input {
            width: 30rem;

            @include respond-to(mobile) {
                width: 100%;
                margin: 0 20px;
            }
        }
    }
</style>
