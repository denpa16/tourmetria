<template>
    <div :class="$style.InfoTable">
        <table :class="$style.headers">
            <thead>
                <tr>
                    <th
                        v-for="(header, index) in table.headers"
                        :key="`header_${index}`"
                        :class="{[$style._large]: header === 'description' && table.headers.length > 3}"
                    >
                        {{ header }}
                    </th>
                </tr>
            </thead>
        </table>

        <VScrollBox
            :class="$style.scrollbox"
            resizable
            skip-offset
        >
            <table :class="$style.infoTable">
                <tbody>
                    <tr
                        v-for="(row, i) in table.rows"
                        :key="`row_${i}`"
                    >
                        <td
                            v-for="(value, key) in row"
                            :key="`table_${key}`"
                            :class="[{
                                [$style._green]: ['property', 'event', 'method', 'slot'].includes(key),
                                [$style._orange]: key === 'type',
                                [$style._large]: key === 'description' && table.headers.length > 3
                            }]"
                            v-html="value"
                        >
                        </td>
                    </tr>
                </tbody>
            </table>
        </VScrollBox>
    </div>
</template>

<script>
export default {
    name: 'InfoTable',

    props: {
        table: {
            type: Object,
            default: () => ({}),
        },
    },
};
</script>

<style lang="scss" module>
    $border: 1px solid rgb(0 0 0 / 20%);
    $white-color: $white;
    $grey-color: $grey;
    $table-broder: rgb(0 0 0 / 20%);
    $active-color: $violet;
    $accent-color: $sky;

    .InfoTable {
        position: relative;
        width: calc(100% + 1rem);
        height: 100%;
        margin-right: 1rem;
        font-size: 1.4rem;

        .scrollbox {
            max-height: calc(100% - 5rem);
        }

        table {
            width: 100%;
            padding-right: 1rem;
            border-spacing: 0;
            table-layout: fixed;

            thead,
            tbody {
                display: table-row-group;
            }

            td,
            th {
                padding: 1rem;
                text-align: left;

                span,
                &._green {
                    color: $accent-color;
                }

                &._orange {
                    text-transform: capitalize;
                    color: $active-color;
                }
            }

            tr {
                min-height: 5rem;
                vertical-align: baseline;

                &:last-child {
                    td {
                        border-bottom: none;
                    }
                }
            }

            td {
                border-bottom: $border;
                border-left: $border;

                &:last-child {
                    border-right: $border;
                }
            }

            &.headers {
                width: calc(100% - 1rem);
                padding-right: 0;
                border: 1px solid $grey-color;
                background: $grey-color;
                text-transform: capitalize;
                color: $white-color;
            }

            @include respond-to(mobile) {
                table-layout: auto;

                td,
                th {
                    &._large {
                        width: initial;
                    }
                }
            }
        }

        &:after {
            content: "";
            bottom: 0;
            left: -1rem;
            display: block;
            width: calc(100% - 1rem);
            height: .1rem;
            background: $table-broder;
        }
    }
</style>
