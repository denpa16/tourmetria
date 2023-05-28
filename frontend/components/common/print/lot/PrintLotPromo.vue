<template>
    <div v-if="promo"
         :class="$style.PrintLotPromo">
        <div :class="$style.textWrapper">
            <p :class="$style.text">
                <span>{{ promo.promo_card_title_first }} {{ promo.promo_card_title_second }}</span>
                <span>{{ promo.promo_card_short_text }}</span>
            </p>
        </div>

        <p :class="$style.disclaimer">
            Не является офертой
        </p>
    </div>
</template>

<script>
    export default {
        name: 'PrintLotPromo',
        props: {
            lot: {
                type: Object,
                default: () => ({}),
            }
        },

        computed: {
            promo() {
                return this.lot.publications.find(({type}) => type === 'promotion');
            }
        }
    };
</script>

<style lang="scss" module>
    .PrintLotPromo {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: $base-0;
    }

    .textWrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: .8;
        max-height: 90px;
        margin-bottom: 8px;
        padding: 8px 36px;
        background-color: $blue;
    }

    .text {
        overflow: hidden;
        /* stylelint-disable */
        display: -webkit-box;
        /* stylelint-enable */
        -webkit-line-clamp: 3;
        text-overflow: ellipsis;
        text-transform: uppercase;
        font-size: 14px;
        line-height: 1.2;
        -webkit-box-orient: vertical;
    }

    .disclaimer {
        flex: .2;
        text-transform: uppercase;
        font-size: 14px;
        line-height: 1;
        color: $base-800;
    }
</style>
