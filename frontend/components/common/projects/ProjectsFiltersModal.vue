<template>
    <transition :name="($deviceIs.tablet || $deviceIs.mobile) ? 'modal' : 'form-appear'"
                appear>
        <div :class="['modal', $style.ProjectsFiltersModal]">
            <div :class="['modal-wrap', $style.wrap]"
                 @click.self="$emit('close')">

                <div :class="$style.contentWrap">
                    <div :class="$style.closeBtn">
                        <VSquareButton color="white"
                                       aria-label="Закрыть"
                                       @click="$emit('close')">
                            <IconPlus :class="$style.closeBtnIcon" />
                        </VSquareButton>
                    </div>
                    <div :class="$style.content">
                        <div :class="$style.head">
                            <button :class="[$style.reset, {[$style._disabled]: isResetBtnDisabled}, 'p6', 'c-blue']"
                                    value="Сбросить"
                                    @click="$emit('reset')">
                                Сбросить
                            </button>
                            <h4 :class="[$style.title, 'h4']">
                                Фильтр
                            </h4>
                            <div :class="$style.closeBtnMobile">
                                <VSquareButton color="light"
                                               size="small"
                                               aria-label="Закрыть"
                                               @click="$emit('close')">
                                    <IconPlus :class="$style.closeBtnIcon" />
                                </VSquareButton>
                            </div>
                        </div>

                        <div :class="$style.filtersContent">
                            <div v-if="page !== 'realty' || page === 'realty' && activeStage === 'projects'"
                                 :class="$style.filterItem">
                                <p :class="$style.label">
                                    Город
                                </p>
                                <VSelect
                                    :class="[$style.selectItem, 'p6']"
                                    :options="cities"
                                    :value="getCurrentCity.value"
                                    margin-dropdown="3rem"
                                    min-width-dropdown="49.6rem"
                                    modal-title="Город"
                                    modal-breakpoint="xs"
                                    :is-tabs="isAnyRegions"
                                    bordered
                                    is-dropdown-right
                                    @input="handleInput"
                                >
                                    <template #icon>
                                        <IconLocation :class="$style.icon" />
                                    </template>
                                </VSelect>
                            </div>

                            <div v-if="page === 'realty' && (activeStage === 'buildings' || activeStage === 'floors')"
                                 :class="$style.filterItem">
                                <p :class="$style.label">
                                    Проект
                                </p>

                                <VSelect
                                    :value="values.project"
                                    :options="specs.project"
                                    apply-facets
                                    :facet="facets.project"
                                    :class="$style.selectItem"
                                    placeholder="Проект"
                                    modal-title="Проект"
                                    modal-breakpoint="xs"
                                    bordered
                                    @input="$emit('change', {project: $event})"
                                />
                            </div>

                            <div v-if="page === 'realty' && activeStage === 'floors'"
                                 :class="$style.filterItem">
                                <p :class="$style.label">
                                    Корпус
                                </p>

                                <VSelect :value="Number(values.building)"
                                         :options="specs.building"
                                         :facet="facets.building"
                                         apply-facets
                                         :class="$style.selectItem"
                                         placeholder="Корпус"
                                         modal-title="Корпус"
                                         modal-breakpoint="xs"
                                         bordered
                                         @input="$emit('change', {building: $event})"
                                />
                            </div>

                            <div v-if="page !== 'realty'"
                                 :class="$style.filterItem">
                                <p :class="$style.label">
                                    Тип недвижимости
                                </p>

                                <VSelect
                                    :value="values.property_type"
                                    :options="specs.property_type"
                                    :class="$style.selectItem"
                                    modal-title="Тип недвижимости"
                                    :facet="facets.property_type"
                                    placeholder="Любой"
                                    modal-breakpoint="xs"
                                    bordered
                                    @input="$emit('change',{property_type: $event})"
                                />
                            </div>

                            <div v-if="page !== 'realty'"
                                 :class="$style.filterItem">
                                <p :class="$style.label">
                                    Комнатность
                                </p>

                                <VTabs :class="$style.tabs"
                                       :tabs="specs.rooms"
                                       :value="values.rooms"
                                       :facets="facets.rooms"
                                       apply-facets
                                       @change="$emit('change',{rooms: $event})"
                                />
                            </div>

                            <div :class="$style.filterItem">
                                <p :class="$style.label">
                                    Площадь, м²
                                </p>
                                <VRange
                                    name="area"
                                    :class="$style.slider"
                                    :spec="specs.area"
                                    :facet="facets.area"
                                    :value-min="values.area_min"
                                    :value-max="values.area_max"
                                    :step=".1"
                                    range
                                    @change="$emit('change', $event)"
                                />
                            </div>

                            <div :class="$style.filterItem">
                                <p :class="$style.label">
                                    Стоимость, Р
                                </p>
                                <VRange
                                    name="price"
                                    :class="$style.slider"
                                    :spec="specs.price"
                                    :facet="facets.price"
                                    :value-min="values.price_min"
                                    :value-max="values.price_max"
                                    :step="1000"
                                    @change="$emit('change', $event)"
                                />
                            </div>

                            <div :class="$style.filterItem">
                                <p :class="$style.label">
                                    Срок сдачи
                                </p>

                                <VSelect :value="values.completion_date"
                                         :options="specs.completion_date"
                                         apply-facets
                                         :facet="facets.completion_date"
                                         :class="$style.selectItem"
                                         placeholder="Не важно"
                                         modal-title="Срок сдачи"
                                         bordered
                                         modal-breakpoint="xs"
                                         @input="$emit('change', {completion_date: $event})"
                                />
                            </div>

                            <div :class="$style.filterItem">
                                <p v-show="($deviceIs.tablet || $deviceIs.mobile)"
                                   :class="$style.label">
                                    Дополнительно
                                </p>

                                <VCheckbox v-if="facets?.has_promotions?.length"
                                           :false-value="false"
                                           :value="values.has_promotions"
                                           :class="$style.checkbox"
                                           :no-checkbox="($deviceIs.tablet || $deviceIs.mobile)"
                                           @input="$emit('change', {has_promotions: $event})">
                                    Акции
                                </VCheckbox>
                            </div>

                            <transition name="fade-content"
                                        mode="out-in">
                                <div v-if="!itemsCount.count"
                                     :class="$style.emptyCard">
                                    <div :class="$style.iconWrapper">
                                        <IconSearch :class="$style.iconSearch" />
                                    </div>
                                    <div :class="$style.emptyText">
                                        <p>
                                            По вашему запросу <span class="c-blue">{{ itemsCount.empty }} не&nbsp;найдено</span>.
                                        </p>
                                        <p>
                                            Измените параметры и попробуйте снова.
                                        </p>
                                    </div>
                                </div>
                            </transition>
                        </div>

                        <div :class="$style.buttonsWrapper">
                            <VButton :class="$style.btn"
                                     @click="$emit('close')">
                                <span>Показать</span>
                                <span v-if="itemsCount.count">{{ itemsCount.plural }}</span>
                                <span v-else>0 {{ itemsCount.empty }}</span>
                            </VButton>

                            <VButton :class="[$style.btn, $style.btnReset]"
                                     :disabled="isResetBtnDisabled"
                                     :color="($deviceIs.tablet || $deviceIs.mobile) ? 'light' : 'custom'"
                                     @click="$emit('reset')">
                                <IconPlus v-show="($deviceIs.laptop || $deviceIs.desktop)"
                                          :class="$style.resetIcon" />
                                Сбросить <span v-show="($deviceIs.laptop || $deviceIs.desktop)">фильтр</span>
                            </VButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';
    import {plural} from '~/assets/js/utils/textUtils';

    import IconLocation from '~/components/icons/IconLocation';
    import IconPlus from '~/components/icons/IconPlus';
    import IconSearch from '~/components/icons/IconSearch';

    export default {
        name: 'ProjectsFiltersModal',

        components: {
            IconLocation,
            IconPlus,
            IconSearch,
        },

        props: {
            projectsCount: {
                type: Number,
                default: 0,
            },

            buildingsCount: {
                type: Number,
                default: 0,
            },

            lotsCount: {
                type: Number,
                default: 0,
            },

            values: {
                type: Object,
                default: () => ({}),
            },

            specs: {
                type: Object,
                default: () => ({}),
            },

            facets: {
                type: Object,
                default: () => ({}),
            },

            cities: {
                type: Array,
                default: () => [],
            },

            isResetBtnDisabled: {
                type: Boolean,
                default: false,
            },

            isReloading: {
                type: Boolean,
                default: false,
            },

            page: {
                type: String,
                default: 'projects',
            },

            realtyType: {
                type: String,
                default: 'parking',
            },

            activeStage: {
                type: String,
                default: 'projects',
            }
        },

        computed: {
            ...mapGetters({
                getCurrentCity: 'getCurrentCity',
            }),

            itemsCount() {
                if (this.page === 'realty' && this.activeStage === 'buildings') {
                    return {plural: `${this.buildingsCount} ${plural(this.buildingsCount, ['корпус', 'корпуса', 'корпусов'])}`, empty: 'корпусов', count: this.buildingsCount};
                } else if (this.page === 'realty' && this.activeStage === 'floors') {
                    return {plural: `${this.lotsCount} ${plural(this.lotsCount, this.realtyType === 'parking'
                                ? ['машино-место', 'машино-места', 'машино-мест']
                                : ['кладовую', 'кладовые', 'кладовых'])}`,

                            empty: this.realtyType === 'parking' ? 'машино-мест' : 'кладовых',
                            count: this.lotsCount};
                }
                return {plural: `${this.projectsCount} ${plural(this.projectsCount, ['проект', 'проекта', 'проектов'])}`, empty: 'проектов', count: this.projectsCount};
            },

            isAnyRegions() {
                return this.cities.some(city => city.group);
            },
        },

        methods: {
            ...mapActions(['setCurrentCity']),
            ...mapActions('projects', ['fetchCurrentCityProject', 'setParams']),

            handleInput(value) {
                const city = this.cities.find(city => (city.value === value) || (city.value === value?.value)) || this.cities[0];
                this.setCurrentCity(city);
                this.fetchCurrentCityProject(city);
            },
        },
    };
</script>

<style lang="scss" module>
    .ProjectsFiltersModal {
        z-index: 100;

        & :global(.v-tab--square.v-tab--medium) {
            @include respond-to(xs) {
                padding: 0 2.1rem;
            }
        }
    }

    .wrap {
        overflow: auto;

        @include respond-to(sm) {
            align-items: center;
            padding: unset;
        }

        @include respond-to(xs) {
            align-items: unset;
            background-color: $base-0;
        }
    }

    .contentWrap {
        position: absolute;
        right: 0;
        display: flex;
        min-height: 100%;
        padding: 2.4rem;

        @include respond-to(sm) {
            position: relative;
            top: unset;
            right: unset;
            min-height: unset;
            margin-top: auto;
            padding: 0;
        }

        @include respond-to(xs) {
            margin-top: unset;
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        width: 56.8rem;
        min-height: 100%;
        border-radius: .8rem;
        background-color: $base-0;

        @include respond-to(sm) {
            width: 54.6rem;
            border-radius: 1.6rem 1.6rem 0 0;
        }

        @include respond-to(xs) {
            width: 100%;
            margin-top: unset;
            padding-bottom: 9rem;
            border-radius: unset;
        }
    }

    .closeBtn {
        position: absolute;
        top: 2.4rem;
        right: calc(100% + 1.2rem);

        @include respond-to(sm) {
            top: unset;
            left: calc(100% + 1.2rem);
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .closeBtnIcon {
        width: 1.6rem;
        height: 1.6rem;
        transform: rotate(45deg);
    }

    .head {
        padding-top: 2.4rem;

        @include respond-to(sm) {
            padding-bottom: 2.4rem;
            border-bottom: 1px solid $base-100;
        }

        @include respond-to(xs) {
            position: relative;
            display: flex;
            align-items: center;
            height: 6.4rem;
            padding: unset;
        }
    }

    .reset {
        display: none;

        &._disabled {
            opacity: .5;
            pointer-events: none;
        }

        @include respond-to(xs) {
            position: absolute;
            top: 50%;
            left: 1.6rem;
            display: block;
            transform: translateY(-50%);
        }
    }

    .closeBtnMobile {
        display: none;

        @include respond-to(xs) {
            position: absolute;
            top: 50%;
            right: 1.6rem;
            display: block;
            transform: translateY(-50%);
        }
    }

    .title {
        padding-left: 2.4rem;
        text-transform: uppercase;

        @include respond-to(sm) {
            padding-left: unset;
            text-align: center;
        }

        @include respond-to(xs) {
            width: 100%;
            font-size: 1.2rem;
            line-height: 1.2rem;
        }
    }

    .filtersContent {
        padding: 2.4rem;

        @include respond-to(sm) {
            border-bottom: 1px solid $base-100;
        }

        @include respond-to(xs) {
            padding: 1.6rem;
        }
    }

    .filterItem {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 2rem 0;

        &:not(:last-child) {
            border-bottom: 1px solid $base-100;
        }

        &:first-child {
            padding-top: 0;
        }

        @include respond-to(sm) {
            flex-direction: column;
            align-items: flex-start;
            padding: 0;

            &:not(:last-child) {
                margin-bottom: 2.4rem;
                border-bottom: unset;
            }
        }
    }

    .icon {
        width: 1.2rem;
        height: 1.2rem;
    }

    .label {
        font-family: $accent-font-family;
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 1.6rem;
        color: $base-400;

        @include respond-to(sm) {
            margin-bottom: 1.2rem;
        }
    }

    .tabs {
        width: 30rem;
        padding: .2rem;
        border-radius: .4rem;
        background-color: $base-50;

        & :global(.v-tab--square.v-tab--medium) {
            flex: 1;
            height: 4rem;
            padding: unset;

            &:first-child {
                min-width: 10rem;
            }
        }

        @include respond-to(sm) {
            width: unset;
            padding: 0;
            border-radius: unset;
            background-color: $base-0;

            & :global(.v-tab--square.v-tab--medium) {
                flex: unset;
                height: 4.4rem;
                padding: 2.4rem;

                &:first-child {
                    min-width: unset;
                }
            }
        }

        @include respond-to(xs) {
            & :global(.v-tab--square.v-tab--medium) {
                padding: 2.1rem;
            }
        }
    }

    .projectBtn {
        display: none;
    }

    .buttonsWrapper {
        display: flex;
        justify-content: flex-start;
        flex-direction: row-reverse;
        margin-top: auto;
        padding: 2.4rem;

        @include respond-to(sm) {
            flex-direction: row;
        }

        @include respond-to(xs) {
            position: fixed;
            bottom: 0;
            z-index: 10;
            width: 100%;
            padding: 1.6rem;
            background-color: $base-0;

            & .btnReset {
                display: none;
            }

            & .projectBtn {
                display: block;
            }
        }
    }

    .btn {
        @include respond-to(sm) {
            width: 50%;

            &:first-child {
                margin-right: 1.6rem;
            }
        }

        @include respond-to(xs) {
            width: 100%;

            &:first-child {
                margin-right: 0;
            }
        }
    }

    .btnReset {
        margin-right: .8rem;

        & :global(.v-button__text) {
            position: relative;
            padding-left: 1.6rem;
        }

        &:global(.v-button--custom.is-disabled) {
            opacity: .5;
            pointer-events: none;
        }

        @include hover {
            color: $blue;
        }

        @include respond-to(sm) {
            margin-right: 0;
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .resetIcon {
        position: absolute;
        top: 50%;
        left: 0;
        width: 1.2rem;
        height: 1.2rem;
        transform: translateY(-50%) rotate(45deg);
    }

    .btnProject {
        display: none;

        @include respond-to(xs) {
            display: block;
        }
    }

    .selectItem {
        width: 30rem;

        @include respond-to(sm) {
            width: 100%;
        }

        //@include respond-to(xs) {
        //    display: none;
        //}
    }

    .slider {
        width: 30rem;

        @include respond-to(sm) {
            width: 100%;
        }
    }

    .selectBtn {
        display: none;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        @include respond-to(xs) {
            display: flex;
        }

        &:global(.v-button--large) {
            padding: 0 1.6rem;
        }
    }

    .iconArrow {
        width: 1.2rem;
        height: 1.2rem;
        transform: rotate(-90deg);
    }

    .checkbox {
        padding-top: 1.1rem;

        @include respond-to(sm) {
            padding-top: 0;
        }
    }

    .emptyCard {
        display: flex;
        align-items: center;
        width: 100%;
        margin-top: 2.4rem;
        padding: 1.6rem;
        border-radius: .8rem;
        background-color: $base-50;

        @include respond-to(xs) {
            margin-bottom: .8rem;
        }
    }

    .iconWrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4rem;
        height: 4rem;
        margin-right: 1.6rem;
        border-radius: 50%;
        background-color: $base-0;
        color: $blue;
    }

    .iconSearch {
        width: 1.6rem;
        height: 1.6rem;
    }

    .emptyText {
        font-size: 1.2rem;
        line-height: 1.6rem;
    }
</style>
