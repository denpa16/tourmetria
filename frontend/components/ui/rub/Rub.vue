<template>
    <span :class="$style.Rub">
        {{ displayedSymbol }}
    </span>
</template>

<script>

// Предустановленные виды символов (алиасы), задаются на основе макетов
const views = {
    base: 'Р ',
    additional: 'А',
};

/**
 * Позволяет отображать различные виды символов рубля.<br>
 * Символы берутся из шрифта PT-Rouble, в котором все кириллические буквы заменены на знак: ₽
 * @version 1.0.0
 * @displayName Rub
 */
export default {
    name: 'Rub',

    props: {
        /**
         * Определяет вид символа. Принимает как предустановленные (алиасы base, additional и т.д.), так и обычные символы
         */
        symbol: {
            type: String,
            default: 'base',
        },
    },

    computed: {
        displayedSymbol() {
            // Если это поисковый бот, то отдаем ему знак рубля
            if (this.$deviceIs.crawler) {
                return '₽';
            }

            // Если это предустановленный символ
            if (views[this.symbol]) {
                return views[this.symbol];
            } else { // Если кастомный
                return this.symbol ? this.symbol : 'Р';
            }
        },
    },
};
</script>

<style lang="scss" module>
    .Rub {
        font-family: PT-Rouble-Sans, sans-serif;
    }
</style>
