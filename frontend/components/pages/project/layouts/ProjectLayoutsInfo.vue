<template>
    <div :class="$style.ProjectLayoutsInfo">
        <div :class="$style.tags">
            <VTag v-if="layout.days_before_start_sales"
                  :class="$style.tag">
                До старта продаж {{ layout.days_before_start_sales }} {{ layout.days_before_start_sales | plural(['день', 'дня', 'дней']) }}
            </VTag>
            <VTag v-if="layout.promotion"
                  color="light"
                  :class="$style.tag">
                Акция
            </VTag>
        </div>

        <div v-if="layout.type"
             :class="[$style.type, 'p6', 'c-base300']">
            Тип: {{ layout.type }}
        </div>

        <transition name="fade-content"
                    mode="out-in">
            <div :key="activeIndex"
                 :class="$style.image"
                 :style="{backgroundImage: `url(${layout.plan_full})`}"></div>
        </transition>

        <div :class="$style.bottom">
            <div :class="$style.info">
                <div :class="$style.infoItem">
                    <p :class="$style.label">
                        Площадь
                    </p>
                    <p :class="$style.value">
                        <span v-if="layout.min_area">{{ layout.min_area }}</span>
                        <span v-if="layout.min_area && layout.max_area && layout.min_area !== layout.max_area"> - </span>
                        <span v-if="layout.max_area && layout.min_area !== layout.max_area">{{ layout.max_area }}</span>
                        м<sup>2</sup>
                    </p>
                </div>

                <div :class="$style.infoItem">
                    <p :class="$style.label">
                        Ипотека
                    </p>
                    <p :class="$style.value">
                        от {{ layout.min_mortgage | splitThousands }} Р/мес
                    </p>
                </div>

                <div :class="$style.infoItem">
                    <p :class="$style.label">
                        Стоимость
                    </p>
                    <p :class="$style.value">
                        от {{ layout.min_price | splitThousands }} Р
                    </p>
                </div>
            </div>

            <div :class="$style.navigation">
                <SliderNavigation color="gray"
                                  :next-disabled="activeIndex >= totalCount - 1"
                                  :prev-disabled="activeIndex === 0"
                                  @prev-click="$emit('prev-click')"
                                  @next-click="$emit('next-click')" />

                <VButton @click="$emit('open-url', layout.id)">
                    Показать {{ layout.flat_count }} {{ layout.flat_count | plural(['квартиру', 'квартиры', 'квартир']) }} <span v-show="($deviceIs.laptop || $deviceIs.desktop)">этого типа</span>
                </VButton>

                <SliderNavigation color="gray"
                                  :class="$style.slidesCount">
                    <template #left>
                        <span class="p5 c-base300">{{ activeIndex + 1 }}</span>
                    </template>
                    <template #right>
                        <span class="p5 c-base300">{{ totalCount }}</span>
                    </template>
                </SliderNavigation>
            </div>
        </div>
    </div>
</template>

<script>
    import SliderNavigation from '~/components/common/SliderNavigation';

    export default {
        name: 'ProjectLayoutsInfo',

        components: {
            SliderNavigation,
        },

        props: {
            layout: {
                type: Object,
                default: () => ({}),
            },

            totalCount: {
                type: Number,
                default: 0,
            },

            activeIndex: {
                type: Number,
                default: 0,
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectLayoutsInfo {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 6rem 4.4rem 4.4rem;

        @include respond-to(sm) {
            padding: 8.4rem 1.6rem 2.4rem;
        }
    }

    .tags {
        position: absolute;
        top: 3rem;
        left: 4.4rem;
        display: flex;
        flex-wrap: wrap;
        max-width: 50%;

        @include respond-to(sm) {
            top: 2rem;
            left: 1.6rem;
        }
    }

    .tag {
        margin-bottom: .4rem;

        &:not(:last-child) {
            margin-right: .4rem;
        }
    }

    .image {
        width: 69.8rem;
        height: 44.6rem;
        margin: 0 auto;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;

        @include respond-to(sm) {
            width: 48.2rem;
            height: 30.8rem;
        }
    }

    .type {
        position: absolute;
        top: 3.2rem;
        right: 4.4rem;

        @include respond-to(sm) {
            top: 2.4rem;
            right: 1.6rem;
        }
    }

    .bottom {
        margin-top: auto;

        @include respond-to(sm) {
            margin-top: 2rem;
        }
    }

    .info {
        display: flex;
        justify-content: space-between;
        padding: 2.7rem 1.4rem;

        @include respond-to(sm) {
            padding: 2.4rem 5.2rem;
        }
    }

    .infoItem {
        display: flex;
        font-size: 1.4rem;
        font-weight: 500;
        line-height: 1.6rem;

        @include respond-to(sm) {
            font-size: 1.2rem;
        }
    }

    .label {
        margin-right: 1.9rem;
        color: $base-300;
    }

    .value {
        color: $base-600;
    }

    .navigation {
        display: flex;
        justify-content: space-between;
    }

    .slidesCount {
        pointer-events: none;
    }
</style>
