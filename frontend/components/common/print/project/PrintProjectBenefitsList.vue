<template>
    <ul :class="$style.PrintProjectBenefitsList">
        <li v-for="(benefit, i) in benefits"
            :key="benefit.id"
            :class="[$style.listItem, {[$style._double]: benefit.double}]">
            <PrintProjectBenefitCard :img="benefit.image_display"
                                     :title="benefit.card_title"
                                     :text="benefit.second_description"
                                     :project-slug="projectSlug"
                                     :project-city-slug="projectCitySlug"
                                     :reversed="i === 1"
                                     :double="benefit.double"
                                     @overflow="$emit('overflow', benefit.id)" />
        </li>

    </ul>
</template>

<script>
    import PrintProjectBenefitCard from '~/components/common/print/project/PrintProjectBenefitCard';
    export default {
        name: 'PrintProjectBenefitsList',

        components: {
            PrintProjectBenefitCard
        },

        props: {
            benefits: {
                type: Array,
                default: () => [],
            },

            projectSlug: {
                type: String,
                default: ''
            },

            projectCitySlug: {
                type: String,
                default: ''
            },
        },
    };
</script>

<style lang="scss" module>
    .PrintProjectBenefitsList {
        width: 100%;
        height: 100%;
    }

    .listItem {
        width: 100%;
        height: calc(100% / 3);

        &._double {
            height: calc((100% * 2) / 3);
        }
    }
</style>
