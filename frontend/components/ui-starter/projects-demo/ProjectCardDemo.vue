<template>
    <div :class="$style.VButtonDemo">
        <UiDemo
            :info="componentInfo"
            @change="onChangeOptions"
        >
            <ProjectCard
                v-bind="compData"
                @click="compData.active = !compData.active"
            />
        </UiDemo>
    </div>
</template>

<script>
// Loader
const docobject = require('vue-simple-docgen-loader!/components/projects/ProjectCard.vue');

// Mixins
import { uiDemo } from '~/mixins/uiDemo';

// Components
import UiDemo from '~/components/ui-starter/UiDemo';
import ProjectCard from '~/components/projects/ProjectCard';

export default {
    name: 'ProjectCardDemo',

    components: {
        UiDemo,
        ProjectCard,
    },

    mixins: [uiDemo],

    data() {
        return {
            compData: {
                project: {
                    name: 'ЖК Пушкино',
                    slug: 'zhk-pushkino',
                    address: 'Москва',
                    complete_date: 'Сдан',
                    min_price: '40000000',
                    image_preview: '/images/projectsDemo/preview_zhk-pushkino.png',
                    image_display: '/images/projectsDemo/zhk-pushkino.png',
                },
            },

            componentInfo: docobject || {},
        };
    },
};
</script>

<style lang="scss" module>
    .VButtonDemo {
        position: relative;
        display: flex;
        flex-flow: column nowrap;
    }
</style>
