<template>
    <div :class="$style.FlatButtonsFixed">
        <div :class="$style.inner">
            <div :class="$style.wrapper">
                <VButton
                    :class="$style.btn"
                    @click="bookOnline"
                >
                    Забронировать
                </VButton>
                <VButton color="light"
                         :class="$style.btn"
                         @click="$emit('open-call-modal')">
                    Консультация
                </VButton>
            </div>
            <!--            <VSquareButton color="custom"-->
            <!--                           :class="$style.favBtn">-->
            <!--                <IconHeart :class="$style.icon" />-->
            <!--            </VSquareButton>-->
        </div>
    </div>
</template>

<script>
    // import IconHeart from '~/components/icons/IconHeart';
    import BookingModal from '~/components/common/selection/flats/flat/booking/BookingModal';

    export default {
        name: 'FlatButtonsFixed',

        components: {
            // IconHeart,
        },

        props: {
            lot: {
                type: Object,
                default: () => ({}),
            },
        },

        methods: {
            bookOnline() {
                this.$modal.open(BookingModal, {
                    flat: this.lot
                });
            }
        }
    };
</script>

<style lang="scss" module>
    .FlatButtonsFixed {
        width: 100%;
        padding: 1.6rem;
        border-top: 1px solid $base-100;
        background-color: $base-0;
    }

    .inner {
        display: flex;
        justify-content: space-between;
    }

    .wrapper {
        display: flex;
        flex: 1;
    }

    .btn {
        flex: 1;

        &:not(:last-child) {
            margin-right: .8rem;
        }
    }

    .favBtn {
        margin-left: .8rem;
        border-color: $base-100;
        background-color: $base-0;
        color: $base-400;
    }

    .icon {
        width: 2.4rem;
        height: 2.4rem;
    }
</style>
