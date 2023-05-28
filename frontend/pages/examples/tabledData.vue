<template>
    <div :class="['page', $style.TabledDataPage]">
        <VTable
            :t-heads="tHeads"
            :t-rows="tRows"
            sticky-header
            layout-fixed
            ellipsis-all
        >
            <template #td-access>
                <VButton
                    round
                    :border="false"
                    :class="$style.btn"
                >
                    Предоставить доступ
                </VButton>
            </template>
        </VTable>

        <VTable
            :t-heads="tHeads"
            :t-rows="tRows"
            :no-wrap-cols="noWrapCols"
        >
            <template #td-access>
                <VButton
                    round
                    :border="false"
                    :class="$style.btn"
                >
                    Предоставить доступ
                </VButton>
            </template>
        </VTable>
    </div>
</template>

<script>
// Components
import VTable from '~/components/ui/table/VTable';
// import VTableCell from '~/components/ui/table/VTableCell';

export default {
    name: 'TabledDataPage',

    components: {
        VTable,
        // VTableCell,
    },

    data() {
        return {
            tHeads: [
                {
                    id: 'id',
                    value: 'ID',
                    width: '7.8rem',
                },
                {
                    id: 'name',
                    value: 'ФИО',
                },
                {
                    id: 'status',
                    value: 'Статус',
                },
                {
                    id: 'phone',
                    value: 'Телефон',
                },
                {
                    id: 'email',
                    value: 'E-mail',
                },
                {
                    id: 'start_work',
                    value: 'Старт работы',
                },
                {
                    id: 'end_work',
                    value: 'Конец работы',
                },
                {
                    id: 'booking_status',
                    value: 'Статус по клиенту',
                },
                {
                    id: 'access',
                    value: 'Доступ',
                    width: '27.5rem',
                },
            ],

            noWrapCols: ['status', 'phone', 'email', 'start_work', 'end_work'],

            tRows: [
                {
                    id: '0000',
                    name: 'Иванов Иван Иванович',
                    status: 'Завершенный',
                    phone: '8(800)555-35-35',
                    email: 'sdjkfkjsdhfjk@idaproject.com',
                    start_work: '24 июня 2022',
                    end_work: '20 окт. 2021',
                    booking_status: 'Ожидает подтверждения',
                    access: '',
                },
                {
                    id: '0000',
                    name: 'Иванов Иван Иванович',
                    status: 'Завершенный',
                    phone: '8(800)555-35-35',
                    email: 'sdjkfkjsdhfjk@idaproject.com',
                    start_work: '24 июня 2022',
                    end_work: '20 окт. 2021',
                    booking_status: 'Ожидает подтверждения',
                    access: '',
                },
                {
                    id: '0000',
                    name: 'Иванов Иван Иванович Иванов Иванович Иванов Иван Иванович',
                    status: 'Завершенный',
                    phone: '8(800)555-35-35',
                    email: 'sdjkfkjsdhfjk@idaproject.com',
                    start_work: '24 июня 2022',
                    end_work: '20 окт. 2021',
                    booking_status: 'Sint sint ea aute laboris consectetur consequat laborum laborum minim id consectetur. Laborum irure mollit est laborum ad in. Do id consectetur sint eu mollit tempor ad aute ex adipisicing esse.',
                    access: '',
                },
                {
                    id: '0000',
                    name: 'Иванов Иван Иванович',
                    status: 'Завершенный',
                    phone: '8(800)555-35-35',
                    email: 'sdjkfkjsdhfjk@idaproject.com',
                    start_work: '24 июня 2022',
                    end_work: '20 окт. 2021',
                    booking_status: 'Ожидает подтверждения',
                    access: '',
                },
                {
                    id: '0000',
                    name: 'Иванов Иван Иванович',
                    status: 'Завершенный',
                    phone: '8(800)555-35-35',
                    email: 'sdjkfkjsdhfjk@idaproject.com',
                    start_work: '24 июня 2022',
                    end_work: '20 окт. 2021',
                    booking_status: 'Ожидает подтверждения',
                    access: '',
                },
                {
                    id: '0001',
                    name: 'Иванов Иван Иванович',
                    status: 'Завершенный',
                    phone: '8(800)555-35-35',
                    email: 'sdjkfkjsdhfjk@idaproject.com',
                    start_work: '24 июня 2022',
                    end_work: '20 окт. 2021',
                    booking_status: 'Ожидает подтверждения',
                    access: '',
                },
                {
                    id: '0001',
                    name: 'Иванов Иван Иванович',
                    status: 'Завершенный',
                    phone: '8(800)555-35-35',
                    email: 'sdjkfkjsdhfjk@idaproject.com',
                    start_work: '24 июня 2022',
                    end_work: '20 окт. 2021',
                    booking_status: 'Ожидает подтверждения',
                    access: '',
                },
                {
                    id: '0001',
                    name: 'Иванов Иван Иванович',
                    status: 'Завершенный',
                    phone: '8(800)555-35-35',
                    email: 'sdjkfkjsdhfjk@idaproject.com',
                    start_work: '24 июня 2022',
                    end_work: '20 окт. 2021',
                    booking_status: 'Ожидает подтверждения',
                    access: '',
                },
                {
                    id: '0001',
                    name: 'Иванов Иван Иванович',
                    status: 'Завершенный',
                    phone: '8(800)555-35-35',
                    email: 'sdjkfkjsdhfjk@idaproject.com',
                    start_work: '24 июня 2022',
                    end_work: '20 окт. 2021',
                    booking_status: 'Ожидает подтверждения',
                    access: '',
                },
                {
                    id: '0001',
                    name: 'Иванов Иван Иванович',
                    status: 'Завершенный',
                    phone: '8(800)555-35-35',
                    email: 'sdjkfkjsdhfjk@idaproject.com',
                    start_work: '24 июня 2022',
                    end_work: '20 окт. 2021',
                    booking_status: 'Ожидает подтверждения',
                    access: '',
                },
                {
                    id: '0001',
                    name: 'Иванов Иван Иванович',
                    status: 'Завершенный',
                    phone: '8(800)555-35-35',
                    email: 'sdjkfkjsdhfjk@idaproject.com',
                    start_work: '24 июня 2022',
                    end_work: '20 окт. 2021',
                    booking_status: 'Ожидает подтверждения',
                    access: '',
                },
                {
                    id: '0001',
                    name: 'Иванов Иван Иванович',
                    status: 'Завершенный',
                    phone: '8(800)555-35-35',
                    email: 'sdjkfkjsdhfjk@idaproject.com',
                    start_work: '24 июня 2022',
                    end_work: '20 окт. 2021',
                    booking_status: 'Ожидает подтверждения',
                    access: '',
                },
                {
                    id: '0001',
                    name: 'Иванов Иван Иванович',
                    status: 'Завершенный',
                    phone: '8(800)555-35-35',
                    email: 'sdjkfkjsdhfjk@idaproject.com',
                    start_work: '24 июня 2022',
                    end_work: '20 окт. 2021',
                    booking_status: 'Ожидает подтверждения',
                    access: '',
                },
                {
                    id: '0001',
                    name: 'Иванов Иван Иванович',
                    status: 'Завершенный',
                    phone: '8(800)555-35-35',
                    email: 'sdjkfkjsdhfjk@idaproject.com',
                    start_work: '24 июня 2022',
                    end_work: '20 окт. 2021',
                    booking_status: 'Ожидает подтверждения',
                    access: '',
                },
                {
                    id: '0001',
                    name: 'Иванов Иван Иванович',
                    status: 'Завершенный',
                    phone: '8(800)555-35-35',
                    email: 'sdjkfkjsdhfjk@idaproject.com',
                    start_work: '24 июня 2022',
                    end_work: '20 окт. 2021',
                    booking_status: 'Ожидает подтверждения',
                    access: '',
                },
                {
                    id: '0001',
                    name: 'Иванов Иван Иванович',
                    status: 'Завершенный',
                    phone: '8(800)555-35-35',
                    email: 'sdjkfkjsdhfjk@idaproject.com',
                    start_work: '24 июня 2022',
                    end_work: '20 окт. 2021',
                    booking_status: 'Ожидает подтверждения',
                    access: '',
                },
            ],
        };
    },

    methods: {

    },
};
</script>

<style lang="scss" module>
    .TabledDataPage {
        padding: 6rem;

        .btn {
            width: 100%;
        }
    }
</style>
