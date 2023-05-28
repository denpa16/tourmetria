<template>
    <div :class="$style.FlatHeroFloor">
        <div
            :class="$style.floor"
            :style="{backgroundImage: `url(${floorPlan})`}"
        >
            <svg v-if="lot.floor_plan_hover"
                 xmlns="http://www.w3.org/2000/svg"
                 :viewBox="`0 0 ${floorWidth} ${floorHeight}`"
                 :class="$style.planSvg"
            >
                <g
                    class="visual__hover"
                    :class="$style.visualHover"
                    v-html="lot.floor_plan_hover"
                />
            </svg>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'FlatHeroFloor',

        props: {
            lot: {
                type: Object,
                default: () => ({}),
            },
        },

        computed: {
            floorPlan() {
                return this.lot?.layout_on_floor?.plan_on_floor || '';
            },

            floorWidth() {
                return this.lot?.layout_on_floor?.plan_width || 0;
            },

            floorHeight() {
                return this.lot?.layout_on_floor?.plan_height || 0;
            }
        },
    };
</script>

<style lang="scss" module>
    .FlatHeroFloor {
        margin: 0 auto;
    }

    .floor {
        position: relative;
        width: 100%;
        height: 100%;
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: contain;
    }

    .planSvg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .visualHover {
        position: relative;
        z-index: 100;
        opacity: 1;
        fill: rgba($blue, .12);
        stroke: $blue;
        stroke-width: 4px;
        transition: fill .2s ease-out;
    }
</style>
