<template>
    <section :class="$style.PromotionPage">
        <div :class="[$style.promotionContainer, 'container']">
            <button
                :class="$style.backButton"
                value="Назад к акциям"
                @click="goToPromotionListPage"
            >
                <IconArrowBig :class="$style.iconArrow" />
                <span class="p6">Назад к акциям</span>
            </button>
            <div :class="$style.promotionContent">
                <div :class="$style.promotionTags">
                    <VTag
                        color="light"
                        label="Акция"
                    />
                    <VTag
                        v-if="projectNames.length === 1"
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
                        :class="$style.pubDate"
                        color="white"
                        :label="promotion.pub_date"
                    />
                </div>
                <div
                    :class="[$style.promotionTitle, 'h3']"
                    v-html="promotion.title"
                >
                </div>
                <div
                    :class="[$style.promotionDescription, 'p3', 'c-base300']"
                    v-html="promotion.description"
                ></div>
                <div :class="$style.buttonsWrapper">
                    <VButton
                        :class="$style.button"
                        color="primary"
                        :link="btnLink"
                    >
                        {{ btnText }}
                    </VButton>
                    <VButton
                        v-if="promotion.brochure_pdf"
                        :class="$style.button"
                        color="light"
                        :link="downloadLink"
                    >
                        Скачать брошюру
                    </VButton>
                </div>
                <ImageLazy
                    :class="$style.promotionImage"
                    :image="promotion.main_image_display"
                    :preview="promotion.main_image_preview"
                    relative
                />
            </div>
        </div>
        <PromotionsBlock
            :promo-list="extraPromotions"
            title="Смотрите также"
        />
    </section>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {objectToQuery} from '~/assets/js/utils/queryUtils';
    import {getPropertyLabel} from '~/assets/js/utils/commonUtils';

    import IconArrowBig from '~/components/icons/IconArrowBig';
    import ImageLazy from '~/components/common/ImageLazy';
    import PromotionsBlock from '~/components/common/promotions/PromotionsBlock';


    export default {
        name: 'PromotionPage',
        components: {PromotionsBlock,
                     IconArrowBig,
                     ImageLazy},

        scrollToTop: true,
        props: {},
        async asyncData({app, params}) {
            try {
                const [promotion, extraPromotions]= await Promise.all([
                    app.$axios.$get(app.$api.publications.publication(params.id)),
                    app.$axios.$get(app.$api.publications.extra_promos(params.id))
                ]);

                return {
                    promotion,
                    extraPromotions
                };
            } catch (error) {
                console.warn('[Promotion page/asyncData] request failed: ', error);
            }
        },

        data() {
            return {
                promotion: {},
                extraPromotions: [],
            };
        },

        head() {
            return {
                title: 'Акции федерального девелопера Неометрия',
                meta: [{
                    hid: 'description',
                    name: 'description',
                    content: 'Акции строительной компании Неометрия . Актуальная информация о строящихся ЖК города ',
                }],
            };
        },

        computed: {
            ...mapGetters({
                storageLink: 'getStorageLink',
            }),

            projectNames() {
                return this.promotion.projects?.map(project => project.name);
            },

            propertyTypes() {
                return this.promotion?.property_types || [];
            },

            hrefToFlatsSelection() {
                return `/selection/flats?${objectToQuery({
                        project: this.promotion.projects?.map(project => project.slug).join(','),
                        publications: this.promotion.id,
                        has_promotions: true
                    })}`;
            },

            downloadLink() {
                return '/storage' + this.promotion.brochure_pdf?.split(this.storageLink)[1];
            },

            mainProperty() {
                if (this.propertyTypes.length === 0 || (this.propertyTypes.length > 1 && this.propertyTypes.includes('flat'))) {
                    return 'flat';
                }

                return this.propertyTypes[0];
            },

            btnLink() {
                if (this.mainProperty === 'flat') {
                    return this.hrefToFlatsSelection;
                }

                if (this.mainProperty === 'hotelroom') {
                    return '/selection/hotel';
                }

                return `/selection/${this.mainProperty}`;
            },

            btnText() {
                if (this.mainProperty === 'flat') {
                    return 'Выбрать квартиру';
                }

                return `Выбрать ${getPropertyLabel(this.mainProperty).toLowerCase()}`;
            }
        },

        methods: {
            goToPromotionListPage() {
                this.$router.push({path: '/blog/promotions'});
            },
        },
    };
</script>

<style lang="scss" module>
    .PromotionPage {
        position: relative;
        display: flex;
        flex-direction: column;

        @include respond-to(sm) {
            background-color: $base-50;
        }

        :global(.promotions-block) {
            width: 100%;
            background-color: $base-0;

            h3 {
                @include respond-to(xs) {
                    align-self: center;
                }
            }
        }
    }

    .pubDate {
        border: 1px solid $base-100;
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

    .promotionContainer {
        position: relative;
        width: 100%;
    }

    .promotionContent {
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

    .promotionTags {
        display: flex;
        margin-bottom: 2.4rem;

        @include respond-to(sm) {
            order: 2;
            margin-bottom: 1.6rem;
        }

        & > *:not(:last-child) {
            margin-right: .4rem;
        }
    }

    .promotionTitle {
        margin-bottom: 2.4rem;

        @include respond-to(sm) {
            order: 1;
            margin-bottom: 1.6rem;
            font-size: 2rem;
            line-height: 2.4rem;
        }
    }

    .promotionDescription {
        margin-bottom: 2.4rem;

        @include respond-to(sm) {
            order: 4;
            margin-bottom: 1.6rem;
        }

        @include reset-text-styles;
    }

    .buttonsWrapper {
        display: flex;
        margin-bottom: 7.8rem;

        @include respond-to(sm) {
            order: 5;
            width: 100%;
            margin-bottom: 2rem;
        }

        @include respond-to(sm) {
            margin-bottom: .8rem;
        }

        .button {
            @include respond-to(sm) {
                flex: auto;
            }
        }
    }

    .button {
        margin-right: .8rem;

        &:last-child {
            margin-right: 0;
        }
    }

    .promotionImage {
        &:global(.image-lazy) {
            grid-area: image;
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
