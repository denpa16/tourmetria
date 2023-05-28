<template>
    <div :class="$style.ProjectsMapList">
        <ProjectsMapListItem v-for="project in projectList"
                             :id="`project-${project.id}`"
                             :key="project.id"
                             :project="project"
                             :active-id="activeId"
                             @click="$emit('change-id', $event)"
        />
    </div>
</template>

<script>
    import ProjectsMapListItem from '~/components/common/projects/ProjectsMapListItem';

    export default {
        name: 'ProjectsMapList',

        components: {ProjectsMapListItem},

        props: {
            projectList: {
                type: Array,
                default: () => [],
            },

            activeId: {
                type: Number,
                default: null,
            }
        },

        watch: {
            activeId(val) {
                if (val) {
                    this.scrollTo(val);
                }
            },
        },

        methods: {
            scrollTo(id) {
                this.$emit('scroll-to', `project-${id}`);
            },
        }
    };
</script>

<style lang="scss" module>
    .ProjectsMapList {
        width: 100%;
    }
</style>
