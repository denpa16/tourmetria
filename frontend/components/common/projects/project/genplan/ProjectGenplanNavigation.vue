<template>
    <SliderNavigation v-if="items && items.length"
                      :class="$style.ProjectGenplanNavigation"
                      :prev-disabled="currentSlide === 1"
                      :next-disabled="currentSlide === totalSlides"
                      @next-click="handleNextClick"
                      @prev-click="handlePrevClick">
        <span :class="[$style.label, 'p6']">{{ label }}
            {{ currentSlideText }}<span class="c-base300">{{ currentSlideEndingText }}</span>
        </span>
    </SliderNavigation>
</template>

<script>
    import SliderNavigation from '~/components/common/SliderNavigation';

    export default {
        name: 'ProjectGenplanNavigation',

        components: {
            SliderNavigation,
        },

        props: {
            items: {
                type: Array,
                default: () => [],
            },

            activeItemId: {
                type: [String, Number],
                default: '',
            },

            itemsPerView: {
                type: Number,
                default: 1,
            },

            label: {
                type: String,
                default: '',
            }
        },

        data() {
            return {
                currentSlide: this.getCurrentSlide() || 1,
            };
        },

        computed: {
            totalSlides() {
                if (!Array.isArray(this.items) || !this.items?.length) {
                    return 1;
                }

                return Math.ceil(this.items.length / this.itemsPerView);
            },

            activeItemsIndexes() {
                const maxIndex = this.currentSlide * this.itemsPerView;
                return [maxIndex - this.itemsPerView, Math.min(maxIndex, this.items.length)];
            },

            activeItems() {
                const [from, to] = this.activeItemsIndexes;
                return this.items.slice(from, to);
            },

            multiSlidePerViewMode() {
                return this.itemsPerView > 1 && (this.activeItemsIndexes[0] + 1) !== this.activeItemsIndexes[1];
            },

            currentSlideText() {
                return !this.multiSlidePerViewMode
                    ? `${this.activeItemsIndexes[1]}`
                    : `${this.activeItemsIndexes[0] + 1}-${this.activeItemsIndexes[1]}`;
            },

            currentSlideEndingText() {
                return !this.multiSlidePerViewMode
                    ? `/${this.items.length}`
                    : ` из ${this.items.length}`;
            },
        },

        methods: {
            getCurrentSlide() {
                if (!Array.isArray(this.items) || !this.items?.length) {
                    return 1;
                }

                const index = this.items.indexOf(item => item.id === this.activeItemId);
                return Math.ceil((index + 1) / this.itemsPerView);
            },

            handleNextClick() {
                this.currentSlide += 1;
                this.$emit('back');
                this.$emit('change-items', this.activeItems);
            },

            handlePrevClick() {
                this.currentSlide -= 1;
                this.$emit('next');
                this.$emit('change-items', this.activeItems);
            },
        }
    };
</script>

<style lang="scss" module>
    .ProjectGenplanNavigation {
        box-shadow: 0 0 4px rgba(0, 0, 0, .04), 0 4px 8px rgba(0, 0, 0, .06);
    }

    .label {
        display: block;
        width: 100%;
        text-align: center;
        color: $base-800;
    }
</style>
