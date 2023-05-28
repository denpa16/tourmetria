<template>
    <li :class="$style.RealtyProjectCard"
        @click="handleClick">
        <div :class="$style.tag">
            <VTag color="white">
                Сдача {{ completionDate }}
            </VTag>
        </div>
        <div :class="[$style.colTitle, {[$style._building]: activeStage === 'buildings'}]">
            <div v-if="activeStage === 'projects'"
                 :class="$style.imageWrapper">
                <ImageLazy :image="item.project_card_image"
                />
            </div>
            <div :class="$style.title">
                <p v-if="activeStage === 'projects'"
                   class="c-base600">
                    {{ item.name }}
                </p>

                <p v-else-if="activeStage === 'buildings'"
                   class="c-base600">
                    КОРПУС {{ item.number }}
                </p>

                <p v-if="minPrice"
                   class="c-blue">
                    от {{ minPrice }} Р
                </p>
            </div>
        </div>

        <div :class="$style.colInfo">
            <div v-if="minArea"
                 :class="[$style.item, {[$style._building]: activeStage === 'buildings'}]">
                <p :class="[$style.itemLabel, 'p5', 'c-base300']">
                    Площадь
                </p>
                <p class="p3 c-base600">
                    от {{ minArea }} м<sup>2</sup>
                </p>
            </div>
            <div :class="[$style.item, $style.itemCompletion, {[$style._building]: activeStage === 'buildings'}]">
                <p :class="[$style.itemLabel, 'p5', 'c-base300']">
                    Сдача
                </p>
                <p class="p3 c-base600">
                    {{ completionDate }}
                </p>
            </div>

            <!--            Временно скрыла-->
            <!--            <div :class="[$style.item, {[$style._building]: activeStage === 'buildings'}]">-->
            <!--                <p :class="[$style.itemLabel, 'p5', 'c-base300']">-->
            <!--                    {{ $deviceIs.tablet || $deviceIs.mobile ? 'Свободно' : realtyType === 'parking' ? 'Машино - мест' : 'Кладовых' }}-->
            <!--                </p>-->
            <!--                <p v-if="realtyType === 'parking' && item.parking_count"-->
            <!--                   class="p3 c-base600">-->
            <!--                    {{ item.parking_count }}-->
            <!--                    <span v-show="$deviceIs.tablet || $deviceIs.mobile">{{ item.parking_count | plural(['машино-место', 'машино-места', 'машино-мест']) }}</span>-->
            <!--                </p>-->
            <!--                <p v-else-if="realtyType === 'storage' && item.storage_count"-->
            <!--                   class="p3 c-base600">-->
            <!--                    {{ item.storage_count }}-->
            <!--                    <span v-show="$deviceIs.tablet || $deviceIs.mobile">{{ item.storage_count | plural(['кладовая', 'кладовые', 'кладовых']) }}</span>-->
            <!--                </p>-->
            <!--            </div>-->
            <div v-if="minMortgage"
                 :class="[$style.item, $style.itemMortgage, {[$style._building]: activeStage === 'buildings'}]">
                <p :class="[$style.itemLabel, 'p5', 'c-base300']">
                    В ипотеку
                </p>
                <p class="p3 c-base600">
                    от {{ minMortgage }} <span :class="$style.rub">₽</span>/мес
                </p>
            </div>
            <VSquareButton size="xsmall"
                           :class="$style.btn"
                           role="presentation"
                           tabindex="-1">
                <IconArrowRight :class="$style.btnIcon" />
            </VSquareButton>
        </div>

    </li>
</template>

<script>
    import {quaterToRoman, splitThousands, changeSeparatorToComma} from '~/assets/js/utils/numberUtils';
    import ImageLazy from '~/components/common/ImageLazy';
    import IconArrowRight from '~/components/icons/IconArrowRight';

    export default {
        name: 'RealtyProjectCard',

        components: {
            IconArrowRight,
            ImageLazy,
        },

        props: {
            item: {
                type: Object,
                default: () => ({}),
            },

            realtyType: {
                type: String,
                default: 'parking',
            },

            activeStage: {
                type: String,
                default: 'projects'
            }
        },

        computed: {
            completionDate() {
                if (!this.item.completion_year && !this.item.deadline_year) {
                    return;
                }
                if (this.activeStage === 'buildings') {
                    return this.item.completion_quarter ? `${quaterToRoman(this.item.completion_quarter)} квартал ${this.item.completion_year}` : this.item.completion_year;
                }
                return this.item.deadline_quarter ? `${quaterToRoman(this.item.deadline_quarter)} квартал ${this.item.deadline_year}` : this.item.deadline_year;
            },

            minPrice() {
                return splitThousands(this.item?.parking_min_price) || splitThousands(this.item?.storage_min_price) || splitThousands(this.item?.commercial_min_price) || splitThousands(this.item?.hotelroom_min_price) || 0;
            },

            minArea() {
                return changeSeparatorToComma(this.item?.parking_min_area) || changeSeparatorToComma(this.item?.storage_min_area) || changeSeparatorToComma(this.item?.commercial_min_area) || changeSeparatorToComma(this.item?.hotelroom_min_area) || 0;
            },

            minMortgage() {
                return this.realtyType === 'parking' && this.item.min_mortgage_parking
                    ? splitThousands(this.item.min_mortgage_parking)
                    : this.realtyType === 'storage' && this.item.min_mortgage_storage ? splitThousands(this.item.min_mortgage_storage) : '';
            },

            url() {
                return this.item?.parking_old_website_link || this.item?.storage_old_website_link || this.item?.commercial_old_website_link || this.item?.hotelroom_old_website_link || 'https://old.neometria.ru/projects/';
            },
        },

        methods: {
            handleClick() {
                // временно закомментировала, так как сейчас при клике по карточке проекта редиректим на старый сайт
                // this.$emit('click', this.activeStage === 'projects' ? {project: this.item.slug} : {building: this.item.id});
                this.$emit('click', this.url);
            }
        }
    };
</script>

<style lang="scss" module>
    .RealtyProjectCard {
        position: relative;
        display: flex;
        justify-content: space-between;
        min-height: 10.8rem;
        padding: 2.6rem 2.4rem;
        border-radius: .8rem;
        border: 1px solid $base-50;
        background-color: $base-50;
        transition: all $default-color-transition;
        cursor: pointer;

        @include hover {
            border-color: $blue;
            transform: scale(.995);
        }

        @include respond-to(sm) {
            flex-direction: column;
            padding: 2.4rem;
        }

        @include respond-to(xs) {
            padding: 1.6rem 1.6rem 4rem;
        }
    }

    .tag {
        position: absolute;
        top: 2.4rem;
        right: 2.4rem;
        display: none;

        @include respond-to(sm) {
            display: block;
        }

        @include respond-to(xs) {
            top: unset;
            right: unset;
            bottom: 1.6rem;
            left: 1.6rem;
        }
    }

    .colTitle {
        display: flex;
        width: 40rem;

        @include respond-to(sm) {
            align-items: center;
            width: unset;
            margin-bottom: 2.4rem;
        }

        &._building {
            margin-right: 12rem;
        }
    }

    .imageWrapper {
        position: relative;
        overflow: hidden;
        -webkit-mask-image: -webkit-radial-gradient(white, black);
        width: 5.6rem;
        height: 5.6rem;
        margin-right: 2.4rem;
        border-radius: .8rem;

        @include respond-to(xs) {
            width: 4.8rem;
            height: 4.8rem;
        }
    }

    .title {
        text-transform: uppercase;
        font-size: 2rem;
        font-weight: 600;
        line-height: 2.8rem;

        @include respond-to(sm) {
            font-size: 1.6rem;
            line-height: 1.9rem;
        }
    }

    .colInfo {
        position: relative;
        display: flex;
        // justify-content: flex-end;
        flex: 1;
        padding-right: 4.2rem;

        @include respond-to(sm) {
            justify-content: flex-start;
        }

        @include respond-to(xs) {
            padding-bottom: 2.4rem;
        }
    }

    .item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-width: 22.4rem;

        &._building {
            flex: 1;
        }

        @include respond-to(sm) {
            min-width: 18.8rem;

            &.itemCompletion {
                display: none;
            }
        }

        @include respond-to(xs) {
            min-width: 14.8rem;

            &.itemMortgage {
                display: none;
            }
        }
    }

    .itemLabel {
        @include respond-to(sm) {
            margin-bottom: .4rem;
        }
    }

    .rub {
        font-family: $accent-font-family;
    }

    .btn {
        position: absolute;
        top: 50%;
        right: 1.8rem;
        transform: translateY(-50%);

        @include respond-to(sm) {
            top: unset;
            right: 0;
            bottom: 0;
            transform: unset;
        }

        @include respond-to(xs) {
            top: 100%;
        }
    }

    .btnIcon {
        width: 1.2rem;
        height: 1.2rem;
    }
</style>
