<template>
    <div :class="$style.ProjectCard"
         @mouseleave="onMouseleave">
        <div :class="[$style.imagesWrapper, {[$style._opened]: isAdditionalOpened}]">
            <div :class="$style.tags">
                <TagsList :tags="tags"
                          :shown-tags-count="3"
                          color-activator="transparent" />
            </div>
            <div :class="[$style.pagination, `swiper-pagination-${project.id}`]"></div>
            <div v-if="slides.length > 1"
                 :class="$style.navigation">
                <VSquareButton ref="prev"
                               :class="$style.navBtn"
                               size="custom"
                               color="white"
                               aria-label="Предыдущий слайд"
                >
                    <IconArrowLeft :class="$style.navIcon" />
                </VSquareButton>
                <VSquareButton ref="next"
                               :class="[$style.navBtn, $style._right]"
                               size="custom"
                               color="white"
                               aria-label="Следующий слайд"
                >
                    <IconArrowLeft :class="$style.navIcon" />
                </VSquareButton>
            </div>
            <TheLink v-bind="linkAttrs">
                <div ref="slider"
                     class="swiper"
                     :class="$style.swiper"
                >
                    <div class="swiper-wrapper">
                        <div v-for="(slide, idx) in slides"
                             :key="idx"
                             :class="$style.slide"
                             class="swiper-slide"
                        >
                            <div ref="image"
                                 :class="$style.image">
                                <ImageLazy
                                    :preview="slide.image_preview"
                                    :image="slide.image_display"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </TheLink>
        </div>

        <div
            :class="[$style.info, {[$style._opened]: isAdditionalOpened}]"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
        >
            <div :class="$style.buttons">
                <transition name="fade-content">
                    <VSquareButton v-show="!isAdditionalOpened || ($deviceIs.tablet || $deviceIs.mobile)"
                                   size="xsmall"
                                   :class="$style.btn"
                                   aria-label="Показать или скрыть дополнительную информацию"
                                   @click="handleClick"
                    >
                        <transition name="fade-content"
                                    mode="out-in">
                            <IconArrowRight v-if="!isAdditionalOpened"
                                            :class="$style.icon" />
                            <IconPlus v-else
                                      :class="$style.iconPlus" />
                        </transition>
                    </VSquareButton>
                </transition>
                <transition name="fade-content">
                    <TheLink v-show="isAdditionalOpened && ($deviceIs.laptop || $deviceIs.desktop)"
                             :class="$style.projectLink"
                             v-bind="linkAttrs">
                        <span>Смотреть проект</span>
                        <IconArrowBig :class="$style.linkIcon" />
                    </TheLink>
                </transition>
            </div>
            <div :class="[$style.infoInner, {[$style._opened]: isAdditionalOpened}]"
                 @click="handleClick">
                <div>
                    <h4 :class="['h4', $style.title]">
                        {{ project.name }}
                    </h4>
                    <transition name="fade-content"
                                mode="out-in">
                        <p v-if="prices.min_price"
                           :key="prices.min_price"
                           :class="['h4','c-blue', $style.title]">
                            от {{ prices.min_price }} млн р
                        </p>
                    </transition>
                </div>

                <div :class="$style.wrapper">
                    <transition name="fade-content">
                        <div v-show="!isAdditionalOpened"
                             :class="$style.location">
                            <span v-if="project.city"
                                  class="p6">{{ project.city.name }}</span>
                            <AnimationRow v-if="project.direction_signs && project.direction_signs.length"
                                          :class="$style.metro"
                                          :items="project.direction_signs">
                                <template #default="{item}">
                                    <MetroInfo
                                        :metro="item"
                                        :class="$style.metroItem"
                                    />
                                </template>
                            </AnimationRow>
                        </div>
                    </transition>
                    <transition name="fade-content">
                        <div v-show="isAdditionalOpened"
                             :class="[$style.watchCount, 'p6']">
                            <IconAboutCompany :class="$style.watchIcon" />
                            Сейчас смотрят {{ watchNumber }} {{ watchNumber | plural(['человек', 'человека', 'человек']) }}
                        </div>
                    </transition>

                    <p v-if="project.flat_count"
                       :class="[$style.flatCount, 'p6', 'c-base300']">
                        {{ flatCount }} {{ flatCount | plural(['квартира', 'квартиры', 'квартир']) }}
                    </p>
                </div>
            </div>

            <div :class="$style.infoAdditional">
                <div :class="$style.wrapperAdditional">
                    <p v-if="project.deadline_year"
                       :class="$style.textAdditional">
                        {{ deadlineText }}
                    </p>
                    <transition name="fade-content"
                                mode="out-in">
                        <p v-if="prices.min_mortgage"
                           :key="prices.min_mortgage"
                           :class="$style.textAdditional">
                            Ипотека от {{ prices.min_mortgage | splitThousands }} <span :class="$style.rub">₽</span>/мес.
                        </p>
                    </transition>
                </div>
                <ul :class="$style.links">
                    <li v-for="link in links"
                        :key="link.value"
                        :class="[$style.linkWrapper, {[$style._disabled]: link.disabled}]"
                        @mouseenter="handleRoomMouseEnter(link.value)"
                        @mouseleave="handleRoomMouseLeave">
                        <nuxt-link :to="link.link"
                                   :class="[$style.link, 'p6']">
                            {{ link.label }}
                        </nuxt-link>
                    </li>
                </ul>

                <VButton :class="$style.mobileBtn"
                         size="custom"
                         responsive
                         :link="linkProject">
                    Подробнее о проекте
                </VButton>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';
    import {plural} from '~/assets/js/utils/textUtils';
    import {
        splitShort,
        splitThousands,
        isDeadlinePassed,
        quaterToRoman,
    } from '~/assets/js/utils/numberUtils';

    import ImageLazy from '~/components/common/ImageLazy';
    import IconArrowLeft from '~/components/icons/IconArrowLeft';
    import AnimationRow from '~/components/common/AnimationRow';
    import MetroInfo from '~/components/common/metro/MetroInfo';
    import IconAboutCompany from '~/components/icons/IconAboutCompany';
    import IconArrowBig from '~/components/icons/IconArrowBig';
    import TagsList from '~/components/common/TagsList';
    import IconArrowRight from '~/components/icons/IconArrowRight';
    import IconPlus from '~/components/icons/IconPlus';
    import TheLink from '~/components/common/TheLink';

    const watchNumberRange = {min: 50, max: 100};

    export default {
        name: 'ProjectCard',

        components: {
            TheLink,
            IconPlus,
            IconArrowRight,
            ImageLazy,
            IconArrowLeft,
            AnimationRow,
            MetroInfo,
            IconAboutCompany,
            IconArrowBig,
            TagsList,
        },

        props: {
            project: {
                type: Object,
                default: () => ({}),
            },
        },

        data() {
            return {
                isAdditionalOpened: false,
                slider: null,
                activeIndex: 0,
                slides: [],
                watchNumber: 10,
                currentRoomsValue: null,
                interval: null,
            };
        },

        computed: {
            ...mapState('domain', ['isHideLayout']),

            links() {
                const rooms = [this.project.studio_count, this.project.room_1_count, this.project.room_2_count, this.project.room_3_count];
                const filteredRooms = rooms.filter(item => item);

                return [
                    {
                        label: 'Студия',
                        value: 0,
                        disabled: !this.project.studio_count,
                        link: `/selection/flats/?project=${this.project.slug}&rooms=0`
                    },
                    {
                        label: '1к',
                        value: 1,
                        disabled: !this.project.room_1_count,
                        link: `/selection/flats/?project=${this.project.slug}&rooms=1`
                    },
                    {
                        label: '2к',
                        value: 2,
                        disabled: !this.project.room_2_count,
                        link: `/selection/flats/?project=${this.project.slug}&rooms=2`
                    },
                    {
                        label: '3к+',
                        value: 3,
                        disabled: !this.project.room_3_count,
                        link: `/selection/flats/?project=${this.project.slug}&rooms=3`
                    },
                    {
                        label: 'Все',
                        value: 'all',
                        disabled: filteredRooms.length < 2,
                        link: `/selection/flats/?project=${this.project.slug}`
                    },
                ];
            },

            prices() {
                switch (this.currentRoomsValue) {
                    case 0:
                        return {
                            min_price: this.project.studio_min_price ? splitShort(this.project.studio_min_price) : null,
                            min_mortgage: this.project.min_mortgage_studio ? splitThousands(this.project.min_mortgage_studio) : null,
                        };
                    case 1:
                        return {
                            min_price: this.project.room_1_min_price ? splitShort(this.project.room_1_min_price) : null,
                            min_mortgage: this.project.min_mortgage_rooms_1 ? splitThousands(this.project.min_mortgage_rooms_1) : null,
                        };
                    case 2:
                        return {
                            min_price: this.project.room_2_min_price ? splitShort(this.project.room_2_min_price) : null,
                            min_mortgage: this.project.min_mortgage_rooms_2 ? splitThousands(this.project.min_mortgage_rooms_2) : null,
                        };
                    case 3:
                        return {
                            min_price: this.project.room_3_min_price ? splitShort(this.project.room_3_min_price) : null,
                            min_mortgage: this.project.min_mortgage_rooms_3 ? splitThousands(this.project.min_mortgage_rooms_3) : null,
                        };
                    default:
                        return {
                            min_price: this.project.flat_min_price ? splitShort(this.project.flat_min_price): null,
                            min_mortgage: this.project.min_mortgage ? splitThousands(this.project.min_mortgage) : null,
                        };
                }
            },

            tags() {
                const tags = [];
                if (this.project.days_before_start_sales) {
                    tags.push({label: `До старта продаж ${this.project.days_before_start_sales} ${plural(this.project.days_before_start_sales, ['день', 'дня', 'дней'])}`, color: 'primary'});
                }

                if (this.project.start_sales) {
                    tags.push({label: 'Старт продаж', color: 'primary'});
                }

                if (this.project.queque_realized) {
                    tags.push({label: `${this.project.queque_realized} очередь сдана`, color: 'primary'});
                }

                if (this.project.has_promotions) {
                    tags.push({
                        label: 'Акция',
                        color: 'white',
                        link: {
                            path: '/blog/promotions',
                            query: {projects: this.project?.slug},
                        },
                        blank: true,
                    });
                }

                if (this.project.realized) {
                    tags.push({label: 'Проект сдан', color: 'transparent'});
                }

                if (this.project.finish) {
                    tags.push({label: 'Отделка', color: 'transparent'});
                }

                if (this.project.tags_list.length) {
                    const customTags = this.project.tags_list.map(item => ({
                        label: item,
                        color: 'transparent'
                    }));
                    tags.push(...customTags);
                }

                return tags;
            },

            linkAttrs() {
                return {to: this.linkProject, target: this.target};
            },

            linkProject() {
                return `/${this.project?.city?.slug}/complex-${this.project.slug}`;
            },

            target() {
                return this.isHideLayout ? '_self' : '_blank';
            },

            flatCount() {
                let count;

                switch (this.currentRoomsValue) {
                    case 0:
                        count = this.project.studio_count;
                        break;
                    case 1:
                        count = this.project.room_1_count;
                        break;
                    case 2:
                        count = this.project.room_2_count;
                        break;
                    case 3:
                        count = this.project.room_3_count;
                        break;
                    case 4:
                        count = this.project.room_4_count;
                        break;
                    default:
                        count = this.project.flat_count;
                }

                return count;
            },

            deadlineText() {
                const quarter = this.project.deadline_quarter;
                const year = this.project.deadline_year;

                if (isDeadlinePassed(year, quarter)) {
                    return 'Объект сдан';
                }

                if (quarter && year) {
                    return `Сдача в ${quaterToRoman(quarter)} кв. ${year}`;
                }

                if (year) {
                    return `Сдача в ${year}`;
                }

                return '';
            }
        },

        watch: {
            activeIndex(value) {
                if (this.slider) {
                    this.$nextTick(() => {
                        this.slider.slideToLoop(value);
                        this.slider.lazy.load();
                    });
                }
            },
        },

        mounted() {
            addResizeListener(this.$refs.slider, this.update);

            this.slides = [...this.project.project_card_images];
            if (this.project.mini_map_image_display) {
                this.slides.push({image_display: this.project.mini_map_image_display, image_preview: this.project.mini_map_image_preview});
            }

            this.getWatchNumber();
            setInterval(this.getWatchNumber, 15000);
        },

        beforeDestroy() {
            removeResizeListener(this.$refs.slider, this.update);
            this.slider?.destroy();

            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        },

        methods: {
            initSlider() {
                if (this.$refs.slider && this.slides.length > 1) {
                    const options = {
                        speed: 1000,
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        allowTouchMove: true,
                        loop: true,
                        pagination: {
                            el: `.swiper-pagination-${this.project.id}`,
                            type: 'bullets',
                            clickable: true,
                        },

                        navigation: {
                            nextEl: this.$refs.next?.$el || this.$refs.next || false,
                            prevEl: this.$refs.prev?.$el || this.$refs.prev || false,
                        },
                    };

                    this.slider = new this.$Swiper(this.$refs.slider, options);
                    this.$nextTick(() => {
                        this.slider.lazy.load();
                    });

                    this.slider.on('slideChange', () => {
                        if (!this.slider) {
                            return;
                        }

                        this.activeIndex = this.slider.realIndex;
                        this.slider.lazy.load();
                    });
                }
            },

            update() {
                this.slider?.destroy();
                this.$nextTick(() => {
                    this.initSlider();
                });
            },

            handleMouseEnter() {
                if (this.$deviceIs.laptop || this.$deviceIs.desktop) {
                    clearInterval(this.interval);

                    this.isAdditionalOpened = true;
                }
            },

            handleMouseLeave() {
                if (this.$deviceIs.laptop || this.$deviceIs.desktop) {
                    clearInterval(this.interval);

                    this.interval = setTimeout(() => {
                        this.isAdditionalOpened = false;
                    }, 100);
                }
            },

            handleClick() {
                if (this.$deviceIs.tablet || this.$deviceIs.mobile) {
                    this.isAdditionalOpened = !this.isAdditionalOpened;
                }
            },

            getWatchNumber() {
                this.watchNumber = Math.floor(Math.random() * (watchNumberRange.max - watchNumberRange.min + 1)) + watchNumberRange.min;
            },

            handleRoomMouseEnter(val) {
                this.currentRoomsValue = val;
            },

            handleRoomMouseLeave() {
                this.currentRoomsValue = null;
            },

            onMouseleave() {
                setTimeout(() => {
                    this.activeIndex = 0;
                }, 300);
            },

            isDeadlinePassed(year, quarter) {
                return isDeadlinePassed(year, quarter);
            }
        },

    };
</script>

<style lang="scss" module>
    .ProjectCard {
        display: flex;
        flex-direction: column;
    }

    .imagesWrapper {
        position: relative;
        overflow: hidden;
        -webkit-mask-image: -webkit-radial-gradient(white, black);
        width: 100%;
        height: 43.2rem;
        min-height: 43.2rem;
        max-height: 43.2rem;
        border-radius: .8rem;
        transition: all .4s ease;

        &._opened {
            min-height: 30.6rem;
            max-height: 30.6rem;
        }

        @include hover {
            .navigation,
            .pagination {
                opacity: 1;
            }
        }

        @include respond-to(sm) {
            height: 37.4rem;
            min-height: 37.4rem;
            max-height: 37.4rem;

            &._opened {
                min-height: 21.5rem;
                max-height: 21.5rem;
            }
        }
    }

    .tags {
        position: absolute;
        top: 1.6rem;
        left: 1.6rem;
        z-index: 2;
        display: flex;
        flex-wrap: wrap;
        width: calc(100% - 5rem);

        :global(.v-tag) {
            font-weight: 400;
        }
    }

    .tag {
        margin-bottom: .6rem;

        &:not(:last-child) {
            margin-right: .4rem;
        }
    }

    .swiper {
        overflow: hidden;
        width: 100%;
        height: 100%;
    }

    .slide {
        position: relative;
        width: 100%;
        height: 100%;

        &:after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 3.5rem;
            background: linear-gradient(180deg, rgba(10, 11, 12, 0) 0%, rgba(10, 11, 12, .0086472) 6.67%, rgba(10, 11, 12, .03551) 13.33%, rgba(10, 11, 12, .0816599) 20%, rgba(10, 11, 12, .147411) 26.67%, rgba(10, 11, 12, .231775) 33.33%, rgba(10, 11, 12, .331884) 40%, rgba(10, 11, 12, .442691) 46.67%, rgba(10, 11, 12, .557309) 53.33%, rgba(10, 11, 12, .668116) 60%, rgba(10, 11, 12, .768225) 66.67%, rgba(10, 11, 12, .852589) 73.33%, rgba(10, 11, 12, .91834) 80%, rgba(10, 11, 12, .96449) 86.67%, rgba(10, 11, 12, .991353) 93.33%, #0a0b0c 100%);
            opacity: .4;
            -webkit-transform: translateZ(0);
        }

        &:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 8.4rem;
            background: linear-gradient(180deg, rgba(10, 11, 12, 0) 0%, rgba(10, 11, 12, .0086472) 6.67%, rgba(10, 11, 12, .03551) 13.33%, rgba(10, 11, 12, .0816599) 20%, rgba(10, 11, 12, .147411) 26.67%, rgba(10, 11, 12, .231775) 33.33%, rgba(10, 11, 12, .331884) 40%, rgba(10, 11, 12, .442691) 46.67%, rgba(10, 11, 12, .557309) 53.33%, rgba(10, 11, 12, .668116) 60%, rgba(10, 11, 12, .768225) 66.67%, rgba(10, 11, 12, .852589) 73.33%, rgba(10, 11, 12, .91834) 80%, rgba(10, 11, 12, .96449) 86.67%, rgba(10, 11, 12, .991353) 93.33%, #0a0b0c 100%);
            opacity: .48;
            -webkit-transform: translateZ(0) rotate(180deg);
        }
    }

    .image {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .pagination {
        position: absolute;
        z-index: 2;
        text-align: center;
        opacity: 0;
        transition: opacity .3s linear;

        &:global(.swiper-pagination-bullets.swiper-pagination-horizontal) {
            bottom: 1.2rem;
        }

        &:global(.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet) {
            width: .6rem;
            height: .6rem;
            border-radius: 50%;
            background-color: $white-40;
            opacity: unset;
        }

        &:global(.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet-active) {
            background-color: $base-0;
        }

        @include respond-to(sm) {
            opacity: 1;
        }
    }

    .navigation {
        position: absolute;
        top: 50%;
        left: 0;
        z-index: 2;
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 0 1.6rem;
        opacity: 0;
        transform: translateY(-50%);
        transition: opacity .3s linear;
    }

    .navBtn {
        width: 2.4rem;
        height: 2.4rem;

        &._right {
            .navIcon {
                transform: rotate(180deg);
            }
        }
    }

    .navIcon {
        width: 1.2rem;
        height: 1.2rem;
    }

    .info {
        position: relative;
        overflow: hidden;
        width: 100%;
        min-height: 14.4rem;
        max-height: 14.4rem;
        margin-top: .8rem;
        padding: 2rem 1.6rem;
        border-radius: .8rem;
        background-color: $base-50;
        transition: all .4s ease;

        &._opened {
            min-height: 27rem;
            max-height: 27rem;

            @include respond-to(sm) {
                min-height: 30.3rem;
                max-height: 30.3rem;
            }

            @include respond-to(xs) {
                min-height: 28.5rem;
                max-height: 28.5rem;
            }
        }

        @include respond-to(xs) {
            min-height: 12.6rem;
            max-height: 12.6rem;
        }
    }

    .btn {
        position: absolute;
        top: 2rem;
        right: 1.6rem;
    }

    .icon {
        width: 1.2rem;
        height: 1.2rem;
        transform: rotate(90deg);
    }

    .iconPlus {
        width: 1.6rem;
        height: 1.6rem;
        transform: rotate(45deg);
    }

    .projectLink {
        position: absolute;
        top: 2rem;
        right: 1.6rem;
        display: flex;
        align-items: center;
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 1;

        @include hover {
            .linkIcon {
                transform: scale(1.2);
            }
        }
    }

    .linkIcon {
        width: 1.2rem;
        height: 1.2rem;
        margin-left: .8rem;
        color: $blue;
        transition: transform .4s;
    }

    .infoInner {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 12.4rem;
        max-height: 12.4rem;
        padding-bottom: 2rem;

        @include respond-to(xs) {
            height: 10.6rem;
            max-height: 10.6rem;
            padding-bottom: 1.6rem;

            &._opened {
                max-height: 9rem;
            }
        }
    }

    .title {
        text-transform: uppercase;

        @include respond-to(xs) {
            font-size: 1.6rem;
            line-height: 1.9rem;
        }
    }

    .metro {
        height: 1.8rem;
        margin-left: .8rem;

        @include respond-to(sm) {
            margin-left: 0;
        }
    }

    .metroItem {
        height: 1.7rem;
    }

    .wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: auto;

        @include respond-to(sm) {
            align-items: flex-end;
        }

        //@include respond-to(xs) {
        //    margin-top: 1.6rem;
        //}
    }

    .wrapperAdditional {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .location {
        display: flex;
        align-items: center;

        @include respond-to(sm) {
            flex-direction: column;
            align-items: flex-start;
        }
    }

    .watchCount {
        display: flex;
        align-items: flex-end;
    }

    .watchIcon {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: .8rem;
        margin-bottom: .2rem;
        color: $blue;
    }

    .flatCount {
        white-space: nowrap;
    }

    .infoAdditional {
        padding-top: 2rem;
        border-top: 1px solid $base-200;

        @include respond-to(sm) {
            padding-top: 1.6rem;
        }
    }

    .rub {
        font-family: $accent-font-family;
    }

    .links {
        display: flex;
        margin-top: 2.8rem;

        @include respond-to(sm) {
            margin-top: 2.4rem;
        }

        @include respond-to(sm) {
            margin-top: 1.6rem;
        }
    }

    .linkWrapper {
        min-width: 14.7%;

        &._disabled {
            opacity: .5;
            pointer-events: none;
        }

        &:not(:last-child) {
            padding-right: .8rem;
        }

        &:last-child {
            flex: 1;

            .link {
                border: 1px solid $blue;
                background-color: $blue;
                color: $base-0;

                @include hover {
                    background-color: rgba($blue, .8);
                    color: $base-0;
                }
            }
        }

        &:first-child {
            min-width: 22.5%;
        }

        @include respond-to(sm) {
            min-width: 18%;

            &:first-child {
                min-width: 22.6%;
            }

            &:not(:last-child) {
                padding-right: .4rem;
            }
        }
    }

    .link {
        display: block;
        padding: 1.5rem 2rem;
        border-radius: .4rem;
        border: 1px solid $base-0;
        background-color: $base-0;
        text-align: center;
        color: $base-800;
        transition: all $default-color-transition;
        cursor: pointer;

        //&._disabled {
        //    opacity: .5;
        //    pointer-events: none;
        //}

        @include hover {
            border: 1px solid $blue;
            color: $blue;
        }

        @include respond-to(sm) {
            padding: 1.3rem 1rem;
        }
    }

    .textAdditional {
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 1.6rem;

        @include respond-to(sm) {
            font-size: 1rem;
            line-height: 1.4rem;
        }
    }

    .mobileBtn {
        display: none;
        height: 4.4rem;
        margin-top: .8rem;
        border-radius: .4rem;

        @include respond-to(sm) {
            display: inline-flex;
        }

        @include respond-to(xs) {
            height: 4rem;
            margin-top: 2rem;
        }
    }
</style>
