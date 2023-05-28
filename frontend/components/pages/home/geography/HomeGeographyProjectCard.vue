<template>
    <div :class="$style.HomeGeographyProjectCard"
         @mouseenter="onMouseEnter"
         @mouseleave="onMouseLeave">
        <transition name="fade-content"
                    mode="out-in">
            <ProjectCardRealty v-if="isActive"
                               :class="$style.card"
                               header
                               :project="project" />
            <ProjectCardShort v-else
                              :class="$style.cardShort"
                              :project="project" />
        </transition>
    </div>
</template>

<script>
    import ProjectCardShort from '~/components/common/projects/project/ProjectCardShort';
    import ProjectCardRealty from '~/components/common/projects/project/ProjectCardRealty';

    export default {
        name: 'HomeGeographyProjectCard',

        components: {
            ProjectCardShort,
            ProjectCardRealty,
        },

        props: {
            project: {
                type: Object,
                default: () => ({}),
            },
        },

        data() {
            return {
                isActive: false,
            };
        },

        methods: {
            onMouseEnter() {
                this.isActive = true;
            },

            onMouseLeave() {
                this.isActive = false;
            },
        }
    };
</script>

<style lang="scss" module>
    .HomeGeographyProjectCard {
        //
    }

    .card {
        border-radius: .8rem;
        background-color: $base-0;
    }

    .cardShort {
        height: 23.5rem;
    }
</style>
