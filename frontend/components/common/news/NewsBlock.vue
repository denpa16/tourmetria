<template>
    <div :class="[$style.NewsBlock, {[$style['_with-image']]: withImage}, 'container', 'news-block']">
        <h3 :class="[$style.newsTitle, 'h3']">
            <span v-if="!title">
                Новости
                <span v-if="options && options.length"
                      :class="$style._adaptive">
                    по
                    <VSelect
                        size="large"
                        :value="projectValue"
                        :options="options"
                        @input="handleInput"
                    />
                </span>
            </span>

            <span v-else>
                {{ title }}
            </span>
        </h3>
        <transition name="fade-content">
            <div
                v-show="isLoaded"
                :key="listKey"
                ref="slider"
                :class="[$style.newsList, 'swiper']"
            >
                <ul :class="[$style.newsListWrap, 'swiper-wrapper']">
                    <li
                        v-for="news in newsListToShow"
                        :key="news.id"
                        :class="[$style.newsItem, 'swiper-slide']"
                    >
                        <NewsCard
                            :news="news"
                            :with-image="withImage"
                        />
                    </li>
                </ul>
                <div
                    class="swiper-pagination"
                    :class="$style.sliderPagination"
                >
                </div>
            </div>
        </transition>
        <VButton
            :class="$style.newsBtn"
            color="light"
            link="/blog/news"
        >
            Смотреть все
        </VButton>
    </div>
</template>

<script>
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';

    import NewsCard from '~/components/common/news/NewsCard';

    export default {
        name: 'NewsBlock',
        components: {NewsCard},
        mixins: [breakpointCheck],
        props: {
            newsList: {
                type: Array,
                default: () => []
            },

            specs: {
                type: Object,
                default: () => ({}),
            },

            title: {
                type: String,
                default: ''
            },

            projectSlug: {
                type: String,
                default: 'all'
            },

            withImage: {
                type: Boolean,
                default: false
            },
        },

        data() {
            return {
                projectValue: 'all',
                isLoaded: false,
                slider: null
            };
        },

        computed: {
            newsListToShow() {
                return this.breakpoint === 'sm' ? this.newsList.slice(0, 2) : this.newsList.slice(0, 3);
            },

            options() {
                return this.specs?.projects?.news_projects?.length ? [{value: 'all', label: 'всем проектам'}, ...this.specs?.projects?.news_projects] : [];
            },

            listKey() {
                const length = this.newsList?.length;
                if (!length) {
                    return 0;
                }

                return length + this.newsList[0]?.id + this.newsList[length - 1]?.id;
            }
        },

        watch: {
            newsListToShow() {
                this.updateSlider();
            }
        },

        mounted() {
            addResizeListener(this.$refs.slider, this.updateSlider);
            this.projectValue = this.projectSlug;
            this.isLoaded = true;
        },

        beforeDestroy() {
            removeResizeListener(this.$refs.slider, this.updateSlider);
            this.slider?.destroy();
        },

        methods: {
            handleInput(val) {
                this.projectValue = val;
                this.$emit('change', val === 'all' ? '' : this.projectValue);
            },

            initSlider() {
                if (this.$refs.slider) {
                    const options = {
                        speed: 1000,
                        spaceBetween: 16,
                        breakpoints: {
                            1280: {
                                allowTouchMove: false,
                                slidesPerView: 3,
                            },

                            768: {
                                allowTouchMove: false,
                                slidesPerView: 2
                            },

                            320: {
                                allowTouchMove: true,
                                slidesPerView: 1.063,
                                spaceBetween: 12,
                            }
                        },

                        pagination: {
                            el: '.swiper-pagination',
                            type: 'bullets',
                            clickable: true,
                        },
                    };

                    this.slider = new this.$Swiper(this.$refs.slider, options);
                }
            },

            updateSlider() {
                this.slider?.destroy();
                this.$nextTick(() => {
                    this.initSlider();
                });
            },
        }
    };
</script>

<style lang='scss' module>
    .NewsBlock {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 6.4rem 2.4rem;

        @include respond-to(xs) {
            padding: 4rem 0 2.4rem;
        }

        &._with-image {
            .newsListWrap {
                height: unset;

                @include respond-to(sm) {
                    height: 30rem;
                }

                @include respond-to(xs) {
                    height: 19.6rem;
                }
            }
        }
    }

    .newsTitle {
        margin-bottom: 6.4rem;
        text-transform: uppercase;

        @include respond-to(xs) {
            align-self: self-start;
            margin-bottom: 2.4rem;
            padding: 0 1.6rem;
            font-size: 2rem;
            line-height: 2.4rem;
        }

        ._adaptive {
            @include respond-to(xs) {
                display: none;
            }
        }
    }

    .newsList {
        width: 100%;
        margin-bottom: 6.4rem;

        @include respond-to(sm) {
            margin-bottom: 2.4rem;
        }

        &:global(.swiper) {
            @include respond-to(xs) {
                padding: 0 1.6rem;
            }
        }

        .newsListWrap {
            height: 30rem;

            @include respond-to(xs) {
                height: 19.6rem;
            }
        }

        .newsItem {
            height: auto;
        }

        .sliderPagination {
            position: static;
            display: none;
            padding: 2.4rem 0 0;

            @include respond-to(xs) {
                display: block;
            }

            :global(.swiper-pagination-bullet) {
                width: 6px;
                height: 6px;
                background-color: $base-400;
            }

            :global(.swiper-pagination-bullet-active) {
                background-color: #000;
            }
        }
    }

    .newsBtn {
        @include respond-to(sm) {
            width: 100%;
        }

        @include respond-to(xs) {
            width: calc(100% - 3.2rem);
            margin: 0 auto;
        }
    }
</style>
