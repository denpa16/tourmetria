<template>
    <div v-if="headerPromo.header_promo_title && headerPromo.header_promo_link"
         id="header-plank"
         :class="[$style.HeaderPlank, {[$style._hidden]: isHidden || !isVisible}]">
        <div :class="$style.wrap">
            <IconCross :class="[$style.icon, $style.crossIcon]"
                       @click.native="onCloseClick"
            />
            <div
                ref="textWrap"
                :class="[$style.textWrap, {[$style._running]: isTextOverflowing}]">
                <a
                    ref="textLine"
                    :href="headerPromo.header_promo_link"
                    target="_blank"
                    :class="[$style.text, 'p6', 'c-base0', {[$style._running]: isTextOverflowing}]">
                    {{ headerPromo.header_promo_title }}
                </a>
            </div>
            <a
                :href="headerPromo.header_promo_link"
                target="_blank"
                :class="$style.link">
                <IconArrowLeft :class="[$style.icon, $style.arrowIcon, $style.right]" />
            </a>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';

    import IconCross from '~/components/icons/IconCross';
    import IconArrowLeft from '~/components/icons/IconArrowLeft';

    export default {
        name: 'HeaderPlank',

        components: {
            IconArrowLeft,
            IconCross,
        },

        props: {},

        data() {
            return {
                isVisible: true,
                isHidden: false,
                isTextOverflowing: false,
            };
        },

        computed: {
            ...mapGetters({
                headerPromo: 'getHeaderPromo',
            }),
        },

        mounted() {
            addResizeListener(this.$refs.textWrap, this.checkTextOverflowing);
            this.checkTextOverflowing();
            this.init();
        },

        beforeDestroy() {
            removeResizeListener(this.$refs.textWrap, this.checkTextOverflowing);
            document.removeEventListener('scroll', this.onScroll);
        },

        methods: {
            checkTextOverflowing() {
                if (this.$refs.textWrap.offsetWidth < this.$refs.textWrap.scrollWidth) {
                    this.isTextOverflowing = true;
                    return;
                }
                this.isTextOverflowing = false;
            },

            init() {
                document.addEventListener('scroll', this.onScroll);
                this.onScroll();
            },

            onScroll() {
                if (document.body.dataset.scrollY) {
                    return;
                }
                const yOffset = window.pageYOffset;

                if (yOffset > 1) {
                    this.isHidden = true;
                } else if (yOffset < 40 || yOffset === 0) {
                    if (this.isVisible) {
                        this.isHidden = false;
                    }
                }
            },

            onCloseClick() {
                this.isVisible = false;
            },
        }
    };
</script>

<style lang="scss" module>
    $duration: 12s;

    .HeaderPlank {
        width: 100%;
        height: 4rem;
        background-color: $blue;
        opacity: 1;
        user-select: none;
        transition: opacity .2s linear, transform .2s linear, height .3s ease;

        &._hidden {
            height: 0;
            opacity: 0;
            transform: translateY(-150%);
        }
    }

    .wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        padding: 0 0 0 2.4rem;

        & > * {
            margin-right: .8rem;

            @include respond-to(xs) {
                margin-right: .4rem;
            }

            &:last-child {
                margin-right: 0;
            }
        }
    }

    .link {
        padding: .4rem 2.4rem;
    }

    .textWrap {
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: center;
        flex: 1;

        &:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
            display: none;
            width: 4.4rem;
            height: 100%;
            background: linear-gradient(270deg, $blue 50%, rgba(0, 158, 174, 0) 100%);
            transform: rotate(-180deg);
        }

        &:after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            z-index: 10;
            display: none;
            width: 4.4rem;
            height: 100%;
            background: linear-gradient(270deg, $blue 50%, rgba(0, 158, 174, 0) 100%);
        }

        &._running {
            &:before {
                display: block;
            }

            &:after {
                display: block;
            }
        }
    }

    .text {
        padding: .8rem 0;
        text-align: center;
        white-space: nowrap;

        &._running {
            animation: ticker $duration infinite linear forwards;
        }
    }

    .icon {
        width: 1.6rem;
        height: 1.6rem;
        color: $base-0;
        cursor: pointer;
    }

    .crossIcon {
        width: 1.2rem;
        height: 1.2rem;
    }

    .arrowIcon {
        &.right {
            transform: rotate(180deg);
        }
    }

    @keyframes ticker {
        0% {
            transform: translate(100%, 0);
        }

        50% {
            transform: translate(0, 0);
        }

        100% {
            transform: translate(calc(-100% + 4.4rem / 2), 0);
        }
    }
</style>
