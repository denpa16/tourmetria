<template>
    <section
        ref="projectBenefits"
        :class="$style.ProjectBenefits"
    >
        <div :class="$style.benefitsHeader">
            <h3 :class="[$style.benefitsTitle, 'h3']">
                Преимущества
                <span :class="[$style.benefitsCounter, 'c-base300']">{{ allBenefitsCounter }}</span>
            </h3>
        </div>
        <div :class="$style.benefitsControl">
            <VTabs
                :class="$style.categoriesTab"
                :tabs="categories"
                :value="currentCategory"
                is-required
                @change="handleCategoryChange"
            />
            <VSelect
                :class="$style.categoriesSelect"
                :value="currentCategory"
                :options="categories"
                bordered
                @input="handleCategoryChange"
            />
            <div :class="$style.cta">
                <VButton v-if="!isHotelProject"
                         :class="$style.ctaItem"
                         color="light"
                         link="/selection/storage"
                         blank>
                    Кладовые
                </VButton>
                <VButton v-if="!isHotelProject"
                         :class="$style.ctaItem"
                         color="light"
                         link="/selection/parking"
                         blank>
                    Паркинг
                </VButton>
                <!-- Временное скрытие кнопки перехода на подбор гостиничных номеров -->
                <VButton v-if="!isHotelProject"
                         :class="$style.ctaItem"
                         :link="lotPageLink"
                         blank>
                    Выбрать {{ lotLabels.singular[3] }}
                </VButton>
            </div>
        </div>
        <div :class="[$style.benefitsBody, 'container']">
            <ul :class="$style.benefitList">
                <li
                    v-for="(benefit, index) in benefitsToShow"
                    :key="benefit.id"
                    :class="$style.benefitItem"
                >
                    <ProjectBenefitCard
                        :benefit="benefit"
                        :is-hint-visible="index === 0 && isHintVisible"
                        @cardClicked="openBenefitModal(benefit)"
                    />
                </li>
            </ul>
            <VButton
                v-if="!isShowAllBenefits && chosenBenefitsCounter > 6"
                :class="$style.buttonMore"
                :color="breakpoint==='xs' ? 'light' : 'primary'"
                @click="showAllBenefits"
            >
                {{ buttonMoreText }}
            </VButton>
            <div :class="$style.ctaMobile">
                <!-- Временное скрытие кнопки перехода на подбор гостиничных номеров -->
                <VButton
                    v-if="!isHotelProject"
                    :class="$style.chooseFlat"
                    :link="lotPageLink"
                    blank
                >
                    Выбрать {{ lotLabels.singular[3] }}
                </VButton>
                <VButton
                    v-if="!isHotelProject"
                    :class="$style.chooseStoreroom"
                    color="light"
                    link="/selection/storage"
                    blank
                >
                    Выбрать кладовую
                </VButton>
                <VButton
                    v-if="!isHotelProject"
                    :class="$style.chooseParking"
                    color="light"
                    link="/selection/parking"
                    blank
                >
                    Выбрать паркинг
                </VButton>
            </div>
        </div>

        <BenefitModal v-if="isBenefitModalShown"
                      :benefit-list="benefitList"
                      :chosen-benefit="chosenBenefit"
                      @close="closeBenefitModal" />
    </section>
</template>

<script>
    import {lockBody, unlockBody} from '~/assets/js/utils/lockUtilsMain';
    import {plural} from '~/assets/js/utils/textUtils';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';

    import ProjectBenefitCard from '~/components/common/projects/project/benefits/ProjectBenefitCard';
    import BenefitModal from '~/components/common/projects/project/benefits/BenefitModal';

    export default {
        name: 'ProjectBenefits',
        components: {BenefitModal,
                     ProjectBenefitCard},

        mixins: [breakpointCheck],
        props: {
            benefitsCategories: {
                type: Array,
                default: () => []
            },

            lotLabels: {
                type: Object,
                default: () => ({}),
            },

            lotPageLink: {
                type: Object,
                default: () => ({}),
            },

            isHotelProject: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                currentCategory: 'all',
                isBenefitModalShown: false,
                chosenBenefit: {},
                projectBenefitsElement: null,
                observer: null,
                isHintVisible: false,
                isShowAllBenefits: false
            };
        },

        computed: {
            categories() {
                return [
                    {
                        label: 'Все',
                        value: 'all'
                    },
                    ...this.benefitsCategories.map((benefit, index) => ({label: benefit.title, value: index}))
                ];
            },

            benefitList() {
                // Все объекты преимуществ заносим в один массив и добавляем поля с названием и индексом категории(нужно для модалки)
                const allBenefits = this.benefitsCategories
                    .reduce((acc, category, index) => [...acc, ...category.benefits
                        .map(benefit => ({...benefit, category_title: category.title, category_index: index}))], [])
                    .sort((a, b) => a?.order - b?.order);
                if (this.currentCategory === 'all') {
                    return allBenefits;
                }
                return allBenefits.filter(benefit => benefit.category_index === this.currentCategory);
            },

            benefitsToShow() {
                return this.isShowAllBenefits ? this.benefitList : this.benefitList.slice(0, 6);
            },

            allBenefitsCounter() {
                return this.benefitsCategories.reduce((acc, category) => acc+category.benefits.length, 0);
            },

            chosenBenefitsCounter() {
                return this.benefitList.length;
            },

            buttonMoreText() {
                const moreCounter = this.chosenBenefitsCounter - 6;
                return `+ ${moreCounter} ${plural(moreCounter, ['преимущество', 'преимущества', 'преимуществ'])}`;
            },
        },

        mounted() {
            this.projectBenefitsElement = this.$refs.projectBenefits;
            if (this.$deviceIsMobile) {
                this.observer = new IntersectionObserver(this.handleIntersect, {
                    threshold: 0,
                });
                this.observer.observe(this.projectBenefitsElement);
            }
        },

        beforeDestroy() {
            if (this.observer) {
                this.observer.unobserve(this.projectBenefitsElement);
            }
        },

        methods: {
            handleCategoryChange(value) {
                this.currentCategory = value;
            },

            openBenefitModal(benefit) {
                this.chosenBenefit = benefit;
                lockBody();
                this.isBenefitModalShown = true;
            },

            closeBenefitModal() {
                unlockBody();
                this.isBenefitModalShown = false;
            },

            handleIntersect(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.isHintVisible = true;
                        setTimeout(() => {
                            this.isHintVisible = false;
                            this.observer.unobserve(this.projectBenefitsElement);
                        }, 4000);
                    }
                });
            },

            showAllBenefits() {
                this.isShowAllBenefits = true;
            }
        },
    };
</script>

<style lang="scss" module>
    .ProjectBenefits {
        width: 100%;
    }

    .benefitsHeader {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 10.4rem 2.4rem 6.4rem;

        @include respond-to(sm) {
            padding: 6.4rem 2.4rem 3.2rem;
        }

        @include respond-to(xs) {
            padding: 4rem 1.6rem 2.4rem;
        }
    }

    .benefitsTitle {
        text-transform: uppercase;

        @include respond-to(xs) {
            font-size: 2rem;
            line-height: 2.8rem;
        }
    }

    .benefitsBody {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .benefitsControl {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: calc(100% - 4.8rem);
        margin: 0 2.4rem 2.4rem;
        padding: 1.2rem 0;
        border-top: 1px solid $base-100;
        border-bottom: 1px solid $base-100;

        @include respond-to(xs) {
            width: calc(100% - 3.2rem);
            margin: 0 1.6rem 2.4rem;
        }

        @include respond-to(xs) {
            width: 100%;
            margin: 0 0 2.4rem;
            border: none;
        }
    }

    .categoriesTab {
        display: flex;
        width: fit-content;

        @include respond-to(sm) {
            display: none;
        }

        @include respond-to(xs) {
            overflow-x: auto;
            display: flex;
            scrollbar-width: none;
            -ms-overflow-style: none;

            &::-webkit-scrollbar {
                display: none;
            }
        }

        :global(.v-tabs__wrapper) {
            flex-wrap: nowrap;
            width: 100%;
            margin: 0;
            padding: .2rem;
            border-radius: .4rem;
            background-color: $base-50;

            @include respond-to(xs) {
                width: unset;
                padding: .2rem 1.6rem;
                background-color: transparent;
            }
        }

        :global(.v-tabs__tab) {
            margin: 0 .4rem 0 0;

            &:last-child {
                margin-right: 0;
            }
        }
    }

    .categoriesSelect {
        display: none;

        @include respond-to(sm) {
            display: flex;
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .cta {
        display: flex;

        @include respond-to(xs) {
            display: none;
        }
    }

    .ctaItem {
        margin-right: .8rem;

        &:last-child {
            margin-right: 0;
        }
    }

    .benefitList {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.6rem;
        width: 100%;
        margin-bottom: 6.4rem;

        @include respond-to(sm) {
            grid-template-columns: repeat(2, 1fr);
            margin-bottom: 2.4rem;
            column-gap: 1.6rem;
            row-gap: 2.4rem;
        }
    }

    .buttonMore {
        margin-bottom: 10.4rem;

        @include respond-to(sm) {
            width: 100%;
            margin-bottom: 3.2rem;
        }

        @include respond-to(sm) {
            margin-bottom: 4rem;
        }
    }

    .ctaMobile {
        display: none;

        @include respond-to(xs) {
            display: grid;
            width: 100%;
            grid-template-areas:
                "flat flat"
                "storeroom parking";
            gap: .8rem;
            margin-bottom: 4rem;

            :global(.v-button--large) {
                padding: 0;
            }
        }
    }

    .chooseFlat {
        grid-area: flat;
    }

    .chooseStoreroom {
        grid-area: storeroom;
    }

    .chooseParking {
        grid-area: parking;
    }
</style>
