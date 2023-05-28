<template>
    <transition name="modal"
                appear>
        <div :class="['modal', $style.HeaderMenuModal]">
            <div :class="['modal-wrap', $style.wrap]"
                 @click.self="$emit('close')">

                <div :class="$style.content">
                    <div :class="$style.closeBtn">
                        <VSquareButton color="white"
                                       aria-label="Закрыть"
                                       @click="$emit('close')">
                            <IconCross :class="$style.closeIcon" />
                        </VSquareButton>
                    </div>

                    <header ref="header"
                            :class="$style.menuHeader"
                    >
                        <nuxt-link :class="$style.logo"
                                   to="/">
                            <IconLogo :class="$style.logoIcon" />
                        </nuxt-link>

                        <a :href="`tel:${phone}`"
                           :class="[$style.phone, 'p3', 'header__phone']"
                        >
                            {{ phone|prettyPhoneNumber }}
                        </a>

                        <button :class="$style.menuHeaderBtn"
                                @click="handleCloseClick"
                        >
                            <IconCross
                                :class="$style.closeIcon"
                            />
                        </button>
                    </header>

                    <div :class="$style.main">
                        <div ref="buttons"
                             :class="$style.btns"
                        >
                            <div :class="[$style.btn, $style._city]">
                                <HeaderCity
                                    :cities-info="citiesInfo"
                                    :default-city="defaultCity"
                                />
                            </div>
                            <!--                            Пока личный кабинет и избранное не нужны-->
                            <!--                            <div :class="[$style.btn, $style._profile]">-->
                            <!--                                <nuxt-link to="/">-->
                            <!--                                    <VButton color="light"-->
                            <!--                                             :class="$style.btnInner"-->
                            <!--                                    >-->
                            <!--                                        <span :class="$style.btnText">Войти</span>-->
                            <!--                                        <template #icon>-->
                            <!--                                            <IconUser :class="$style.icon" />-->
                            <!--                                        </template>-->
                            <!--                                    </VButton>-->
                            <!--                                </nuxt-link>-->
                            <!--                            </div>-->
                            <!--                            <div :class="[$style.btn, $style._favorite]">-->
                            <!--                                <nuxt-link to="/">-->
                            <!--                                    <VButton color="light"-->
                            <!--                                             :class="$style.btnInner"-->
                            <!--                                    >-->
                            <!--                                        <span :class="$style.btnText">Избранное</span>-->
                            <!--                                        <template #icon>-->
                            <!--                                            <IconHeart :class="$style.icon" />-->
                            <!--                                        </template>-->
                            <!--                                    </VButton>-->
                            <!--                                </nuxt-link>-->
                            <!--                            </div>-->
                        </div>

                        <VScrollBox ref="scrollbox"
                                    :class="$style.scrollbox"
                        >
                            <transition :name="isMenuForward ? 'scroll-left' : 'scroll-right'"
                                        mode="out-in">
                                <ul :key="currentItems[0].label"
                                    :class="$style.menuWrap"
                                >
                                    <li v-show="lastItems"
                                        :class="[$style.menuItem, 'h6']"
                                    >
                                        <div :class="$style.menuItemInner"
                                             @click="handleBackBtnClick"
                                        >
                                            <IconArrowLeft :class="$style.menuItemIcon" />
                                            Назад
                                        </div>
                                    </li>

                                    <li v-for="item in currentItems"
                                        :key="item.label"
                                        :class="[$style.menuItem, 'h6']"
                                    >
                                        <div
                                            v-if="item.options && item.options.length"
                                            :class="[$style.menuItemInner, {[$style._list]: item.options}]"
                                            @click="handleMenuItemClick(item)"
                                        >
                                            {{ item.label }}
                                            <span v-if="item.placeholderPostfix"
                                                  :class="[$style.menuItemPostfix, 'c-blue']">
                                                {{ item.placeholderPostfix }}
                                            </span>
                                            <IconArrowLeft
                                                v-if="item.options"
                                                :class="[$style.menuItemIcon, $style._arrowRight]"
                                            />
                                        </div>
                                        <TheLink
                                            v-else
                                            :class="[$style.menuItemInner, {[$style._list]: item.options, [$style._disabled]: activeAccordion}]"
                                            :href="item.href"
                                            :to="item.to"
                                            :target="item.target"
                                            @click.native="handleMenuItemClick(item)"
                                        >
                                            {{ item.label }}
                                            <span v-if="item.placeholderPostfix"
                                                  :class="[$style.menuItemPostfix, 'c-blue']">
                                                {{ item.placeholderPostfix }}
                                            </span>
                                            <IconArrowLeft
                                                v-if="item.options"
                                                :class="[$style.menuItemIcon, $style._arrowRight]"
                                            />
                                        </TheLink>
                                        <HeaderMenuAccordion
                                            v-if="item.options"
                                            :class="[
                                                $style.menuItemInner,
                                                $style._accordion,
                                                {[$style._disabled]: activeAccordion && activeAccordion !== item.label}
                                            ]"
                                            :value="activeAccordion === item.label"
                                            :title="item.label"
                                            :postfix="item.placeholderPostfix"
                                            :list="item.options"
                                            @click="handleClickAccordion"
                                            @close="handleCloseClick"
                                        />
                                    </li>
                                </ul>
                            </transition>
                        </VScrollBox>
                    </div>

                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    // import IconUser from '~/components/icons/IconUser';
    // import IconHeart from '~/components/icons/IconHeart';
    import IconArrowLeft from '~/components/icons/IconArrowLeft';
    import IconLogo from '~/components/icons/IconLogo';
    import IconCross from '~/components/icons/IconCross';
    import HeaderMenuAccordion from '~/components/layout/header/HeaderMenuAccordion';
    import HeaderCity from '~/components/layout/header/HeaderCity';
    import TheLink from '~/components/common/TheLink';
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';

    export default {
        name: 'HeaderMenuModal',

        components: {
            TheLink,
            HeaderCity,
            HeaderMenuAccordion,
            // IconUser,
            // IconHeart,
            IconArrowLeft,
            IconLogo,
            IconCross
        },

        props: {
            menuItems: {
                type: Array,
                default: () => [],
            },

            citiesInfo: {
                type: Array,
                default: () => [],
            },

            defaultCity: {
                type: Object,
                default: () => ({})
            },
        },

        data() {
            return {
                phone: '88007751793',
                currentItems: this.menuItems,
                lastItems: null,
                isMenuForward: true,
                activeAccordion: '',
            };
        },

        computed: {
            menuItemsFormatted() {
                const formattedMenuItems = JSON.parse(JSON.stringify(this.menuItems));
                return formattedMenuItems.map(item => {
                    if (item.options?.length && (item.href || item.to) && item.options[0]?.label !== 'Все') {
                        const commonOption = {
                            label: 'Все',
                            value: item.href || item.to
                        };

                        if (item.href) {
                            commonOption.href = item.href;
                            if (commonOption.target) {
                                commonOption.target = item.target;
                            }
                        } else {
                            commonOption.to = item.to;
                        }

                        item.options.unshift(commonOption);
                        return item;
                    }

                    return item;
                });
            },
        },

        mounted() {
            this.currentItems = this.menuItemsFormatted;
            addResizeListener(this.$refs.scrollbox.$el, this.calculateScrollboxHeight);
            this.calculateScrollboxHeight();
        },

        beforeDestroy() {
            removeResizeListener(this.$refs.scrollbox.$el, this.calculateScrollboxHeight);
        },

        methods: {
            calculateScrollboxHeight() {
                const scrollboxEl = this.$refs.scrollbox.$el;
                const btnsEl = this.$refs.buttons;
                const headerEl = this.$refs.header;

                scrollboxEl.style.maxHeight = window.innerHeight
                    - btnsEl.getBoundingClientRect().height
                    - headerEl.getBoundingClientRect().height
                    - (!this.$deviceIs.mobile ? 16 * 2 : 0)
                    + 'px';
            },

            handleCloseClick() {
                this.$emit('close');
            },

            handleClickAccordion(value) {
                this.activeAccordion = value;
            },

            handleMenuItemClick(item) {
                if (item.options) {
                    this.isMenuForward = true;
                    this.lastItems = this.currentItems;
                    this.currentItems = item.options;
                } else {
                    this.$emit('close');
                }
            },

            handleBackBtnClick() {
                this.isMenuForward = false;
                this.currentItems = this.lastItems;
                this.lastItems = null;
            }
        }
    };
</script>

<style lang="scss" module>
    .HeaderMenuModal {
        top: 50%;
        left: 1.6rem;
        z-index: 100;
        overflow: unset;
        display: none;
        width: 41.5rem;
        height: calc(100% - (1.6rem * 2));
        transform: translateY(-50%);

        @include respond-to(sm) {
            display: block;
        }

        @include respond-to(xs) {
            top: unset;
            bottom: 0;
            left: unset;
            width: 100%;
            height: 100%;
            transform: translateY(0);
        }
    }

    .wrap {
        align-items: center;
        width: 100%;
        height: 100%;

        @include respond-to(xs) {
            align-items: unset;
        }
    }

    .content {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        border-radius: 1.6rem;
        background-color: $base-0;

        @include respond-to(xs) {
            margin-top: unset;
            border-radius: unset;
        }
    }

    .closeBtn {
        position: absolute;
        top: 0;
        left: calc(100% + 1.2rem);

        @include respond-to(xs) {
            display: none;
        }
    }

    .menuHeader {
        display: flex;
        align-items: center;
        padding: 2.4rem;
        border-bottom: 1px solid $base-100;

        @include respond-to(xs) {
            padding: 2rem 1.6rem;
            border-bottom: none;
        }
    }

    .logo {
        width: 12.4rem;
        height: 2.6rem;
        margin-right: auto;
    }

    .logoIcon {
        width: 100%;
        height: 100%;
    }

    .phone {
        margin-right: .4rem;
    }

    .menuHeaderBtn {
        display: none;

        @include respond-to(xs) {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 2.4rem;
            opacity: 1;
            transition: opacity $default-transition;
            cursor: pointer;

            @include hover {
                opacity: .7;
            }
        }
    }

    .closeIcon {
        width: 12px;
        height: 12px;

        @include respond-to(xs) {
            margin-right: .4rem;
            color: $blue;
        }
    }

    .main {
        display: flex;
        flex-direction: column-reverse;
        justify-content: space-between;
        flex: 1;

        @include respond-to(xs) {
            flex-direction: column;
            justify-content: flex-start;
        }
    }

    .btns {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 2.4rem;

        @include respond-to(xs) {
            padding: 0 1.6rem;
        }
    }

    .btn {
        margin-right: .8rem;

        &:last-child {
            margin-right: 0;
        }

        & :global(.v-button--large) {
            padding-right: 1.6rem;
            padding-left: 1.6rem;
            border: none;
        }

        &._favorite {
            flex: 1;

            @include respond-to(xs) {
                flex: unset;

                & :global(.v-button__icon-wrap) {
                    margin-left: 0;
                }
            }

            .btnText {
                @include respond-to(xs) {
                    display: none;
                }
            }
        }

        &._profile {
            flex: 1;
        }

        &._city {
            display: none;

            @include respond-to(xs) {
                display: block;
                flex: 2;
            }
        }
    }

    .btnInner {
        width: 100%;
    }

    .icon {
        width: 1.6rem;
        height: 1.6rem;
    }

    .menuWrap {
        padding: 3.2rem 1.6rem 1.6rem;
    }

    .menuItem {
        margin-bottom: 3.2rem;
        text-transform: uppercase;
        transition: color $default-transition;
        cursor: pointer;

        &:last-child {
            margin-bottom: 0;
        }

        @include hover {
            color: $blue;
        }

        @include respond-to(sm) {
            font-size: 2rem;
            line-height: 2.8rem;
        }

        @include respond-to(xs) {
            font-size: 1.6rem;
            line-height: 1;
        }
    }

    .menuItemInner {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: 100%;
        opacity: 1;
        transition: opacity $default-transition;

        &._list {
            @include respond-to(sm) {
                display: none;
            }

            @include respond-to(xs) {
                display: flex;
            }
        }

        &._accordion {
            @include respond-to(sm) {
                display: block;
            }

            @include respond-to(xs) {
                display: none;
            }
        }

        &._disabled {
            @include respond-to(sm) {
                opacity: .48;
            }

            @include respond-to(xs) {
                opacity: 1;
            }
        }
    }

    .menuItemPostfix {
        margin-left: .4rem;
    }

    .menuItemIcon {
        width: 2rem;
        height: 2rem;
        margin-right: .2rem;
        color: $blue;
        transform: translateY(-.2rem);

        &._arrowRight {
            margin-left: .2rem;
            transform: rotate(180deg) translateY(.2rem);
        }
    }

    .scrollbox {
        flex: 1;
    }
</style>
