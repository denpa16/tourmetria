<template>
    <section :class="[$style.FlatsPage, 'container']">
        <div :class="$style.flatsFilters">
            <FlatsFilters
                :values="values"
                :specs="specs"
                :facets="facets"
                :current-floor-tabs="currentFloorTabs"
                @change="handleChangeValue"
            />
            <transition
                name="fade-content"
                mode="out-in"
            >
                <VSpinner
                    v-if="isReloading"
                    :class="$style.spinner"
                />
            </transition>
            <div :class="$style.right">
                <p :class="[$style.counter, 'p6', 'c-base300']">
                    {{ flatsCounter }}
                </p>
                <VButton color="light"
                         @click="openModalFilters">
                    Расширенный фильтр
                </VButton>
            </div>
        </div>
        <div :class="$style.buttonsWrap">
            <VButton color="light"
                     :class="$style.filterBtn"
                     @click="openModalFilters"
            >
                Фильтр
                <template #icon>
                    <IconFilters :class="$style.iconFilters" />
                </template>
            </VButton>
            <SortSelect
                :class="$style.sortMobile"
                :options="optionsSort"
                :value="values.order"
                bordered
                @change="handleSort"
            />
        </div>
        <div :class="$style.sortContainer">
            <SortSelect
                :options="optionsSort"
                :value="values.order"
                label="Сортировать по"
                @change="handleSort"
            />
            <VButton
                :class="$style.resetBtn"
                color="text"
                size="medium"
                icon-first
                @click="resetFilters"
            >
                Сбросить фильтр
                <template #icon>
                    <IconCross :class="$style.iconCross" />
                </template>
            </VButton>
            <p :class="[$style.counterTable, 'p6', 'c-base300']">
                {{ flatsCounter }}
            </p>
        </div>
        <transition
            name="fade-content"
            mode="out-in"
        >
            <transition-group v-if="flatListToShow.length"
                              :key="flatsCount"
                              tag="ul"
                              name="list-fade"
                              :class="$style.flatList"
            >
                <li
                    v-for="(flat, index) in flatListToShow"
                    :key="flat.id"
                    :class="$style.flatItem"
                    :style="`order: ${index + 1}`"
                >
                    <LotCard :lot="flat" />
                </li>

                <template v-for="promo in promotionListToShow">
                    <li v-if="promo.isShow"
                        :key="'promo' + promo.id"
                        :class="[$style.flatItem, $style.promotionItem]"
                        :style="`order: ${promo.order}`">
                        <PromotionCard
                            :promotion="promo"
                            :preferred-project-slug="currentProjects"
                            mobile-images
                        />
                    </li>
                </template>
            </transition-group>
        </transition>
        <transition
            name="fade-content"
            mode="out-in"
        >
            <div
                v-if="!flatListToShow.length"
                :class="$style.emptyFlats"
            >
                <p :class="['h4', 'c-base300', $style.emptyText]">
                    По заданным параметрам квартир нет.
                </p>
                <p :class="['h4', $style.emptyText]">
                    Измените параметры и попробуйте снова
                </p>
                <VButton
                    color="light"
                    :class="$style.emptyBtn"
                    @click="openCallModal"
                >
                    Консультация
                </VButton>
            </div>
        </transition>
        <VButton
            v-if="moreFlatsCounter > 0"
            :class="$style.moreButton"
            color="light"
            :loading="isReloading"
            :spinner="isReloading"
            @click="showMoreFlats"
        >
            {{ moreButtonText }}
        </VButton>

        <FlatsFiltersModal
            v-if="isShownModalFilters"
            :values="values"
            :specs="specs"
            :facets="facets"
            :flats-count="flatsCount"
            :current-floor-tabs="currentFloorTabs"
            @close="closeModalFilters"
            @change="handleChangeValue"
            @resetFilters="resetFilters"
        />
    </section>
</template>

<script>
    import {
        clearDoubleSpaces,
        convertFilterValuesToOrderDetails,
    } from '~/assets/js/utils/commonUtils';
    import {lockBody, unlockBody} from '~/assets/js/utils/lockUtilsMain';
    import {plural} from '~/assets/js/utils/textUtils';
    import {mapActions, mapState} from 'vuex';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';
    import {serializeValues} from '~/assets/js/utils/filterUtils';

    import LotCard from '~/components/common/selection/LotCard';
    import SortSelect from '~/components/common/SortSelect';
    import VButton from '~/components/ui/buttons/VButton';
    import FlatsFilters from '~/components/common/selection/flats/FlatsFilters';
    import IconCross from '~/components/icons/IconCross';
    import IconFilters from '~/components/icons/IconFilters';
    import FlatsFiltersModal from '~/components/common/selection/flats/FlatsFiltersModal';
    import FormModal from '~/components/layout/modals/forms/FormModal';
    import PromotionCard from '~/components/common/promotions/PromotionCard';

    const defaultValues = {
        project: [],
        city: '',
        rooms: [],
        area_min: '',
        area_max: '',
        price_min: '',
        price_max: '',
        completion_date: [],
        floor_min: '',
        floor_max: '',
        floorTabs: [],
        has_promotions: false,
        features: [],
        decorationAdditionally: false,
        building: [],
        // furnish: [],
        order: 'price'
    };
    export default {
        name: 'FlatsPage',

        components: {
            LotCard,
            SortSelect,
            VButton,
            FlatsFilters,
            IconCross,
            IconFilters,
            FlatsFiltersModal,
            PromotionCard
        },

        mixins: [breakpointCheck],

        props: {},

        async asyncData({app, query, store}) {
            try {
                const queryCopy = JSON.parse(JSON.stringify(query));
                for (const key in queryCopy) {
                    if (typeof queryCopy[key] === 'string' && queryCopy[key].indexOf(',') !== -1) {
                        queryCopy[key] = queryCopy[key].split(',');
                    } else if (typeof queryCopy[key] === 'string' && Array.isArray(defaultValues[key])) {
                        queryCopy[key] = [queryCopy[key]];
                    }
                }

                const city = store?.state?.current_city?.value && !query?.city && !query?.project
                    ? store?.state?.current_city?.value
                    : '';

                const initialValues = {
                    ...defaultValues,
                    ...queryCopy,
                    rooms: query.rooms?.length ? query.rooms.split(',').map(item => Number(item)) : [],
                    features: query.features?.length ? query.features.split(',').map(item => Number(item)) : [],
                    has_promotions: queryCopy.has_promotions === 'true',
                    building: query.building?.length ? query.building.split(',').map(item => Number(item)) : [],
                };

                if (city) {
                    initialValues.city = city;
                }

                const [promotionList] = await Promise.all([
                    app.$axios.$get(app.$api.publications.promo),
                    app.store.dispatch('flats/setParams', initialValues),
                    app.store.dispatch('flats/fetchFlats'),
                    app.store.dispatch('flats/fetchFacets'),
                    app.store.dispatch('flats/fetchSpecs'),
                ]);

                return {
                    values: initialValues,
                    promotionList
                };
            } catch (err) {
                console.warn('[Flats page/asyncData] request failed: ', err);
            }
        },

        data() {
            return {
                values: {},
                isReloading: false,
                isShownModalFilters: false,
                promotionList: [],
                currentFlatList: [],
                currentFlatListSlice: {},
                paginationCountPc: 1,
                paginationCountMobile: 1,
                flatsPerViewPc: 20,
                flatsPerViewMobile: 10,
                currentFloorTabs: [],
            };
        },

        head() {
            const cityStr = this.currentCity?.value && this.currentCity?.value !== 'all' ? `в городе ${this.currentCity?.label} ` : '';
            const cityStrShort = this.currentCity?.value && this.currentCity?.value !== 'all' ? `в г. ${this.currentCity?.label} ` : '';

            return {
                title: `Выбрать квартиру ${cityStrShort}| Федеральный девелопер Неометрия`,
                meta: [{
                    hid: 'description',
                    name: 'description',
                    content: `Выбор квартир ${cityStr}от официального застройщика СК "Неометрия". 8 800 777-40-93`,
                }],
            };
        },

        computed: {
            ...mapState({
                currentCity: 'current_city',
            }),

            ...mapState('flats', [
                'flatList',
                'flatsCount',
                'firstPaginationStepUrl',
                'facets',
                'specs'
            ]),

            promotionListToShow() {
                let resList = [];

                if (!this.promotionList?.length) {
                    return [];
                }

                if (this.promotionList.length > 4) {
                    resList = this.promotionList.slice(0, 4);
                } else {
                    resList = this.promotionList;
                }

                return resList.map((promo, i) => {
                    let order;

                    switch (this.breakpoint) {
                        case 'xs': {
                            // Каждый третий
                            order = (2 * i) + 2;
                            break;
                        }
                        case 'sm': {
                            // Каждый нечетный, начиная с 3
                            order = (2 * i) + 3;
                            break;
                        }
                        default: {
                            // 3, 7, 13, 17
                            order = i === 0
                                ? 3
                                : i === 1
                                    ? 7
                                    : i === 2
                                        ? 13
                                        : 17;
                        }
                    }

                    return {
                        ...promo,
                        order,
                        isShow: (this.flatListToShow.length - 1) >= order
                    };
                });
            },

            pcFlatListLength() {
                return this.paginationCountPc * this.flatsPerViewPc;
            },

            mobileFlatListLength() {
                return this.paginationCountMobile * this.flatsPerViewMobile;
            },

            flatListToShow() {
                return ['sm', 'xs'].includes(this.breakpoint)
                    ? this.currentFlatList.slice(0, this.mobileFlatListLength)
                    : this.currentFlatList.slice(0, this.pcFlatListLength);
            },

            nextPaginationStepUrl() {
                if (!this.currentFlatListSlice?.next && this.currentFlatListSlice?.next !== null) {
                  return this.firstPaginationStepUrl;
                }

                return this.currentFlatListSlice.next;
            },

            isNotRequiredDataUploadForMobile() {
                return ['sm', 'xs'].includes(this.breakpoint)
                    && this.mobileFlatListLength <= (this.currentFlatList?.length - this.flatsPerViewMobile);
            },

            optionsSort() {
                const getDisplayName = displayName => this.breakpoint === 'xs' ? 'Сортировка' : displayName;
                return [
                    {
                        value: 'price',
                        label: 'По возрастанию',
                        displayName: getDisplayName('стоимость по возрастанию'),
                        group: {
                            value: 'price',
                            label: 'Стоимость',
                        },
                    },
                    {
                        value: '-price',
                        label: 'По убыванию',
                        displayName: getDisplayName('стоимость по убыванию'),
                        group: {
                            value: 'price',
                            label: 'Стоимость',
                        },
                    },
                    {
                        value: 'area',
                        label: 'По возрастанию',
                        displayName: getDisplayName('площадь по возрастанию'),
                        group: {
                            value: 'area',
                            label: 'Площадь',
                        },
                    },
                    {
                        value: '-area',
                        label: 'По убыванию',
                        displayName: getDisplayName('площадь по убыванию'),
                        group: {
                            value: 'area',
                            label: 'Площадь',
                        },
                    },
                    {
                        value: 'completion_date',
                        label: 'По возрастанию',
                        displayName: getDisplayName('срок сдачи по возрастанию'),
                        group: {
                            value: 'completion_date',
                            label: 'Срок сдачи',
                        },
                    },
                    {
                        value: '-completion_date',
                        label: 'По убыванию',
                        displayName: getDisplayName('срок сдачи по убыванию'),
                        group: {
                            value: 'completion_date',
                            label: 'Срок сдачи',
                        },
                    },
                ];
            },

            flatsCounter() {
                return `${this.flatsCount} ${plural(this.flatsCount, ['квартира', 'квартиры', 'квартир'])}`;
            },

            moreFlatsCounter() {
                return ['sm', 'xs'].includes(this.breakpoint)
                    ? Math.min(this.flatsCount - this.mobileFlatListLength, this.flatsPerViewMobile)
                    : Math.min(this.flatsCount - this.pcFlatListLength, this.flatsPerViewPc);
            },

            moreButtonText() {
                return `+${this.moreFlatsCounter} ${plural(this.moreFlatsCounter, ['квартира', 'квартиры', 'квартир'])}`;
            },

            currentProjects() {
                return this.values?.project;
            }
        },

        watch: {
            currentCity(city) {
                this.handleChangeValue({city: city.value});
            },
        },

        created() {
            this.currentFlatList = this.flatList;

            if (this.currentCity?.value) {
                this.updateUrl();
            }
        },

        methods: {
            ...mapActions('flats', ['appendParams', 'fetchFacets', 'fetchFlats']),
            setDefaultValues() {
                this.values = JSON.parse(JSON.stringify(defaultValues));
            },

            handleChangeValue(values) {
                if (values.price_min) {
                    values.price_min = Math.round(Number(values.price_min) * 1000000);
                }

                if (values.price_max) {
                    values.price_max = Math.round(Number(values.price_max) * 1000000);
                }

                this.values = {
                    ...this.values,
                    ...values,
                };
                this.updateValues();
            },

            async updateValues() {
                this.isReloading = true;
                this.currentFloorTabs = this.values.floorTabs;
                this.appendParams(this.values);
                this.updateUrl();
                await Promise.all([this.fetchFacets(), this.fetchFlats()]);
                this.resetPagination();
                this.isReloading = false;
            },

            async getNextFlatListSlice() {
                if (!this.nextPaginationStepUrl) {
                    return;
                }

                this.isReloading = true;

                try {
                    this.currentFlatListSlice = await this.$axios.$get(this.nextPaginationStepUrl);

                    if (Array.isArray(this.currentFlatListSlice?.results)) {
                        this.currentFlatList = [...this.currentFlatList, ...this.currentFlatListSlice.results];
                        this.paginationCountPc += 1;
                        this.paginationCountMobile += 1;
                    }
                } catch (e) {
                    console.error(`[getNextFlatListSlice]: ${e}`);
                } finally {
                    this.isReloading = false;
                }
            },

            resetPagination() {
                this.currentFlatList = this.flatList;
                this.currentFlatListSlice = {};
                this.paginationCountPc = 1;
                this.paginationCountMobile = 1;
            },

            updateUrl() {
                this.$router.push({path: '/selection/flats', query: serializeValues(this.values)});
            },

            handleSort(val) {
                this.values.order = val;
                this.updateValues();
            },

            openModalFilters() {
                this.isShownModalFilters = true;
                lockBody();
            },

            closeModalFilters() {
                this.isShownModalFilters = false;
                unlockBody();
            },

            resetFilters() {
                this.currentFloorTabs = [];
                this.setDefaultValues();
                this.updateValues();
            },

            showMoreFlats() {
                if (this.isNotRequiredDataUploadForMobile) {
                    this.paginationCountMobile += 1;
                    return;
                }

                this.getNextFlatListSlice();
            },

            openCallModal() {
                const data = {
                    formTitle: 'Заказать консультацию. Не найдены квартиры по заданным параметрам',
                    formSource: 'Страница подбора квартир',
                    formComment: clearDoubleSpaces(`
                        Выбранный город: ${this.currentCity?.label || ''};
                        Путь страницы: ${this.$route.path};
                        Выбранные параметры: ${convertFilterValuesToOrderDetails(this.values, this.specs) || ''}
                    `),
                };

                this.$modal.open(FormModal, data);
            },
        },
    };
</script>

<style lang="scss" module>
    .FlatsPage {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding-top: 6.4rem;
        padding-bottom: 7.2rem;

        @include respond-to(sm) {
            padding-top: 4rem;
        }

        @include respond-to(xs) {
            padding-top: 2.4rem;
            padding-bottom: 6.4rem;
        }
    }

    .flatsFilters {
        display: flex;
        align-items: center;
        padding: 1.2rem 0;
        border-top: 1px solid $base-100;
        border-bottom: 1px solid $base-100;

        @include respond-to(sm) {
            display: none;
        }
    }

    .right {
        display: flex;
        align-items: center;
        margin-left: auto;
    }

    .counter {
        margin-right: 4.8rem;
    }

    .buttonsWrap {
        display: none;

        @include respond-to(sm) {
            display: flex;
            padding: 1.2rem 0;
            border-top: 1px solid $base-100;
            border-bottom: 1px solid $base-100;

            :global(.v-button) {
                justify-content: space-between;
                padding: 0 1.6rem;
            }
        }

        @include respond-to(xs) {
            border-top: none;
            margin-bottom: 1.6rem;
            padding: 0 0 1.6rem 0;
        }

        :global(.sort-select) {
            display: none;

            @include respond-to(xs) {
                display: block;
                width: 50%;
            }
        }
    }

    .iconFilters {
        width: 1.2rem;
        height: 1.2rem;
    }

    .sortContainer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.6rem 0 2.4rem;

        @include respond-to(sm) {
            padding: 1.6rem 0 1.6rem;

            :global(.sort-label) {
                color: $base-800;
            }
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .resetBtn {
        @include respond-to(sm) {
            display: none;
        }
    }

    .filterBtn {
        width: 100%;

        @include respond-to(xs) {
            width: 50%;
            margin-right: 1.2rem;
        }
    }

    .counterTable {
        display: none;

        @include respond-to(sm) {
            display: block;
        }
    }

    .iconCross {
        width: .8rem;
        height: .8rem;
    }

    .flatList {
        width: calc(100% + 1.6rem);
        display: flex;
        flex-wrap: wrap;
        margin: -.8rem -.8rem 0;

        @include respond-to(sm) {
            margin: -.8rem -.8rem 0;
        }

        @include respond-to(xs) {
            margin: -.8rem -.8rem 0;
        }
    }

    .flatItem {
        padding: .8rem;
        width: 25%;
        transition: all $default-transition;

        @include respond-to(sm) {
            width: 50%;
        }

        @include respond-to(xs) {
            width: 100%;
        }
    }

    .promotionItem {
        @include respond-to(xs) {
            height: 50.8rem;
        }
    }

    .moreButton {
        width: fit-content;
        margin: 6.4rem auto 0;

        @include respond-to(sm) {
            width: 100%;
            margin: 4rem auto 0;
        }

        @include respond-to(xs) {
            margin: 2.4rem auto 0;
        }
    }

    .spinner {
        margin-left: 2rem;
    }

    .emptyFlats {
        padding: 15rem 0 19.2rem 0;
        text-align: center;

        @include respond-to(sm) {
            //padding: 18.4rem 0 15.2rem 0;
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

    .emptyBtn {
        margin-top: 2.4rem;
    }
</style>
