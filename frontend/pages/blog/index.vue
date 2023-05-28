<template>
    <section :class="$style.BlogPage">
        <transition name="fade-slow">
            <div
                v-if="!$route.name.includes('id')"
                :class="[$style.tabsWrapper, 'container']"
            >
                <VTabs
                    :class="$style.tabs"
                    :tabs="tabs"
                    :value="tabValue"
                    type="transparent"
                    is-required
                    @change="handleTabChange"
                />
                <VSelect
                    :class="$style.select"
                    :options="tabs"
                    :value="tabValue"
                    modal-breakpoint="xs"
                    modal-title="Выбор"
                    @input="handleTabChange"
                />
            </div>
        </transition>
        <NuxtChild />
    </section>
</template>

<script>
    export default {
        name: 'BlogPage',
        components: {},
        middleware({route, redirect}) {
            if (route.path.split('/')[2]) {
                return;
            }
            return redirect('/blog/news');
        },

        props: {},

        data() {
            return {
                tabs: [
                    {
                        label: 'О компании',
                        value: 'about',
                        href: '/about',
                    },
                    {
                        label: 'Новости',
                        value: 'news'
                    },
                    {
                        label: 'Акции',
                        value: 'promotions'
                    },
                    {
                        label: 'NEO-забота',
                        value: 'care',
                        href: '/about/neocare',
                    },
                    {
                        label: 'Видео',
                        value: 'video',
                        href: '/about/videos',
                    },
                    {
                        label: 'Карьера',
                        value: 'career',
                        href: '/about/career',
                    },
                    {
                        label: 'Инвесторам',
                        value: 'investors',
                        href: '/about/investors',
                    }
                ],

                tabValue: ''
            };
        },

        computed: {},
        watch: {
            '$route.path': {
                handler: function(path) {
                    this.tabValue = path.split('/')[2];
                },

                deep: true,
                immediate: true
            }
        },

        created() {
            this.tabValue = this.$route.path.split('/')[2];
        },

        methods: {
            handleTabChange(val) {
                const activeTab = this.tabs.find(tab => tab?.value === val);

                if (!activeTab) {
                    return;
                }

                if (!activeTab.href) {
                    this.tabValue = val;
                    this.$router.push(`/blog/${val}`);
                    return;
                }

                const link = document.createElement('a');
                link.href = activeTab.href;
                link.target = '_blank';
                link.click();
            }
        }
    };
</script>

<style lang="scss" module>
    .BlogPage {
        //
    }

    .tabsWrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        border-top: 1px solid $base-100;
        border-bottom: 1px solid $base-100;
    }

    .tabs {
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
</style>
