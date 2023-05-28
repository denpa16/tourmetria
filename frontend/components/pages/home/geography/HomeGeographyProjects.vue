<template>
    <div ref="container"
         :class="$style.HomeGeographyProjects">
        <div :class="$style.container">
            <div v-for="project in projects"
                 :key="project.id"
                 :style="{minWidth: `${cardWidth}px`}"
                 :class="$style.card">
                <HomeGeographyProjectCard :project="project" />
            </div>
        </div>
    </div>
</template>

<script>
    import {addResizeListener, removeResizeListener} from '~/assets/js/utils/resizeUtils';
    import HomeGeographyProjectCard from '~/components/pages/home/geography/HomeGeographyProjectCard';

    export default {
        name: 'HomeGeographyProjects',

        components: {
            HomeGeographyProjectCard,
        },

        props: {
            projects: {
                type: Array,
                default: () => [],
            }
        },

        data() {
            return {
                cardWidth: 0,
            };
        },

        mounted() {
            addResizeListener(this.$refs.container, this.calcCardWidth);
            this.calcCardWidth();
        },

        beforeDestroy() {
            removeResizeListener(this.$refs.container, this.calcCardWidth);
        },

        methods: {
            calcCardWidth() {
                this.cardWidth = (this.$refs?.container?.offsetWidth / 4) - 11;
            }
        }
    };
</script>

<style lang="scss" module>
    .HomeGeographyProjects {
        overflow: hidden;
        width: 100%;
        height: 100%;
    }

    .container {
        overflow-x: auto;
        display: flex;
        align-items: flex-end;
        width: 100%;
        height: 100%;

        &::-webkit-scrollbar {
            height: .4rem;
        }

        &::-webkit-scrollbar-track {
            border-radius: .4rem;
            background-color: $base-100;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: .4rem;
            background-color: $base-500;
        }
    }

    .card {
        margin-bottom: 1.6rem;

        &:not(:last-child) {
            margin-right: 1.6rem;
        }
    }

    .cardInner {
        width: 100%;
        height: 100%;
        background-color: $base-200;
    }
</style>
