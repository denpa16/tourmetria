<template>
    <div :class="[$style.PaymentCard, {[$style._hover]: isHover}]"
         @mouseenter="handleMouseEnter"
         @mouseleave="handleMouseLeave"
         @click="handleClick"
    >
        <div :class="$style.content">
            <transition name="fade-content">
                <div v-show="!isHover"
                     key="default"
                     :class="$style.container"
                >
                    <div :class="$style.header">
                        <div>
                            <ImageLazy
                                :class="[$style.img, $style._mobile]"
                                :image="card.icon"
                                :preview="card.icon"
                                relative
                                contain
                            />
                            <h3 :class="[$style.title, 'h4', 'c-base0']">
                                {{ card.type }}
                            </h3>
                        </div>

                        <VSquareButton :class="$style.navBtn"
                                       size="xsmall"
                                       color="primary"
                                       aria-label="Перейти к способу оплаты"
                                       :to="card.slugZ"
                        >
                            <IconArrowRight :class="$style.arrowRightIcon" />
                        </VSquareButton>
                    </div>

                    <ImageLazy
                        :class="[$style.img, $style._center]"
                        :image="card.icon"
                        :preview="card.icon"
                        contain
                    />

                    <div :class="$style.bottom">
                        <p :class="[$style.description, 'p3', 'c-base300']">
                            {{ card.card_description }}
                        </p>
                    </div>
                </div>
            </transition>

            <transition name="fade-content">
                <div v-show="isHover"
                     key="hover"
                     :class="$style.container"
                >
                    <h3 :class="[$style.title, $style._center, 'h4', 'c-base0']">
                        {{ card.type }}
                    </h3>
                    <VButton :class="$style.btn"
                             :link="`/how-buy/${card.slug}`"
                             blank
                             color="primary"
                    >
                        Подробнее
                    </VButton>
                </div>
            </transition>
        </div>

    </div>
</template>

<script>
    import VButton from '~/components/ui/buttons/VButton';
    import VSquareButton from '~/components/ui/buttons/VSquareButton';
    import ImageLazy from '~/components/common/ImageLazy';
    import IconArrowRight from '~/components/icons/IconArrowRight';
    export default {
        name: 'PaymentCard',
        components: {IconArrowRight, ImageLazy, VSquareButton, VButton},
        props: {
            card: {
                type: Object,
                default: () => ({})
            }
        },

        data() {
            return {
                isHover: false,
                hoverTimeout: null
            };
        },

        methods: {
            handleMouseEnter() {
                if (!this.$deviceIs.mobile) {
                    clearTimeout(this.hoverTimeout);
                    this.isHover = true;
                }
            },

            handleMouseLeave() {
                if (!this.$deviceIs.mobile) {
                    this.hoverTimeout = setTimeout(() => this.isHover = false, 100);
                }
            },

            handleClick() {
                if (this.$deviceIs.mobile) {
                    const link = document.createElement('a');
                    link.href = `/how-buy/${this.card?.slug}`;
                    link.target = '_blank';
                    link.click();
                }
            }
        }
    };
</script>


<style lang="scss" module>
    .PaymentCard {
        position: relative;
        overflow: hidden;
        display: block;
        width: 100%;
        border-radius: .8rem;
        background-color: $base-800;
        user-select: none;

        &:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            display: block;
            width: 100%;
            height: 100%;
            background:
                linear-gradient(180deg, $base-900 0%, rgba(10, 11, 12, .991353) 3%, rgba(10, 11, 12, .96449) 6%, rgba(10, 11, 12, .91834) 9%, rgba(10, 11, 12, .852589) 12%, rgba(10, 11, 12, .768225) 15%, rgba(10, 11, 12, .668116) 18%, rgba(10, 11, 12, .557309) 21%, rgba(10, 11, 12, .442691) 24%, rgba(10, 11, 12, .331884) 27%, rgba(10, 11, 12, .231775) 30%, rgba(10, 11, 12, .147411) 33%, rgba(10, 11, 12, .0816599) 36%, rgba(10, 11, 12, .03551) 39%, rgba(10, 11, 12, .0086472) 42%, rgba(10, 11, 12, 0) 45%, rgba(10, 11, 12, 0) 55%, rgba(10, 11, 12, .0086472) 58%, rgba(10, 11, 12, .03551) 61%, rgba(10, 11, 12, .0816599) 64%, rgba(10, 11, 12, .147411) 67%, rgba(10, 11, 12, .231775) 70%, rgba(10, 11, 12, .331884) 73%, rgba(10, 11, 12, .442691) 76%, rgba(10, 11, 12, .557309) 79%, rgba(10, 11, 12, .668116) 82%, rgba(10, 11, 12, .768225) 85%, rgba(10, 11, 12, .852589) 88%, rgba(10, 11, 12, .91834) 91%, rgba(10, 11, 12, .96449) 94%, rgba(10, 11, 12, .991353) 97%, $base-900 100%),
                url("/images/vectorBg.svg");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            opacity: 0;
            transition: opacity .2s ease;
        }

        &._hover:before {
            opacity: .88;
        }

        @include respond-to('xs') {
            cursor: pointer;
        }
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        height: 100%;
        padding: 2rem 1.6rem;

        @include respond-to(xs) {
            padding: 2.4rem;
        }
    }

    .header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        width: 100%;
    }

    .bottom {
        width: 100%;
        margin-top: auto;
    }

    .container {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .title {
        text-transform: uppercase;

        @include respond-to(xs) {
            font-size: 1.6rem;
            line-height: 1.2;
        }
    }

    .description {
        overflow: hidden;
        /* stylelint-disable */
        display: -webkit-box;
        /* stylelint-enable */
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;

        @include respond-to(xs) {
            font-size: 1.2rem;
            line-height: 1.6;
        }
    }

    ._center {
        position: absolute;
        top: 50%;
        left: 50%;
        text-align: center;
        transform: translateX(-50%) translateY(-50%);
    }

    .navBtn {
        margin-left: .8rem;

        @include respond-to(xs) {
            margin-left: 0;
        }
    }

    .arrowRightIcon {
        width: 1.2rem;
        height: 1.2rem;
        fill: $base-0;
    }

    .img {
        width: 8rem;
        height: 8rem;

        @include respond-to(xs) {
            display: none;
            width: 4.8rem;
            height: 4.8rem;
            margin-bottom: 2.4rem;
        }

        &._mobile {
            display: none;

            @include respond-to(xs) {
                display: block;
            }
        }
    }

    .btn {
        width: 100%;
        margin-top: auto;
        margin-bottom: -.4rem;
    }
</style>
