<template>
    <div :class="$style.HomeGeographyInfoCard">
        <p :class="['h4', $style.title]">
            {{ pin.title }}
        </p>
        <ul :class="$style.counterList">
            <li :class="['h4', 'c-blue', $style.title, $style.counterItem]">
                {{ countText }}
            </li>
            <li
                v-if="pin.secondCount"
                :class="['h4', 'c-blue', $style.title, $style.counterItem]"
            >
                {{ secondCountText }}
            </li>
        </ul>
        <p :class="$style.hint">
            Нажмите, чтобы узнать подробнее
        </p>
    </div>
</template>

<script>
    import {plural} from '~/assets/js/utils/textUtils';

    export default {
        name: 'HomeGeographyInfoCard',

        components: {},

        props: {
            pin: {
                type: Object,
                default: () => ({}),
            },

            activeStage: {
                type: String,
                default: ''
            },
        },

        computed: {
            countText() {
                return `${this.pin.count} ${plural(this.pin.count, ['проект', 'проекта', 'проектов'])}`;
            },

            secondCountText() {
                const text = this.pin?.type === 'districts' ? plural(this.pin.secondCount, ['город', 'города', 'городов']) : plural(this.pin.secondCount, ['квартира', 'квартиры', 'квартир']);
                return `${this.pin.secondCount} ${text}`;
            }
        }
    };
</script>

<style lang="scss" module>
    .HomeGeographyInfoCard {
        width: 35.8rem;
        padding: 1.6rem 8rem 1.6rem 1.6rem;
        border-radius: .8rem;
        background-color: $base-0;
    }

    .title {
        text-transform: uppercase;
    }

    .counterList {
        display: flex;
    }

    .counterItem {
        white-space: nowrap;

        &:last-child:not(:first-child) {
            position: relative;
            margin-left: 2.1rem;

            &:before {
                content: "";
                position: absolute;
                top: 50%;
                right: calc(100% + .8rem);
                width: .5rem;
                height: .5rem;
                border-radius: 50%;
                background-color: #d9d9d9;
                transform: translateY(-50%);
            }
        }
    }

    .hint {
        margin-top: .8rem;
        font-family: $accent-font-family;
        font-size: 1.2rem;
        font-weight: 500;
        line-height: 1.6rem;
        color: $base-300;
    }
</style>
