<template>
    <section :class="$style.PolicyPage">
        <div ref="tabs"
             :class="$style.tabsWrapper">
            <VTabs
                v-if="formattedThemes && formattedThemes.length"
                :class="$style.tabs"
                :tabs="formattedThemes"
                :value="activeTab"
                type="transparent"
                is-required
                @change="handleTabChange"
            />
            <VSelect
                v-if="formattedThemes && formattedThemes.length"
                :class="$style.select"
                :options="formattedThemes"
                :value="activeTab"
                modal-breakpoint="xs"
                modal-title="Выбор"
                @input="handleTabChange"
            />
        </div>

        <div :class="$style.policyContainer">
            <h3 :class="[$style.policyTitle, 'h3']">
                {{ title }}
            </h3>

            <ul :class="$style.themeList">
                <li
                    v-for="(theme,index) in formattedThemes"
                    :key="index"
                    ref="themeItem"
                    :data-index="index"
                    :class="[$style.themeItem, 'p3', 'c-base300']"
                >
                    <h5 :class="[$style.policySubtitle, 'h5']">
                        {{ theme.title }}
                    </h5>
                    <span v-html="wrapLinks(theme.text)"></span>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
    import variables from '~/assets/scss/shared/_variables.scss';

    export default {
        name: 'PolicyPage',
        components: {},
        props: {},
        async asyncData({app}) {
            try {
                const {title, themes} = await app.$axios.$get(app.$api.documents.policy);
                return {
                    title,
                    themes
                };
            } catch (error) {
                console.warn('[Privacy page/asyncData] request failed: ', error);
            }
        },

        data() {
            return {
                observer: null,
                isScrollDown: true,
                oldScroll: 0,
                title: '',
                themes: [],
                activeTabData: {},
                activeIndex: 0,
                isForward: true,
            };
        },

        head() {
            return {
                title: 'Политика конфиденциальности - федеральный девелопер Неометрия',
                meta: [{
                    hid: 'description',
                    name: 'description',
                    content: 'Текст политики конфиденциальности персональных данных. Условия обработки данных',
                }],
            };
        },

        computed: {
            formattedThemes() {
                if (!Array.isArray(this.themes)) {
                    return [];
                }

                return this.themes.map(theme => {
                    let label = theme.title
                        .replace(/(^\d+\.?(\d+)?(.|\))?( +)?)/g, '')
                        .toLowerCase();
                    label = label[0].toUpperCase() + label.slice(1);

                    return {
                        ...theme,
                        label: label,
                        value: theme.title,
                    };
                });
            },

            activeTab() {
                return this.formattedThemes[this.activeIndex]?.value;
            }
        },

        mounted() {
            if (this.$refs.themeItem?.length) {
                this.observer = new IntersectionObserver(this.handleObserver, {threshold: [.3, .4, .6, .7, 1]});
                this.$refs.themeItem.forEach(item => this.observer.observe(item));
            }
            window.addEventListener('scroll', this.handleWindowScroll);
        },

        beforeDestroy() {
            this.observer?.disconnect();
            window.removeEventListener('scroll', this.handleWindowScroll);
        },

        methods: {
            wrapLinks(text) {
                const patternProtocol = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&/=]*)/g;
                const patternUrl = /[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z]{1,6}\b([-a-zA-Z()@:%_.~#?&/=]*)/g;

                let wrappedText = text;

                if (wrappedText.match(patternProtocol)) {
                    wrappedText = wrappedText.replace(patternProtocol, '<a href="$&" target="_blank">$&</a>');
                } else {
                    wrappedText = wrappedText.replace(patternUrl, '<a href="https://$&" target="_blank">$&</a>');
                }
                return wrappedText;
            },

            findActiveTabIndex(value) {
                return this.formattedThemes.findIndex(theme => theme.value === value);
            },

            scrollToItem() {
                if (!this.activeIndex) {
                    window.scrollTo({top: 0, behavior: 'smooth'});
                    return;
                }

                if (!this.$refs.themeItem?.length || !this.$refs.tabs) {
                    return;
                }

                let headerHeight = this.$deviceIs.mobile ? variables['header-mobile-h'] : variables['header-h'];

                if (headerHeight.includes('rem')) {
                    headerHeight = parseFloat(headerHeight) * 10;
                } else {
                    headerHeight = parseFloat(headerHeight);
                }

                const tabsHeight = this.$refs.tabs.offsetHeight;
                const themeTop = this.$refs.themeItem[this.activeIndex].getBoundingClientRect().top;
                const topScroll = themeTop - tabsHeight - headerHeight;

                window.scrollBy({top: topScroll, behavior: 'smooth'});
            },

            handleObserver(e) {
                if (e.length === this.formattedThemes.length) {
                    this.activeIndex = this.findVisibleBlockIndex(e);
                    return;
                }

                const nextIndex = e.length === 1 ? Number(e[0]?.target?.dataset?.index) : this.findVisibleBlockIndex(e);

                if (this.activeIndex === nextIndex) {
                    return;
                }

                if (this.isScrollDown) {
                    if (nextIndex > this.activeIndex) {
                        this.activeIndex = nextIndex;
                    }
                    return;
                }

                if (nextIndex < this.activeIndex) {
                    this.activeIndex = nextIndex;
                }
            },

            findVisibleBlockIndex(blocks) {
                return blocks.reduce((res, block) => {
                    if (block.intersectionRatio > res.intersectionRatio) {
                        return {
                            intersectionRatio: block.intersectionRatio,
                            index: Number(block.target.dataset.index)
                        };
                    }
                    return res;
                }, {
                    intersectionRatio: 0,
                    index: 0
                }).index;
            },

            handleWindowScroll() {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                this.isScrollDown = currentScroll >= this.oldScroll;
                this.oldScroll = currentScroll;
            },

            handleTabChange(value) {
                this.activeIndex = this.findActiveTabIndex(value);

                this.scrollToItem();
            }
        },
    };
</script>

<style lang="scss" module>
    .PolicyPage{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .tabsWrapper {
        position: sticky;
        top: $header-h;
        left: 0;
        overflow-y: auto;
        display: flex;
        align-items: center;
        width: 100%;
        border-top: 1px solid $base-100;
        border-bottom: 1px solid $base-100;
        background-color: $base-0;
        scrollbar-width: none;
        -ms-overflow-style: none;

        &::-webkit-scrollbar {
            display: none;
        }

        :global(.v-tabs .v-tabs__wrapper) {
            justify-content: center;
        }

        :global(.v-tab--transparent) {
            white-space: nowrap;
        }

        @include respond-to(sm) {
            :global(.v-tabs .v-tabs__wrapper) {
                flex-wrap: nowrap;
            }
        }

        @include respond-to(xs) {
            top: $header-mobile-h;
            padding: 0 1.6rem;
        }
    }

    .tabs {
        margin: 0 auto;
        @include respond-to(xs) {
            display: none;
        }
    }
    .select {
        &:global(.v-select) {
            display: none;

            @include respond-to(xs) {
                display: inline-block;
                width: 100%;
            }
        }

        :global(.v-select__field) {
            padding-top: 1.4rem;
            padding-bottom: 1.4rem;
            color: $base-800;
        }
    }

    .policyContainer {
        width: 100%;
        max-width: 83.2rem;
        padding: 6.4rem 2.4rem 10.4rem;

        @include respond-to(sm) {
            padding: 6.4rem 2.4rem 8.8rem;
        }

        @include respond-to(xs) {
            padding: 4rem 1.6rem 5.6rem;
        }
    }
    .policyTitle {
        margin-bottom: 2.4rem;
        text-transform: uppercase;

        @include respond-to(sm) {
            margin-bottom: 3.2rem;
        }

        @include respond-to(sm) {
            margin-bottom: 2.6rem;
            font-size: 2rem;
            line-height: 120%;
        }
    }

    .policySubtitle {
        margin-bottom: 2.4rem;
        text-transform: uppercase;
        color: $base-800;

        @include respond-to(sm) {
            margin-bottom: 3.2rem;
            font-size: 1.6rem;
        }

        @include respond-to(xs) {
            margin-bottom: 2.6rem;
        }
    }

    .themeItem {
        padding-top: 2.4rem;

        &:first-child {
            padding-top: 0;
        }

        p{
            margin-bottom: 1.6rem;

            &:last-child {
                margin-bottom: 0;
            }

            a {
                color: $blue;
            }
        }

        strong {
            font-size: 1.6rem;
            font-weight: 700;
            line-height: 2.6rem;
            color: $blue;
        }
    }
</style>
