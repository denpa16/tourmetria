<template>
    <section :class="$style.NewsPage">
        <div :class="[$style.newsContainer, 'container']">
            <button
                :class="$style.backButton"
                value="Назад к новостям"
                @click="goToNewsListPage"
            >
                <IconArrowBig :class="$style.iconArrow" />
                <span class="p6">Назад к новостям</span>
            </button>
            <div :class="$style.newsContent">
                <div :class="$style.newsTags">
                    <VTag
                        v-if="projectNames.length === 0"
                        color="primary"
                        label="Неометрия"
                    />
                    <VTag
                        v-else-if="projectNames.length === 1"
                        color="primary"
                        :label="projectNames[0]"
                    />
                    <VTooltip
                        v-else
                        top
                        :nudge="12"
                    >
                        <template #activator>
                            <VTag
                                color="primary"
                                :label="`${projectNames[0]} +${projectNames.length - 1}`"
                            />
                        </template>
                        <div :class="$style.tooltip">
                            <VTag v-for="(project, index) in projectNames.slice(1)"
                                  :key="index"
                                  :class="$style.tag"
                                  :label="project"
                                  color="light"
                            />
                        </div>
                    </VTooltip>
                    <VTag
                        :class="$style.dateTag"
                        color="white"
                        :label="publicationDate"
                    />
                </div>
                <div
                    :class="[$style.newsTitle, 'h3']"
                    v-html="news.title"
                >
                </div>
                <div
                    :class="[$style.newsDescription, 'p3', 'c-base300']"
                    v-html="news.description"
                ></div>
                <div :class="$style.quote">
                    <IconDoubleQuotes :class="$style.iconDoubleQuotes" />
                    <div
                        :class="[$style.quoteText, 'h5']"
                        v-html="news.news_text_in_quotes"
                    >
                    </div>
                </div>
                <ImageLazy
                    :class="$style.newsImage"
                    :image="news.main_image_display"
                    :preview="news.main_image_preview"
                    relative
                />
                <div
                    :class="[$style.secondDescription, 'p3', 'c-base300']"
                    v-html="news.description_after_main_image"
                ></div>
            </div>
        </div>
        <NewsBlock
            :news-list="extraNews"
            with-image
            title="Смотрите также"
        />
    </section>
</template>

<script>
    import IconDoubleQuotes from '~/components/icons/IconDoubleQuotes';
    import ImageLazy from '~/components/common/ImageLazy';
    import NewsBlock from '~/components/common/news/NewsBlock';
    import IconArrowBig from '~/components/icons/IconArrowBig';

    export default {
        name: 'NewsPage',
        components: {NewsBlock,
                     ImageLazy,
                     IconDoubleQuotes,
                     IconArrowBig},

        scrollToTop: true,
        props: {},
        async asyncData({app, params}) {
            try {
                const [news, extraNews]= await Promise.all([
                    app.$axios.$get(app.$api.publications.publication(params.id)),
                    app.$axios.$get(app.$api.publications.extra_news(params.id))
                ]);

                return {
                    news,
                    extraNews
                };
            } catch (error) {
                console.warn('[News page/asyncData] request failed: ', error);
            }
        },

        data() {
            return {
                news: {},
                extraNews: []
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
            projectNames() {
                return this.news.projects.map(project => project.name);
            },

            publicationDate() {
                const dateArray = this.news.pub_date.split(' ');
                switch (dateArray[1]) {
                    case 'январь':
                        dateArray[1] = '01';
                        break;
                    case 'февраль':
                        dateArray[1] = '02';
                        break;
                    case 'март':
                        dateArray[1] = '03';
                        break;
                    case 'апрель':
                        dateArray[1] = '04';
                        break;
                    case 'май':
                        dateArray[1] = '05';
                        break;
                    case 'июнь':
                        dateArray[1] = '06';
                        break;
                    case 'июль':
                        dateArray[1] = '07';
                        break;
                    case 'август':
                        dateArray[1] = '08';
                        break;
                    case 'сентябрь':
                        dateArray[1] = '09';
                        break;
                    case 'октябрь':
                        dateArray[1] = '10';
                        break;
                    case 'ноябрь':
                        dateArray[1] = '11';
                        break;
                    case 'декабрь':
                        dateArray[1] = '12';
                        break;
                }
                return dateArray.join('.');
            },
        },

        methods: {
            goToNewsListPage() {
                this.$router.push({path: '/blog/news'});
            }
        },
    };
</script>

<style lang="scss" module>
    .NewsPage {
        position: relative;
        display: flex;
        flex-direction: column;

        @include respond-to(sm) {
            background-color: $base-50;
        }

        :global(.news-block) {
            width: 100%;
            background-color: $base-0;

            h3 {
                @include respond-to(xs) {
                    align-self: center;
                }
            }
        }
    }

    .newsContainer {
        position: relative;
        width: 100%;
    }

    .newsContent {
        width: 83.2rem;
        margin: 0 auto;
        padding: 6.4rem 0 4.8rem;

        @include respond-to(sm) {
            display: flex;
            flex-direction: column;
            width: calc(100% - 4.8rem);
            margin: 0 auto 2.4rem;
            padding: 2.4rem;
            border-radius: .8rem;
            background-color: $base-0;
        }

        @include respond-to(xs) {
            width: 100%;
            margin: 0 0 .4rem;
            padding: 2.4rem 1.6rem;
        }
    }

    .newsTags {
        display: flex;
        margin-bottom: 2.4rem;

        & > * {
            &:not(:last-child) {
                margin-right: .4rem;
            }
        }

        @include respond-to(sm) {
            order: 2;
            margin-bottom: 1.6rem;
        }
    }

    .newsTitle {
        margin-bottom: 2.4rem;

        @include respond-to(sm) {
            order: 1;
            margin-bottom: 1.6rem;
            font-size: 2rem;
            line-height: 2.4rem;
        }
    }

    .newsDescription {
        margin-bottom: 2.4rem;

        @include respond-to(sm) {
            order: 4;
            margin-bottom: 1.6rem;
        }

        @include reset-text-styles;
    }

    .quote {
        display: flex;
        width: 100%;
        margin-bottom: 2.4rem;
        padding: 1.6rem;
        border-radius: .8rem;
        background-color: $base-50;

        @include respond-to(sm) {
            order: 5;
            margin-bottom: 1.6rem;
        }
    }

    .iconDoubleQuotes {
        width: 3.2rem;
        height: 3.2rem;
        margin-right: 1.5rem;
    }

    .quoteText {
        padding-left: 1.6rem;
        text-transform: uppercase;
        font-weight: bold;
        border-left: 1px solid $base-200;

        @include respond-to(sm) {
            font-size: 1.6rem;
            line-height: 120%;
        }
    }

    .newsImage {
        &:global(.image-lazy) {
            overflow: hidden;
            width: 100%;
            height: 29rem;
            margin-bottom: 2.4rem;
            border-radius: .8rem;

            @include respond-to(sm) {
                order: 3;
                height: 29.9rem;
                margin-bottom: 1.6rem;
            }

            @include respond-to(xs) {
                height: 22.4rem;
            }
        }
    }

    .secondDescription {
        @include respond-to(sm) {
            order: 6;
        }

        @include reset-text-styles;
    }

    .backButton {
        position: sticky;
        top: calc(#{$header-h} + 7.2rem);
        bottom: 0;
        left: 2.4rem;
        display: flex;
        align-items: center;
        color: $base-500;
        cursor: pointer;

        @include hover {
            .iconArrow {
                translate: -.5rem;
            }
        }

        @include respond-to(sm) {
            position: static;
            padding: 2.4rem 0 1.6rem 2.4rem;
        }
    }

    .iconArrow {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 1rem;
        color: $blue;
        rotate: 180deg;
        transition: all .2s;
    }

    .tooltip {
        display: flex;
        flex-wrap: wrap;
        max-width: 33rem;
        margin: -.2rem;
        padding: 1rem 1rem .6rem;
        border-radius: .8rem;
        background-color: $base-0;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);

        &:before {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            width: 0;
            height: 0;
            border-color: $base-0 transparent transparent transparent;
            border-style: solid;
            border-width: .6rem .6rem 0 .6rem;
            transform: translateX(-50%);
        }

        & > * {
            margin: .2rem;
        }
    }
</style>
