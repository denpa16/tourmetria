<template>
    <div ref="projectMenuInfo"
         :class="[$style.ProjectMenuInfo, 'container']"
    >
        <ul v-show="!$deviceIs.mobile || (priceFloor || paymentFloor)"
            :class="$style.infoList">
            <li v-if="priceFloor"
                :class="[$style.infoListItem, $style._clickable]"
                @click="$emit('lot-btn-click')">
                <IconFlat :class="$style.icon" />
                <p :class="[$style.infoListItemTitle, $style._desktop, 'p5', 'c-base300']">
                    {{ lotLabels.plural[0] | toSentenceCase }}
                </p>
                <span :class="[$style.infoListItemText, $style._desktop, 'p6']">
                    от {{ priceFloor }}
                </span>

                <p :class="[$style.infoListItemTitle, $style._mobile, 'p5', 'c-base300']">
                    Выбрать<br>{{ lotLabels.singular[3] }}
                </p>
            </li>
            <li v-if="paymentFloor"
                :class="[$style.infoListItem, $style._clickable]"
                @click="$emit('scroll-to', 'mortgage')">
                <IconPercent :class="$style.icon" />
                <p :class="[$style.infoListItemTitle, 'p5', 'c-base300']">
                    Ипотека
                </p>
                <span :class="[$style.infoListItemText, 'p6']">
                    от {{ paymentFloor }}
                </span>
            </li>
            <li :class="$style.infoListItem">
                <p :class="[$style.infoListItemTitle, 'p5', 'c-base300']">
                    Cдача
                </p>
                <span :class="[$style.infoListItemText, 'p6']">
                    {{ deadline }}
                </span>
            </li>
            <li :class="$style.infoListItem">
                <p :class="[$style.infoListItemTitle, 'p5', 'c-base300']">
                    Локация
                </p>
                <span :class="[$style.infoListItemText, $style._metro, 'p6']">
                    <span>{{ city.name }}</span>
                    <AnimationRow v-if="directionSigns.length"
                                  :class="$style.metro"
                                  :items="directionSigns">
                        <template #default="{item}">
                            <MetroInfo
                                :metro="item"
                                :class="$style.metroItem"
                            />
                        </template>
                    </AnimationRow>
                </span>
            </li>
        </ul>

        <VSquareButton :class="$style.squareBtn"
                       color="light"
                       aria-label="Открыть меню проекта"
                       @click="handleOpenMenu"
        >
            <IconArrowLeft :class="[$style.squareBtnIcon, $style._bottom]" />
        </VSquareButton>

        <VButton
            :class="$style.sendBtn"
            color="dark"
            @click="handleOpenForm"
        >
            Заказать консультацию
        </VButton>
    </div>
</template>

<script>
    import {quaterToRoman} from '~/assets/js/utils/numberUtils';

    import AnimationRow from '~/components/common/AnimationRow';
    import MetroInfo from '~/components/common/metro/MetroInfo';
    import IconArrowLeft from '~/components/icons/IconArrowLeft';
    import IconFlat from '~/components/icons/IconFlat';
    import IconPercent from '~/components/icons/IconPercent';

    export default {
        name: 'ProjectMenuInfo',

        components: {
            IconArrowLeft,
            IconFlat,
            IconPercent,
            AnimationRow,
            MetroInfo,
        },

        props: {
            deadlineYear: {
                type: Number,
                default: 0
            },

            deadlineQuarter: {
                type: Number,
                default: 0
            },

            city: {
                type: Object,
                default: () => ({})
            },

            directionSigns: {
                type: Array,
                default: () => []
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

            lotLabels: {
                type: Object,
                default: () => ({}),
            },
        },

        computed: {
            deadline() {
                return `${quaterToRoman(this.deadlineQuarter || 1)} кв. ${this.deadlineYear}`;
            },
        },

        methods: {
            handleOpenMenu() {
                this.$emit('open-menu');
            },

            handleOpenForm() {
                this.$emit('open-form');
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectMenuInfo {
        display: none;

        @include respond-to(sm) {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 3.2rem;
            padding-bottom: 2.4rem;
        }

        @include respond-to(xs) {
            flex-wrap: wrap;
        }
    }

    .infoList {
        display: flex;
        align-items: center;

        @include respond-to(xs) {
            width: 100%;
            margin-bottom: 1.6rem;
        }
    }

    .infoListItem {
        position: relative;
        overflow: hidden;
        margin-right: 3.6rem;
        transition: all $default-transition;
        user-select: none;

        &:last-child {
            margin-right: 0;
        }

        @include respond-to(xs) {
            width: calc(50% - .6rem);
            min-height: 120px;
            margin-right: 0;
            padding: 1.6rem;
            border-radius: .8rem;

            &:nth-child(1) {
                margin-right: 1.6rem;
                background-color: $blue;
                color: $base-0;

                &:before {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(0deg, rgba(255, 255, 255, .2), rgba(255, 255, 255, .2)), $blue;
                    opacity: 0;
                    transition: opacity $default-color-transition;
                }

                & .infoListItemTitle {
                    color: $base-0;
                }

                @include hover {
                    &:before {
                        opacity: 1;
                    }
                }
            }

            &:nth-child(2) {
                background: $base-50;
                color: $blue;

                & .infoListItemTitle {
                    color: $base-800;
                }

                @include hover {
                    border-color: $blue;
                    background-color: $blue;
                    color: $base-0;

                    & .infoListItemText,
                    & .infoListItemTitle {
                        color: $base-0;
                    }
                }
            }

            &:nth-child(n+3) {
                display: none;
            }
        }

        &._clickable {
            cursor: pointer;

            @include hover {
                opacity: .7;
            }
        }
    }

    .infoListItemTitle {
        @include respond-to(xs) {
            position: relative;
            z-index: 1;
            text-transform: uppercase;
        }

        &._desktop {
            @include respond-to(xs) {
                display: none;
            }
        }

        &._mobile {
            display: none;

            @include respond-to(xs) {
                display: block;
            }
        }
    }

    .infoListItemText {
        display: block;
        margin-top: .4rem;

        &._metro {
            overflow: hidden;
            display: flex;
            height: 1.6rem;
        }

        @include respond-to(xs) {
            position: relative;
            z-index: 1;
        }

        &._desktop {
            @include respond-to(xs) {
                display: none;
            }
        }
    }

    .metro {
        display: inline-block;
        height: 1.6rem;
        margin-left: .8rem;
    }

    .metroItem {
        height: 1.6rem;
    }

    .squareBtn {
        @include respond-to(xs) {
            display: none;
        }
    }

    .squareBtnIcon {
        width: 1.2rem;
        height: 1.2rem;

        &._bottom {
            transform: rotate(-90deg);
        }
    }

    .sendBtn {
        display: none;
        width: 100%;

        @include respond-to(xs) {
            display: inline-flex;
        }
    }

    .icon {
        position: relative;
        z-index: 1;
        display: none;
        width: 3.2rem;
        height: 3.2rem;
        margin-bottom: 2.4rem;

        @include respond-to(xs) {
            display: block;
        }
    }
</style>
