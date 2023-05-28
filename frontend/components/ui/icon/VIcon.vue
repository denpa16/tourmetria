<template>
    <svg-icon
        :name="name"
        :class="[$style.VIcon, classList]"
    />
</template>

<script>

/**
 * Компонент-обертка для удобного использования иконок
 *
 * @version 1.0.1
 * @displayName VIcon
 */
export default {
    name: 'VIcon',

    props: {
        name: {
            type: String,
            required: true,
        },

        size: {
            type: String,
            default: 'medium',
            validator: v => [
                'small',
                'medium',
                'large',
                'custom',
            ].includes(v),
        },
    },

    computed: {
        classList() {
            return {
                [this.$style[`_${this.size}`]]: this.size,
            };
        },
    },
};
</script>

<style lang="scss" module>
    .VIcon {
        &._small {
            width: 1.2rem;
            height: 1.2rem;
        }

        &._medium {
            width: 1.6rem;
            height: 1.6rem;
        }

        &._large {
            width: 2.4rem;
            height: 2.4rem;
        }
    }
</style>
