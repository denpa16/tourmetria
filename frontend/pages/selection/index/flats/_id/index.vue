<template>
    <div ref="page"
         :class="$style.FlatPage">
        <FlatHero :lot="flat"
                  :origin-url="originUrl"
                  :is-mortgage-loading="isMortgageLoading"
                  :min-rate="minRate"
                  @open-call-modal="handleOpenCallModal" />
        <FlatFeatures
            v-if="flat.features.length"
            :feature-list="flat.features"
        />
        <FlatBenefits :benefit-list="benefitList" />
        <MortgageBlock
            :title="mainPage.title_mortgage"
            :default-params="mortgageInitialParams"
            :load-when-scrolled="false"
            load-when-mounted
            @loaded="handleMortgageLoaded"
        />
        <FlatSimilar :flats="similarFlats" />
        <FlatButtonsFixed
            :class="[$style.mobilePanel, {[$style._hidden]: !isButtonsVisible}]"
            :lot="flat"
            @open-call-modal="handleOpenCallModal"
        />
    </div>
</template>

<script>
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';
    import {mapGetters} from 'vuex';

    import FlatHero from '~/components/pages/selection/flats/flat/hero/FlatHero';
    import FlatBenefits from '~/components/pages/selection/flats/flat/FlatBenefits';
    import FlatFeatures from '~/components/pages/selection/flats/flat/FlatFeatures';
    import FlatButtonsFixed from '~/components/pages/selection/flats/flat/FlatButtonsFixed';
    import FormModal from '~/components/layout/modals/forms/FormModal';
    import ResultModal from '~/components/layout/modals/ResultModal';
    import FlatSimilar from '~/components/pages/selection/flats/flat/FlatSimilar';
    import MortgageBlock from '~/components/common/mortgage/MortgageBlock';
    import {clearDoubleSpaces} from '~/assets/js/utils/commonUtils';
    import {getFlatTitle, splitThousands} from '~/assets/js/utils/numberUtils';

    export default {
        name: 'FlatPage',

        components: {
            MortgageBlock,
            FlatFeatures,
            FlatSimilar,
            FlatBenefits,
            FlatHero,
            FlatButtonsFixed,
        },

        mixins: [breakpointCheck],
        scrollToTop: true,

        async asyncData({app, params, error}) {
            try {
                const [
                    flatRes,
                    similarFlats,
                    mainPage,
                ] = await Promise.all([
                    app.$axios.$get(app.$api.flats.id(params.id)),
                    app.$axios.$get(app.$api.flats.similar(params.id)),
                    app.$axios.$get(app.$api.mainPage),
                ]);

                const benefitList = await app.$axios.$get(app.$api.flatProjectFeatures.list, {
                    params: {
                        project: flatRes.project_slug
                    }
                });

                return {
                    flat: flatRes ? flatRes : {},
                    benefitList: benefitList || [],
                    similarFlats: similarFlats || [],
                    mainPage: mainPage || {},
                };
            } catch (err) {
                console.warn('[Flat page/asyncData] request failed: ', err);
                return error({statusCode: 404});
            }
        },

        data() {
            return {
                flat: {},
                similarFlats: [],
                benefitList: [],
                isButtonsVisible: true,
                orderStatus: '',
                orderId: '',
                contactNumber: '88007751793',
                mainPage: {},

                initialBankList: [],
                isMortgageLoading: true,
            };
        },

        head() {
            if (!this.flat?.project_name && !this.flat?.number) {
                return {};
            }

            const projectStr = this.flat?.project_name ? `${this.flat.project_name} ` : '';
            const buildingStr = this.flat?.building ? `Литер ${this.flat?.building} ` : '';
            const flatStr = this.flat?.number ? `квартира №${this.flat.number} ` : '';
            const floorStr = this.flat?.floor ? `${this.flat?.floor} этаж ` : '';
            const cityStr = this.flat?.city_name ? `г. ${this.flat?.city_name}` : '';

            const flatStrDescription = flatStr ? flatStr[0].toUpperCase() + flatStr.slice(1) : '';
            const buildingStrDescription = buildingStr ? `(${buildingStr.trim()}) ` : '';
            const floorStrDescription = floorStr ? `, ${floorStr}` : '';
            const cityStrDescription = cityStr ? `, ${cityStr}` : '';

            return {
                title: `${projectStr}${buildingStr}${flatStr}${floorStr}${cityStr}`.trim(),
                meta: [{
                    hid: 'description',
                    name: 'description',
                    content: `${flatStrDescription}в ${projectStr}${buildingStrDescription}от застройщика СК Неометрия${cityStrDescription}. Планировка ${this.flat?.area}м2${floorStrDescription}`.trim(),
                }],
            };
        },

        computed: {
            ...mapGetters('domain', {domain: 'getDomainAddress'}),

            originUrl() {
                return this.domain + this.$route.path;
            },

            mortgageInitialParams() {
                const initialParams = {};

                if (this.flat?.project_slug) {
                    initialParams.developmentprojectSlug = this.flat.project_slug;
                }
                if (this.flat?.price) {
                    initialParams.cost = this.flat?.original_price || this.flat.price;
                }

                return initialParams;
            },

            minRate() {
                return this.initialBankList[0]?.offers[0]?.rate || '';
            }
        },

        mounted() {
            window.addEventListener('scroll', this.handleScroll);

            this.orderId = this.$route.query.orderId;
            if (this.orderId) {
                this.$router.replace({query: null});
                this.getOrderStatus();
            }
        },

        beforeDestroy() {
            window.removeEventListener('scroll', this.handleScroll);
        },


        methods: {
            handleOpenCallModal() {
                const data = {
                    formTitle: 'Получить консультацию - квартира',
                    formSource: 'Страница квартиры',
                    formComment: clearDoubleSpaces(`
                        Тип:
                        Название планировки:
                        Цена:
                        Площадь:
                        Апартаменты: ${this.flat?.project_name || ''}
                        Литер: ${this.flat?.building || ''}
                        Код планировки:
                        Этаж: ${this.flat?.floor || ''}
                        Квартира ${this.flat?.rooms ? getFlatTitle(this.flat.rooms)?.fullNumber : ''}
                        Общая площадь: ${this.flat?.area || ''}
                        IP пользователя:
                        Стоимость квартиры: ${this.flat?.price ? splitThousands(this.flat?.original_price || this.flat.price) : ''}
                        Номер: ${this.flat?.number}
                    `),
                };

                this.$modal.open(FormModal, data);
            },

            handleScroll() {
                if (this.breakpoint === 'xs' && this.$refs.page) {
                    const position = this.$refs.page.getBoundingClientRect().bottom;
                    this.isButtonsVisible = position >= 700;
                }
            },

            openResultModal() {
                this.$modal.open(ResultModal, {
                    status: this.orderStatus,
                });
            },

            async getOrderStatus() {
                try {
                    this.orderStatus = await this.$axios.$post(this.$api.booking.orderStatus, {
                        bank_order_id: this.orderId
                    });
                    this.openResultModal();
                } catch (error) {
                    console.warn('[Flat page/getOrderStatus] request failed: ', error);
                }
            },

            handleMortgageLoaded(list) {
                this.initialBankList = list;
                this.isMortgageLoading = false;
            },
        },
    };
</script>

<style lang="scss" module>
    .FlatPage {
        //
    }

    .mobilePanel {
        display: none;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 10;
        transition: all .2s linear;

        @include respond-to(xs) {
            display: block;
        }

        &._hidden {
            opacity: 0;
            transform: translateY(100%);
        }
    }
</style>
