<template>
    <div
        :class="[$style.SlideMenu, {[$style._modal]: isModal}]"
    >
        <transition name="fade-fast">
            <div
                v-if="isInit && currentItems && Object.keys(currentItems).length"
                :class="$style.wrapper"
            >
                <!-- prev -->
                <MenuPanel
                    :list="prevItems"
                    :class="[$style.menuPanel, currentPositionStyle[0]]"
                    :translating="isTranslating"
                    :arrow="parentItems.length >= 2"
                    :timeout="timeout"
                />

                <!-- current -->
                <MenuPanel
                    :list="currentItems"
                    :class="[$style.menuPanel, currentPositionStyle[1]]"
                    :translating="isTranslating"
                    :arrow="parentItems.length >= 1"
                    :timeout="timeout"
                    @header-clicked="handlePrev"
                    @item-clicked="handleNext"
                />

                <!-- next -->
                <MenuPanel
                    :list="nextItems"
                    :class="[$style.menuPanel, currentPositionStyle[2]]"
                    :translating="isTranslating"
                    :timeout="timeout"
                />
            </div>
        </transition>
    </div>
</template>

<script>
// Vuex
import { mapGetters } from 'vuex';

// Components
import MenuPanel from './MenuPanel';

export default {
    name: 'SlideMenu',

    components: {
        MenuPanel,
    },

    props: {
        visible: Boolean,
        isModal: Boolean,
    },

    data() {
        return {
            prevItems: {},
            currentItems: {},
            nextItems: {},
            parentItems: [],
            isTranslating: false,
            currentPositionStyle: {
                0: this.$style.prev,
                1: this.$style.current,
                2: this.$style.next,
            },

            isInit: false,
            timeout: 300,
        };
    },

    computed: {
        ...mapGetters({
            navList: 'ui-nav/getUiMenu',
        }),
    },

    created() {
        this.currentItems = { ...this.navList };
        const route = this.$route.path.split('/');
        let found = {};
        let foundCat = null;

        if (route.length > 2) {
            foundCat = this.navList.find(i => i.to.replace(/[^\w\s-]+/g, '') === route[1]);
            found = foundCat?.list?.find(i => i.to === this.$route.path);
            found = found?.list ? found : foundCat;
        } else {
            found = this.navList.find(i => i.to.replace(/[^\w\s-]+/g, '') === route[1]);
        }

        if (found?.list) {
            this.handleNext(found, true);

            setTimeout(() => {
                this.isInit = true;
            }, 100);
        } else {
            this.isInit = true;
        }
    },

    methods: {
        handleNext(targetItem, force = false) {
            if (this.isTranslating || !targetItem?.list) {
                if (this.isModal) {
                    setTimeout(() => {
                        this.$modal.close();
                    }, this.timeout + 100);
                }
                return; // Проверяет на дочерние элементы
            }

            this.isTranslating = true; // Выставляет transation для перетасковки менюх
            this.nextItems = targetItem?.list; // См. navigations.js
            this.nextItems.catTitle = targetItem?.title; // Подставляем название для кнопки назад
            this.nextItems.baseUrl = targetItem?.to;

            if (!force) {
                this.$nextTick(() => { // Анимация, одно меню сменяется другим
                    this.currentPositionStyle[1] = this.$style.prev; // Центр уходит назад
                    this.currentPositionStyle[2] = this.$style.current; // Последнее меню выезжает
                    this.handleScrollTop(); // Чтобы на позицию нового меню не влиял скрол
                });
            }

            setTimeout(() => { // Отрубаем анимацию, возвращаем новые данные
                this.isTranslating = false;
                const parent = this.currentItems;
                this.parentItems.push(parent);
                this.currentPositionStyle = {
                    0: this.$style.prev,
                    1: this.$style.current,
                    2: this.$style.next,
                };
                this.prevItems = this.currentItems;
                this.currentItems = this.nextItems;
                this.nextItems = {};
            }, !force ? this.timeout : 0);
        },

        handlePrev() {
            if (this.isTranslating || this.parentItems?.length < 1) {
                return;
            }

            this.isTranslating = true;
            this.prevItems = this.parentItems[this.parentItems?.length - 1];

            this.$nextTick(() => {
                this.currentPositionStyle[1] = this.$style.next;
                this.currentPositionStyle[0] = this.$style.current;
                this.handleScrollTop();
            });

            setTimeout(() => {
                this.isTranslating = false;
                this.parentItems.pop();
                this.currentPositionStyle = {
                    0: this.$style.prev,
                    1: this.$style.current,
                    2: this.$style.next,
                };
                this.currentItems = this.prevItems;
                this.nextItems = {};
            }, this.timeout);
        },

        handleScrollTop() {
            const menu = document.getElementsByClassName(this.$style.menuPanel);

            for (const i of menu) {
                i.scrollTo({ top: 0, left: 0 });
            }
        },
    },
};
</script>

<style lang="scss" module>
    $primary-color: $violet;
    $stroke: $grey;
    $normal-width: 78vw;
    $small-width: 24.8rem;
    $border: 1px solid rgb(0 0 0 / 20%);

    .SlideMenu {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        height: calc(100% - #{$header-h});
        padding-top: $header-h;
        border-right: $border;
        background: $white;
        flex-direction: column;
        pointer-events: none;

        &._modal {
            position: relative;

            .prev {
                transform: translateX(-100%) translate3d(0, 0, 0);
            }

            .next {
                transform: translateX(100%) translate3d(0, 0, 0);
            }

            .wrapper {
                width: 100%;
            }
        }

        @include respond-to(tablet) {
            height: calc(100% - #{$header-h-tablet});
            padding-top: $header-h-tablet;
        }

        @include respond-to(mobile) {
            height: calc(100% - #{$header-h-mobile});
            padding-top: $header-h-mobile;
        }
    }

    .wrapper {
        position: relative;
        width: $small-width;
        height: 100%;
        pointer-events: all;

        @include respond-to(mobile) {
            width: $normal-width;
            padding: 1.6rem 0;
        }
    }

    .menuPanel {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
    }

    .prev {
        transform: translateX(-$small-width) translate3d(0, 0, 0);

        @include respond-to(mobile) {
            transform: translateX(-$normal-width) translate3d(0, 0, 0);
        }
    }

    .current {
        right: 0;
        padding-bottom: 3rem;
        transform: translateX(0) translate3d(0, 0, 0);
    }

    .next {
        transform: translateX($small-width) translate3d(0, 0, 0);

        @include respond-to(mobile) {
            transform: translateX($normal-width) translate3d(0, 0, 0);
        }
    }

    .prev,
    .next {
        visibility: hidden;
    }
</style>
