<template>
    <div :class="$style.FlatInfo">
        <img
            :class="$style.flatPlan"
            :src="flat.layout?.plan_full"
            alt="Планировка квартиры"
        >
        <div :class="$style.infoContainer">
            <h5
                :class="[$style.flatArea, 'h5']"
                v-html="name"
            >
            </h5>
            <div :class="$style.flatPrice">
                <h5 :class="[$style.priceInfo, 'h5']">
                    {{ (flat.original_price || flat.price) | splitThousands }} ₽
                    <span
                        v-if="flat.original_price"
                        :class="$style._original"
                    >
                        {{ flat.price | splitThousands }} ₽
                    </span>
                </h5>
                <VTooltip
                    v-if="flat.price_additional_info"
                    :class="$style.tooltip"
                    top-left
                >
                    <template #activator>
                        <span :class="$style.iconTooltip">
                            ?
                        </span>
                    </template>
                    <div :class="$style.tooltipContent">
                        {{ flat.price_additional_info }}
                    </div>
                </VTooltip>
            </div>
            <ul :class="$style.flatDetails">
                <li :class="[$style.flatDetail,'p6', 'c-base400']">
                    {{ flat.project_name }}
                </li>
                <li :class="[$style.flatDetail,'p6', 'c-base400']">
                    Литер {{ flat.building }}
                </li>
                <li :class="[$style.flatDetail,'p6', 'c-base400']">
                    {{ flat.floor }} этаж
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {getFlatTitle} from '~/assets/js/utils/numberUtils';

    export default {
        name: 'BookingFlatInfo',
        components: {},
        props: {
            flat: {
                type: Object,
                default: () => ({})
            }
        },

        data() {
            return {};
        },

        computed: {
            name() {
                const area = this.flat?.area ? `, ${this.flat.area}&nbsp;м<sup>2</sup>` : '';
                const rooms = this.flat?.rooms ? this.flat.rooms : 0;
                return rooms === 0 ? 'квартира ' + String(getFlatTitle(rooms).fullNumber) + area : String(getFlatTitle(rooms).fullNumber) + ' квартира' + area;
            },
        },

        methods: {}
    };
</script>

<style lang="scss" module>
    .FlatInfo {
        display: flex;
        width: 100%;
        padding: 1.6rem;
        border-radius: .8rem;
        background-color: $base-50;
    }

    .flatPlan {
        width: 8rem;
        height: 8rem;
        margin-right: 2.4rem;

        @include respond-to(xs) {
            width: 5.1rem;
            height: 5.1rem;
        }
    }

    .flatArea {
        text-transform: uppercase;

        @include respond-to(xs) {
            font-size: 1.4rem;
            line-height: 120%;
        }
    }

    .flatPrice {
        display: flex;
        align-items: center;
        margin-bottom: 1.2rem;

        @include respond-to(xs) {
            margin-bottom: .8rem;
        }
    }

    .priceInfo {
        margin-right: .6rem;
        line-height: 2.2rem;
        color: $primary-500;

        @include respond-to(xs) {
            font-size: 1.4rem;
            line-height: 120%;
        }

        ._original {
            position: relative;
            margin: 0 .4rem;
            font-size: 1.4rem;
            font-weight: 400;
            color: $base-600;

            @include respond-to(xs) {
                font-size: 1.2rem;
                line-height: 120%;
            }

            &:after {
                content: "";
                position: absolute;
                top: 50%;
                left: 0;
                width: 100%;
                height: 2px;
                background-color: $primary-500;
                transform: translateY(-50%);
            }
        }
    }

    .flatDetails {
        display: flex;
    }

    .flatDetail {
        position: relative;

        @include respond-to(xs) {
            font-size: 1.1rem;
            line-height: 1.6rem;
        }

        &:not(&:last-child) {
            margin-right: 2rem;

            &:after {
                content: "";
                position: absolute;
                top: 50%;
                left: calc(100% + .8rem);
                width: .4rem;
                height: .4rem;
                border-radius: 50%;
                background-color: $primary-500;
                transform: translateY(-50%);
            }
        }
    }

    .tooltip {
        &:global(.v-tooltip__content) {
            z-index: 200;
        }
    }

    .iconTooltip {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 50%;
        border: 1px solid $base-100;
        background-color: $base-0;
        font-size: .9rem;
        font-weight: 600;
        color: $base-800;
        transition: all $default-transition;
        cursor: pointer;

        @include hover {
            border-color: $base-800;
        }
    }

    .tooltipContent {
        max-width: 22.5rem;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
        padding: 1.6rem;
        border-radius: .8rem;
        background-color: $base-0;
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 1.6rem;
        color: $base-400;
    }
</style>
