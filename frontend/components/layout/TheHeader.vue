<template>
    <header id="header"
            ref="header"
            :class="[$style.TheHeader, {[$style._modal]: isMenuOpen}]">
        <HeaderPlank ref="plank" />
        <div id="headerMenu"
             :class="[$style.wrap, 'container']">
            <div :class="$style.navWrapper">
                <button :class="$style.burger"
                        @click="handleOpenMenu"
                >
                    <span :class="$style.burgerItem"></span>
                </button>

                <HeaderCity
                    :class="$style.cityBtn"
                    :cities-info="citiesInfo"
                    :forced-open-city-select="forcedOpenCitySelect"
                />

                <nav :class="$style.nav">
                    <template v-for="item in leftMenuItems">
                        <TheLink
                            v-if="item.options"
                            :key="item.label"
                            :class="$style.theLink"
                            :href="item.href"
                            :to="item.to"
                            :target="item.target"
                        >
                            <VSelect
                                :class="[$style.link, $style.select, 'p6']"
                                :placeholder="item.label"
                                :placeholder-postfix="item.placeholderPostfix"
                                :options="item.options"
                                :arrow="false"
                                :is-forced-close="item.isForcedClose"
                                :is-double="item.label === 'Проекты'"
                                margin-dropdown="4rem"
                                open-on-hover
                                inline
                                @click.native="handleSelectClose(item)"
                                @open="handleSelectOpen(item)"
                                @close="handleSelectClose(item)"
                            />
                        </TheLink>
                        <TheLink v-else-if="item.href || item.to"
                                 :key="item.label"
                                 :class="[$style.item, $style.link, 'p6']"
                                 :to="item.to"
                                 :href="item.href"
                                 :target="item.target">
                            {{ item.label }}
                        </TheLink>
                    </template>
                </nav>
            </div>

            <nuxt-link :class="$style.logo"
                       to="/">
                <IconLogo :class="$style.logoIcon" />
            </nuxt-link>

            <div :class="[$style.navWrapper, $style._right]">
                <nav :class="$style.nav">
                    <template v-for="item in rightMenuItems">
                        <TheLink
                            v-if="item.options"
                            :key="item.label"
                            :class="$style.theLink"
                            :href="item.href"
                            :to="item.to"
                            :target="item.target"
                        >
                            <VSelect
                                :class="[$style.link, $style.select, 'p6']"
                                :placeholder="item.label"
                                :placeholder-postfix="item.placeholderPostfix"
                                :options="item.options"
                                :arrow="false"
                                :is-forced-close="item.isForcedClose"
                                margin-dropdown="4rem"
                                open-on-hover
                                inline
                                @click.native="handleSelectClose(item)"
                                @open="handleSelectOpen(item)"
                                @close="handleSelectClose(item)"
                            />
                        </TheLink>

                        <TheLink v-else-if="item.href || item.to"
                                 :key="item.label"
                                 :class="[$style.item, $style.link, 'p6']"
                                 :to="item.to"
                                 :href="item.href"
                                 :target="item.target">
                            {{ item.label }}
                        </TheLink>
                    </template>
                </nav>
                <a :href="`tel:${phone}`"
                   :class="[$style.phone, 'p5', 'c-blue', 'header__phone']"
                >
                    {{ phone|prettyPhoneNumber }}
                </a>

                <!--                Пока личный кабинет и избранное не нужны-->
                <!--                <div :class="$style.btnWrapper">-->
                <!--                    <button :class="[$style.btn, $style._left]">-->
                <!--                        <IconHeart :class="$style.btnIcon" />-->
                <!--                    </button>-->
                <!--                    <button :class="[$style.btn, $style._right]">-->
                <!--                        <IconUser :class="$style.btnIcon" />-->
                <!--                    </button>-->
                <!--                </div>-->
            </div>

            <!--            <button :class="$style.btnFav">-->
            <!--                <IconHeart :class="$style.btnIconFav" />-->
            <!--            </button>-->

            <HeaderLocation
                :class="$style.cityModal"
                :cities-info="citiesInfo"
                @change="onChangeCity"
            />
        </div>

        <HeaderMenuModal v-if="isMenuOpen"
                         :class="$style.modal"
                         :menu-items="menuItems"
                         :cities-info="citiesInfo"
                         @close="handleCloseMenu" />

        <transition name="overlay-appear">
            <Overlay v-if="isMenuOpen"
                     :class="$style.overlay"
                     @click="handleCloseMenu" />
        </transition>
    </header>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';
    import {lockBody, unlockBody} from '~/assets/js/utils/lockUtilsMain';

    import IconLogo from '~/components/icons/IconLogo';
    // import IconHeart from '~/components/icons/IconHeart';
    // import IconUser from '~/components/icons/IconUser';
    import HeaderCity from '~/components/layout/header/HeaderCity';
    import VSelect from '~/components/ui/select/VSelect';
    import HeaderMenuModal from '~/components/layout/header/HeaderMenuModal';
    import Overlay from '~/components/layout/modals/Overlay';
    import HeaderLocation from '~/components/layout/header/HeaderLocation';
    import HeaderPlank from '~/components/layout/header/HeaderPlank';
    import SelectModal from '~/components/layout/modals/SelectModal';
    import TheLink from '~/components/common/TheLink';

    export default {
        name: 'TheHeader',

        components: {
            TheLink,
            HeaderPlank,
            HeaderLocation,
            VSelect,
            IconLogo,
            // IconHeart,
            // IconUser,
            HeaderCity,
            HeaderMenuModal,
            Overlay
        },

        data() {
            return {
                resizeObserver: null,
                phone: '88007751793',
                openedSelect: null,
                isMenuOpen: false,
                leftMenuItems: [
                    {
                        label: 'Проекты',
                        to: '/projects',
                        options: [],
                        isForcedClose: true
                    },
                    {
                        label: 'Квартиры',
                        to: '/selection',
                        options: [
                            {
                                value: '/selection/flats/',
                                label: 'Квартиры',
                                to: '/selection/flats/'
                            },
                            {
                                value: '/selection/parking/',
                                label: 'Машино-места',
                                to: '/selection/parking/'
                            },
                            {
                                value: '/selection/storage/',
                                label: 'Кладовые',
                                to: '/selection/storage/'
                            },
                            {
                                value: '/selection/commercial/',
                                label: 'Коммерческие помещения',
                                to: '/selection/commercial/'
                            },
                            {
                                value: '/selection/hotel/',
                                label: 'Гостиничные номера',
                                to: '/selection/hotel/'
                            },
                        ],

                        isForcedClose: true
                    },
                    {
                        label: 'Ипотека',
                        to: '/how-buy/mortgage',
                        target: '_blank',
                        options: [
                            {
                                value: '/how-buy/mortgage',
                                label: 'Ипотека',
                                href: '/how-buy/mortgage',
                            },
                            {
                                value: '/how-buy/installment',
                                label: 'Рассрочка',
                                href: '/how-buy/installment'
                            },
                            {
                                value: '/how-buy/capital',
                                label: 'Материнский капитал',
                                href: '/how-buy/capital'
                            },
                            {
                                value: '/how-buy/military',
                                label: 'Военная ипотека',
                                href: '/how-buy/military'
                            },
                            {
                                value: '/how-buy/full',
                                label: '100% оплата',
                                href: '/how-buy/full'
                            },
                        ],

                        isForcedClose: true
                    },
                    {
                        label: 'Акции',
                        to: '/blog/promotions',
                    }
                ],

                rightMenuItems: [
                    {
                        label: 'Компания',
                        target: '_blank',
                        to: '/about',
                        options: [
                            {
                                value: '/about/videos',
                                label: 'Видео',
                                href: '/about/videos'
                            },
                            {
                                value: '/about/career',
                                label: 'Карьера',
                                href: '/about/career'
                            },
                            {
                                value: '/about/vacancies',
                                label: 'Вакансии',
                                href: '/about/vacancies'
                            },
                            {
                                value: '/about/investors',
                                label: 'Инвесторам',
                                href: '/about/investors'
                            },
                        ],

                        isForcedClose: true
                    },
                    {
                        label: 'Новости',
                        to: '/blog/news',
                    },
                    {
                        label: 'Тендеры',
                        href: '/tenders',
                        target: '_blank'
                    },
                    {
                        label: 'Контакты',
                        href: '/about/contacts',
                        target: '_blank'
                    }
                ],

                forcedOpenCitySelect: false
            };
        },

        computed: {
            ...mapGetters({
                cities: 'getCities',
                currentCity: 'getCurrentCity',
                projectsList: 'projects/getProjectsList',
            }),

            projectMenuList() {
                return this.projectsList.map(({name, to}) => ({
                    value: to,
                    label: name,
                    to,
                }));
            },

            menuItems() {
                return [...this.leftMenuItems, ...this.rightMenuItems];
            },

            citiesInfo() {
                return [
                    {
                        value: '',
                        label: 'Все города',
                    },
                    ...this.cities.map(city => {
                        if (city.region?.slug && city.region?.name) {
                            return {
                                value: city.slug,
                                label: city.name,
                                coordinates: {
                                    latitude: city.coordinates?.latitude ? parseFloat(city.coordinates?.latitude.trim()) : '',
                                    longitude: city.coordinates?.longitude ? parseFloat(city.coordinates?.longitude.trim()) : ''
                                },
                                group: {
                                    value: city.region.slug,
                                    label: city.region.name,
                                }
                            };
                        }

                        return {
                            value: city.slug,
                            label: city.name,
                            coords: city.coords,
                        };
                    }),
                ];
            }
        },

        watch: {
            projectMenuList(newVal) {
                this.updatedMenuProjectsList(newVal);
            }
        },

        mounted() {
            this.updatedMenuProjectsList(this.projectMenuList);
        },

        methods: {
            ...mapActions(['setCurrentCity']),
            ...mapActions('projects', ['fetchCurrentCityProject', 'setParams']),

            handleSelectOpen(item) {
                if (this.openedSelect) {
                    this.openedSelect.isForcedClose = true;
                }
                item.isForcedClose = false;
                this.openedSelect = item;
            },

            handleSelectClose(item) {
                item.isForcedClose = true;
                if (this.openedSelect === item) {
                    this.openedSelect = null;
                }
            },

            handleOpenMenu() {
                this.isMenuOpen = true;
                lockBody();
            },

            handleCloseMenu() {
                this.isMenuOpen = false;
                unlockBody();
            },

            onChangeCity() {
                if (!this.$deviceIs.mobile) {
                    this.forcedOpenCitySelect = true;
                    return;
                }

                this.$modal.open(SelectModal, {
                    title: 'Ваш город',
                    options: this.citiesInfo,
                    value: this.currentCity?.value || '',
                    type: 'value',
                    filter: this.handleFilter,
                    search: true,
                    isTabs: true
                });
            },

            handleFilter(value) {
                const city = this.citiesInfo.find(city => city.value === value?.value) || this.citiesInfo[0];
                this.setCurrentCity(city);
                this.fetchCurrentCityProject(city);
            },

            updatedMenuProjectsList(newList) {
                const findedItem = this.leftMenuItems.find(({to}) => to === '/projects');
                if (findedItem) {
                    findedItem.options = newList;
                }
            }
        }
    };
</script>

<style lang="scss" module>
    .TheHeader {
        position: sticky;
        top: 0;
        left: 0;
        z-index: 20;
        width: 100%;
        background-color: $base-0;

        &._modal {
            z-index: 25;
        }
    }

    .wrap {
        position: relative;
        display: flex;
        align-items: center;
        height: $header-h;
        margin-right: auto;
        margin-left: auto;

        @include respond-to(xs) {
            height: $header-mobile-h;
        }
    }

    .logo {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 15rem;
        height: 3.2rem;
        transform: translate(-50%, -50%);

        @include respond-to(xs) {
            position: static;
            order: 0;
            width: 12.4rem;
            height: 2.6rem;
            margin-right: auto;
            transform: translate(0, 0);
        }
    }

    .logoIcon {
        width: 100%;
        height: 100%;
    }

    .navWrapper {
        display: flex;
        align-items: center;
        flex: 1;
        height: 100%;

        @include respond-to(xs) {
            flex: unset;
            order: 2;
        }

        &._right {
            justify-content: flex-end;

            @include respond-to(xs) {
                order: 1;
            }
        }
    }

    .nav {
        display: flex;

        @include respond-to(sm) {
            display: none;
        }
    }

    .burger {
        display: none;
        margin-right: 3.2rem;
        padding: 6px 2px 12px 0;
        border: 0;
        background: none;
        cursor: pointer;

        @include respond-to(sm) {
            display: block;

            @include hover {
                .burgerItem:before {
                    width: 70%;
                }
            }
        }

        @include respond-to(xs) {
            margin-right: 0;
            margin-left: 2.2rem;
            padding: 12px 2px 12px 0;
        }
    }

    .burgerItem {
        position: relative;
        display: block;
        width: 3.2rem;
        height: 2px;
        border-radius: 6px;
        background-color: $base-1000;
        font-size: 0;
        color: transparent;

        &:before,
        &:after {
            content: "";
            position: absolute;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 100%;
            border-radius: 6px;
            background-color: $base-1000;
        }

        &:before {
            bottom: -7px;
            transition: width $default-transition;

            @include respond-to(xs) {
                bottom: -6px;
            }
        }

        &:after {
            top: -6px;
            display: none;

            @include respond-to(xs) {
                display: block;
            }
        }

        @include respond-to(xs) {
            width: 2rem;
        }
    }

    .cityBtn {
        margin-right: 3.2rem;

        @include respond-to(xs) {
            display: none;
        }
    }

    .theLink,
    .link {
        &:not(:last-child) {
            margin-right: 2.4rem;
        }
    }

    .item {
        color: $base-800;
        transition: color $default-color-transition;

        @include hover {
            color: $blue;
        }
    }

    .select {
        &:global(.v-select--medium) {
            & :global(.v-select__value) {
                font-weight: 500;
            }
        }

        & :global(.v-select__field) {
            margin: -1rem;
            padding: 1rem;
        }
    }

    .phone {
        margin-left: 3.2rem;
        transition: opacity $default-color-transition;

        @include hover {
            opacity: .7;
        }

        @include respond-to(xs) {
            font-size: 1.4rem;
            line-height: 2rem;
            color: $base-800;
        }
    }

    .btnWrapper {
        display: flex;
        margin-left: 3.2rem;

        @include hover {
            .btn._left:after {
                opacity: 0;
            }
        }

        @include respond-to(xs) {
            display: none;
        }
    }

    .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4.4rem;
        height: 4.4rem;
        background-color: $base-50;
        color: $base-800;
        transition: all $default-color-transition;
        cursor: pointer;

        &._left {
            position: relative;
            border-radius: .4rem 0 0 .4rem;

            &:after {
                content: "";
                position: absolute;
                top: 50%;
                right: 0;
                width: 1px;
                height: 1.2rem;
                background-color: $base-200;
                transform: translateY(-50%);
                transition: opacity $default-color-transition;
            }
        }

        &._right {
            border-radius: 0 .4rem .4rem 0;
        }

        @include hover {
            background-color: $blue;
            color: $base-0;
        }
    }

    .btnIcon {
        width: 1.3rem;
        height: 1.2rem;
    }

    .btnFav {
        display: none;
        width: 2.4rem;
        height: 2.4rem;

        @include respond-to(xs) {
            display: none;
        }
    }

    .btnIconFav {
        width: 2.4rem;
        height: 2.4rem;
    }

    .closeIcon {
        width: 2rem;
        height: 2rem;
        color: $blue;
    }

    .modal,
    .overlay {
        display: none;

        @include respond-to(sm) {
            display: block;
        }
    }

    .cityModal {
        position: absolute;
        bottom: -.8rem;
        left: 2.4rem;
        z-index: 16;
        transform: translateY(100%);
    }
</style>
