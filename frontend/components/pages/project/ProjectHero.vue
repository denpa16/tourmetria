<template>
    <HeroBlock
        :slides="slides"
        :tags="tags"
        :slider-navigation-attrs="{ color: $deviceIs.desktop ? 'light' : 'transparent' }"
        :custom-height-reduction="customHeightReduction"
        :class="$style.ProjectHero"
    >
        <template #rightBottomPlank>
            <VButton
                v-if="brochure"
                :class="$style.brochureBtn"
                :color="$deviceIs.desktop ? 'light' : 'transparent'"
                :href="brochure"
                blank
            >
                Скачать презентацию
            </VButton>
            <VSquareButton :class="$style.squareBtn"
                           color="white"
                           aria-label="Прокрутить начальный экран"
                           @click="$emit('scroll-to', 'about')"
            >
                <IconMouse :class="$style.squareBtnIcon" />
            </VSquareButton>
        </template>

        <template v-if="promo && promo.promo_card_short_text"
                  #rightTopPlank>
            <article :class="$style.promotion">
                <div :class="$style.promotionHeader">
                    <div :class="[$style.iconWrapper, $style._lightning]">
                        <IconLightning :class="$style.lightningIcon" />
                    </div>
                    <h3 :class="[$style.promotionTitle, 'h6']">
                        Акция
                    </h3>
                    <VSquareButton size="xsmall"
                                   :class="$style.promotionLinkBtn"
                                   :link="promoLink"
                                   aria-label="Перейти к акции">
                        <IconArrowRight :class="$style.iconArrowRight" />
                    </VSquareButton>
                </div>
                <p :class="[$style.promotionText, 'p6']"
                   v-html="promoTitle">
                </p>
                <span class="p6 c-base300">
                    {{ `до ${new Date(promo.promo_end_date).toLocaleDateString('ru-RU')}` }}
                </span>

                <nuxt-link :class="$style.promotionLink"
                           :to="promoLink" />
            </article>
        </template>

        <template #btns>
            <div :class="$style.btns">
                <VButton :class="[$style.btn, $style._main]"
                         color="transparent"
                         link="/"
                >
                    Подробнее
                </VButton>
                <VButton v-if="promo && promoTitle"
                         :class="[$style.btn, $style._secondary]"
                         color="primary"
                         :link="promoLink"
                >
                    <span :class="$style.btnInner">
                        <IconDoor :class="[$style.btnIcon, $style._left]" />
                        <span :class="$style.btnInnerText">{{ promoTitle }}</span>
                        <IconArrowLeft :class="[$style.btnIcon, $style._right]" />
                    </span>
                </VButton>
            </div>
        </template>

        <template #customTag>
            <VTag :class="$style.tag"
                  color="transparent"
            >
                <span :class="$style.tagName">{{ city.name }}</span>
                <AnimationRow v-if="directionSigns.length"
                              :class="$style.metro"
                              :items="directionSigns">
                    <template #default="{item}">
                        <MetroInfo
                            :metro="item"
                            :class="$style.metroItem"
                            :icon-base-color="200"
                        />
                    </template>
                </AnimationRow>
            </VTag>
        </template>
    </HeroBlock>
</template>

<script>
    import HeroBlock from '~/components/common/hero/HeroBlock';
    import IconMouse from '~/components/icons/IconMouse';
    import IconLightning from '~/components/icons/IconLightning';
    import IconDoor from '~/components/icons/IconDoor';
    import IconArrowLeft from '~/components/icons/IconArrowLeft';
    import AnimationRow from '~/components/common/AnimationRow';
    import MetroInfo from '~/components/common/metro/MetroInfo';
    import IconArrowRight from '~/components/icons/IconArrowRight';

    export default {
        name: 'ProjectHero',

        components: {
            IconArrowRight,
            IconDoor,
            IconArrowLeft,
            IconLightning,
            HeroBlock,
            IconMouse,
            AnimationRow,
            MetroInfo,
        },

        props: {
            slides: {
                type: Array,
                default: () => []
            },

            city: {
                type: Object,
                default: () => ({})
            },

            directionSigns: {
                type: Array,
                default: () => [],
            },

            tags: {
                type: Array,
                default: () => []
            },

            customHeightReduction: {
                type: Number,
                default: 0,
            },

            brochure: {
                type: String,
                default: ''
            },

            promo: {
                type: Object,
                default: () => ({})
            },
        },

        computed: {
            promoTitle() {
                return `${this.promo?.promo_card_title_first} ${this.promo?.promo_card_title_second}`;
            },

            promoLink() {
                return this.promo?.id ? `/blog/promotions/${this.promo.id}` : '/';
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectHero {
        min-height: auto;
    }

    .squareBtn {
        &:global(.v-square-button) {
            @include respond-to(sm) {
                display: none;
            }
        }
    }

    .brochureBtn {
        @include respond-to(xs) {
            display: none;
        }
    }

    .squareBtnIcon {
        width: 1.6rem;
        height: 1.6rem;
    }

    .promotion {
        position: relative;
        display: block;
        width: 30.9rem;
        padding: 1.2rem;
        border-radius: .8rem;
        background-color: $base-0;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
        opacity: 1;
        transform: translateY(0);
        transition: all $default-transition;
        cursor: pointer;

        @include hover {
            opacity: .9;
            transform: translateY(-.2rem);
        }

        @include respond-to(sm) {
            width: 23rem;
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .promotionHeader {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        margin-bottom: 1.6rem;
    }

    .iconWrapper {
        display: flex;
        align-items: center;
        justify-content: center;

        &._lightning {
            width: 4rem;
            height: 4rem;
            border-radius: 50%;
            background-color: $base-50;
        }

        &._plus {
            width: 2.4rem;
            height: 2.4rem;
            border-radius: .4rem;
            background-color: $blue;
        }
    }

    .promotionLinkBtn {
        position: relative;
        z-index: 2;
    }

    .promotionLink {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .lightningIcon {
        width: 1.2rem;
        height: 1.6rem;
        color: $blue;
    }

    .iconArrowRight {
        width: 1.2rem;
        height: 1.2rem;
        color: $base-0;
    }

    .promotionTitle {
        margin-right: auto;
        margin-left: 1.6rem;
        text-transform: uppercase;
        font-weight: 600;
        line-height: 1.2;
    }

    .promotionText {
        margin-bottom: .8rem;
    }

    .btns {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .btn {
        display: none;
        width: 100%;

        @include respond-to(xs) {
            display: inline-flex;
            margin-bottom: .8rem;

            &:last-child {
                margin-bottom: 0;
            }
        }

        &._main {
            border: none;
            transition: opacity $default-transition;

            @include hover {
                opacity: .8;
            }
        }

        &._secondary {
            &:global(.v-button) {
                overflow: hidden;
                white-space: normal;
            }
        }

        & :global(.v-button__text) {
            display: flex;
        }
    }

    .btnIcon {
        width: 1.6rem;
        min-width: 1.6rem;
        height: 1.6rem;

        &._left {
            width: 1.7rem;
            margin-right: .8rem;
        }

        &._right {
            margin-left: .8rem;
            transform: rotate(180deg);
        }
    }

    .btnInner {
        display: inline-flex;
        align-items: center;
    }

    .btnInnerText {
        overflow: hidden;
        /* stylelint-disable */
        display: -webkit-box;
        /* stylelint-enable */
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
    }

    .tag {
        @include respond-to(sm) {
            display: none;
        }

        @include respond-to(xs) {
            display: inline-flex;
        }
    }

    .tagName {
        margin-right: .8rem;
    }

    .metro {
        display: inline-block;
        height: 1.6rem;

        @include respond-to(sm) {
            margin-left: 0;
        }
    }

    .metroItem {
        height: 1.6rem;
    }
</style>
