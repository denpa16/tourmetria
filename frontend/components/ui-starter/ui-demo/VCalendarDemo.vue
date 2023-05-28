<template>
    <div :class="$style.VCalendarDemo">
        <UiDemo
            :info="componentInfo"
            :options="options"
            :utils="utilsOptions"
            :code="code"
            shadow
            @change="onChangeOptions"
            @change-utils="onChangeUtils"
        >
            <VCalendar
                :disabled="compData.disabled"
                :allowed="compData.allowed"
                :locale="compData.locale"
                :start-week-day="Number(compData.startWeekDay) || 0"
                :multiple="compData.multiple"
                :allow-empty="compData.allowEmpty"
            >
                <template
                    v-if="utilsData.month"
                    #month
                >
                    Название месяца
                </template>
            </VCalendar>
        </UiDemo>
    </div>
</template>

<script>
// Loader
const docobject = require('vue-simple-docgen-loader!@spooosh/vcalendar/src/components/VCalendar.vue');

// Mixins
import { uiDemo } from '~/mixins/uiDemo';

// Components
import UiDemo from '~/components/ui-starter/UiDemo';
import VCalendar from '@spooosh/vcalendar';

export default {
    name: 'VCalendarDemo',

    components: { UiDemo, VCalendar },

    mixins: [uiDemo],

    data() {
        return {
            compData: {
                disabled: [],
                allowed: [],
                locale: 'en',
                startWeekDay: '0',
                multiple: false,
                allowEmpty: false,
            },

            utilsData: {
                month: false,
            },

            componentInfo: docobject || {},
        };
    },

    computed: {
        code() {
            let template = '```html\n' +
                '<VCalendar\n' +
                `    startWeekDay="${this.compData.startWeekDay}"\n` +
                `    locale="${this.compData.locale}"\n`;


            if (this.compData.multiple) {
                template += '    multiple\n';
            }

            if (this.compData.allowEmpty) {
                template += '    allowEmpty\n';
            }

            template += '>\n';

            if (this.utilsData.month) {
                template += '' +
                    '    <template #month>\n' +
                    '        Название месяца\n' +
                    '    </template>\n';
            }

            template += '' +
                '</VCalendar>\n' +
                '```';
            return template;
        },

        options() {
            return [
                {
                    title: 'locale',
                    type: 'select',
                    values: ['en', 'ru'],
                    default: this.compData.locale,
                    required: true,
                },
                {
                    title: 'startWeekDay',
                    type: 'select',
                    values: ['0', '1'],
                    default: this.compData.startWeekDay,
                    required: true,
                },
                {
                    title: 'multiple',
                    type: 'boolean',
                    default: this.compData.multiple,
                },
                {
                    title: 'allowEmpty',
                    type: 'boolean',
                    default: this.compData.allowEmpty,
                },
            ];
        },

        utilsOptions() {
            return [
                {
                    title: 'month',
                    type: 'boolean',
                    default: this.utilsData.month,
                },
            ];
        },
    },
};
</script>

<style lang="scss" module>
    .VCalendarDemo {
        position: relative;
    }
</style>
