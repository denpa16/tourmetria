<template>
    <div :class="[$style.ProjectMortgage, 'container']">
        <div :class="$style.wrapper">
            <h2 :class="[$style.title, 'h3']">
                {{ mortgage.title }}
            </h2>
            <p :class="[$style.subtitle, 'p3', 'c-base300']">
                {{ mortgage.description }}
            </p>

            <ul v-if="mortgage.cards && mortgage.cards.length"
                :class="$style.cardsList">
                <li v-for="card in mortgage.cards"
                    :key="card.id"
                    :class="$style.card">
                    <div :class="$style.cardIconWrapper">
                        <IconCheck :class="$style.cardIcon" />
                    </div>
                    <div :class="[$style.cardContent, 'p5']">
                        <p :class="[$style.cardTitle, 'c-base300']">
                            {{ card.title }}
                        </p>
                        <span :class="$style.cardText">{{ card.value }}</span>
                    </div>
                </li>
            </ul>

            <div :class="$style.btns">
                <VButton :class="$style.btn"
                         color="primary"
                         @click="openForm">
                    Подать заявку
                </VButton>
                <!--                <VButton :class="$style.btn"-->
                <!--                         color="white-additional">-->
                <!--                    <template #default>-->
                <!--                        <span :class="$style.btnText">Рассчитать условия</span>-->
                <!--                        <span :class="[$style.btnText, $style._mobile]">Рассчитать</span>-->
                <!--                    </template>-->
                <!--                    <template #icon>-->
                <!--                        <IconCalculator :class="$style.btnIcon" />-->
                <!--                    </template>-->
                <!--                </VButton>-->
            </div>
        </div>
    </div>
</template>

<script>
    import FormModal from '~/components/layout/modals/forms/FormModal';
    import IconCheck from '~/components/icons/IconCheck';
    import {clearDoubleSpaces} from '~/assets/js/utils/commonUtils';
    // import IconCalculator from '~/components/icons/IconCalculator';

    export default {
        name: 'ProjectMortgage',

        components: {
            // IconCalculator,
            IconCheck,
        },

        props: {
            mortgage: {
                type: Object,
                default: () => ({})
            },

            lotLabels: {
                type: Object,
                default: () => ({}),
            },
        },

        data() {
            return {
                title: 'Ипотека 1,99% на весь период',
                subtitle: `Фиксированная ставка действует для всех ${this.lotLabels.plural[1]}.`,
            };
        },

        methods: {
            openForm() {
                const data = {
                    formTitle: `Подать заявку на ипотеку. Проект - ${this.project?.name || 'страница проекта'}`,
                    formSource: `Страница ${this.project?.name}: Блок - Субсидированная ипотека 0.1%`,
                    formComment: clearDoubleSpaces(`
                        Проект: ${this.project?.name || ''};
                        Город проекта: ${this.project?.city?.name || ''};
                    `),
                };

                this.$modal.open(FormModal, data);
            },
        }
    };
</script>

<style lang="scss" module>
    .ProjectMortgage {
        padding-top: 2.4rem;
        padding-bottom: 2.4rem;

        @include respond-to(xs) {
            padding-top: 4rem;
            padding-bottom: 4rem;
        }
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-top: 9.4rem;
        padding-right: 2.4rem;
        padding-bottom: 9.4rem;
        padding-left: 2.4rem;
        border-radius: 1.6rem;
        background-color: $base-50;

        @include respond-to(sm) {
            padding-top: 6.4rem;
            padding-right: 4.1rem;
            padding-bottom: 6.4rem;
            padding-left: 4.1rem;
        }

        @include respond-to(xs) {
            padding-top: 3.2rem;
            padding-right: 1.6rem;
            padding-bottom: 3.2rem;
            padding-left: 1.6rem;
        }
    }

    .title {
        text-transform: uppercase;

        @include respond-to(xs) {
            font-size: 2rem;
            line-height: 2.4rem;
        }
    }

    .subtitle {
        margin-top: 2.8rem;
        font-weight: 500;

        @include respond-to(sm) {
            margin-top: 1.6rem;
        }

        @include respond-to(xs) {
            margin-top: .8rem;
        }
    }

    .cardsList {
        display: flex;
        justify-content: center;
        width: 100%;
        margin-top: 2.4rem;

        @include respond-to(sm) {
            margin-top: 1.6rem;
        }

        @include respond-to(xs) {
            flex-direction: column;
            margin-top: 3.2rem;
        }
    }

    .card {
        display: flex;
        flex-direction: column;
        width: 26.8rem;
        margin-right: 1.6rem;
        padding: 1.6rem;
        border-radius: 1rem;
        background: $base-0;

        @include respond-to(sm) {
            flex: 1;
        }

        @include respond-to(xs) {
            flex-direction: row;
            width: 100%;
            margin-right: 0;
            margin-bottom: .8rem;
        }

        &:last-child {
            margin-right: 0;
            margin-bottom: 0;
        }
    }

    .cardIconWrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3.1rem;
        height: 3.1rem;
        border-radius: 50%;
        background-color: $base-50;
    }

    .cardIcon {
        width: 1.2rem;
        height: 1.2rem;
        color: $blue;
    }

    .cardContent {
        margin-top: 3.2rem;

        @include respond-to(sm) {
            margin-top: 2.4rem;
            font-size: 1.4rem;
        }

        @include respond-to(xs) {
            margin-top: 0;
            margin-left: 2.4rem;
        }
    }

    .btns {
        display: flex;
        margin-top: 2.4rem;

        @include respond-to(xs) {
            width: 100%;
        }
    }

    .btn {
        margin-right: .8rem;

        @include respond-to(xs) {
            flex: 1;
            margin-right: 1.2rem;
        }

        &:last-child {
            margin-right: 0;
        }

        & :global(.v-button__icon) {
            display: none;

            @include respond-to(xs) {
                display: inline;
            }
        }
    }

    .btnInner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    .btnText {
        @include respond-to(xs) {
            display: none;
        }

        &._mobile {
            display: none;

            @include respond-to(xs) {
                display: block;
            }
        }
    }

    .btnIcon {
        width: 1.6rem;
        height: 1.6rem;
    }
</style>
