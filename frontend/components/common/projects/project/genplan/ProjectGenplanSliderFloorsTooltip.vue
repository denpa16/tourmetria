<template>
    <transition name="fade-content"
                mode="out-in">
        <div v-show="isShow"
             :class="$style.ProjectGenplanSliderFloorsTooltip">
            <transition name="fade-content"
                        mode="out-in">
                <p :key="text"
                   class="p6, c-base300">
                    {{ text }}
                </p>
            </transition>

            <IconPlus :class="$style.closeBtnIcon"
                      @click.native="isShow = false" />
        </div>
    </transition>
</template>

<script>
    import IconPlus from '~/components/icons/IconPlus';

    export default {
        name: 'ProjectGenplanSliderFloorsTooltip',
        components: {
            IconPlus
        },

        props: {
            activeFloor: {
                type: Number,
                required: true,
            },

            nextFloor: {
                type: Number,
                required: true,
            },

            prevFloor: {
                type: Number,
                required: true,
            },
        },

        data() {
            return {
                isShow: false,
            };
        },

        computed: {
            nextDisabledFloors() {
                if (!this.nextFloor || this.nextFloor === (this.activeFloor + 1)) {
                    return null;
                }

                if (this.nextFloor === (this.activeFloor + 2)) {
                    return [this.activeFloor + 1];
                }

                return [this.activeFloor + 1, this.nextFloor - 1];
            },

            prevDisabledFloors() {
                if (!this.prevFloor || this.prevFloor === (this.activeFloor - 1)) {
                    return null;
                }

                if (this.prevFloor === (this.activeFloor - 2)) {
                    return [this.activeFloor - 1];
                }

                return [this.activeFloor - 1, this.prevFloor + 1];
            },

            visible() {
                return Boolean(this.nextDisabledFloors || this.prevDisabledFloors);
            },

            isBothSidesDisabledFloors() {
                return this.nextDisabledFloors && this.prevDisabledFloors;
            },

            isManyDisabledFloors() {
                return this.nextDisabledFloors?.length === 2
                    || this.prevDisabledFloors?.length === 2
                    || this.isBothSidesDisabledFloors;
            },

            connectingString() {
                return this.isBothSidesDisabledFloors ? ' и ' : '';
            },

            prevDisabledFloorsString() {
                if (!this.prevDisabledFloors) {
                    return '';
                }

                return this.prevDisabledFloors.length === 2 ? `${this.prevDisabledFloors[1]}-${this.prevDisabledFloors[0]}` : this.prevDisabledFloors[0];
            },

            nextDisabledFloorsString() {
                if (!this.nextDisabledFloors) {
                    return '';
                }

                return this.nextDisabledFloors.length === 2 ? `${this.nextDisabledFloors[0]}-${this.nextDisabledFloors[1]}` : this.nextDisabledFloors[0];
            },

            text() {
                return `На ${this.prevDisabledFloorsString}${this.connectingString}${this.nextDisabledFloorsString} этаж${this.isManyDisabledFloors ? 'ах' : 'е'} доступных квартир нет, зато есть варианты на ${this.prevDisabledFloors ? this.prevFloor : ''}${this.connectingString}${this.nextDisabledFloors ? this.nextFloor : ''} этаж${this.isBothSidesDisabledFloors ? 'ах' : 'е'}`;
            }
        },

        watch: {
            text() {
                this.isShow = this.visible;
            }
        },

        mounted() {
            this.isShow = this.visible;
        }
    };
</script>

<style lang="scss" module>
    .ProjectGenplanSliderFloorsTooltip {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 50vw;
        padding: 1.6rem 2rem;
        border-radius: .8rem;
        border: 1px solid $base-100;
        background-color: $base-0;
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
    }

    .closeBtnIcon {
        width: 3.2rem;
        height: 3.2rem;
        margin-left: 1.2rem;
        color: $blue;
        transform: rotate(45deg);
        transition: opacity $default-transition;
        cursor: pointer;

        @include hover {
            opacity: .7;
        }
    }
</style>
