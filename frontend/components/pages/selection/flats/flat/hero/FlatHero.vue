<template>
    <div :class="$style.FlatHero">
        <div :class="[$style.container, 'container']">
            <div :class="$style.topPanel">
                <NuxtLink :class="$style.backBtn"
                          to="/selection/flats">
                    <IconArrowBig :class="$style.iconArrow" />
                    <span class="p6">{{ $deviceIs.mobile ? 'Назад к выбору' : 'Вернуться к подбору по параметрам' }}</span>
                </NuxtLink>
                <div v-if="lot.number"
                     class="p5 c-base300">
                    Номер квартиры: {{ lot.number }}
                </div>
            </div>

            <div :class="$style.content">
                <FlatHeroInfo :class="$style.info"
                              :lot="lot"
                              :origin-url="originUrl"
                              :plan-link="planLink"
                              :is-mortgage-loading="isMortgageLoading"
                              :min-rate="minRate"
                              @open-call-modal="$emit('open-call-modal')"
                />

                <FlatHeroGallery :lot="lot"
                                 :class="$style.gallery"
                                 @open-gallery="openGalleryModal"
                                 @open-plan="openPlanModal"
                                 @change-plan="handleChangePlan"
                                 @change-genplan-view="handleChangeGenplanView" />

                <FlatHeroGalleryMobile :lot="lot"
                                       :class="$style.galleryMobile"
                                       @open-plan="openPlanModal" />
            </div>
        </div>
    </div>
</template>

<script>
    import IconArrowBig from '~/components/icons/IconArrowBig';
    import FlatHeroInfo from '~/components/pages/selection/flats/flat/hero/FlatHeroInfo';
    import FlatHeroGallery from '~/components/pages/selection/flats/flat/hero/FlatHeroGallery';
    import FlatHeroGalleryModal from '~/components/pages/selection/flats/flat/hero/FlatHeroGalleryModal';
    import FlatHeroGalleryMobile from '~/components/pages/selection/flats/flat/hero/FlatHeroGalleryMobile';

    export default {
        name: 'FlatHero',

        components: {
            IconArrowBig,
            FlatHeroInfo,
            FlatHeroGallery,
            FlatHeroGalleryMobile,
        },

        props: {
            lot: {
                type: Object,
                default: () => ({}),
            },

            originUrl: {
                type: String,
                default: '',
            },

            isMortgageLoading: {
                type: Boolean,
                default: false,
            },

            minRate: {
                type: [String, Number],
                default: '',
            },
        },

        data() {
            return {
                currentPlan: {
                    furniture: true,
                    not_main_wall: true,
                },

                planViewAngle: false,
            };
        },

        computed: {
            planLink() {
                const path = this.$route.fullPath.split('/');
                const lastIdx = path.length ? path.length - 1 : 0;

                const res = this.$router.resolve({
                    path: `/pdf/print/${path[lastIdx - 1]}/${path[lastIdx]}/plan`,
                    query: {
                        format: 'A4',
                        furniture: this.currentPlan.furniture,
                        not_main_wall: this.currentPlan.not_main_wall,
                        time: new Date().toLocaleTimeString('ru-RU'),
                    },
                });

                return res.href;
            },
        },

        methods: {
            openGalleryModal(val) {
                this.$modal.open(FlatHeroGalleryModal, {lot: this.lot, activeTab: val, planViewAngle: this.planViewAngle});
            },

            openPlanModal() {
                this.$modal.open(FlatHeroGalleryModal, {lot: this.lot, onlyPlan: true});
            },

            handleChangePlan(val) {
                this.currentPlan = val;
            },

            handleChangeGenplanView(val) {
                this.planViewAngle = val;
            }
        }

    };
</script>

<style lang="scss" module>
    .FlatHero {
        display: flex;
        flex-direction: column;
        width: 100%;
        min-height: calc(100vh - (#{$header-h} + #{$header-plank-h}));
        background-color: $base-50;

        @include respond-to(sm) {
            min-height: unset;
        }

        @include respond-to(xs) {
            & :global(.container) {
                padding: 0;
            }
        }
    }

    .container {
        display: flex;
        flex-direction: column;
        flex: 1;
        width: 100%;
        height: 100%;
    }

    .topPanel {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 6rem;
        min-height: 6rem;

        @include respond-to(sm) {
            height: 6.5rem;
            min-height: 6.5rem;
        }

        @include respond-to(xs) {
            height: 5.6rem;
            min-height: 5.6rem;
            padding: 0 1.6rem;
        }
    }

    .backBtn {
        display: flex;
        align-items: center;
        height: 100%;
        color: $base-500;
        cursor: pointer;

        @include hover {
            .iconArrow {
                transform: rotate(180deg) translateX(.5rem);
            }
        }
    }

    .iconArrow {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 1rem;
        margin-bottom: .2rem;
        color: $blue;
        transform: rotate(180deg);
        transition: transform .2s;
    }

    .content {
        display: flex;
        flex: 1;
        width: 100%;
        padding-bottom: 1.6rem;

        @include respond-to(sm) {
            flex-direction: column-reverse;
            padding-bottom: 2.4rem;
        }
    }

    .info {
        width: 42%;
        margin-right: 1.6rem;

        @include respond-to(sm) {
            width: 100%;
            margin-right: 0;
        }
    }

    .gallery {
        flex: 1;

        @include respond-to(sm) {
            flex: unset;
            width: 100%;
            height: 66.1rem;
            margin-bottom: 1.6rem;
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .galleryMobile {
        display: none;
        width: 100%;
        height: 42rem;
        margin-bottom: .4rem;
        padding: 1.6rem;
        border-radius: 1.6rem;
        background-color: $base-0;

        @include respond-to(xs) {
            display: block;
        }
    }
</style>
