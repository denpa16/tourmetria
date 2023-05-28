<template>
    <div :class="$style.ProjectGenplanFlatList">
        <ProjectGenplanFlatItem v-for="flat in flats"
                                :key="flat.name"
                                :class="$style.flat"
                                :flat="flat" />
    </div>
</template>

<script>
    import ProjectGenplanFlatItem from '~/components/common/projects/project/genplan/flat/ProjectGenplanFlatItem';
    export default {
        name: 'ProjectGenplanFlatList',

        components: {
            ProjectGenplanFlatItem
        },

        props: {
            flats: {
                type: Array,
                default: () => [],
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectGenplanFlatList {
        //
    }

    .flat {
        margin-bottom: 1.6rem;

        @include respond-to(sm) {
            margin-bottom: .8rem;
        }

        &:last-child {
            margin-bottom: 0;
        }
    }
</style>
