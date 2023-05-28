<template>
    <div v-if="mapDisplay"
         :class="$style.ProjectInfra">
        <div :class="$style.headerVector"></div>
        <div :class="$style.wrapper">
            <div :class="[$style.content, 'container']">
                <div :class="$style.contentHeader">
                    <h2 :class="[$style.title, 'h1']">
                        локация и инфраструктура
                    </h2>
                    <p :class="[$style.tooltip, 'p3', 'c-base300']">
                        Нажмите на объект для просмотра карты
                    </p>
                    <VButton v-show="$deviceIs.laptop || $deviceIs.desktop"
                             :class="$style.btn"
                             color="primary"
                             @click="handleOpenModal">
                        Открыть карту
                    </VButton>
                </div>

                <VButton v-show="$deviceIs.tablet || $deviceIs.mobile"
                         :class="$style.btn"
                         color="primary"
                         @click="handleOpenModal">
                    Открыть карту
                </VButton>

                <ul v-if="cards.length"
                    :class="$style.cards">
                    <ProjectInfraCard
                        v-for="card in cards"
                        :key="card.id"
                        :card="card"
                        elem="li"
                        @click="handleOpenModal"
                    />
                </ul>

                <div :class="$style.slider">
                    <transition name="fade-content">
                        <div v-show="isLoaded"
                             ref="slider"
                             class="swiper"
                             :class="$style.swiper"
                        >
                            <div v-if="cards.length"
                                 class="swiper-wrapper">
                                <div v-for="card in cards"
                                     :key="card.id"
                                     :class="$style.slide"
                                     class="swiper-slide"
                                >
                                    <ProjectInfraCard :card="card"
                                                      @click="handleOpenModal" />
                                </div>
                            </div>
                        </div>
                    </transition>

                    <SliderNavigation
                        v-show="totalSlides > 1"
                        ref="nav"
                        :class="$style.nav"
                        color="gray"
                    >
                        <div :class="[$style.pagination, 'c-base300']">
                            {{ `${activeSlide}/${totalSlides}` }}
                        </div>
                    </SliderNavigation>
                </div>
            </div>

            <div :class="$style.map">
                <ImageLazy
                    :image="mapDisplay"
                    :preview="mapPreview"
                    absolute
                />
                <div :class="$style.pin"
                     :style="{top: `${project.latitude}%`, left: `${project.longitude}%`}"
                     @click="handleOpenModal"
                >
                    <ImageLazy :class="$style.pinShield"
                               :image="project.image_in_map_display"
                               :preview="project.image_in_map_preview"
                               relative />
                    <IconPinTriangle :class="$style.pinIcon"
                                     fill="#009EAE" />
                    <span :class="[$style.pinCaption, 'p2', 'c-blue']">Посмотреть инфраструктуру</span>
                </div>
            </div>

            <div :class="$style.mapTopBg"></div>

            <ProjectInfraMapModal v-if="isShowModal"
                                  :project="project"
                                  :infras="infras"
                                  :infras-categories="infrasCategories"
                                  :initial-categories="initialCategories"
                                  @close="handleCloseModal" />
        </div>
    </div>
</template>

<script>
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';

    import ProjectInfraMapModal from '~/components/common/projects/project/infra/map/ProjectInfraMapModal';
    import ImageLazy from '~/components/common/ImageLazy';
    import ProjectInfraCard from '~/components/common/projects/project/infra/ProjectInfraCard';
    import SliderNavigation from '~/components/common/SliderNavigation';
    import IconPinTriangle from '~/components/icons/IconPinTriangle';
    import {lockBody, unlockBody} from '~/assets/js/utils/lockUtilsMain';

    export default {
        name: 'ProjectInfra',

        components: {
            ProjectInfraMapModal,
            SliderNavigation,
            ProjectInfraCard,
            ImageLazy,
            IconPinTriangle
        },

        props: {
            mapDisplay: {
                type: String,
                default: ''
            },

            mapPreview: {
                type: String,
                default: ''
            },

            project: {
                type: Object,
                default: () => ({})
            },

            infras: {
                type: Array,
                default: () => []
            },

            infrasCategories: {
                type: Array,
                default: () => []
            },
        },

        data() {
            return {
                isShowModal: false,
                isLoaded: false,
                initialCategories: [],
                activeSlide: 1,
                totalSlides: 1,
                currentInitialSlide: 0,
            };
        },

        computed: {
            cards() {
                return this.project?.local_obj || [];
            }
        },

        mounted() {
            if (this.$refs.slider) {
                addResizeListener(this.$refs.slider, this.updateSwiper);
            }
            this.isLoaded = true;
        },

        beforeDestroy() {
            if (this.$refs.slider) {
                removeResizeListener(this.$refs.slider, this.updateSwiper);
            }
            this.slider?.destroy();
        },

        methods: {
            initSlider() {
                if (this.$refs.slider) {
                    const options = {
                        speed: 1000,
                        slidesPerView: 2.1,
                        spaceBetween: 16,
                        initialSlide: this.currentInitialSlide,
                        allowTouchMove: true,
                        navigation: {
                            nextEl: this.$refs.next?.$el || this.$refs.next || this.$refs.nav.$refs.next || false,
                            prevEl: this.$refs.prev?.$el || this.$refs.prev || this.$refs.nav.$refs.prev || false,
                        },

                        on: {
                            init: () => {
                                this.activeSlide = (this.currentInitialSlide + 1) || 1;
                                this.totalSlides = Math.ceil(this.$refs.slider.swiper.slides.length - this.$refs.slider.swiper.params.slidesPerView + 1);
                            },
                        },
                    };

                    this.slider = new this.$Swiper(this.$refs.slider, options);

                    this.slider.on('activeIndexChange', () => {
                        this.activeSlide = this.$refs.slider.swiper.realIndex + 1;
                    });
                }
            },

            updateSwiper() {
                this.currentInitialSlide = this.activeSlide - 1;
                this.slider?.destroy();
                this.$nextTick(() => {
                    this.initSlider();
                });
            },

            handleOpenModal(event, categories) {
                this.initialCategories = categories;
                this.isShowModal = true;
                lockBody();
            },

            handleCloseModal() {
                unlockBody();
                this.isShowModal = false;
            }
        },
    };
</script>

<style lang="scss" module>
    .ProjectInfra {
        //
    }

    .headerVector {
        width: 100%;
        height: 17.1rem;
        border-bottom: 1px solid $black;
        background-image: url("/images/vectorBottom.svg");
        background-size: 100% 100%;
        opacity: .081;

        @include respond-to(sm) {
            height: 11.8rem;
        }

        @include respond-to(xs) {
            height: 5.6rem;
        }
    }

    .wrapper {
        position: relative;
        height: calc(100vh - #{$header-h});
        padding-bottom: 2.4rem;

        @include respond-to(sm) {
            min-height: 78.6rem;
        }

        @include respond-to(xs) {
            height: calc(100vh - #{$header-mobile-h});
            padding-bottom: 4rem;
        }
    }

    .content {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .contentHeader {
        margin: 0 auto;

        @include respond-to(sm) {
            margin: unset;
        }
    }

    .title {
        margin-top: .5rem;
        margin-bottom: 1.2rem;
        text-align: center;
        text-transform: uppercase;
        white-space: nowrap;
        font-size: 7.8rem;
        font-weight: 600;
        line-height: 1.2;

        @include respond-to(md) {
            font-size: 5.2vw;
        }

        @include respond-to(sm) {
            font-size: 4rem;
        }

        @include respond-to(xs) {
            margin-top: 1.6rem;
            margin-bottom: .8rem;
            text-align: left;
            font-size: 2rem;
        }
    }

    .tooltip {
        max-width: 19.2rem;

        @include respond-to(xs) {
            font-size: 1.4rem;
            line-height: 1.6rem;
        }
    }

    .btn {
        align-self: flex-start;
        margin-top: 3.2rem;

        @include respond-to(sm) {
            align-self: stretch;
            margin-top: auto;
        }
    }

    .cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.6rem;
        margin-top: auto;

        @include respond-to(sm) {
            display: none;
        }

        @include respond-to(xs) {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            margin-top: 3.2rem;
        }
    }

    .slider {
        display: none;

        @include respond-to(sm) {
            display: block;
            margin: 3.2rem -2.4rem 0;
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .swiper {
        padding: 0 2.4rem;
    }

    .nav {
        margin: 2.4rem 2.4rem 0;
    }

    .pagination {
        width: 100%;
        text-align: center;
    }

    .map {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 90%;

        &:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            display: block;
            width: 100%;
            height: 100%;
            background: radial-gradient(76.42% 241.54% at 74% 50%, rgba(255, 255, 255, 0) 68.75%, $base-0 100%);
        }

        &:after {
            content: "";
            position: absolute;
            bottom: -.1rem;
            left: 0;
            display: block;
            width: 100%;
            height: 21.3rem;
            background: linear-gradient(180deg, $base-0 0%, rgba(255, 255, 255, .991353) 6.67%, rgba(255, 255, 255, .96449) 13.33%, rgba(255, 255, 255, .91834) 20%, rgba(255, 255, 255, .852589) 26.67%, rgba(255, 255, 255, .768225) 33.33%, rgba(255, 255, 255, .668116) 40%, rgba(255, 255, 255, .557309) 46.67%, rgba(255, 255, 255, .442691) 53.33%, rgba(255, 255, 255, .331884) 60%, rgba(255, 255, 255, .231775) 66.67%, rgba(255, 255, 255, .147411) 73.33%, rgba(255, 255, 255, .0816599) 80%, rgba(255, 255, 255, .03551) 86.67%, rgba(255, 255, 255, .0086472) 93.33%, rgba(255, 255, 255, 0) 100%);
            transform: matrix(1, 0, 0, -1, 0, 0);

            @include respond-to(xs) {
                height: 12.8rem;
            }
        }

        @include respond-to(sm) {
            height: 60%;
        }
    }

    .mapTopBg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 21.3rem;
        background: linear-gradient(180deg, $base-0 38.03%, rgba(255, 255, 255, .991353) 42.16%, rgba(255, 255, 255, .96449) 46.29%, rgba(255, 255, 255, .91834) 5.42%, rgba(255, 255, 255, .852589) 54.55%, rgba(255, 255, 255, .768225) 58.69%, rgba(255, 255, 255, .668116) 62.82%, rgba(255, 255, 255, .557309) 66.95%, rgba(255, 255, 255, .442691) 71.08%, rgba(255, 255, 255, .331884) 75.21%, rgba(255, 255, 255, .231775) 79.34%, rgba(255, 255, 255, .147411) 83.47%, rgba(255, 255, 255, .0816599) 87.61%, rgba(255, 255, 255, .03551) 91.74%, rgba(255, 255, 255, .0086472) 95.87%, rgba(255, 255, 255, 0) 100%);

        @include respond-to(xs) {
            height: 12.8rem;
        }
    }

    .pin {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 10;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transform: translateX(-50%) translateY(-50%) scale(1);
        transition: all $default-transition;
        cursor: pointer;

        @include hover {
            transform: translateX(-50%) translateY(-50%) scale(1.05);
        }

        &:hover .pinShield {
            opacity: .8;
        }
    }

    .pinShield {
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4.8rem;
        height: 4.8rem;
        padding-top: .3rem;
        border-radius: 50%;
        border: .4rem solid $blue;
        opacity: 1;
        transform: translateZ(0);
        transition: all $default-transition;

        @include respond-to(sm) {
            width: 4rem;
            height: 4rem;
        }
    }

    .pinIcon {
        width: 1.2rem;
        height: 1.2rem;
        margin-top: .2rem;
        color: $blue;
    }

    .pinCaption {
        margin-top: .8rem;
        text-align: center;
        text-transform: uppercase;
        font-weight: 700;
    }
</style>
