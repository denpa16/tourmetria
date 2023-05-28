<template>
    <nuxt-link :to="href">
        <article :class="[$style.NewsCard, {[$style['_with-image']] : withImage}]">
            <div :class="$style.newsTags">
                <VTag
                    v-if="withImage"
                    color="white"
                    label="Новость"
                />
                <VTag
                    v-if="projectList.length === 1 || !projectList.length"
                    color="primary"
                    :label="label"
                />
                <VTooltip
                    v-else-if="projectList.length > 1"
                    top
                    :nudge="12"
                >
                    <template #activator>
                        <VTag
                            color="primary"
                            :label="`${projectList[0]?.name} +${projectList.length - 1}`"
                        />
                    </template>
                    <div v-if="projectList.length"
                         :class="$style.tooltip">
                        <VTag v-for="(project, index) in projectList.slice(1)"
                              :key="index"
                              :class="$style.tag"
                              :label="project?.name"
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
                v-if="withImage"
                :class="$style.imageWrapper"
            >
                <ImageLazy
                    :class="$style.newsImage"
                    :image="news.news_card_image_display"
                    :preview="news.news_card_image_preview"
                    relative
                />
            </div>
            <div :class="$style.newsContent">
                <time :class="[$style.newsDate, 'p5','c-base300']">
                    {{ currentDate(news.pub_date) }}
                </time>
                <VSquareButton
                    size="xsmall"
                    :class="$style.buttonPlus"
                    role="presentation"
                    tabindex="-1"
                >
                    <IconArrowRight :class="$style.iconArrowRight" />
                </VSquareButton>
                <div :class="[$style.newsTitle, 'h4']"
                     v-html="news.title">
                </div>
                <p
                    :class="[$style.newsDescription, 'p6']"
                    v-html="news.news_card_short_text"
                >
                </p>
            </div>
        </article>
    </nuxt-link>
</template>

<script>
    import ImageLazy from '~/components/common/ImageLazy';
    import VTag from '~/components/ui/tag/VTag';
    import IconArrowRight from '~/components/icons/IconArrowRight';
    export default {
        name: 'NewsCard',
        components: {
            IconArrowRight,
            VTag,
            ImageLazy,
        },

        props: {
            news: {
                type: Object,
                default: () => ({})
            },

            withImage: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {};
        },

        computed: {
            label() {
                return this.projectList.length === 1 ? this.projectList[0]?.name : 'Неометрия';
            },

            projectList() {
                return this.news?.projects || [];
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

            href() {
                return `/blog/news/${this.news.id}`;
            }
        },

        methods: {
            currentDate(date) {
                const splitedDate = date.split(' ');
                const month = splitedDate[1];
                const normalizeMonth = month.substr(0, month.length-1) + 'я';
                splitedDate[1] = normalizeMonth;
                return splitedDate.join(' ');
            }
        },
    };
</script>

<style lang='scss' module>
    .NewsCard {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        padding: 1.6rem;
        border-radius: .8rem;
        background-color: $base-50;
        cursor: pointer;

        @include respond-to(sm) {
            flex-direction: column-reverse;
        }

        @include hover {
            .newsImage {
                scale: 1.1;
            }

            .newsTitle {
                color: $blue;
            }
        }

        &._with-image {
            justify-content: start;
            padding: 0;
            background-color: transparent;

            @include respond-to(sm) {
                flex-direction: column-reverse;
                padding: 2rem 1.6rem 1.6rem;
                border-radius: .8rem;
                background-color: $base-50;
            }

            .newsTags {
                position: absolute;
                top: 2rem;
                left: 1.6rem;
                z-index: 1;
                display: flex;

                @include respond-to(sm) {
                    position: static;
                }
            }

            .dateTag {
                display: none;

                @include respond-to(sm) {
                    display: inline-flex;
                }
            }

            .newsContent {
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                flex: auto;
                padding: 2.4rem 1.6rem 2rem;
                border-radius: .8rem;
                background-color: $base-50;

                @include respond-to(sm) {
                    justify-content: start;
                    padding: 0;
                    border-radius: 0;
                    background-color: transparent;
                }
            }

            .newsDate {
                display: inline;
                margin-bottom: 2.8rem;

                @include respond-to(sm) {
                    display: none;
                }
            }

            .buttonPlus {
                position: absolute;
                top: 2rem;
                right: 1.6rem;
                display: inline-flex;

                @include respond-to(sm) {
                    display: none;
                }
            }

            .iconArrowRight {
                width: 1.2rem;
                height: 1.2rem;
            }

            .newsTitle {
                margin-bottom: 0;
                color: $base-800;
                transition: color $default-transition;

                @include respond-to(sm) {
                    margin-bottom: 1.6rem;
                    font-size: 1.6rem;
                    line-height: 2rem;
                }

                @include respond-to(xs) {
                    overflow: hidden;
                    /* stylelint-disable */
                    display: -webkit-box;
                    /* stylelint-enable */
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    margin-bottom: 1.2rem;
                }
            }

            .newsDescription {
                display: none;

                @include respond-to(sm) {
                    display: inline;
                }

                @include respond-to(xs) {
                    margin-bottom: 3.2rem;
                    color: $base-400;
                    opacity: .48;
                }
            }
        }
    }

    .newsTags {
        display: flex;

        & > * {
            &:not(:last-child) {
                margin-right: .4rem;
            }
        }
    }

    .newsImage {
        width: 100%;
        height: 100%;
        transition: scale $default-transition;
    }

    .imageWrapper {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 37.6rem;
        margin-bottom: .8rem;
        border-radius: .8rem;

        @include respond-to(sm) {
            display: none;
        }

        &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 8.4rem;
            border-radius: .8rem;
            background:
                linear-gradient(
                    180deg,
                    rgba(10, 11, 12, 0) 0%,
                    rgba(10, 11, 12, .0086472) 6.67%,
                    rgba(10, 11, 12, .03551) 13.33%,
                    rgba(10, 11, 12, .0816599) 20%,
                    rgba(10, 11, 12, .147411) 26.67%,
                    rgba(10, 11, 12, .231775) 33.33%,
                    rgba(10, 11, 12, .331884) 40%,
                    rgba(10, 11, 12, .442691) 46.67%,
                    rgba(10, 11, 12, .557309) 53.33%,
                    rgba(10, 11, 12, .668116) 60%,
                    rgba(10, 11, 12, .768225) 66.67%,
                    rgba(10, 11, 12, .852589) 73.33%,
                    rgba(10, 11, 12, .91834) 80%,
                    rgba(10, 11, 12, .96449) 86.67%,
                    rgba(10, 11, 12, .991353) 93.33%,
                    #0a0b0c 100%
                );
            opacity: .64;
            transform: matrix(1, 0, 0, -1, 0, 0);
        }
    }

    .newsDate {
        display: none;
    }

    .buttonPlus {
        display: none;
    }

    .newsTitle {
        margin-bottom: 1.6rem;
        text-transform: uppercase;
        transition: color $default-transition;

        @include respond-to(sm) {
            font-size: 1.6rem;
            line-height: 2rem;
        }

        @include respond-to(xs) {
            overflow: hidden;
            /* stylelint-disable */
            display: -webkit-box;
            /* stylelint-enable */
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }

    .newsDescription {
        color: $base-300;

        @include respond-to(xs) {
            overflow: hidden;
            /* stylelint-disable */
            display: -webkit-box;
            /* stylelint-enable */
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
        }
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
