<template>
    <div :class="[$style.UiDemo, classList]">
        <div :id="info.displayName" class="anchor"></div>

        <!-- Title, description -->
        <!-- TODO: добавить путь компонента с копированием в буфер -->
        <h1
            v-if="info.displayName"
            :class="$style.title"
        >
            {{ info.displayName }}
        </h1>

        <template v-if="loaded">
            <p
                v-if="info.description"
                :class="$style.description"
                v-html="info.description"
            >
            </p>

            <template v-if="isShowDevInfo">
                <!-- Change info tables -->
                <VTabBar
                    v-if="infoTabsFilter && Object.keys(infoTabsFilter).length"
                    :class="$style.infoTabsWrapper"
                    grey
                    close
                >
                    <VTab
                        v-for="(infoTab, tabInd) in infoTabsFilter"
                        :key="`${infoTab.title}_${tabInd}`"
                        :class="$style.tab"
                        :active="!!infoTab.active"
                        :disabled="infoTab.disabled"
                        @click="onInfoTabChange(infoTab.value)"
                    >
                        {{ infoTab.value }}
                    </VTab>
                </VTabBar>

                <!-- Docgen info table -->
                <div
                    v-if="info && Object.keys(info).length"
                    :class="$style.infoTableWrapper"
                >
                    <transition
                        name="list"
                        mode="out-in"
                    >
                        <InfoTable
                            :key="activeInfoTab"
                            :class="$style.infoTable"
                            :table="table"
                        />
                    </transition>
                </div>
            </template>

            <!-- Demo tools/preview -->
            <div :class="$style.tools">
                <div
                    :class="[
                        $style.left,
                        {[$style._border]: compData && Object.keys(compData).length}
                    ]"
                >
                    <template v-if="compData.tabs && compData.tabs.length">
                        <div
                            v-for="(tab, index) in compData.tabs"
                            :key="`arrayOpt_${index}`"
                            :class="$style.tabsWrapper"
                        >
                            <VTabBar
                                :class="$style.tabs"
                                grey
                            >
                                <VTab
                                    v-for="(item, ind) in tab.values"
                                    :key="`${tab.title}_${ind}`"
                                    :class="$style.tab"
                                    :active="!!item.active"
                                    @click="onOptionTabChange(tab.title, item.value)"
                                >
                                    {{ item.value }}
                                </VTab>
                            </VTabBar>
                        </div>
                    </template>

                    <div
                        :class="[
                            $style.demo,
                            {[$style._border]: compData.tabs && compData.tabs.length}
                        ]"
                    >
                        <!-- Demo slot -->
                        <slot></slot>

                        <!-- Theme switch -->
                        <svg-icon
                            :class="$style.svgIcon"
                            name="moon"
                            @click="dark = !dark"
                        />
                    </div>
                </div>

                <!-- Toolbar -->
                <div
                    v-if="compData && Object.keys(compData).length"
                    :class="$style.right"
                >
                    <div :class="$style.rightTitle">
                        <span>Options</span>
                    </div>

                    <UiToolbar
                        :class="$style.toolbar"
                        :options="compData"
                        @on-change="onChange"
                    />

                    <template v-if="utilsData && Object.keys(utilsData).length">
                        <div :class="$style.rightTitle">
                            <span>Views</span>
                        </div>

                        <UiToolbar
                            :class="$style.toolbar"
                            :options="utilsData"
                            utils
                            @on-change="onChange"
                        />
                    </template>
                </div>
            </div>

            <!-- Code highlight -->
            <template v-if="isShowDevInfo">
                <div
                    v-if="code"
                    :class="$style.codeWrap"
                >
                    <!-- Render code -->
                    <div
                        v-html="rendered"
                    >
                    </div>

                    <!-- Clipboard icon -->
                    <svg-icon
                        :class="[$style.codeClipboard, {[$style._active]: inClipboard}]"
                        :name="inClipboard ? 'checkbox' : 'copy'"
                        @click="handleCopyClick"
                    />
                </div>
            </template>
        </template>
    </div>
</template>

<script>
// Utils
import markdownItPrism from 'markdown-it-prism';

// Components
import InfoTable from '~/components/ui-starter/InfoTable';
import UiToolbar from '~/components/ui-starter/UiToolbar';

/**
 * Интерфейс взаимодействия с компонентом, аля Vuetify.<br>
 * Отображает изменения состояния компонента и данные, собранные с коментариев компонента, по стандарту JSDoc.<br><br>
 * Хорошего тестирования!
 *
 * @version 1.0.2
 * @displayName UiDemo
 */
export default {
    name: 'UiDemo',

    components: { UiToolbar, InfoTable },

    props: {
        /**
         * Для парсинга массива объектов, чтобы отображать их по заданному типу в виде компонентов.
         *
         * Пример:
         * [{
         *     title: 'hideSelected', - Название ключа объекта для изменения и отображения.
         *     type: 'boolean', - Тип селектора (tabs, boolean, switch, checkbox, selector, input).
         *     reset: ['multiple', 'required'], - Эти значения, по ключу, будут сбросаны при изменении.
         *     readonly: ['multiple', 'required'], - Отключает поля, при выборе этого значения.
         *     disabled: false, - Отключение взаимодействия.
         *     default: this.compData.hideSelected, - Дефолтное значение состояния.
         * }],
         */
        options: {
            type: Array,
            default: () => [],
        },

        utils: {
            type: Array,
            default: () => [],
        },

        /**
         * Данная стринга будет отображаться в виде подсвеченного кода, в зависимости от
         * @see [Markdown Style](https://google.github.io/styleguide/docguide/style.html)
         * @see Отвечает за это зависимость [@nuxtjs/markdownit](https://www.npmjs.com/package/@nuxtjs/markdownit).
         * @see Для стилей отображения кода отвечает зависимость [markdown-it-highlightjs](markdown-it-highlightjs).
         */
        code: {
            type: String,
            default: '',
        },

        /**
         * Данный объект парсится на отдельные таблицы.
         * Сам объект представляет из себя значения, которые получены из передаваемого компонента
         * в лоадер vue-simple-docgen-loader который в свою очередь использует vue-docgen-api,
         * для парсинга комментариев в формате JSDoc.
         *
         * Подробнее:
         * @see (vue-simple-docgen-loader)[https://github.com/vue-styleguidist/vue-styleguidist/tree/dev/packages/vue-simple-docgen-loader]
         * @see (vue-docgen-api)https://github.com/vue-styleguidist/vue-styleguidist/tree/dev/packages/vue-docgen-api
         *
         */
        info: {
            type: Object,
            default: () => ({}),
        },

        /**
         * Модификатор стиля превьюшки компонента для тени
         */
        shadow: Boolean,
    },

    data() {
        return {
            compData: {},
            utilsData: {},
            infoProps: {},
            infoEvents: {},
            infoMethods: {},
            infoSlots: {},
            loaded: false,
            dark: false,
            inClipboard: false,
            activeInfoTab: 'props',
        };
    },

    async fetch() {
        await this.handleInit();
    },

    computed: {
        classList() {
            return [{
                [this.$style._shadow]: this.shadow,
                [this.$style._dark]: this.dark,
            }];
        },

        rendered() {
            if (this.$config.UI_DEMO !== true) {
                return '';
            }

            const md = this.$md;
            md.use(markdownItPrism, {});
            return md.render(this.code);
        },

        table() {
            let rows = {};
            let headers = [];

            switch (this.activeInfoTab) {
                case 'methods':
                    rows = this.infoMethods;
                    break;
                case 'props': {
                    rows = this.infoProps;
                    break;
                }
                case 'events': {
                    rows = this.infoEvents;
                    break;
                }
                case 'slots': {
                    rows = this.infoSlots;
                    break;
                }

                default:
                    return {
                        headers,
                        rows,
                    };
            }

            // Clear empty columns
            if (Object.keys(rows).length) {
                Object.keys(rows[0])
                    .filter(k => rows.every(obj => obj[k] === '–'))
                    .forEach(k => rows.forEach(obj => delete obj[k]));
            }

            if (rows.length) {
                headers = Object.keys(rows[0]);
            }

            return {
                headers,
                rows,
            };
        },

        infoTabsFilter() {
            return [
                {
                    value: 'props',
                    active: this.activeInfoTab === 'props',
                    disabled: !this.infoProps?.length,
                },
                {
                    value: 'methods',
                    active: this.activeInfoTab === 'methods',
                    disabled: !this.infoMethods?.length,
                },
                {
                    value: 'events',
                    active: this.activeInfoTab === 'events',
                    disabled: !this.infoEvents?.length,
                },
                {
                    value: 'slots',
                    active: this.activeInfoTab === 'slots',
                    disabled: !this.infoSlots?.length,
                },
            ];
        },

        isShowDevInfo() {
            return this.$config.UI_DEMO === true;
        },
    },

    methods: {
        /**
         * Инициализация, подготавливает данные для работы и отображения данных компонента
         * @public
         * @returns {Array} - Возвращает массив объектов в data
         */
        async handleInit() {
            try {
                [
                    this.compData,
                    this.utilsData,
                    this.infoProps,
                    this.infoEvents,
                    this.infoMethods,
                    this.infoSlots,
                ] = await Promise.all([
                    this.handleGetOptions(this.options),
                    this.handleGetOptions(this.utils),
                    this.handleInfoProps(),
                    this.handleInfoEvents(),
                    this.handleInfoMethods(),
                    this.handleInfoSlots(),
                ]);
                this.loaded = true;
            } catch (e) {
                console.log('UiDemo:fetch error:', e);
            }
        },

        /**
         * Отвечает за переключение состояния табов и отображение нужной таблицы по типу
         * @public
         * @param {String} val - тип таба
         */
        onInfoTabChange(val) {
            this.activeInfoTab = val;
        },

        /**
         * Меняет состояние опций в табе и эмитит данные
         * для изменения состояния компонента в slot
         * @public
         * @param {String} type Для поиска таба по ключу title
         * @param {String} option Новое значение
         */
        onOptionTabChange(type, option) {
            this.inClipboard = false;
            const foundIndex = this.compData.tabs.map(e => e.title)
                .indexOf(type);

            if (foundIndex !== -1) {
                this.compData.tabs[foundIndex].values.forEach(i => i.active = i.value === option);
            }

            // Автоматически переключает тему, если ловит схему для неё
            if (type === 'color') {
                this.dark = option === 'dark';
            }

            /**
             * Передаёт данные на уровень выше, чтобы изменить
             * состояние компонента, переданный в slot
             *
             * @event mouseenter
             * @property {object} key: value
             */
            this.$emit('change', { [type]: option });
        },

        /**
         * Меняет состояние всех типов опций (кроме табов) и эмитит
         * данные для изменения состояния компонента в slot
         * @public
         * @param {String} type Для поиска таба по ключу title
         * @param {String} option Новое значение
         * @param {String} component тип селектора
         */
        onChange(type, option, component, key = 'compData') {
            this.inClipboard = false;

            // Фикс для инпута с пустыми значениями
            if (component === 'input' && !option) {
                option = type;
            }

            const foundIndex = this[key][component].map(e => e.title)
                .indexOf(type);

            if (foundIndex !== -1) {
                const dataOptions = this[key][component][foundIndex];
                dataOptions.state = option;

                // Отключаем недопустимые значения
                if (dataOptions?.readonly) {
                    this.handleFindInObjects(dataOptions.readonly, this[key], 'disabled', option === true);
                }

                // Включаем значения на условие
                if (dataOptions?.enabled) {
                    this.handleFindInObjects(dataOptions.enabled, this[key], 'disabled', option === false);
                }

                // reset значений
                if (dataOptions?.reset) {
                    this.handleFindInObjects(dataOptions.reset, this[key], 'state', '');
                }
            }

            if (key === 'compData') {
                /**
                 * Передаёт данные на уровень выше, чтобы изменить
                 * состояние компонента, переданный в slot
                 *
                 * @event change
                 * @property {Object} key: value
                 */
                this.$emit('change', { [type]: option });
            } else {
                /**
                 * Костыль для работы с утилитами. В целом работает так-же как change,
                 * но вызывается другой метод, который изменяет другой объект, где хранится их состояние,
                 * а не состояние компонента.
                 *
                 * @event change-utils
                 * @property {Object} key: value
                 */
                this.$emit('change-utils', { [type]: option });
            }
        },


        /**
         * Помогает найти значение, перебирая объекты,
         * в которых хранятся массивы с другими объектами.
         *
         * @param {String|Array} changeValues содержит title, по которому производится поиск
         * @param {Object} inObject перебираемый объект
         * @param {String} keyObject ключь объекта, который требуется поменять
         * @param {Boolean} toState новое состояние
         * @public
         */
        handleFindInObjects(changeValues, inObject, keyObject, toState) {
            if (!changeValues) {
                return;
            }

            if (Array.isArray(changeValues)) {
                changeValues.forEach(i => {
                    for (const objValue of Object.values(inObject)) {
                        const foundKey = objValue.find(f => f.title === i);
                        if (foundKey) {
                            foundKey[keyObject] = toState;
                            break;
                        }
                    }
                });
            } else {
                for (const objValue of Object.values(inObject)) {
                    const foundKey = objValue.find(f => f.title === changeValues);
                    if (foundKey) {
                        foundKey[keyObject] = toState;
                        break;
                    }
                }
            }
        },

        /**
         * Собирает передаваемые данные из prop options и переводит
         * в нужный формат (в зависимости от типа), для отображения
         * в виде компонентов и их управления.
         * @public
         */
        async handleGetOptions(options) {
            if (!options?.length) {
                return {};
            }

            const compData = {};
            options.forEach(i => {
                if (!compData[i.type]?.length) {
                    compData[i.type] = [];
                }

                switch (i.type) {
                    case 'tabs': {
                        const values = i.values.map(opt => (
                            {
                                value: opt,
                                active: i.default === opt,
                            }
                        ));
                        if (values?.length) {
                            compData[i.type].push({ title: i.title, values });
                        }

                        break;
                    }
                    case 'input': {
                        compData[i.type].push({
                            title: i.title || '',
                            value: i.value || '',
                            disabled: i?.disabled || false,
                        });
                        break;
                    }
                    case 'switch':
                    case 'boolean': {
                        compData[i.type].push({
                            title: i.title || '',
                            values: i.values || '',
                            state: i.default || '',
                            disabled: i?.disabled || false,
                            reset: i?.reset || null,
                            enabled: i?.enabled || null,
                            readonly: i?.readonly || null,
                        });
                        break;
                    }
                    case 'select': {
                        compData[i.type].push({
                            title: i.title,
                            values: i.values.map(opt => (
                                {
                                    label: opt,
                                    value: opt,
                                }
                            )),
                            facets: i.values,
                            state: i.default,
                            disabled: i?.disabled || false, // Делает селектор не активным, если передано true
                            reset: i?.reset || null, // Сбрасывает значения по переданным ключам
                            enabled: i?.enabled || null, // При активации выключается disabled по передану списку ключей
                            readonly: i?.readonly || null, // При активации этого селектора, если в readonly переданы ключи других селекторов - отключает их
                            required: i?.required === false ? i.required : true, // Позволяет сбросить выбор, если передано в объекте required: false.
                        });
                        break;
                    }
                    default:
                        return '';
                }
            });
            return compData;
        },

        /**
         * Собирает данные для отображения таблицы Props.
         * @public
         */
        async handleInfoProps() {
            if (!this.info?.props?.length) {
                return {};
            }

            return this.info.props.map(i => ({
                property: i.name ? `${i.name}${i.required === true ? ' <span>(required)</span>' : ''}` : '–',
                description: i.description || '–',
                type: i.type?.name?.replace(/\|/g, '<br>') || '–',
                default: i.defaultValue?.value?.replace(/[^\w\s]/gi, '') || '–',
                validator: i.values?.join(', ') || '–',
            }));
        },

        /**
         * Собирает данные для отображения таблицы Events.
         * @public
         */
        async handleInfoEvents() {
            if (!this.info?.events?.length) {
                return {};
            }

            return this.info.events.map(i => {
                let properties = i.properties?.map((p, index) => {
                    let template = p.name;

                    // Тут немного туго с мультитайпами
                    if (p.type?.names[0] === 'union' && i.tags[index]?.type?.elements?.length) {
                        const tagsArr = i.tags[index].type.elements.map(type => type.name);
                        if (tagsArr.length) {
                            template += `:<span>${tagsArr.join('|')}</span>`;
                        }
                    } else if (p.type?.names?.length) {
                        template += `:<span>${p.type?.names.join('|')}</span>`;
                    }

                    if (p.description) {
                        template += ` – ${p.description}`;
                    }

                    return template;
                });

                if (properties?.length) {
                    properties = properties.join(',');
                }

                return {
                    event: i.name || '–',
                    description: i.description || '–',
                    properties: properties || '–',
                };
            });
        },

        /**
         * Собирает данные для отображения таблицы Methods.
         * @public
         */
        async handleInfoMethods() {
            if (!this.info?.methods?.length) {
                return {};
            }

            return this.info.methods.map(i => {
                let parameters = '';
                if (i?.tags?.params?.length) {
                    i?.tags?.params.forEach((param, index) => {
                        parameters += `${param.name}`;

                        if (param?.type?.elements?.length) {
                            parameters += `:<span>${param?.type.elements.map(el => el.name)
                                .join('|')}</span>`;
                        } else if (param?.type?.name) {
                            parameters += `:<span>${param.type.name}</span>`;
                        }

                        if (param?.description) {
                            parameters += ` – ${param?.description}`;
                        }

                        if (index + 1 !== i.tags.params.length) {
                            parameters += '</br>';
                        }
                    });
                }

                let returns = '';
                if (i.returns && Object.keys(i.returns).length) {
                    returns = `<span>${i.returns.type.name}</span>${i.returns.description ? ` – ${i.returns.description}` : ''}`;
                }

                return {
                    method: i.name || '–',
                    description: i.description || '–',
                    params: parameters || '–',
                    returns: returns || '–',
                };
            });
        },

        /**
         * Собирает данные для отображения таблицы Slots.
         * @public
         */
        async handleInfoSlots() {
            if (!this.info?.slots?.length) {
                return {};
            }

            return this.info.slots.map(i => ({
                slot: i.name || '–',
                description: i.description || '–',
            }));
        },

        /**
         * Создаёт скрытый объект, для копирования содержимого в clipboard
         * @public
         * @param {String} str Строка, которая будет скопирована в буфер обмена
         */
        handleClipboard(str) {
            const el = document.createElement('textarea');
            el.value = str;
            el.setAttribute('readonly', '');
            el.style.cssText = 'position: absolute; bottom: 0; z-index: -1; opacity: 0;';
            document.body.appendChild(el);

            const selected =
                document.getSelection().rangeCount > 0 // Check if there is any content selected previously
                    ? document.getSelection()
                        .getRangeAt(0)
                    : false;
            el.select();
            document.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
            document.body.removeChild(el); // Remove the <textarea> element

            if (selected) {
                document.getSelection()
                    .removeAllRanges();
                document.getSelection()
                    .addRange(selected);
            }

            setTimeout(() => {
                this.inClipboard = false;
            }, 2400);
        },

        /**
         * Обрабатывает mardown-it код, для дальнейшего копирования в буфер обмена
         * @public
         */
        handleCopyClick() {
            setTimeout(() => {
                this.inClipboard = true;
            }, 300);

            const code = this.code.replace(new RegExp('`{3}.*\\n', 'gm'), '');
            this.handleClipboard(code.replace(new RegExp('(`{3,})(.*?)', 'gm'), ''));
        },
    },
};
</script>

<style lang="scss" module>
    $border: 1px solid rgb(0 0 0 / 20%);

    .UiDemo {
        position: relative;
        display: flex;
        flex-flow: column nowrap;

        &._shadow:not(._dark) {
            .demo {
                > * {
                    box-shadow: 0 4px 12px rgb(0 0 0 / 5%);
                }
            }
        }

        &._dark {
            .demo {
                background: $body-color;
            }

            .svgIcon {
                color: $gold;
            }
        }

        .infoTabsWrapper,
        .infoTableWrapper {
            @include respond-to(mobile) {
                display: none;
            }
        }
    }

    .title {
        font-family: Kinetika, sans-serif;
        font-size: 3rem;
        font-weight: 600;

        @include respond-to(mobile) {
            font-size: 2.4rem;
        }
    }

    .description {
        @include respond-to(mobile) {
            font-size: 1.4rem;
        }
    }

    .description,
    .title {
        margin-bottom: 2.4rem;
    }

    .infoTableWrapper {
        height: 19.7rem;
        margin-bottom: 3.2rem;
    }

    .infoTabsWrapper,
    .tabsWrapper {
        display: flex;
        align-items: center;
        height: 4.2rem;

        .tabsTitle {
            font-size: 1.2rem;
        }

        .tabs {
            height: 100%;
        }

        .tab {
            display: flex;
            align-items: center;
            height: 100%;
            padding: 0 2rem;
            text-transform: capitalize;
            font-size: 1.4rem;
        }
    }

    .infoTabsWrapper {
        margin-bottom: 1.2rem;
    }

    .tabsWrapper {
        overflow: auto;
        width: 100%;
        padding: 0 1.2rem;
    }

    .tools {
        display: flex;
        flex-flow: row nowrap;
        border: $border;

        @include respond-to(mobile) {
            flex-flow: column wrap;
        }
    }

    .left,
    .right {
        display: flex;
        flex-flow: column nowrap;
    }

    .left {
        flex: 1;

        .demo {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            min-height: 24rem;
            background: #fff;
            transition: background $default-transition;

            &._border {
                border-top: $border;
            }

            .svgIcon {
                position: absolute;
                top: 1.2rem;
                right: 1.2rem;
            }
        }

        &._border {
            border-right: $border;

            @include respond-to(mobile) {
                border-right: none;
            }
        }

        @include respond-to(mobile) {
            overflow: hidden;
            max-width: 100%;
        }
    }

    .right {
        width: 20rem;

        .rightTitle {
            position: relative;
            display: flex;
            align-items: center;
            height: calc(4.2rem + 1px);
            padding: 1.2rem;
            border-bottom: $border;
            user-select: none;

            span {
                flex: 1;

                @include respond-to(mobile) {
                    display: none;
                }
            }
        }

        .toolbar {
            padding: 1.2rem 1.2rem 2.4rem;
        }

        @include respond-to(mobile) {
            width: 100%;
        }
    }

    .svgIcon {
        width: 1.6rem;
        height: 1.6rem;
        color: $grey;
        transition: all $default-transition;
        user-select: none;
        box-shadow: none;
        cursor: pointer;

        &:hover {
            opacity: .6;
        }
    }

    .codeWrap {
        position: relative;
        border-right: $border;
        border-bottom: $border;
        border-left: $border;

        .codeClipboard {
            position: absolute;
            top: 1.2rem;
            right: 1.2rem;
            width: 1.6rem;
            height: 1.6rem;
            color: $grey;
            transition: all $default-transition;
            cursor: pointer;
            user-select: none;

            &._active {
                color: $violet;
                cursor: default;
                pointer-events: none;
            }

            &:hover {
                color: $violet;
                opacity: .7;
            }
        }

        code {
            font-size: 1.6rem;

            @include respond-to(mobile) {
                font-size: 1.4rem;
            }
        }
    }
</style>
