<template>
    <div :class="$style.AnimationRow">
        <ul ref="list"
            :class="$style.list">
            <li v-for="(i, index) of outputItems"
                :key="index"
                :class="$style.row">
                <slot :item="i"></slot>
            </li>
        </ul>
    </div>
</template>

<script>
    import {gsap} from 'gsap';

    export default {
        name: 'AnimationRow',

        props: {
            items: {
                type: Array,
                required: true,
                default: () => [],
            },
        },

        data() {
            return {
                timeline: null,
            };
        },

        computed: {
            outputItems() {
                return this.items.length > 1 ? [...this.items, this.items[0]] : [...this.items];
            },

            count() {
                return this.outputItems.length;
            },
        },

        mounted() {
            if (this.count > 1) {
                this.createTimeline(this.count);
            }
        },

        methods: {
            createTimeline(count) {
                if (!this.$refs.list) {
                    return;
                }

                this.timeline = gsap.timeline({repeat: -1});

                const shiftPercent = 100 / count;

                for (let i = 0; i < count - 1; i++) {
                    this.timeline.to(this.$refs.list, {
                        duration: .8,
                        ease: 'ease-in-out',
                        transform: `translateY(-${(i + 1) * shiftPercent}%)`,
                    }, '+=3.5');
                }
            },
        },
    };
</script>

<style lang="scss" module>
    .AnimationRow {
        clip-path: inset(1px 0);
    }
</style>
