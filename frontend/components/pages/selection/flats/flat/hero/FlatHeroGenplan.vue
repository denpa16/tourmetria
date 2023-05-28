<template>
    <div :class="$style.FlatHeroGenplan">
        <div v-if="lot.layout && lot.layout.plan_view_angle"
             :class="$style.wrapper">
            <VSwitch
                :value="planView"
                @input="handleChangePlan">
                <template #trueLabel>
                    Схема
                </template>
                <template #falseLabel>
                    Генплан
                </template>
            </VSwitch>
        </div>
        <transition name="fade-content"
                    mode="out-in">
            <div v-if="planView"
                 key="planView"
                 :class="$style.planWrapper">
                <img :class="$style.image"
                     :src="lot.layout.plan_view_angle"
                     alt="Угол обзора из окна"
                >
            </div>
            <div v-else
                 key="genplan"
                 :class="$style.planWrapper">
                <ImageLazy ref="genplan"
                           :class="$style.image"
                           :image="lot.genplan_display"
                           :preview="lot.genplan_preview"
                           alt="Изображение генплана"
                           relative
                           contain
                />
                <svg v-if="lot.building_render_hover_point[0] && lot.building_render_hover_point[0].hover"
                     :class="$style.svg"
                     xmlns="http://www.w3.org/2000/svg"
                     x="0"
                     y="0"
                     :viewBox="`0 0 ${lot.project_genplan_width} ${lot.project_genplan_height}`"
                >
                    <g
                        class="visual__hover"
                        :class="$style.visualHover"
                        v-html="lot.building_render_hover_point[0].hover"
                    />
                </svg>
            </div>
        </transition>
    </div>
</template>

<script>
    import ImageLazy from '~/components/common/ImageLazy';
    export default {
        name: 'FlatHeroGenplan',
        components: {ImageLazy},
        props: {
            lot: {
                type: Object,
                default: () => ({}),
            },

            planViewAngle: {
                type: Boolean,
                default: false,
            }
        },

        data() {
            return {
                planView: false,
            };
        },

        created() {
            this.planView = this.planViewAngle;
        },

        methods: {
            handleChangePlan(val) {
                this.planView = val;
                this.$emit('change-genplan-view', val);
            }
        }
    };
</script>

<style lang="scss" module>
    .FlatHeroGenplan {
        width: 100%;
        height: 100%;
    }

    .planWrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        -webkit-user-select: none;
        user-select: none;
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

    .image {
        width: 100%;
        height: 100%;
        border-radius: 1.6rem;
        object-fit: contain;
    }

    .svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .wrapper {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
        display: flex;
        width: 100%;
        padding: 2.4rem;
        border-radius: 1.6rem 1.6rem 0 0;
        background-color: $base-0;

        @include respond-to(xs) {
            top: -1.6rem;
            right: unset;
            left: -1.6rem;
            width: calc(100% + 3.2rem);
        }
    }
</style>
