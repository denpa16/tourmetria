/**
* !!! Внимание !!!
* Для легкого переопределения содержимого ячейки, без переопределения всей таблицы,
* содержимое ячеек в заголовках и в теле таблицы обернуто в слоты с динамическими именами.
* Для заголовков именем является параметр id с префиксом "th" (th-name)
* Для тела именем является ключ с префиксом "td" (td-name)
*/

<template>
    <table :class="[$style.VTable, classList]">
        <thead>
            <tr>
                <VTableCell
                    v-for="th in tHeads"
                    :key="th.id"
                    head
                    :width="th.width"
                >
                    <slot :name="`th-${th.id}`">
                        {{ th.value }}
                    </slot>
                </VTableCell>
            </tr>
        </thead>

        <transition-group
            name="simple-appear"
            mode="out-in"
            tag="tbody"
        >
            <tr
                v-for="(item, i) in tRows"
                :key="i + 1"
            >
                <!-- Слот для добавления элементов до основного ряда ячеек
                Внимание, для соблюдения табличной верстки, внутри слота обязательно использование VTableCell,
                а также нужно добавить пустые колонки в массив заголовков -->
                <slot name="prepend-row"></slot>

                <VTableCell
                    v-for="col, key, ind of item"
                    :key="`one-${col}-${ind}`"
                    :no-wrap="noWrapCols.includes(key)"
                    :ellipsis="ellipsisCols.includes(key) || ellipsisAll"
                    :title="col"
                >
                    <slot :name="`td-${key}`">
                        {{ col }}
                    </slot>
                </VTableCell>

                <!-- Слот для добавления элементов после основного ряда ячеек
                Внимание, для соблюдения табличной верстки, внутри слота обязательно использование VTableCell,
                а также нужно добавить пустые колонки в массив заголовков -->
                <slot name="append-row"></slot>
            </tr>
        </transition-group>
    </table>
</template>

<script>
import VTableCell from '~/components/ui/table/VTableCell';

export default {
    name: 'VTable',

    components: {
        VTableCell,
    },

    props: {
        /**
         * Массив заголовков таблицы.
         * Параметр id требуется для сортировки, при клике по заголовку вернется именно это и попадет в фильтр.
         * А также для динамических имен слотов
         *
         * Value - человеко-понятное наименование колонки
         *
         * Параметр width - необязательный, но используется для раздачи колонкам различной ширины при layoutFixed === true.
         * Если оставить пустым - колонки поделятся поровну
         */
        tHeads: {
            type: Array,
            default: () => [
                {
                    id: 'id',
                    value: 'ID',
                    width: '',
                },
                {
                    id: 'name',
                    value: 'ФИО',
                    width: '',
                },
                {
                    id: 'status',
                    value: 'Статус',
                    width: '',
                },
            ],
        },

        /**
         * Динамические данные для рядов таблицы.
         * Обязательно чтобы ключи в объектах совпадали с ключами, используемыми в остальных пропсах
         */
        tRows: {
            type: Array,
            default: () => [
                {
                    id: '0001',
                    name: 'Иванов Иван Иванович',
                    status: 'Завершенный',
                },
            ],
        },

        /**
         * Массив ключей для колонок, которым мы хотим запретить перенос слов
         * Обязательно чтобы ключи в массиве совпадали с ключами, используемыми в tRows
         */
        noWrapCols: {
            type: Array,
            default: () => [],
        },

        /**
         * Массив ключей для колонок, которым мы хотим задать "overflow: ellipsis"
         * Обязательно чтобы ключи в массиве совпадали с ключами, используемыми в tRows
         */
        ellipsisCols: {
            type: Array,
            default: () => [],
        },

        /**
         * "overflow: ellipsis" для всех
         */
        ellipsisAll: Boolean,

        /**
         * Меняет table-layout с "auto" на "fixed"
         */
        layoutFixed: Boolean,

        /**
         * th прилипает при скролле
         */
        stickyHeader: Boolean,
    },

    computed: {
        classList() {
            return [{
                [this.$style._fixed]: this.layoutFixed,
                [this.$style._sticky]: this.stickyHeader,
            }];
        },
    },
};
</script>

<style lang="scss" module>
    $white: $white;
    $light-gray: $grey-light;

    .VTable {
        table {
            position: relative;
            table-layout: auto;
            width: 100%;
            border-spacing: 0 .8rem;

            &._fixed {
                table-layout: fixed;
            }

            &._sticky {
                th {
                    position: sticky;

                    // По дефолту "top: 0" но по факту отступаем высоту если на проекте "липкий" header
                    top: 6.2rem;
                    background: $white;
                }
            }
        }

        tbody {
            tr {
                // border-bottom: 8px solid transparent;
                background: $light-gray;
                cursor: pointer;
            }
        }
    }
</style>
