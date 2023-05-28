<template>
    <ul :class="$style.RealtyProjectsList">
        <RealtyProjectCard v-for="item in itemsList"
                           :key="item.id"
                           :item="item"
                           :realty-type="realtyType"
                           :class="$style.card"
                           :active-stage="activeStage"
                           @click="$emit('card-click', $event)" />

        <li v-if="hasNext && pagiCount > 0"
            :class="$style.btnWrapper">
            <VButton
                color="light"
                :class="$style.btn"
                @click="loadMore"
            >
                <span v-if="activeStage === 'projects'">+ {{ pagiCount }} {{ pagiCount | plural(['проект', 'проекта', 'проектов']) }}</span>
                <span v-if="activeStage === 'buildings'">+ {{ pagiCount }} {{ pagiCount | plural(['корпус', 'корпуса', 'корпусов']) }}</span>
            </VButton>
        </li>
    </ul>
</template>

<script>
    import RealtyProjectCard from '~/components/pages/selection/realty/RealtyProjectCard';

    export default {
        name: 'RealtyProjectsList',

        components: {RealtyProjectCard},

        props: {
            items: {
                type: Array,
                default: () => [],
            },

            realtyType: {
                type: String,
                default: 'parking',
            },

            activeStage: {
                type: String,
                default: 'project'
            }
        },

        data() {
            return {
                lastIndex: 6,
                pagiCount: 0,
            };
        },

        computed: {
            itemsList() {
                return this.items.slice(0, this.lastIndex);
            },

            hasNext() {
                return this.lastIndex < this.items.length;
            },
        },

        mounted() {
            this.pagiCount = this.items.length - this.lastIndex;
        },

        methods: {
            loadMore() {
                if (this.lastIndex < this.items.length) {
                    this.lastIndex += this.pagiCount;
                    this.pagiCount = this.items.length - this.lastIndex;
                }
            },
        },
    };
</script>

<style lang="scss" module>
    .RealtyProjectsList {
        //
    }

    .card {
        &:not(:last-child) {
            margin-bottom: 1.6rem;
        }
    }

    .btnWrapper {
        margin-top: 6.4rem;
        text-align: center;

        @include respond-to(sm) {
            margin-top: 4rem;
        }

        @include respond-to(xs) {
            margin-top: 2.4rem;
        }
    }

    .btn {
        @include respond-to(sm) {
            width: 100%;
        }
    }
</style>
