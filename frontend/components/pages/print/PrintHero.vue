<template>
    <PrintPage :class="$style.PrintHero"
               top-vector
               bottom-vector>
        <IconLogo :class="$style.logo" />

        <div :class="$style.content">
            <div :class="$style.section">
                <h1 :class="[$style.title, 'c-blue']">
                    О компании
                </h1>
                <p :class="[$style.text]">
                    «НЕОМЕТРИЯ» &ndash; федеральный девелопер полного цикла, осуществляет
                    комплексную деятельность от подбора земельного участка до
                    эксплуатации готовых объектов. Реализует проекты и комфорт-, бизнес- и
                    премиум-классов в нескольких субъектах  РФ
                </p>
            </div>

            <div :class="$style.section">
                <h2 :class="[$style.title, 'c-blue']">
                    «НЕОМЕТРИЯ» В ЦИФРАХ
                </h2>

                <ul :class="$style.benefitsList">
                    <li v-for="benefit in benefits"
                        :key="benefit.count + benefit.text"
                        :class="$style.benefitItem">
                        <div :class="$style.benefitHead">
                            <span :class="[$style.benefitCount, 'c-blue']">{{ benefit.count }}</span>
                            <p :class="$style.benefitCountText">
                                {{ benefit.text }}
                            </p>
                        </div>

                        <ul :class="$style.subbenefitsList">
                            <li v-for="subbenefits in benefit.subbenefits"
                                :key="subbenefits.title + subbenefits.text"
                                :class="$style.subbenefitItem">
                                <span :class="[$style.subbenefitTitle, 'c-blue']">
                                    {{ subbenefits.title }}<sup v-if="subbenefits.sup">{{ subbenefits.sup }}</sup>
                                </span>
                                <p :class="$style.subbenefitText">
                                    {{ subbenefits.text }}
                                </p>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>

            <div :class="[$style.section, $style._geography]">
                <h2 :class="[$style.title, 'c-blue']">
                    ПРОЕКТЫ ФЕДЕРАЛЬНОГО ДЕВЕЛОПЕРА «НЕОМЕТРИЯ»
                </h2>
                <p :class="$style.geographyText">
                    География: Краснодар, Сочи, Новороссийск, Ростов-на-Дону, Геленджик, Москва.
                </p>
                <div :class="$style.geographyWrapper">
                    <div :class="$style.citiesCount">
                        <span :class="[$style.citiesCountNumber, 'c-blue']">{{ totalCities }}</span>
                        <span :class="$style.citiesCountText">ЖИЛЫХ КОМПЛЕКСА В ГОРОДАХ ПРИСУТСТВИЯ</span>
                    </div>

                    <ul :class="$style.citiesList">
                        <li v-for="city in geography"
                            :key="city.name"
                            :class="$style.city">
                            <span :class="[$style.cityNumber, 'c-blue']">{{ city.number }}</span>
                            <span :class="$style.cityName">{{ city.name }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    </PrintPage>
</template>

<script>
    import PrintPage from '~/components/common/print/PrintPage';
    import IconLogo from '~/components/icons/IconLogo';
    export default {
        name: 'PrintHero',
        components: {
            IconLogo,
            PrintPage
        },

        data() {
            return {
                benefits: [
                    {
                        count: '12',
                        text: 'лет на рынке',
                        subbenefits: [
                            {
                                title: '1 000 000 м',
                                text: 'построено',
                                sup: 2,
                            },
                            {
                                title: '1 500 000 м',
                                text: 'в реализации',
                                sup: 2,
                            },
                            {
                                title: '1 100 000 м',
                                text: 'на запуске',
                                sup: 2,
                            }
                        ]
                    },
                    {
                        count: '30',
                        text: 'объектов сданы в срок',
                        subbenefits: [
                            {
                                title: '№1 В СОЧИ И НОВОРОССИЙСКЕ',
                                text: 'по объему строящегося жилья',
                                sup: '',
                            },
                            {
                                title: 'ТОП-3 в ЮФО',
                                text: 'по объему строящегося жилья',
                                sup: '',
                            },
                        ]
                    },
                    {
                        count: '30 000',
                        text: 'семей живут в наших домах',
                        subbenefits: [
                            {
                                title: 'ТОП-25 В РОССИИ',
                                text: 'по объему строящегося жилья',
                                sup: '',
                            },
                        ]
                    },
                ],

                geography: [
                    {
                        number: 8,
                        name: 'в Краснодаре',
                    },
                    {
                        number: 4,
                        name: 'в Новороссийске',
                    },
                    {
                        number: 3,
                        name: 'в Сочи',
                    },
                    {
                        number: 3,
                        name: 'в Москве',
                    },
                    {
                        number: 3,
                        name: 'в Ростове-на-Дону',
                    },
                    {
                        number: 1,
                        name: 'в Геленджике',
                    },
                ],
            };
        },

        computed: {
            totalCities() {
                return this.geography.reduce((res, {number}) => res + number, 0);
            }
        },
    };
</script>

<style lang="scss" module>
    .PrintHero {
        padding-top: 154px;
    }

    .logo {
        position: absolute;
        top: 48px;
        right: 37px;
        width: 330px;
        height: 70.4px;
        color: $base-800;
    }

    .content {
        padding-left: 44px;
        color: $base-800;
    }

    .section {
        margin-bottom: 48px;

        &:last-child {
            margin-bottom: 0;
        }

        &._geography {
            min-height: 475px;
            background: url('/images/print/lot/map.svg') 100% 50% no-repeat;
        }
    }

    .title {
        text-transform: uppercase;
        font-size: 24px;
        font-weight: 500;
        line-height: 34px;
    }

    .text {
        max-width: 80%;
        margin-top: 4px;
        margin-left: 8px;
        font-size: 15px;
        line-height: 20px;
    }

    .benefitsList {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-top: 8px;
        padding-right: 44px;
    }

    .benefitItem {
        flex: 1;
        margin-right: 34px;

        &:last-child {
            margin-right: 0;
        }
    }

    .benefitHead {
        min-height: 108px;
        padding: 12px 12px 8px;
        border-bottom: 1px solid $blue;
    }

    .benefitCount {
        text-transform: uppercase;
        font-size: 44px;
        font-weight: 700;
        line-height: 1.05;
    }

    .benefitCountText {
        font-size: 18px;
        line-height: 20px;
    }

    .subbenefitsList {
        padding-top: 40px;
    }

    .subbenefitItem {
        margin-bottom: 12px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .subbenefitTitle {
        text-transform: uppercase;
        font-size: 20px;
        font-weight: 500;
        line-height: 1.2;
    }

    .subbenefitText {
        font-size: 16px;
        line-height: 1.2;
    }

    .geographyText {
        width: 40%;
        font-size: 16px;
        line-height: 1.3;
    }

    .geographyWrapper {
        display: flex;
        align-items: center;
    }

    .citiesCount {
        position: relative;
        width: 192px;
        margin-top: 36px;
        margin-left: 21px;
        padding: 10px 18px;
        border: 2px solid transparent;

        &:before {
            content: "";
            position: absolute;
            top: -6px;
            left: -2px;
            display: block;
            width: 100%;
            height: 100%;
            border: 1.5px solid $blue;
        }

        &:after {
            content: "";
            position: absolute;
            top: 6px;
            left: -15px;
            display: block;
            width: 100%;
            height: 100%;
            border: 1.5px dashed $blue;
        }
    }

    .citiesCountNumber {
        font-size: 108px;
        line-height: 1;
    }

    .citiesCountText {
        display: block;
        margin-top: -15px;
        margin-left: 6px;
        text-transform: uppercase;
        font-size: 16px;
        line-height: 1.2;
    }

    .citiesList {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        margin-top: 34px;
        margin-left: 50px;
        row-gap: 32px;
        column-gap: 12px;
    }

    .cityNumber {
        font-size: 64px;
        line-height: 1;
    }

    .cityName {
        display: block;
        text-transform: uppercase;
        font-size: 12px;
        line-height: 1;
    }
</style>
