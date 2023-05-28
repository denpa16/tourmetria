<template>
    <div id="mortgage"
         ref="mortgage"
         :class="$style.MortgageBlock">
        <h2
            :class="$style.mortgageTitle"
            :style="{fontSize: titleFontSize}">
            {{ title }}
        </h2>
        <div :class="[$style.mortgageBody,'container']">
            <div :class="$style.mortgageControl">
                <MortgageFilters
                    :class="$style.mortgageFilters"
                    :values="values"
                    :specs="specs"
                    :facets="facets"
                    @change="handleChangeValues"
                />
                <div :class="$style.mortgageButtons">
                    <VButton
                        :class="$style.btn"
                        @click="openModalApplication(approvalBtnText)"
                    >
                        {{ approvalBtnText }}
                    </VButton>
                    <VButton
                        :class="$style.btn"
                        :color="consultationBtnColor"
                        @click="openModalApplication(consultationBtnText)"
                    >
                        {{ consultationBtnText }}
                    </VButton>
                </div>
                <VButton
                    :class="$style.resetBtnTable"
                    color="text"
                    size="medium"
                    icon-first
                    :disabled="isParamsDefault"
                    @click="handleReset"
                >
                    Сбросить фильтр
                    <template #icon>
                        <IconCross :class="$style.iconCross" />
                    </template>
                </VButton>
                <VButton
                    :class="$style.filtersButton"
                    color="light"
                    @click="openModalFilters"
                >
                    Рассчитать ипотеку
                    <template #icon>
                        <IconCalculator :class="$style.iconCalculator" />
                    </template>
                </VButton>
            </div>
            <div :class="$style.banksControl">
                <p :class="[$style.offersCounter, 'p6', 'c-base300']">
                    {{ offersCountText }}
                </p>
                <VButton
                    :class="$style.resetBtn"
                    color="text"
                    size="medium"
                    icon-first
                    :disabled="isParamsDefault"
                    @click="handleReset"
                >
                    Сбросить фильтр
                    <template #icon>
                        <IconCross :class="$style.iconCross" />
                    </template>
                </VButton>
            </div>
            <transition
                name="fade-content"
                mode="out-in"
            >
                <div
                    v-if="bankList.length"
                    :class="$style.mortgageBanks"
                >
                    <p :class="[$style.offersCounterTable, 'p6', 'c-base300']">
                        {{ offersCountText }}
                    </p>

                    <transition-group name="fade-slow"
                                      tag="ul"
                                      :class="$style.bankList">
                        <MortgageBankCard
                            v-for="(bank, index) in bankListToShow"
                            :key="`bank-item-${index}`"
                            :class="$style.bankItem"
                            :bank-card="bank"
                            @openModal="openModalOffers"
                        />
                    </transition-group>

                    <VButton
                        v-if="moreBanksCounter > 0"
                        :class="$style.buttonMore"
                        color="light"
                        @click="toggleShowAllBanks"
                    >
                        {{ moreBanksCounterText }}
                    </VButton>
                </div>

                <div
                    v-else-if="isLoading"
                    :class="$style.emptyBanks"
                >
                    <VSpinner size="large"
                              color="primary"
                              :class="$style.spinner" />
                    <p :class="['h4', 'c-base300', $style.emptyText]">
                        Ищем лучшие предложения от банков...
                    </p>
                </div>

                <div
                    v-else
                    :class="$style.emptyBanks"
                >
                    <p :class="['h4', 'c-base300', $style.emptyText]">
                        По заданным параметрам предложений нет.
                    </p>
                    <p :class="['h4', $style.emptyText]">
                        Измените параметры и попробуйте снова
                    </p>
                </div>
            </transition>
        </div>
        <MortgageModalOffers
            v-if="isShownModalOffers"
            :bank-list="bankList"
            :chosen-bank="chosenBank"
            :current-program-name="currentProgramName"
            :current-initial-payment="currentInitialPayment"
            :current-cost="currentCost"
            @close="closeModalOffers"
            @leftApplication="leftApplication"
        />
        <MortgageModalApplication
            v-if="isShownModalApplication"
            @close="closeModalApplication"
        />
        <MortgageModalFilters
            v-if="isShownModalFilters"
            :values="values"
            :specs="specs"
            :facets="facets"
            :offers-count-text="offersCountText"
            :is-loading="isLoading"
            @change="handleChangeValues"
            @reset="handleReset"
            @close="closeModalFilters"
        />
    </div>
</template>

<script>
    import {
        scrollTo,
        clearDoubleSpaces, convertFilterValuesToOrderDetails, getPageTitle, clearAllSpaces,
    } from '~/assets/js/utils/commonUtils';
    import {lockBody, unlockBody} from '~/assets/js/utils/lockUtilsMain';
    import {plural} from '~/assets/js/utils/textUtils';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';

    import MortgageBankCard from '~/components/common/mortgage/MortgageBankCard';
    import MortgageFilters from '~/components/common/mortgage/MortgageFilters';
    import MortgageModalOffers from '~/components/common/mortgage/modals/offers/MortgageModalOffers';
    import MortgageModalApplication from '~/components/common/mortgage/modals/MortgageModalApplication';
    import MortgageModalFilters from '~/components/common/mortgage/modals/MortgageModalFilters';
    import IconCalculator from '~/components/icons/IconCalculator';
    import IconCross from '~/components/icons/IconCross';
    import VSpinner from '~/components/ui/spinner/VSpinner';
    import FormModal from '~/components/layout/modals/forms/FormModal';
    import {splitThousands} from '~/assets/js/utils/numberUtils';
    import {mapActions, mapGetters, mapState} from 'vuex';

    export default {
        name: 'MortgageBlock',
        components: {VSpinner,
                     IconCross,
                     IconCalculator,
                     MortgageModalFilters,
                     MortgageModalApplication,
                     MortgageModalOffers,
                     MortgageFilters,
                     MortgageBankCard},

        mixins: [breakpointCheck],
        props: {
            title: {
                type: String,
                default: ''
            },

            // В этот пропс можно прокинуть дефолтные параметры для текущей страницы
            defaultParams: {
                type: Object,
                default: () => ({})
            },

            // Запустить загрузку данных в момент, когда доскролливаем до компонента,
            // поведение по-умолчанию, нужно отменять, если требуется иное
            loadWhenScrolled: {
                type: Boolean,
                default: true,
            },

            // Запустить загрузку данных в момент монтирования компонента
            loadWhenMounted: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                values: {},
                isLoading: false,

                mortgageRef: null,
                prevMortgageEl: null,

                chosenBank: {},
                isShownModalOffers: false,
                isShownModalApplication: false,
                isShownModalFilters: false,
                isAllBanksShown: false,

                optionsSort: [
                    {
                        value: 'monthly_amount',
                        label: 'По возрастанию',
                        displayName: 'платеж по возрастанию',
                        group: {
                            value: 'monthly_amount',
                            label: 'Платеж',
                        },
                    },
                    {
                        value: '-monthly_amount',
                        label: 'По убыванию',
                        displayName: 'платеж по убыванию',
                        group: {
                            value: 'monthly_amount',
                            label: 'Платеж',
                        },
                    },
                    {
                        value: 'rate',
                        label: 'По возрастанию',
                        displayName: 'ставка по возрастанию',
                        group: {
                            value: 'rate',
                            label: 'Ставка',
                        },
                    },
                    {
                        value: '-rate',
                        label: 'По убыванию',
                        displayName: 'ставка по убыванию',
                        group: {
                            value: 'rate',
                            label: 'Ставка',
                        },
                    },
                    {
                        value: 'term',
                        label: 'По возрастанию',
                        displayName: 'срок по возрастанию',
                        group: {
                            value: 'term',
                            label: 'Срок',
                        },
                    },
                    {
                        value: '-term',
                        label: 'По убыванию',
                        displayName: 'срок по убыванию',
                        group: {
                            value: 'term',
                            label: 'Срок',
                        },
                    },
                ],
            };
        },

        computed: {
            ...mapState('mortgage', {
                specs: 'mortgageSpecs',
                facets: 'mortgageFacets',
                lastFacets: 'lastMortgageFacets',
                offersCount: 'offersCount',
                defaultMortgageParams: 'defaultMortgageParams',
                mainPageDefaultMortgageParams: 'mainPageDefaultMortgageParams',
                initialBankList: 'bankList',
            }),

            ...mapGetters('mortgage', {bankList: 'sortedBankList'}),

            consultationBtnColor() {
                return this.breakpoint !== 'xs' ? 'light' : 'white';
            },

            consultationBtnText() {
                return this.breakpoint !== 'xs' ? 'Заказать консультацию' : 'Консультация';
            },

            approvalBtnText() {
                return this.breakpoint !== 'xs' ? 'Получить одобрение' : 'Оставить заявку';
            },

            offersCountText() {
                return this.offersCount ? `${this.offersCount} ${plural(this.offersCount, ['предложение', 'предложения', 'предложений'])}` : '0 предложений';
            },

            banksCounter() {
                return this.bankList.length;
            },

            bankListToShow() {
                if (this.isAllBanksShown) {
                    return this.bankList;
                }
                return this.breakpoint === 'xs' ? this.bankList.slice(0, 4) : this.bankList.slice(0, 6);
            },

            moreBanksCounter() {
                return this.breakpoint === 'xs'? this.banksCounter - 4 : this.banksCounter - 6;
            },

            moreBanksCounterText() {
                return this.isAllBanksShown ? 'Свернуть' : `+ ${this.moreBanksCounter} ${plural(this.moreBanksCounter, ['банк', 'банка', 'банков'])}`;
            },

            currentProgramName() {
                return this.specs.program.find(program => program.value === this.values.mortgageType)?.label;
            },

            currentInitialPayment() {
                return parseFloat(this.values?.initialPayment);
            },

            currentCost() {
                return parseFloat(this.values?.cost);
            },

            isParamsDefault() {
                if (!Object.keys(this.values).length) {
                    return false;
                }

                for (const key in this.values) {
                    if (this.values[key] !== this.defaultMortgageParams[key]) {
                        return false;
                    }
                }
                return true;
            },

            titleFontSize() {
                if (this.windowWidth >= 1920) {
                    // 6.72 - ширина одного символа толщины bold при размере шрифта 10px
                    return `calc((((1920px - 3.2rem) / ${this.title?.length}) / 6.72) * 10)`;
                }

                return `calc((((100vw - 3.2rem) / ${this.title?.length}) / 6.72) * 10)`;
            }
        },

        watch: {
            facets(val) {
                const cost = Number(this.values.cost);
                const initialPayment = Number(this.values.initialPayment);

                const lastMinPrice = this.lastFacets?.property_price?.min;
                const lastMaxPrice = this.lastFacets?.property_price?.max;
                const lastMinInitialPayment = lastMinPrice * (this.specs?.deposit?.min / 100);

                if (cost === lastMinPrice || cost < val?.property_price?.min) {
                    this.values.cost = val?.property_price?.min;
                }

                if (cost === lastMaxPrice || cost > val?.property_price?.max) {
                    this.values.cost = val?.property_price?.max;
                }

                const minInitialPayment = this.values.cost * (this.specs?.deposit?.min / 100);

                if (initialPayment === lastMinInitialPayment || initialPayment < minInitialPayment) {
                    this.values.initialPayment = minInitialPayment;
                } else if (initialPayment > this.values.cost) {
                    this.values.initialPayment = this.values.cost;
                }
            },
        },

        mounted() {
            if (this.loadWhenScrolled) {
                this.mortgageRef = this.$refs?.mortgage;
                this.prevMortgageEl = this.mortgageRef?.previousElementSibling;
                this.handleStartObserve();
            } else if (this.loadWhenMounted) {
                this.loadData();
            }
        },

        methods: {
            ...mapActions('mortgage', [
                'fetchBanks',
                'fetchMortgageSpecs',
                'fetchMortgageFacets',
                'appendMortgageParams',
                'setMortgageParams',
                'setDefaultMortgageParams',
                'setMainPageDefaultMortgageParams',
            ]),

            async updateMortgageValues(isUpdateFacets = false) {
                this.appendMortgageParams(this.values);

                this.isLoading = true;
                if (isUpdateFacets) {
                    await this.fetchMortgageFacets();
                    this.appendMortgageParams(this.values);
                }
                await this.fetchBanks();
                this.isLoading = false;
            },

            handleChangeValues(values, isDefault = false) {
                const isUpdateFacets = !isDefault
                    && values.developmentprojectSlug
                    && (values.developmentprojectSlug !== this.values.developmentprojectSlug);

                this.values = {
                    ...this.values,
                    ...values,
                };
                this.updateMortgageValues(isUpdateFacets);
            },

            handleReset() {
                this.handleChangeValues({...this.defaultMortgageParams}, true);
            },

            openModalOffers(val) {
                this.chosenBank = val;
                this.isShownModalOffers = true;
                lockBody();
            },

            closeModalOffers() {
                this.isShownModalOffers = false;
                unlockBody();
            },

            openModalApplication(title = 'Ипотека', comment) {
                const data = {
                    formTitle: `${title}. Основной сайт - ипотека`,
                    formSource: comment ? 'Блок ипотеки: В карточке предложения' : 'Блок ипотеки: Стартовый экран',
                    formComment: clearDoubleSpaces(`
                        Выбранный город: ${this.currentCity?.label || ''};
                        Текущая страница: ${getPageTitle()};
                        Путь страницы: ${this.$route.path};
                        Выбранные параметры: ${convertFilterValuesToOrderDetails(this.values, this.specs) || ''},
                        Выбранное предложение: ${comment}
                    `),
                };

                this.$modal.open(FormModal, data);
            },

            closeModalApplication() {
                this.isShownModalApplication = false;
                unlockBody();
            },

            openModalFilters() {
                this.isShownModalFilters = true;
                lockBody();
            },

            closeModalFilters() {
                this.isShownModalFilters = false;
                unlockBody();
            },

            leftApplication(offer) {
                const comment = clearAllSpaces(`
                    Банк - ${offer?.bank_name},
                    Программа - ${offer?.program_name},
                    Перв.взнос - ${splitThousands(offer?.deposit)},
                    Ежем.платеж - ${splitThousands(offer?.monthly_amount)},
                    Ставка - ${offer?.rate}%,
                    Срок - ${offer?.term} лет,
                `);

                this.closeModalOffers();
                this.openModalApplication('Узнать подробнее', comment);
            },

            toggleShowAllBanks() {
                setTimeout(() => {
                    this.isAllBanksShown = !this.isAllBanksShown;

                    if (!this.isAllBanksShown) {
                        scrollTo('mortgage', -100);
                    }
                }, 100);
            },

            async loadData() {
                this.isLoading = true;

                // Подгружаем спеки для ипотеки, если не были загружены ранее
                if (!this.mortgageSpecs || !Object.keys(this.mortgageSpecs)?.length) {
                    await this.fetchMortgageSpecs();
                }
                // Подгружаем фасеты для ипотеки, если не были загружены ранее
                if (!this.mortgageFacets || !Object.keys(this.mortgageFacets)?.length) {
                    await this.fetchMortgageFacets();
                }
                // Настраиваем дефолтные параметры для ипотеки на главной странице,
                // если это не было сделано раньше в рамках текущей сессии
                if (!this.mainPageDefaultMortgageParams) {
                    this.setMainPageDefaultMortgageParams();
                }

                // Определяем, нужно ли загрузить информацию по банкам или она была загружена ранее
                const isRequiredReloadBanks = JSON.stringify(this.defaultMortgageParams) !== JSON.stringify(this.mainPageDefaultMortgageParams);
                // Сбрасываем параметры по-умолчанию и текущие параметры
                this.setDefaultMortgageParams(this.defaultParams);
                this.setMortgageParams(this.defaultMortgageParams);
                this.values = this.defaultMortgageParams;
                // Если нужна перезагрузка банков, добавляем этот запрос в очередь
                if (isRequiredReloadBanks) {
                    await this.fetchBanks();
                }

                this.isLoading = false;
                this.$emit('loaded', this.initialBankList);
            },

            handleStartObserve() {
                if (!this.mortgageRef) {
                    return;
                }

                this.observer = new IntersectionObserver(this.onVisibleload, {
                    threshold: .1,
                });

                this.observer.observe(this.mortgageRef);

                if (this.prevMortgageEl) {
                    this.observer.observe(this.prevMortgageEl);
                }
            },

            onVisibleload(entries) {
                const isIntersecting = entries.some(entry => entry?.isIntersecting);

                if (!isIntersecting) {
                    return;
                }

                this.loadData();

                this.observer.unobserve(this.mortgageRef);

                if (this.prevMortgageEl) {
                    this.observer.unobserve(this.prevMortgageEl);
                }
            },
        }
    };
</script>

<style lang="scss" module>
    .MortgageBlock {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 22.8rem 0 6.4rem;
        border-top: 1px solid $base-100;
        background: url("/images/vectorTopShort.svg") no-repeat top center;
        background-size: 100%;

        @include respond-to(sm) {
            padding: 11.7rem 0 3.2rem;
        }

        @include respond-to(xs) {
            padding: 8.7rem 0 4rem;
            background-size: 130%;
        }
    }

    .mortgageTitle {
        width: 100%;
        text-align: center;
        text-transform: uppercase;
        white-space: nowrap;
        font-size: 8vw;
        font-weight: bold;
        color: $base-800;

        @include respond-to(lg) {
            font-size: 8vw;
        }

        @include respond-to(sm) {
            margin-bottom: 1.6rem;
        }

        @include respond-to(xs) {
            margin-bottom: 3.2rem;
        }
    }

    .mortgageBody {
        width: 100%;

        @include respond-to(sm) {
            display: flex;
        }

        @include respond-to(xs) {
            flex-direction: column;
        }
    }

    .mortgageControl {
        display: flex;
        align-items: center;
        margin-bottom: .8rem;
        padding: 1.2rem 0;
        border-top: 1px solid $base-100;
        border-bottom: 1px solid $base-100;

        @include respond-to(sm) {
            margin-top: 4rem;
        }

        @include respond-to(xs) {
            margin-top: 0;
        }

        :global(.sort-select) {
            display: none;

            @include respond-to(sm) {
                display: flex;
                margin-bottom: 2.4rem;
            }
        }

        @include respond-to(sm) {
            flex-direction: column;
            align-items: unset;
            justify-content: start;
            width: 38%;
            padding: 0 2.4rem 0 0;
            border: none;
        }

        @include respond-to(xs) {
            flex-direction: column-reverse;
            width: 100%;
            padding: 0;

            & :global(.mortgage-filters) {
                display: none;
            }
        }
    }

    .sortSelectAdaptive {
        @include respond-to(xs) {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.2rem 0;
            border-top: 1px solid $base-100;
            border-bottom: 1px solid $base-100;
        }

        :global(.v-select) {
            width: fit-content;
        }
    }

    .mortgageFilters {
        @include respond-to(sm) {
            margin-bottom: 3.2rem;
        }
    }

    .mortgageButtons {
        display: flex;
        margin-left: auto;

        @include respond-to(sm) {
            flex-direction: column;
            margin-bottom: .8rem;
            margin-left: unset;
        }

        @include respond-to(xs) {
            flex-direction: row-reverse;
            margin-bottom: 2.4rem;
        }

        & > *:not(:last-child) {
            margin-right: .8rem;

            @include respond-to(sm) {
                margin-right: 0;
                margin-bottom: .8rem;
            }

            @include respond-to(xs) {
                margin-bottom: 0;
            }
        }
    }

    .resetBtnTable {
        display: none;

        @include respond-to(sm) {
            display: flex;

            & :global(.v-button__icon-wrap) {
                transform: translateY(-1px);
            }
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .btn {
        @include respond-to(xs) {
            flex: auto;

            &:last-child {
                margin-right: 1.2rem;
            }
        }
    }

    .filtersButton {
        display: none;

        @include respond-to(xs) {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-bottom: 1.2rem;
            padding: 0 1.6rem;
        }
    }

    .iconCalculator {
        width: 1.2rem;
        height: 1.4rem;
        color: #000;
    }

    .banksControl {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-bottom: .8rem;

        @include respond-to(sm) {
            display: none;
        }
    }

    .iconCross {
        width: .8rem;
        height: .8rem;
    }

    .mortgageBanks {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: auto;
    }

    .offersCounter {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .offersCounterTable {
        display: none;

        @include respond-to(sm) {
            display: flex;
            margin-bottom: 2.4rem;
            margin-left: auto;
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .bankList {
        display: grid;
        width: 100%;
        margin-bottom: 6.4rem;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.6rem;

        @include respond-to(sm) {
            grid-template-columns: initial;
            margin-bottom: 2.4rem;
        }
    }

    .buttonMore {
        @include respond-to(sm) {
            width: 100%;
        }
    }

    .emptyBanks {
        padding: 15rem 0 19.2rem 0;
        text-align: center;

        @include respond-to(sm) {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex: auto;
        }

        @include respond-to(sm) {
            position: static;
            padding: 8rem 0 8rem 0;
            transform: unset;
        }
    }

    .emptyText {
        text-transform: uppercase;

        @include respond-to(sm) {
            text-transform: unset;
            font-size: 1.4rem;
            font-weight: 400;
            line-height: 1.6rem;
            letter-spacing: -.02em;
        }

        @include respond-to(xs) {
            font-size: 1.6rem;
        }
    }

    .spinner {
        margin-bottom: 2.4rem;
    }
</style>
