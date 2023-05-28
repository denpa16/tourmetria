<template>
    <div :class="$style.ProjectGenplanModalFloors">
        <TemplateBottomModal :visible="visible"
                             :is-lock-body="$deviceIs.mobile"
                             :data="data"
                             @close="$emit('close')">
            <div :class="$style.wrapper">
                <VRangeSingle
                    :class="$style.range"
                    :spec="spec"
                    :value="initialFloorNumber"
                    :step="1"
                    postfix=" этаж"
                    @change="currentFloorNumber = $event"
                />
                <VButton color="primary"
                         :disabled="isEmptyFloor"
                         responsive
                         @click="handleBtnClick">
                    {{ btnText }}
                </VButton>
            </div>
        </TemplateBottomModal>

        <transition name="overlay-appear">
            <Overlay v-if="visible"
                     :class="$style.overlay"
                     @click="$emit('close')" />
        </transition>
    </div>
</template>

<script>
    import TemplateBottomModal from '~/components/layout/modals/templates/TemplateBottomModal';
    import Overlay from '~/components/layout/modals/Overlay';

    export default {
        name: 'ProjectGenplanModalFloors',

        components: {
            Overlay,
            TemplateBottomModal
        },

        props: {
            visible: {
                type: Boolean,
                default: false,
            },

            floors: {
                type: Array,
                default: () => []
            },

            initialFloorNumber: {
                type: Number,
                default: 1
            }
        },

        data() {
            return {
                currentFloorNumber: this.initialFloorNumber,
                data: {
                    title: 'Этаж'
                },
            };
        },

        computed: {
            spec() {
                if (this.floors) {
                    return {
                        min: this.floors[0]?.label,
                        max: this.floors[this.floors.length - 1]?.label
                    };
                }

                return {};
            },

            currentFloor() {
                if (this.currentFloorNumber) {
                    return this.floors.find(({label}) => label === Number(this.currentFloorNumber));
                }

                return {};
            },

            isEmptyFloor() {
                return !this.currentFloor?.flat_count;
            },

            btnText() {
                return !this.isEmptyFloor ? `Показать ${this.currentFloor.flat_count} квартир` : 'На этаже нет доступных квартир';
            }
        },

        methods: {
            handleBtnClick() {
                this.$emit('change', this.currentFloor?.value);
                this.$emit('close');
            }
        },
    };
</script>

<style lang="scss" module>
    .ProjectGenplanModalFloors {
        //
    }

    .wrapper {
        padding-bottom: 1.6rem;
    }

    .range {
        margin-bottom: 4rem;
    }

    .overlay {
        display: none;

        @include respond-to(sm) {
            display: block;
        }
    }
</style>
