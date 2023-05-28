<template>
    <section :class="$style.NewsListPage">
        <div :class="[$style.filtersWrapper, 'container']">
            <VSelect
                :value="values.projects"
                :options="projectOptions"
                apply-facets
                :facet="facets.projects"
                :class="$style.filterItem"
                placeholder="Проект"
                modal-breakpoint="xs"
                modal-title="Проект"
                bordered
                multiple
                clear-btn
                @clear-filter="onProjectInput([])"
                @input="onProjectInput"
            />
            <p :class="[$style.newsCounter, 'p6','c-base300']">
                {{ newsCounterText }}
            </p>
        </div>
        <div :class="[$style.newsWrapper, 'container']">
            <ul :class="$style.newsList">
                <li
                    v-for="news in newsListToShow"
                    :key="news.id"
                    :class="$style.newsItem"
                >
                    <NewsCard
                        :news="news"
                        with-image
                    />
                </li>
            </ul>
            <VButton
                v-if="moreNewsCounter > 0 && !isAllNewsShown"
                :class="$style.moreNewsButton"
                color="light"
                @click="onMoreButtonClick"
            >
                {{ moreButtonText }}
            </VButton>
        </div>
    </section>
</template>

<script>
    import {convertToObject} from '~/assets/js/utils/commonUtils';
    import {plural} from '~/assets/js/utils/textUtils';
    import {serializeValues} from '~/assets/js/utils/filterUtils';
    import {objectToQuery} from '~/assets/js/utils/queryUtils';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';

    import NewsCard from '~/components/common/news/NewsCard';

    export default {
        name: 'NewsListPage',
        components: {NewsCard},
        mixins: [breakpointCheck],
        props: {},
        async asyncData({app, query}) {
            try {
                const initialValues = {
                    projects: query.projects?.length ? query.projects.split(',') : []
                };
                const [
                    specs,
                    facets,
                    newsList
                ] = await Promise.all([
                    app.$axios.$get(app.$api.publications.specs),
                    app.$axios.$get(app.$api.publications.facets, {
                        params: {
                            ...query,
                            type: 'news',
                        }
                    }),
                    app.$axios.$get(app.$api.publications.news, {
                        params: {
                            ...query
                        }
                    }),
                ]);

                const specsObject = Array.isArray(specs) ? convertToObject(specs) : specs;
                const facetsObject = Array.isArray(facets?.facets) ? convertToObject(facets?.facets) : facets?.facets;
                const newsCounter = facets?.count;

                return {
                    specs: specsObject || {},
                    facets: facetsObject || {},
                    newsCounter: newsCounter || 0,
                    newsList: newsList || [],
                    values: initialValues
                };
            } catch (err) {
                console.warn('[Project page/asyncData] request failed: ', err);
            }
        },

        data() {
            return {
                values: {},
                specs: {},
                facets: {},
                newsCounter: 0,
                newsList: [],
                isAllNewsShown: false
            };
        },

        head() {
            return {
                title: 'Новости федерального девелопера Неометрия',
                meta: [{
                    hid: 'description',
                    name: 'description',
                    content: 'Новости строительной компании Неометрия . Актуальная информация о строящихся ЖК города ',
                }],
            };
        },

        computed: {
            projectOptions() {
                return this.specs.projects.news_projects;
            },

            newsListToShow() {
                if (this.isAllNewsShown) {
                    return this.newsList;
                }

                if (this.breakpoint === 'xs') {
                    return this.newsList.slice(0, 7);
                } else if (this.breakpoint === 'sm') {
                    return this.newsList.slice(0, 6);
                }
                return this.newsList.slice(0, 9);
            },

            newsCounterText() {
                return `${this.newsCounter} ${plural(this.newsCounter, ['новость', 'новости', 'новостей'])}`;
            },

            moreNewsCounter() {
                if (this.breakpoint === 'xs') {
                    return this.newsCounter - 7;
                } else if (this.breakpoint === 'sm') {
                    return this.newsCounter - 6;
                }
                return this.newsCounter - 9;
            },

            moreButtonText() {
                const newsCounter = `${this.moreNewsCounter} ${plural(this.moreNewsCounter, ['новость', 'новости', 'новостей'])}`;
                const desktopText = `+ ${newsCounter}`;
                const adaptiveText = `Смотреть ещё ${newsCounter}`;

                return ['sm', 'xs'].includes(this.breakpoint) ? adaptiveText : desktopText;
            }
        },

        methods: {
            async fetchNews() {
                try {
                    const res = await this.$axios.$get(this.$api.publications.news, {
                        params: serializeValues(this.values),
                        paramsSerializer: params => objectToQuery(params),
                    });

                    this.newsList = res?.length ? res : [];
                } catch (err) {
                    console.warn('[NewsPage/fetchNews] request failed: ', err);
                }
            },

            async fetchFacets() {
                try {
                    const res = await this.$axios.$get(this.$api.publications.facets, {
                        params: serializeValues(this.values),
                        paramsSerializer: params => objectToQuery(params),
                    });
                    this.facets = Array.isArray(res.facets) ? convertToObject(res.facets) : res.facets;
                    this.newsCounter = res?.count_news;
                } catch (err) {
                    console.warn('[NewsPage/fetchFacets] request failed: ', err);
                }
            },

            updateUrl() {
                this.$router.push({path: '/blog/news', query: serializeValues(this.values)});
            },

            onProjectInput(val) {
                this.values.projects = val;

                this.updateUrl();
                this.fetchFacets();
                this.fetchNews();
            },

            onMoreButtonClick() {
                this.isAllNewsShown = true;
            }
        },
    };
</script>

<style lang="scss" module>
    .NewsListPage {
        padding-bottom: 7.2rem;

        @include respond-to(sm) {
            padding-bottom: 4.8rem;
        }

        @include respond-to(xs) {
            padding-bottom: 4rem;
        }
    }

    .filtersWrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 2.4rem;
        padding-top: 1.2rem;
        padding-bottom: 1.2rem;
        border-bottom: 1px solid $base-100;

        @include respond-to(xs) {
            margin-bottom: 1.6rem;
        }

        .filterItem {
            @include respond-to(sm) {
                width: 100%;
            }
        }
    }

    .newsCounter {
        @include respond-to(sm) {
            display: none;
        }
    }

    .newsWrapper {
        display: flex;
        flex-direction: column;

        .moreNewsButton {
            width: fit-content;
            margin: 6.4rem auto 0;

            @include respond-to(sm) {
                width: 100%;
                margin: 1.6rem 0 0;
            }

            @include respond-to(sm) {
                margin: 1.2rem 0 0;
            }
        }
    }

    .newsList {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 1.6rem;

        @include respond-to(sm) {
            grid-template-columns: repeat(2, 1fr);
        }

        @include respond-to(xs) {
            grid-template-columns: initial;
            grid-gap: 1.2rem;
        }
    }

    .newsItem {
        @include respond-to(sm) {
            height: 30rem;
        }

        @include respond-to(xs) {
            height: unset;
        }
    }

</style>
