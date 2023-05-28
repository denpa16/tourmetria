<template>
    <transition name="modal"
                @after-enter="$emit('after-enter')"
                @before-leave="$emit('before-leave')"
                @after-leave="$emit('after-leave')">
        <div v-if="visible"
             :class="['modal', $style.SelectModal]">

            <div :class="['modal-wrap', $style.wrap]"
                 @click.self="$emit('close')">
                <div :class="[$style.content, {[$style._withAdditionalContent]: search || isTabs}]">
                    <div ref="head"
                         :class="[$style.head, {[$style._paddingBottomNone]: search || isTabs}]">
                        <div :class="$style.closeBtn">
                            <VSquareButton color="light"
                                           :size="!$deviceIs.mobile ? 'medium' : 'small'"
                                           aria-label="Закрыть"
                                           @click="$emit('close')">
                                <IconPlus :class="$style.closeBtnIcon" />
                            </VSquareButton>
                        </div>

                        <h5 :class="$style.title">
                            {{ title }}
                        </h5>
                    </div>

                    <div v-if="search"
                         ref="search"
                         :class="$style.search">
                        <VInputSearch
                            placeholder="Город"
                            :items="options"
                            value-path="label"
                            is-prepend-icon
                            @input="onSearchInput"
                        />
                    </div>

                    <VTabs
                        v-if="isTabs"
                        v-show="currentTabs.length"
                        ref="tabs"
                        :class="$style.tabs"
                        size="small"
                        :tabs="currentTabs"
                        :value="activeTab"
                        fill
                        @change="onTabsChange"
                    />

                    <VScrollBox :class="$style.scrollBox"
                                :styles="scrollboxStyles">
                        <ul v-show="(search || isTabs) ? filteredOptions.length : options.length"
                            :class="$style.options">
                            <li v-for="(option, idx) in ((search || isTabs) ? filteredOptions : options)"
                                :key="`option-${idx}`"
                                :class="[$style.item, {[$style._active]: option.value === value}]"
                                @click="handleClick(option.value)">
                                <span class="p6">{{ option.label }}</span>
                            </li>
                        </ul>
                    </VScrollBox>

                    <transition name="fade-content">
                        <span v-if="search"
                              v-show="filteredOptions.length === 0"
                              :class="$style.notFound">
                            Ничего не найдено
                        </span>
                    </transition>

                    <div v-if="btns.length"
                         :class="$style.btns">
                        <VButton v-for="btn in btns"
                                 :key="btn.text"
                                 :color="btn.color"
                                 @click="btn.handler">
                            {{ btn.text }}
                        </VButton>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import IconPlus from '~/components/icons/IconPlus';

    export default {
        name: 'SelectModal',

        components: {
            IconPlus,
        },

        props: {
            visible: Boolean,

            data: {
                type: Object,
                default: () => ({}),
            },
        },

        data() {
            return {
                filteredOptions: this.data?.options,
                findedOptions: [],
                isSearchActive: false,
                activeTab: '',
                scrollboxMaxHeight: '',
            };
        },

        computed: {
            title() {
                return this.data.title || '';
            },

            options() {
                return this.data.options || [];
            },

            value() {
                return this.data.value || '';
            },

            type() {
                return this.data.type || '';
            },

            search() {
                return this.data.search || false;
            },

            isTabs() {
                return this.data.isTabs || false;
            },

            btns() {
                return this.data.btns || [];
            },

            scrollboxStyles() {
                return {
                    maxHeight: this.scrollboxMaxHeight,
                };
            },

            currentTabs() {
                if (this.isTabs) {
                    if (this.isSearchActive) {
                        return this.findedOptions.reduce((res, {group}) => {
                            if (group && !res.some(({value}) => group.value === value)) {
                                res.push(group);
                                return res;
                            }
                            return res;
                        }, []);
                    }

                    return this.options.reduce((res, {group}) => {
                        if (group && !res.some(({value}) => group.value === value)) {
                            res.push(group);
                            return res;
                        }
                        return res;
                    }, []);
                }
                return [];
            }
        },

        mounted() {
            this.$nextTick(() => {
                this.calculateScrollboxHeight();
            });

            window.addEventListener('resize', this.onResize);
        },

        beforeDestroy() {
            window.removeEventListener('resize', this.onResize);
        },

        methods: {
            handleClick(val) {
                const obj = {};
                obj[this.type] = val;
                this.data.filter(obj);
                this.$emit('close');
            },

            /**
             * Обработчик поиска
             */
            onSearchInput(value, filteredItems) {
                this.isSearchActive = Boolean(value);
                this.findedOptions = filteredItems;
                this.filteredOptions = filteredItems;
                this.activeTab = '';
            },

            /**
             * Обработчик переключение табов
             */
            onTabsChange(value) {
                if (!value.length) {
                    this.filteredOptions = this.isSearchActive ? this.findedOptions : this.options;
                    this.activeTab = '';
                    return;
                }
                this.activeTab = value;

                if (this.isSearchActive) {
                    this.filteredOptions = this.findedOptions.filter(({group}) => group && group.value === this.activeTab);
                } else {
                    this.filteredOptions = this.options.filter(({group}) => group && group.value === this.activeTab);
                }
            },

            calculateScrollboxHeight() {
                const fullPageHeight = this.$deviceIs.pc ? '100vh' : 'var(--vh-full-page)';
                const headHeight = this.$refs.head?.offsetHeight || 0;
                const searchHeight = this.$refs.search?.offsetHeight || 0;
                const tabsHeight = this.$refs.tabs?.offsetHeight || 0;

                this.scrollboxMaxHeight = `calc(${fullPageHeight} - ${headHeight}px - ${searchHeight}px - ${tabsHeight}px)`;
            },

            onResize() {
                this.calculateScrollboxHeight();
            }
        },
    };
</script>

<style lang="scss" module>
    .SelectModal {
        z-index: 200;
    }

    .wrap {
        @include respond-to(sm) {
            right: 50%;
            max-width: 54.6rem;
            transform: translateX(50%);
        }

        @include respond-to(xs) {
            right: 0;
            max-width: 100vw;
            transform: translateX(0);
        }
    }

    .content {
        max-height: 100%;
        margin-top: auto;
        padding-bottom: 2.4rem;
        border-radius: .8rem .8rem 0 0;
        background-color: $base-0;

        &._withAdditionalContent {
            display: flex;
            flex-direction: column;
            height: 60%;
        }
    }

    .head {
        position: relative;
        padding: 3.4rem 1.6rem;

        &._paddingBottomNone {
            padding-bottom: 0;
        }
    }

    .title {
        text-transform: uppercase;
        font-weight: 600;

        @include respond-to(sm) {
            font-size: 2rem;
            line-height: 2.8rem;
        }

        @include respond-to(xs) {
            font-size: 1.2rem;
        }
    }

    .closeBtn {
        position: absolute;

        @include respond-to(sm) {
            top: 0;
            right: -1.2rem;
            transform: translateX(100%);
        }

        @include respond-to(xs) {
            top: 2.4rem;
            right: 1.6rem;
            transform: translateX(0);
        }
    }

    .closeBtnIcon {
        width: 1.6rem;
        height: 1.6rem;
        transform: rotate(45deg);
    }

    .options {
        padding: 0 1.6rem 1.6rem;
    }

    .item {
        display: flex;
        align-items: center;
        height: 4.4rem;
        padding: 0 1.6rem;
        border-radius: .4rem;
        border: 1px solid $base-100;
        transition: all $default-transition;
        cursor: pointer;

        &:not(:last-child) {
            margin-bottom: .8rem;
        }

        &._active {
            border-color: rgba($blue, .32);
            color: $blue;
        }

        @include hover {
            border-color: $blue;
            color: $blue;
        }
    }

    .search {
        padding: 1.6rem;
        border-bottom: 1px solid $base-100;
    }

    .notFound {
        display: block;
        padding: 1.6rem 2.4rem;
        font-size: 1.4rem;
        font-weight: 500;
        line-height: 1.6rem;
        color: $base-300;
    }

    .tabs {
        margin-bottom: 1.6rem;
        padding: 1.6rem;
        border-bottom: 1px solid $base-100;
    }

    .scrollBox {
        max-height: 100%;
    }

    .btns {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(1fr, 50%));
        padding-right: 1.6rem;
        padding-left: 1.6rem;
    }
</style>
