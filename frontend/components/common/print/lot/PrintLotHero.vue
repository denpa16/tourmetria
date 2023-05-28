<template>
    <div :class="$style.PrintLotHero">
        <div :class="$style.lotSchemaWrapper">
            <div :class="$style.compass">
                <PrintCompass :font-size="10"
                              :rotate-deg="lot.layout && lot.layout.compass_azimuth" />
            </div>

            <img :class="$style.lotSchemaImg"
                 :src="lot.layout && lot.layout.plan_full ? lot.layout.plan_full : '/images/flat/emptyPlan.svg'"
                 alt="Планировка объекта собственности">
            <p v-if="!lot.layout || !lot.layout.plan_full"
               :class="[$style.emptyText, 'h6', 'c-base300']">
                на данный момент <br> планировка отсутствует
            </p>
        </div>

        <div :class="$style.info">
            <img v-if="project.logo"
                 :class="$style.logo"
                 :src="project.logo"
                 alt="Логотип проекта">

            <h2 :class="$style.infoTitle">
                {{ flatTitle }}
            </h2>
            <ul :class="$style.specs">
                <li v-for="spec in specs"
                    :key="spec.label + spec.value"
                    :class="[$style.specItem, 'c-base400']">
                    <span>{{ spec.label }}</span>
                    <span>{{ spec.value }}</span>
                </li>
            </ul>

            <div v-if="price"
                 :class="[$style.infoBottom, $style.price]">
                <span :class="$style.infoBottomLabel">Стоимость</span>
                <span :class="[$style.infoBottomValue, 'c-blue']">
                    {{ price }}
                    <span :class="$style.infoBottomValueSymbol">
                        ₽
                    </span>
                </span>
            </div>

            <div v-if="mortgage"
                 :class="[$style.infoBottom, $style.mortgage]">
                <span :class="$style.infoBottomLabel">Ипотека</span>
                <span :class="[$style.infoBottomValue, 'c-blue']">
                    {{ mortgage }}
                    <span :class="$style.infoBottomValueSymbol">
                        ₽/МЕС
                    </span>
                </span>
                <div :class="$style.infoBottomValueAdditionalInfo">
                    <span v-if="$route.query.rate"
                          :class="$style.creditInfo">Ставка: от {{ $route.query.rate }}%</span>
                    <span :class="$style.creditInfo">Первый взнос: от 15%</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getFlatTitle, isDeadlinePassed, splitThousands} from '~/assets/js/utils/numberUtils';
    import PrintCompass from '~/components/common/print/PrintCompass';

    export default {
        name: 'PrintLotHero',
        components: {
            PrintCompass,
        },

        props: {
            lot: {
                type: Object,
                default: () => ({}),
            },

            project: {
                type: Object,
                default: () => ({}),
            },
        },

        computed: {
            flatTitle() {
                if (typeof this.lot?.rooms !== 'string' && typeof this.lot?.rooms !== 'number') {
                    return '';
                }

                return !this.lot.rooms ? getFlatTitle(this.lot.rooms).fullNumber : `${getFlatTitle(this.lot.rooms).fullNumber} квартира`;
            },

            price() {
                if (!this.lot?.price) {
                    return 0;
                }
                return `${splitThousands(Math.round(this.lot?.original_price || this.lot.price))}`;
            },

            mortgage() {
                if (!this.lot.min_mortgage) {
                    return 0;
                }
                return `от ${splitThousands(Math.ceil(this.lot.min_mortgage))}`;
            },

            deadlineText() {
                const quarter = this.lot?.completion_quarter;
                const year = this.lot?.completion_year;

                if (isDeadlinePassed(year, quarter)) {
                    return 'Cдан';
                }

                if (quarter && year) {
                    return `${quarter} кв. ${year}`;
                }

                if (year) {
                    return `${year} г`;
                }

                return '';
            },

            specs() {
                return [
                    {
                        label: 'Очередь',
                        value: this.lot?.phase_number || '-',
                    },
                    {
                        label: 'Литер',
                        value: this.lot?.building || '-',
                    },
                    {
                        label: 'Подъезд',
                        value: this.lot?.section || '-',
                    },
                    {
                        label: 'Срок сдачи',
                        value: this.deadlineText || '-',
                    },
                    {
                        label: 'Этаж',
                        value: this.lot?.floor || '-',
                    },
                    {
                        label: 'Общая',
                        value: this.lot?.area ? `${this.lot.area} м²` : '-',
                    },
                    {
                        label: 'Жилая',
                        value: this.lot?.living_area ? `${this.lot.living_area} м²` : '-',
                    },
                    {
                        label: 'Кухня',
                        value: this.lot?.kitchen_area ? `${this.lot.kitchen_area} м²` : '-',
                    },
                ];
            }
        }
    };
</script>

<style lang="scss" module>
    .PrintLotHero {
        position: relative;
        display: flex;
        justify-content: space-between;
    }

    .lotSchemaWrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 55%;
        height: 437px;
        margin-right: 40px;
        padding-top: 80px;
    }

    .compass {
        position: absolute;
        top: -16px;
        left: 7px;
        width: 70px;
        height: 70px;
    }

    .lotSchemaImg {
        object-fit: contain;
        width: 100%;
        height: 100%;
    }

    .emptyText {
        position: absolute;
        top: 0;
        right: 20px;
        text-align: right;
        text-transform: uppercase;
    }

    .info {
        flex: 1;
    }

    .logo {
        max-width: 100%;
        height: 62px;
        object-fit: contain;
    }

    .infoTitle {
        margin-top: 36px;
        text-transform: uppercase;
        font-size: 18px;
        line-height: 1.2;
    }

    .specs {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        row-gap: 18px;
        margin-top: 22px;
        margin-bottom: 60px;
    }

    .specItem {
        display: flex;
        flex-direction: column;
        font-size: 11px;
    }

    .infoBottom {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .infoBottomLabel {
        text-transform: uppercase;
        font-size: 18px;
        line-height: 1.2;
    }

    .infoBottomValue {
        font-size: 36px;
        font-weight: 500;
        line-height: 1;
    }

    .infoBottomValueSymbol {
        font-size: 24px;
    }

    .infoBottomValueAdditionalInfo {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .creditInfo {
        margin-top: 4px;
        font-size: 12px;
        line-height: 1;
    }
</style>
