<template>
    <section :class="$style.SelectionPage">
        <div :class="$style.wrapper">
            <div
                v-if="!$route.name.includes('id')"
                class="container"
            >
                <h1 class="visually-hidden">
                    Выбор квартир
                </h1>
                <div :class="$style.selectionHeader">
                    <h3 :class="[$style.selectionTitle, 'h3']">
                        Выбор
                    </h3>
                    <VSelect
                        :class="$style.select"
                        size="large"
                        :value="type"
                        :options="types"
                        @input="handleSelect"
                    />
                </div>
            </div>

            <NuxtChild />
        </div>

    </section>
</template>

<script>
    import {mapActions} from 'vuex';

    export default {
        name: 'SelectionPage',

        components: {},

        middleware({route, redirect}) {
            if (route.path.split('/')[2]) {
                return;
            }
            return redirect('/selection/flats');
        },

        props: {},

        data() {
            return {
                type: 'flats',
                types: [
                    {
                        value: 'flats',
                        label: 'Квартиры',
                        displayName: 'Квартиры'
                    },
                    {
                        value: 'parking',
                        label: 'Машино-места',
                        displayName: 'Машино-места',
                    },
                    {
                        value: 'storage',
                        label: 'Кладовые',
                        displayName: 'Кладовой',
                    },
                    {
                        value: 'commercial',
                        label: 'Коммерческие помещения',
                        displayName: 'Помещения',
                    },
                    {
                        value: 'hotel',
                        label: 'Гостиничные номера',
                        displayName: 'Номера',
                    }
                ]
            };
        },

        watch: {
            $route(to, from) {
                if (to.path.split('/')[2]) {
                    this.type = to.path.split('/')[2];
                    return;
                }
                this.type = 'flats';
                console.log('route change to', to);
                console.log('route change from', from);
            },
        },

        created() {
            this.type = this.$route.path.split('/')[2];
        },


        beforeDestroy() {
            this.removeRealty();
        },

        methods: {
            ...mapActions('realty', [
                'removeRealty',
            ]),

            handleSelect(val) {
                this.type = val;
                this.$router.replace(`/selection/${this.type}`);
            },
        },
    };
</script>

<style lang="scss" module>
    .SelectionPage {
        background-color: $base-50;
    }

    .wrapper {
        border-radius: 0 0 1.6rem 1.6rem;
        background-color: $base-0;
    }

    .selectionHeader {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-top: 6.4rem;

        @include respond-to(sm) {
            padding-top: 6.4rem;
        }

        @include respond-to(xs) {
            padding-top: 4rem;

            :global(.v-select__value) {
                font-size: 2rem;
                line-height: 2.8rem;
            }
        }

        :global(.v-select__value) {
            font-weight: 700;
        }
    }

    .selectionTitle {
        margin-top: .8rem;
        margin-right: .8rem;
        text-transform: uppercase;

        @include respond-to(xs) {
            font-size: 2rem;
            line-height: 2.8rem;
        }
    }

    .select {
        & :global(.v-select__wrapper) {
            @include respond-to(xs) {
                min-width: 224px;
            }
        }

        & :global(.v-select__value.is-arrow) {

            @include respond-to(xs) {
                line-height: 2.8rem;
            }
        }
    }
</style>
