// Компонент требуется для ручной сборки контента в ряду таблицы

<template>
    <component
        :is="head ? 'th' : 'td'"
        :class="[$style.VTableCell, cellClasses]"
        :style="{width: width}"
    >
        <slot>
            Example text
        </slot>
    </component>
</template>

<script>
export default {
    name: 'VTableCell',

    props: {
        head: Boolean,

        noWrap: Boolean,

        ellipsis: Boolean,

        width: {
            type: String,
            default: '',
        },
    },

    computed: {
        cellClasses() {
            return [{
                [this.$style._noWrap]: this.noWrap,
                [this.$style._ellipsis]: this.ellipsis,
            }];
        },
    },
};
</script>

<style lang="scss" module>
    $black: $base-900;

    .VTableCell {
        th {
            overflow: hidden;
            width: 10rem;
            padding: 1.6rem 0 1.6rem 1.6rem;
            text-align: left;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 1.2rem;
            font-weight: 400;
            line-height: 1.2rem;
            color: $black;

            &:first-child {
                padding-left: 2.4rem;
                border-bottom-left-radius: .8rem;
            }

            &:last-child {
                padding-right: 2.4rem;
                border-bottom-right-radius: .8rem;
                border-right: 0;
            }
        }

        td {
            padding: 1.6rem 0 1.6rem 1.6rem;
            color: $black;

            &:first-child {
                padding-left: 2.4rem;
                border-top-left-radius: .8rem;
                border-bottom-left-radius: .8rem;
            }

            &:last-child {
                padding-right: 2.4rem;
                border-top-right-radius: .8rem;
                border-bottom-right-radius: .8rem;
                border-right: 0;
            }

            &._noWrap {
                white-space: nowrap;
            }

            &._ellipsis {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
</style>
