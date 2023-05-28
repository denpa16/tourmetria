<template>
    <div ref="projectMenu"
         :class="[$style.ProjectMenu]"
    >
        <ProjectMenuBar
            :logo="project.logo"
            :logo-content="project.logo_content"
            :price-floor="priceFloor"
            :payment-floor="paymentFloor"
            :nav-links="filteredNavLinks"
            :project-slug="project.slug"
            :promo-count="promoCount"
            :lot-labels="lotLabels"
            @open-menu="onOpenMenu"
            @open-form="onOpenForm"
            @scroll-to="onScrollTo"
            @lot-btn-click="handleLotBtnClick"
        />
        <ProjectMenuInfo
            :deadline-year="project.deadline_year"
            :deadline-quarter="project.deadline_quarter"
            :city="project.city"
            :direction-signs="project.direction_signs"
            :nav-links="filteredNavLinks"
            :price-floor="priceFloor"
            :payment-floor="paymentFloor"
            :lot-labels="lotLabels"
            @open-menu="onOpenMenu"
            @open-form="onOpenForm"
            @scroll-to="onScrollTo"
            @lot-btn-click="handleLotBtnClick"
        />
    </div>
</template>

<script>
    import ProjectMenuBar from '~/components/common/projects/project/menu/ProjectMenuBar';
    import ProjectMenuInfo from '~/components/common/projects/project/menu/ProjectMenuInfo';
    import SelectModal from '~/components/layout/modals/SelectModal';
    import FormModal from '~/components/layout/modals/forms/FormModal';
    import {
        clearDoubleSpaces,
        roundToMillions,
    } from '~/assets/js/utils/commonUtils';
    import {splitThousands} from '~/assets/js/utils/numberUtils';

    export default {
        name: 'ProjectMenu',

        components: {
            ProjectMenuBar,
            ProjectMenuInfo,
        },

        props: {
            project: {
                type: Object,
                default: () => ({}),
            },

            promoCount: {
                type: Number,
                default: 0,
            },

            lotLabels: {
                type: Object,
                default: () => ({}),
            },

            lotPageLink: {
                type: Object,
                default: () => ({}),
            },

            isShowBlocks: {
                type: Object,
                default: () => ({}),
            },
        },

        data() {
            return {
                navLinks: [
                    {
                        value: 'about',
                        label: 'О проекте'
                    },
                    {
                        value: 'genplan',
                        label: 'Генплан'
                    },
                    {
                        value: 'infra',
                        label: 'Локация и инфраструктура'
                    },
                    {
                        value: 'benefits',
                        label: 'Преимущества'
                    },
                    {
                        value: 'layouts',
                        label: 'Типовые планировки'
                    },
                    {
                        value: 'finishes',
                        label: `Отделка ${this.lotLabels.plural[1]}`
                    },
                    {
                        value: 'promotions',
                        label: 'Акции и скидки'
                    },
                    {
                        value: 'mortgage',
                        label: 'Ипотека'
                    },
                    {
                        value: 'advantages',
                        label: 'Преимущества ГК'
                    },
                    {
                        value: 'payment',
                        label: 'Способы оплаты'
                    },
                    {
                        value: 'progress',
                        label: 'Ход строительства'
                    },
                    {
                        value: 'care',
                        label: 'NEO-забота'
                    },
                    {
                        value: 'office',
                        label: 'Офис продаж'
                    },
                    {
                        value: 'docs',
                        label: 'Документы'
                    },
                    {
                        value: 'news',
                        label: 'Новости'
                    },
                ],
            };
        },

        computed: {
            filteredNavLinks() {
                return this.navLinks.filter(link => this.isShowBlocks[link.value] !== false);
            },

            priceFloor() {
                return this.project?.flat_min_price ? `${roundToMillions(this.project.flat_min_price)} млн. Р` : '';
            },

            paymentFloor() {
                return this.project?.min_mortgage ? `${splitThousands(this.project?.min_mortgage)} Р/мес` : '';
            }
        },

        mounted() {
            this.resizeObserver = new ResizeObserver(this.onResize);
            if (this.$refs.projectMenu) {
                this.resizeObserver.observe(this.$refs.projectMenu);
            }
            window.addEventListener('resize', this.onResize);
        },

        beforeDestroy() {
            if (this.$refs.projectMenu) {
                this.resizeObserver.unobserve(this.$refs.projectMenu);
            }
            window.removeEventListener('resize', this.onResize);
        },

        methods: {
            onResize() {
                if (this.$deviceIs.mobile) {
                    this.$emit('update-height', 0);
                    return;
                }

                this.$emit('update-height', this.$refs.projectMenu.getBoundingClientRect().height);
            },

            onOpenMenu() {
                this.$modal.open(SelectModal, {
                    title: 'Навигация по проекту',
                    options: this.filteredNavLinks,
                    value: '',
                    type: 'value',
                    filter: value => setTimeout(() => this.onScrollTo(value.value), 700),
                });
            },

            onOpenForm() {
                const data = {
                    formTitle: `Заказать консультацию. Проект - ${this.project?.name || 'страница проекта'}`,
                    formSource: `Страница ${this.project?.name}: Меню страницы проекта`,
                    formComment: clearDoubleSpaces(`
                        Проект: ${this.project?.name || ''};
                        Город проекта: ${this.project?.city?.name || ''};
                    `),
                };

                this.$modal.open(FormModal, data);
            },

            onScrollTo(value) {
                this.$emit('scroll-to', value);
            },

            handleLotBtnClick() {
                this.$router.push(this.lotPageLink);
            },
        }
    };
</script>

<style lang="scss" module>
    .ProjectMenu {
        //
    }
</style>
