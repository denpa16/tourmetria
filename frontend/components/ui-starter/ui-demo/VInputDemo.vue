<template>
    <div :class="$style.VInputDemo">
        <UiDemo
            :code="code"
            :info="componentInfo"
            :options="options"
            @change="onChangeOptions"
        >
            <transition
                mode="out-in"
                name="fade-fast"
            >
                <VInput
                    :key="`input_${compData.mask}`"
                    v-model="value"
                    :autocomplete="false"
                    :class="$style.input"
                    :error="Boolean(error)"
                    :msg="error === false ? '' : error"
                    v-bind="compData"
                    @input="error = onInput(value)"
                />
            </transition>
        </UiDemo>
    </div>
</template>

<script>
// Utils
import { strValidate, dateValidate } from '~/assets/js/utils/validate-utils';

// Loader
const docobject = require('vue-simple-docgen-loader!/components/ui/input/VInput');

// Mixins
import { uiDemo } from '~/mixins/uiDemo';

// Components
import UiDemo from '~/components/ui-starter/UiDemo';

export default {
    name: 'VInputDemo',

    components: { UiDemo },

    mixins: [uiDemo],

    data() {
        return {
            value: '',
            required: true,
            error: '',

            compData: {
                type: 'text',
                label: 'Ваше имя',
                color: 'base',
                size: 'medium',
                mask: '',
                border: true,
                keepLabel: true,
                autocomplete: false,
                keepMasked: true,
                premask: true,
            },

            utilsData: {
                validateType: '',
                validate: false,
                required: false,
            },

            componentInfo: docobject || {},
        };
    },

    computed: {
        code() {
            let template = '```html\n' +
                '<VInput\n' +
                '    v-model="inputVal"\n' +
                `    name="${this.compData.type}"\n` +
                `    size="${this.compData.size}"\n` +
                `    color="${this.compData.color}"\n` +
                `    label="${this.compData.label}"\n`;

            if (this.compData.mask) {
                template += `    mask="${this.compData.mask}"\n`;
            }

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

            if (this.utilsData.validate) {
                let validateMethod = '';

                if (this.utilsData.validateType === 'date') {
                    validateMethod = `dateValidate(inputVal, true, true, ${this.utilsData.required})`;
                } else {
                    validateMethod = `strValidate(inputVal, '${this.utilsData.validateType}', ${this.utilsData.required})`;
                }

                template += '    :msg="error"\n' +
                    '    :error="Boolean(error)"\n' +
                    `    @input="error = ${validateMethod}"\n`;
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
                    title: 'mask',
                    type: 'select',
                    values: props.find(i => i.name === 'mask').values,
                    default: this.compData.mask,
                    required: false,
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
                    title: 'premask',
                    type: 'boolean',
                    default: this.compData.premask,
                },
                {
                    title: 'keepMasked',
                    type: 'boolean',
                    default: this.compData.keepMasked,
                },
                {
                    title: 'disabled',
                    type: 'boolean',
                    default: this.compData.disabled,
                },
            ];
        },
    },

    watch: {
        'compData.mask'(val) {
            this.value = '';

            const validates = [
                'date',
                'phone',
                'snils',
                'inn',
                'payment',
                'passport',
            ];

            if (validates.includes(val)) {
                this.utilsData.validateType = val;
                this.utilsData.validate = true;
            } else {
                this.utilsData.validateType = '';
                this.utilsData.validate = false;
            }
        },
    },

    methods: {
        onInput(value) {
            if (!this.utilsData.validate) {
                return;
            }

            if (this.utilsData.validateType === 'date') {
                return dateValidate(value, true, true, this.utilsData.required);
            } else {
                return strValidate(value, this.utilsData.validateType, this.utilsData.required);
            }
        },
    },
};
</script>

<style lang="scss" module>
    .VInputDemo {
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
