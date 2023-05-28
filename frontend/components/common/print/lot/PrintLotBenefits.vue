<template>
    <div v-if="lot && lot.features && lot.features.length"
         :class="$style.PrintLotBenefits">
        <img v-if="lot.layout && lot.layout.plan_view_angle"
             :class="$style.viewAngle"
             :src="lot.layout.plan_view_angle"
             alt="Угол обзора из окна">
        <div :class="$style.content">
            <div :class="$style.plank">
                Предложение действует на {{ currentDate }}
            </div>

            <ul :class="$style.benefitsList">
                <li v-for="benefit in slicedBenefits"
                    :key="benefit.id"
                    :class="$style.benefitItem">
                    <div v-if="benefit.icon_content"
                         :class="$style.benefitIcon"
                         v-html="benefit.icon_content"></div>
                    <img v-else-if="benefit.icon"
                         :src="benefit.icon"
                         :class="$style.benefitIcon"
                         alt="Иконка преимущества">
                    <span :class="$style.benefitLabel">{{ benefit.title }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PrintLotBenefits',

        props: {
            lot: {
                type: Object,
                default: () => ({}),
            },
        },

        computed: {
            slicedBenefits() {
                return this.lot?.features?.length > 4 ? this.lot?.features.slice(0, 4) : this.lot?.features;
            },

            currentDate() {
                return new Date().toLocaleDateString('ru-RU');
            }
        }
    };
</script>

<style lang="scss" module>
    .PrintLotBenefits {
        display: flex;
        height: 120px;
    }

    .viewAngle {
        width: 185px;
        height: 100%;
        margin-right: 8px;
        object-fit: cover;
        border: 6px solid $blue;
    }

    .content {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 100%;
    }

    .plank {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 25px;
        background-color: $blue;
        font-size: 16px;
        color: $base-0;
    }

    .benefitsList {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        flex: 1;
    }

    .benefitItem {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .benefitLabel {
        text-transform: uppercase;
        font-size: 14px;
        line-height: 1;
    }

    .benefitIcon {
        width: 45px;
        height: 38px;
        margin-bottom: 12px;
        color: $blue;

        & > svg {
            width: 100%;
            height: 100%;
        }
    }
</style>
