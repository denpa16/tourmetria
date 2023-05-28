<template>
    <nuxt-link :to="href">
        <article :class="[$style.PromotionCard, {[$style.mobileImages]: mobileImages}]">
            <div :class="$style.promotionNameplates">
                <VTag
                    color="white"
                    label="Акция"
                />
                <VTag
                    v-if="projectList.length === 1"
                    color="primary"
                    :label="projectList[0].name"
                />
                <VTooltip
                    v-else
                    top
                    :nudge="12"
                >
                    <template #activator>
                        <VTag
                            color="primary"
                            :label="`${projectLabel} +${projectList.length - 1}`"
                        />
                    </template>
                    <div :class="$style.tooltip">
                        <VTag v-for="(project, index) in projectList.slice(1)"
                              :key="index"
                              :class="$style.tag"
                              :label="project.name"
                              color="light"
                        />
                    </div>
                </VTooltip>
                <VTag
                    v-if="promotion && promotion.pub_date"
                    color="transparent"
                    :label="promotion.pub_date.replace('Ещё', 'Осталось')"
                />
            </div>
            <div :class="$style.promotionImages">
                <div :class="$style.promotionImageWrap1">
                    <ImageLazy
                        :class="$style.promotionImage1"
                        :image="promotion.promo_card_first_image_display"
                        :preview="promotion.promo_card_first_image_preview"
                    />
                </div>
                <div :class="$style.promotionImageWrap2">
                    <ImageLazy
                        :class="$style.promotionImage2"
                        :image="promotion.promo_card_second_image_display"
                        :preview="promotion.promo_card_second_image_preview"
                    />
                </div>
            </div>
            <div :class="$style.promotionText">
                <h4 :class="[$style.promotionTitle, 'h4']">
                    <span class="c-blue">
                        {{ promotion.promo_card_title_first }}
                    </span><br>
                    {{ promotion.promo_card_title_second }}
                </h4>
                <p
                    :class="[$style.promotionDescription, 'p6']"
                    v-html="promotion.promo_card_short_text"
                >
                </p>
            </div>
            <p :class="$style.promotionDetails">
                Подробнее
            </p>
        </article>
    </nuxt-link>
</template>

<script>
    import ImageLazy from '~/components/common/ImageLazy';
    import VTag from '~/components/ui/tag/VTag';
    export default {
        name: 'PromotionCard',
        components: {VTag,
                     ImageLazy},

        props: {
            promotion: {
                type: Object,
                default: () => ({})
            },

            mobileImages: {
                type: Boolean,
                default: false,
            },

            preferredProjectName: {
                type: String,
                default: '',
            },

            preferredProjectSlug: {
                type: [Array, String],
                default: '',
            },
        },

        data() {
            return {};
        },

        computed: {
            projectList() {
                if (!this.promotion?.projects?.length) {
                    return this.promotion?.projects;
                }

                const projects = JSON.parse(JSON.stringify(this.promotion?.projects));
                let firstProjectIndex = -1;

                if (this.preferredProjectName) {
                    firstProjectIndex = this.findProjectIndexByParams(projects, this.preferredProjectName, 'name');
                } else if (this.preferredProjectSlug?.length) {
                    firstProjectIndex = this.findProjectIndexByParams(projects, this.preferredProjectSlug, 'slug');
                }

                if (firstProjectIndex !== -1) {
                    const firstProject = projects.splice(firstProjectIndex, 1)[0];
                    return [firstProject, ...projects];
                }

                return projects;
            },

            projectLabel() {
                return this.projectList[0]?.name;
            },

            component() {
                if (this.href) {
                    return 'nuxt-link';
                }

                return 'article';
            },

            href() {
                return `/blog/promotions/${this.promotion.id}`;
            }
        },

        methods: {
            findProjectIndexByParams(projects, params, propertyName) {
                return projects.findIndex(project => {
                    if (!project) {
                        return false;
                    }

                    if (Array.isArray(params)) {
                        return params.find(param => project[propertyName] === param);
                    }

                    return project[propertyName] === params;
                });
            }
        },
    };
</script>

<style lang="scss" module>
    .PromotionCard {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        border-radius: .8rem;
        background-color: #000;
        cursor: pointer;

        &:hover {
            .promotionImageWrap1 {
                clip-path: polygon(0 0, 100% 5%, 100% 95%, 0% 100%);
                width: 37%;
            }

            .promotionImage1 {
                transform: scale(1.1);

                :global(.image-lazy__image) {
                    background-position: 80%;
                    transition: all $default-transition;
                }
            }

            .promotionImageWrap2 {
                clip-path: polygon(0 0, 100% 10%, 100% 90%, 0% 100%);
                width: 63%;
            }

            .promotionImage2 {
                transform: scale(1);
            }
        }

        &.mobileImages {
            .promotionImages {
                @include respond-to(sm) {
                    min-height: 30.2rem;
                }

                @include respond-to(xs) {
                    display: flex;
                }
            }
        }
    }

    .promotionNameplates {
        display: flex;
        flex-wrap: wrap;
        height: 5.6rem;
        margin-top: -.4rem;
        margin-left: -.4rem;
        padding: 1.6rem;

        & > * {
            margin-top: .4rem;
            margin-left: .4rem;
        }

        @include respond-to(xs) {
            height: fit-content;
            margin-bottom: 2.4rem;
            padding: 1.6rem 1.6rem 0;
        }
    }

    .promotionImages {
        display: flex;
        width: 100%;
        height: 100%;
        max-height: 36rem;

        @include respond-to(sm) {
            max-height: 30.2rem;
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .promotionImageWrap1 {
        width: 63%;
        clip-path: polygon(0 0, 100% 10%, 100% 90%, 0% 100%);
        transition: all $default-transition;

        .promotionImage1 {
            transform: scale(1);
            transition: all $default-transition;

            :global(.image-lazy__image) {
                transition: all $default-transition;
            }
        }
    }

    .promotionImageWrap2 {
        width: 37%;
        clip-path: polygon(0 0, 100% 5%, 100% 95%, 0% 100%);
        transition: all $default-transition;

        .promotionImage2 {
            transform: scale(1.2);
            transition: all $default-transition;
        }
    }

    .promotionText {
        margin-top: auto;
        padding: 1.6rem;

        @include respond-to(xs) {
            margin-top: 0;
            padding: 0 1.6rem;
        }
    }

    .promotionTitle {
        margin-bottom: 1.6rem;
        text-transform: uppercase;
        color: $base-0;

        @include respond-to(xs) {
            margin-bottom: .8rem;
            font-size: 1.6rem;
            line-height: 1.92rem;
        }
    }

    .promotionDescription {
        color: $white-48;

        @include respond-to(xs) {
            font-size: 1.2rem;
            line-height: 1.6rem;
        }
    }

    .promotionDetails {
        display: none;
        padding: .8rem 0 1.6rem 1.6rem;
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 1.6rem;
        color: $blue;

        @include respond-to(xs) {
            display: block;
            margin-top: auto;
            padding: 0 1.6rem 2rem 1.6rem;
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
