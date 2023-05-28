<template>
    <div ref="projectMenuBar"
         :class="$style.ProjectMenuBar"
    >
        <div
            :class="[$style.stickyBlock, {[$style._sticked]: isSticked, [$style._slideDown]: isSlideDown}]"
            :style="{top: headerPlankHeight === null || !$deviceIs.mobile ? null : headerPlankHeight + 'px'}"
        >
            <div :class="[$style.wrapper, 'container']">
                <div :class="$style.menu">
                    <div :class="[$style.btns, $style._left]">
                        <VButton
                            v-if="priceFloor"
                            :class="$style.btn"
                            color="primary"
                            @click="$emit('lot-btn-click')"
                        >
                            Выбрать {{ lotLabels.singular[3] }}
                        </VButton>
                        <VButton
                            v-if="paymentFloor"
                            :class="$style.btn"
                            color="light"
                            @click="$emit('scroll-to', 'mortgage')"
                        >
                            Ипотека&nbsp;
                            <span :class="[$style.btnAccent, 'c-blue']">от {{ paymentFloor }}</span>
                        </VButton>
                        <VButton
                            v-if="promoCount"
                            :class="$style.btn"
                            color="light"
                            @click="handleSelectInput('promotions')"
                        >
                            Акции
                        </VButton>
                    </div>

                    <div v-if="logoContent"
                         :class="$style.logo"
                         v-html="logoContent"></div>
                    <img v-else-if="logo"
                         :src="logo"
                         :class="$style.logo"
                         alt="Логотип проекта"
                    >

                    <div :class="[$style.btns, $style._right]">
                        <VSelect
                            placeholder="Навигация по проекту"
                            :options="navLinks"
                            :class="[$style.btn, $style._navSelect]"
                            :is-forced-open="isMenuOpen"
                            :is-forced-close="!isMenuOpen"
                            variable-pos
                            bordered
                            @input="handleSelectInput"
                            @click.native.stop="isMenuOpen = !isMenuOpen"
                        />
                        <VButton
                            color="light"
                            :class="[$style.btn, $style._navBtn]"
                            :size="$deviceIs.mobile ? 'small' : 'large'"
                            @click="handleOpenMenu"
                        >
                            <template #default>
                                Навигация по проекту
                            </template>
                            <template #icon>
                                <IconArrowLeft :class="[$style.navBtnIcon, $style._bottom]" />
                            </template>
                        </VButton>
                        <VButton
                            :class="[$style.btn, $style._desktop]"
                            color="light"
                            link="/about/contacts"
                            blank
                        >
                            Контакты
                        </VButton>
                        <VButton
                            :class="[$style.btn, $style._desktop, $style._last]"
                            color="dark"
                            @click="handleOpenForm"
                        >
                            Заказать консультацию
                        </VButton>

                        <div v-show="$deviceIs.tablet">
                            <transition name="scroll-right"
                                        mode="out-in">
                                <div v-if="!isSticked"
                                     key="notSticked">
                                    <VButton
                                        :class="$style.btn"
                                        color="light"
                                        link="/"
                                    >
                                        Контакты
                                    </VButton>
                                    <VButton
                                        :class="$style.btn"
                                        color="dark"
                                        @click="handleOpenForm"
                                    >
                                        Заказать консультацию
                                    </VButton>
                                </div>
                                <div v-else
                                     key="sticked">
                                    <VButton
                                        v-show="isSticked"
                                        color="light"
                                        :class="$style.btn"
                                        @click="handleOpenMenu"
                                    >
                                        <template #default>
                                            Навигация по проекту
                                        </template>
                                        <template #icon>
                                            <IconArrowLeft :class="[$style.navBtnIcon, $style._bottom]" />
                                        </template>
                                    </VButton>
                                    <VButton
                                        v-show="priceFloor && isSticked"
                                        :class="$style.btn"
                                        color="primary"
                                        @click="$emit('lot-btn-click')"
                                    >
                                        Выбрать {{ lotLabels.singular[3] }}
                                    </VButton>
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';
    import IconArrowLeft from '~/components/icons/IconArrowLeft';

    export default {
        name: 'ProjectMenuBar',

        components: {
            IconArrowLeft
        },

        props: {
            logo: {
                type: String,
                default: ''
            },

            logoContent: {
                type: String,
                default: ''
            },

            priceFloor: {
                type: String,
                default: ''
            },

            paymentFloor: {
                type: String,
                default: ''
            },

            navLinks: {
                type: Array,
                default: () => []
            },

            projectSlug: {
                type: String,
                default: ''
            },

            promoCount: {
                type: Number,
                default: 0,
            },

            lotLabels: {
                type: Object,
                default: () => ({}),
            },
        },

        data() {
            return {
                startPageHeight: 0,
                isSticked: false,
                oldScroll: 0,
                isScrollDown: true,
                headerTimer: null,
                scrollTimer: null,
                isMenuOpen: false,

                // Headers refs
                header: null,
                headerMenu: null,
                headerPlank: null,
                headerPlankHeight: null,

                isHaveResizeListener: false,
            };
        },

        computed: {
            isSlideDown() {
                return this.isSticked && !this.isScrollDown;
            }
        },

        mounted() {
            this.header = document.querySelector('#header');
            this.headerMenu = document.querySelector('#headerMenu');
            this.headerPlank = document.querySelector('#header-plank');

            this.handlePlankResize();
            this.onResize();
            document.addEventListener('scroll', this.onScroll);
            window.addEventListener('resize', this.onResize);
            this.startPageHeight = document.body.offsetHeight;
            this.headerMenu.addEventListener('mouseenter', this.handleHeaderMouseEnter);
            this.headerMenu.addEventListener('mouseleave', this.handleHeaderMouseLeave);
        },

        beforeDestroy() {
            document.removeEventListener('scroll', this.onScroll);
            window.removeEventListener('resize', this.onResize);
            this.headerMenu.removeEventListener('mouseenter', this.handleHeaderMouseEnter);
            this.headerMenu.removeEventListener('mouseleave', this.handleHeaderMouseLeave);

            this.header.style.removeProperty('z-index');

            if (this.isHaveResizeListener) {
                removeResizeListener(this.headerPlank, this.handlePlankResize);
            }
        },

        methods: {
            onResize() {
                window.requestAnimationFrame(() => {
                    this.updatedStickedStatus();
                    this.addResizeListenerToPlank();
                });
            },

            onScroll() {
                if (document.body.dataset.scrollY) {
                    return;
                }

                window.requestAnimationFrame(() => {
                    this.updatedStickedStatus();
                    this.isMenuOpen = false;
                });

                if (this.scrollTimer) {
                    return;
                }
                this.scrollTimer = setTimeout(() => {
                    this.updateScrollDirection();
                    clearTimeout(this.scrollTimer);
                    this.scrollTimer = null;
                }, 100);
            },

            updateScrollDirection() {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                this.isScrollDown = currentScroll >= this.oldScroll;
                this.oldScroll = currentScroll;
            },

            updatedStickedStatus() {
                if (this.$deviceIs.mobile) {
                    this.isSticked = true;
                    return;
                }

                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                const initialOffsetTop = this.$refs.projectMenuBar?.offsetTop || 0;
                this.isSticked = initialOffsetTop <= currentScroll;
            },

            addResizeListenerToPlank() {
                if (this.isHaveResizeListener) {
                    return;
                }

                if (this.$deviceIs.mobile) {
                    addResizeListener(this.headerPlank, this.handlePlankResize);
                    this.isHaveResizeListener = true;
                }
            },

            handlePlankResize() {
                this.headerPlankHeight = this.headerPlank.offsetHeight;
            },

            handleOpenMenu() {
                this.$emit('open-menu');
            },

            handleOpenForm() {
                this.$emit('open-form');
            },

            handleHeaderMouseEnter() {
                if (this.headerTimer) {
                    clearTimeout(this.headerTimer);
                    this.headerTimer = null;
                }

                this.header.style.zIndex = 25;
            },

            handleHeaderMouseLeave() {
                this.headerTimer = setTimeout(() => {
                    this.header.style.removeProperty('z-index');
                }, 1000);
            },

            handleSelectInput(value) {
                this.$emit('scroll-to', value);
                this.isMenuOpen = false;
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectMenuBar {
        width: 100%;
        height: $header-h;

        @include respond-to(xs) {
            position: absolute;
            height: 0;
        }
    }

    .stickyBlock {
        position: relative;
        top: 0;
        z-index: 20;
        display: flex;
        align-items: center;
        width: 100%;
        min-height: $header-h;
        max-height: 100%;
        background-color: $base-0;
        opacity: 1;
        transform: translateY(0);
        transition: transform $default-transition, opacity $default-transition;

        @include respond-to(xs) {
            top: $header-plank-h;
            min-height: $header-mobile-h;
        }

        &._slideDown {
            opacity: 0;
            transform: translateY(-100%);
        }

        &._sticked {
            position: fixed;
            z-index: 20;
        }
    }

    .wrapper {
        position: relative;
        width: 100%;
    }

    .menu {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    .logo {
        position: absolute;
        left: 50%;
        width: 14.6rem;
        height: 4rem;
        transform: translateX(-50%);

        @include respond-to(sm) {
            position: static;
            width: 17.9rem;
            height: 5rem;
            transform: translateX(0);
        }

        @include respond-to(xs) {
            width: 14.6rem;
            height: 4rem;
        }

        svg {
            width: 100%;
            height: 100%;
        }
    }

    .btns {
        display: flex;

        &._left {
            @include respond-to(sm) {
                display: none;
            }
        }
    }

    .btn {
        margin-right: .8rem;

        &:hover .btnAccent {
            color: $base-0;
        }

        &:last-child {
            margin-right: 0;
        }

        &._navSelect {
            @include respond-to(sm) {
                display: none;
            }
        }

        &._navBtn {
            display: none;

            @include respond-to(xs) {
                display: inline-flex;
            }
        }

        &._desktop {
            @include respond-to(sm) {
                display: none;
            }
        }

        &._last {
            margin-right: 0;
        }
    }

    .btnAccent {
        color: $blue;
        transition: color .5s ease;
    }

    .navBtnIcon {
        width: 1.2rem;
        height: 1.2rem;

        &._bottom {
            transform: rotate(-90deg);
        }
    }
</style>
