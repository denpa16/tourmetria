<template>
    <component
        :is="isComponent"
        :class="$style.VTabBar"
    >
        <!-- @slot Контент внутри VTabBar -->
        <slot>
            <div
                v-show="slider"
                ref="bgSlider"
                :class="['bg-slider', $style.slider]"
            >
            </div>
            <VTab
                v-for="(tab, tabInd) in tabs"
                :key="`${tab.value}_${tabInd}`"
                ref="tabs"
                :active="currentTab.value === tab.value"
                :disabled="tab.disabled"
                @click="onTabChange(tab.value, tabInd)"
            >
                {{ tab.label }}
            </VTab>
        </slot>
    </component>
</template>

<script>
export default {
    name: 'VTabBar',

    props: {
        /**
         * HTML тег - обертка для табов
         */
        tag: {
            type: String,
            default: 'ul',
            validator: v => [
                'ul',
                'div',
            ].includes(v),
        },

        /**
         * Массив всех табов, каждый из которых может содержать параметры описанные в VTab,
         * а также обязательные параметры label и value
         */
        tabs: {
            type: Array,
            default: () => [],
        },

        /**
         * Модификатор для отображения активного перемещающегося фона при переключении табов.
         * ВНИМАНИЕ: Будет считать некорректно, при наличии margin между табами
        */
        slider: Boolean,

        /**
         * Определяет классы, которые будут модифицировать размер
         */
        size: {
            type: String,
            default: 'medium',
            validator: value => ['small', 'medium'].includes(value),
        },

        /**
         * Определяет классы, которые будут модифицировать цвет
         */
        color: {
            type: String,
            default: 'grey',
            validator: value => ['grey'].includes(value),
        },

        /**
         * Определяет стилизацию табов
         */
        close: Boolean,
    },

    data() {
        return {
            currentTab: {
                ind: null,
                value: '',
            },
        };
    },

    computed: {
        isComponent() {
            return this.tag;
        },
    },

    watch: {
        close() {
            this.$nextTick(() => {
                this.calcBg();
            });
        },

        size() {
            this.$nextTick(() => {
                this.calcBg();
            });
        },

        slider(val) {
            if (val) {
                this.$nextTick(() => {
                    this.calcBg();
                });
            }
        },
    },

    mounted() {
        this.checkActiveTab();

        if (this.slider) {
            this.calcBg();

            window.addEventListener('resize', this.calcBg);
            window.addEventListener('orientationchange', this.calcBg);
        }
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.calcBg);
        window.removeEventListener('orientationchange', this.calcBg);
    },

    methods: {
        checkActiveTab() {
            let i = 0;

            for (const tab of this.tabs) {
                if (tab.active) {
                    this.currentTab = {
                        ind: i,
                        value: tab.value,
                    };
                    return;
                }

                i++;
            }
        },

        calcBg() {
            this.bgSliderWidth(this.currentTab.ind);
            this.bgSliderOffset(this.currentTab.ind);
        },

        /**
         * Устанавливает активный таб, перерассчитывает положение и размеры заднего фона (при необходимости),
         * а также эмитит событие клика по табу в родительский компонент
         * @param {Event} event mouse event
         * @public
         */
        onTabChange(val, index) {
            this.currentTab = {
                ind: index,
                value: val,
            };

            /**
             * Cобытие клика в родительский компонент
             * @event change
             * @param {Event} event mouse event
             */
            this.$emit('change', this.currentTab.value);

            this.calcBg();
        },

        bgSliderWidth(ind) {
            const tabWidth = this.$refs?.tabs[ind || 0]?.$el.getBoundingClientRect()?.width;

            if (this.$refs.bgSlider.style) {
                this.$refs.bgSlider.style.width = `${tabWidth}px`;
            }
        },

        bgSliderOffset(ind) {
            let tabsWidth = 0;

            for (let index = 0; index < (ind || 0); index++) {
                tabsWidth += this.$refs.tabs[index].$el.getBoundingClientRect().width;
            }

            this.$refs.bgSlider.style.left = `${tabsWidth}px`;
        },
    },
};
</script>

<style lang="scss" module>
    $primary: $grey-light;

    .VTabBar {
        position: relative;
        display: flex;
        user-select: none;
    }

    .slider {
        position: absolute;
        top: 0;
        left: 0;
        min-width: 1rem;
        height: 100%;
        margin: 0;
        border-radius: .6rem;
        background-color: $primary;
        transition: .3s;
    }
</style>
