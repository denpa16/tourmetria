<template>
    <div :class="[$style.FlatHeroInfoButtons, 'share-panel']">
        <!--        <div :class="$style.item">-->
        <!--            <VSquareButton color="light">-->
        <!--                <IconHeart :class="$style.icon" />-->
        <!--            </VSquareButton>-->
        <!--        </div>-->

        <div :class="$style.item">
            <VSquareButton v-clickoutside="handleClickOutside"
                           color="light"
                           aria-label="Открыть список брошюр"
                           @click="handlePrintClick">
                <IconPrint :class="$style.icon" />
            </VSquareButton>

            <transition name="dropdown">
                <div v-if="listVisible"
                     :class="$style.list">
                    <nuxt-link :class="[$style.btn, {[$style._disabled]: isMortgageLoading}]"
                               :to="brochureLink"
                               target="_blank">
                        <IconFile v-if="!isMortgageLoading"
                                  :class="$style.icon" />
                        <VSpinner v-else
                                  size="small" />
                        <span :class="$style.btnText">Брошюра со всей информацией</span>
                    </nuxt-link>
                    <nuxt-link :class="$style.btn"
                               :to="planLink"
                               target="_blank">
                        <IconImage :class="$style.icon" />
                        <span :class="$style.btnText">Скачать только планировку</span>
                    </nuxt-link>
                </div>
            </transition>
        </div>

        <div key="share"
             :class="$style.item">
            <SharingButton :origin-url="originUrl" />
        </div>
    </div>
</template>

<script>
    import clickoutside from '~/assets/js/directives/clickoutside';
    import IconPrint from '~/components/icons/IconPrint';
    import SharingButton from '~/components/common/SharingButton';
    import IconFile from '~/components/icons/IconFile';
    import IconImage from '~/components/icons/IconImage';
    import VSpinner from '~/components/ui/spinner/VSpinner';
    // import IconHeart from '~/components/icons/IconHeart';

    export default {
        name: 'FlatHeroInfoButtons',

        directives: {
            clickoutside,
        },

        components: {
            VSpinner,
            SharingButton,
            IconPrint,
            IconFile,
            IconImage,
            // IconHeart,
        },

        props: {
            originUrl: {
                type: String,
                default: '',
            },

            brochureLink: {
                type: String,
                default: '',
            },

            planLink: {
                type: String,
                default: '',
            },

            isMortgageLoading: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                listVisible: false,
            };
        },

        methods: {
            handlePrintClick() {
                this.listVisible = !this.listVisible;
            },

            handleClickOutside() {
                if (!this.listVisible) {
                    return;
                }
                this.listVisible = false;
            },
        }
    };
</script>

<style lang="scss" module>
    .FlatHeroInfoButtons {
        display: flex;
        border-radius: .4rem;
        background-color: $base-50;
    }

    .item {
        position: relative;

        &:not(:last-child) {
            &:after {
                content: '';
                position: absolute;
                top: 50%;
                right: 0;
                width: 1px;
                height: 1.2rem;
                background-color: $base-250;
                transform: translateY(-50%);
                transition: opacity $default-color-transition;
            }
        }

        @include hover {
            &:after {
                opacity: 0;
            }
        }
    }

    .icon {
        width: 1.2rem;
        height: 1.2rem;
    }

    .list {
        position: absolute;
        top: calc(100% + .8rem);
        left: 0;
        z-index: 10;
        border-radius: .4rem;
        background-color: $base-50;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);

        @include respond-to(sm) {
            right: -100%;
            left: unset;
        }
    }

    .btn {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        padding: 1.4rem 1.6rem;
        border-radius: .4rem;
        background-color: $base-50;
        text-align: left;
        white-space: nowrap;
        color: $base-800;
        transition: $default-color-transition;
        cursor: pointer;

        @include hover {
            background-color: $blue;
            color: $base-0;
        }

        &._disabled {
            pointer-events: none;
            color: $base-300;

            @include hover {
                background-color: $base-50;
                color: $base-300;
                cursor: auto;
                user-select: none;
            }
        }
    }

    .btnText {
        margin-left: 1.6rem;
    }
</style>
