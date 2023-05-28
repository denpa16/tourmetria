<template>
    <div :class="[$style.ProjectLayoutsMobileCard, {[$style._active]: isActive}]">
        <div :class="$style.shortInfo"
             @click="handleClick">
            <div :class="[$style.plan, $style._small]"
                 :style="{backgroundImage: `url(${layout.plan_full})`}"></div>
            <div>
                <p :class="$style.title">
                    <span>{{ title }}</span><span>, от {{ layout.min_area || layout.max_area }} м<sup>2</sup></span>
                </p>
                <p :class="$style.price">
                    от {{ layout.min_price | splitShort }} млн Р
                </p>
            </div>
            <VSquareButton size="xsmall"
                           aria-label="Показать или скрыть полную информацию"
                           :class="$style.squareBtn">
                <transition name="fade-content"
                            mode="out-in">
                    <IconArrowRight v-if="!isActive"
                                    :class="$style.icon" />
                    <IconPlus v-else
                              :class="$style.plusIcon" />
                </transition>
            </VSquareButton>
        </div>

        <transition name="dropdown-bottom">
            <div v-show="isActive"
                 :class="$style.fullInfo">
                <TagsList :tags="tags"
                          :class="$style.tags" />

                <div :class="[$style.plan, $style._large]"
                     :style="{backgroundImage: `url(${layout.plan_full})`}"></div>

                <div :class="$style.info">
                    <div :class="$style.row">
                        <div class="p5 c-base300">
                            Площадь
                        </div>
                        <div :class="$style.line"></div>
                        <p class="p5">
                            <span v-if="layout.min_area">{{ layout.min_area }}</span>
                            <span v-if="layout.min_area && layout.max_area && layout.min_area !== layout.max_area"> - </span>
                            <span v-if="layout.max_area && layout.min_area !== layout.max_area">{{ layout.max_area }}</span>
                            м<sup>2</sup>
                        </p>
                    </div>
                    <div :class="$style.row">
                        <div class="p5 c-base300">
                            Ипотека
                        </div>
                        <div :class="$style.line"></div>
                        <p class="p5">
                            от {{ layout.min_mortgage | splitThousands }} <span :class="$style.rub">₽</span>/мес
                        </p>
                    </div>
                    <div v-if="layout.type"
                         :class="$style.row">
                        <div class="p5 c-base300">
                            Тип
                        </div>
                        <div :class="$style.line"></div>
                        <p class="p5">
                            {{ layout.type }}
                        </p>
                    </div>
                </div>

                <VButton :class="$style.btn"
                         @click="$emit('open-url', layout.id)">
                    Показать {{ layout.flat_count }} {{ layout.flat_count | plural(['квартиру', 'квартиры', 'квартир']) }} этого
                    типа
                </VButton>

            </div>
        </transition>
    </div>
</template>

<script>
    import TagsList from '~/components/common/TagsList';
    import {getFlatTitle} from '~/assets/js/utils/numberUtils';
    import {plural} from '~/assets/js/utils/textUtils';
    import IconArrowRight from '~/components/icons/IconArrowRight';
    import IconPlus from '~/components/icons/IconPlus';

    export default {
        name: 'ProjectLayoutsMobileCard',

        components: {
            IconPlus,
            IconArrowRight,
            TagsList,
        },

        props: {
            layout: {
                type: Object,
                default: () => ({}),
            },
        },

        data() {
            return {
                shownTagsCount: 2,
                isActive: false,
            };
        },

        computed: {
            title() {
                return String(getFlatTitle(this.layout.rooms).short);
            },

            tags() {
                const tags = [];
                if (this.layout.days_before_start_sales) {
                    tags.push({label: `До старта продаж ${this.layout.days_before_start_sales} ${plural(this.layout.days_before_start_sales, ['день', 'дня', 'дней'])}`, color: 'primary'});
                }

                if (this.layout.original_price && this.layout.price && this.layout.original_price !== this.layout.price) {
                    tags.push({label: 'Акция', color: 'light'});
                }

                return tags;
            },
        },

        methods: {
            handleClick() {
                this.isActive = !this.isActive;
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectLayoutsMobileCard {
        padding: 1.3rem 1.6rem 0;
        border-radius: .8rem;
        background-color: $base-0;
        cursor: pointer;

        &._active {
            .plan {
                &._small {
                    opacity: .4;
                }
            }
        }
    }

    .shortInfo {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        padding-bottom: 1.3rem;
    }

    .plan {
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        transition: opacity $default-color-transition;

        &._small {
            width: 6.3rem;
            height: 5.8rem;
            margin-right: 1.6rem;
        }

        &._large {
            width: 31.1rem;
            height: 24.2rem;
            margin: 0 auto;
        }
    }

    .title {
        text-transform: uppercase;
        font-size: 1.4rem;
        font-weight: 600;
        line-height: 1.4rem;
    }

    .price {
        margin-top: .8rem;
        font-size: 1.4rem;
        font-weight: 600;
        line-height: 1.6rem;
        color: $blue;
    }

    .squareBtn {
        position: absolute;
        right: 0;
    }

    .icon {
        width: 1.2rem;
        height: 1.2rem;
        transform: rotate(90deg);
    }

    .plusIcon {
        width: 1.6rem;
        height: 1.6rem;
        transform: rotate(45deg);
    }

    .fullInfo {
        padding-top: 1.6rem;
        padding-bottom: 2.4rem;
        border-top: 1px solid $base-100;
    }

    .tags {
        margin-bottom: 1.6rem;
    }

    .info {
        margin-top: 1.6rem;
    }

    .row {
        display: flex;

        &:not(:last-child) {
            margin-bottom: .8rem;
        }
    }

    .line {
        flex: 1;
        margin-bottom: .4rem;
        border-bottom: 1px dashed $base-100;
    }

    .rub {
        font-family: 'Noto Sans', sans-serif;
    }

    .btn {
        width: 100%;
        margin-top: 2.4rem;
    }

</style>
