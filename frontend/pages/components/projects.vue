<template>
    <div
        :class="[$style.ProjectsPage, 'page', 'container']"
    >
        <ProgressBar :class="$style.progressBar" />

        <div :class="$style.demosWrap">
            <!-- VButton -->
            <ProjectCardDemo
                ref="ProjectCard"
                data-item="ProjectCard"
                :class="$style.demo"
            />
        </div>
    </div>
</template>

<script>
// Utils
import { scrollTo } from '~/assets/js/utils/common-utils';

// Vuex
import { mapActions } from 'vuex';

// Mixins
import { containerObserver } from '~/mixins/containerObserver';

// Components
import ProgressBar from '~/components/common/ProgressBar';
import ProjectCardDemo from '~/components/ui-starter/projects-demo/ProjectCardDemo';

export default {
    name: 'ProjectsPage',

    components: {
        ProgressBar,
        ProjectCardDemo,
    },

    mixins: [containerObserver],

    data() {
        return {
            changeTimeout: null,
        };
    },

    mounted() {
        let anchor = null;
        if (this.$route?.hash) {
            anchor = this.$route.hash.replace(/[^\w]+/g, '');
        }

        this.$nextTick(() => {
            if (anchor) {
                setTimeout(() => scrollTo(anchor, 0, true), 1);
            }

            this.onInit();
        });
    },

    beforeDestroy() {
        if (this.changeTimeout) {
            clearTimeout(this.changeTimeout);
            this.changeTimeout = null;
        }

        this.handleChangeActiveItem('');
    },

    methods: {
        ...mapActions({
            setActive: 'ui-nav/setActive',
        }),

        onInit() {
            const containers = [];
            Object.keys(this.$refs)
                .forEach(i => {
                    containers.push(this.$refs[i].$el);
                });

            if (containers.length) {
                this.startObserve(containers);
            }
        },

        handleBlockIsVisible(blockTarget) {
            const item = blockTarget.dataset.item;

            clearTimeout(this.changeTimeout);
            this.changeTimeout = setTimeout(() => {
                this.handleChangeActiveItem(item);
            }, 400);
        },

        handleChangeActiveItem(item) {
            this.setActive({ category: 'Components', item: 'Projects', title: item });

            if (item) {
                window.history.replaceState(null, null, `${this.$route.path}#${item}`);
            }
        },
    },
};
</script>

<style lang="scss" module>
    .ProjectsPage {
        position: relative;
        padding-bottom: 6.2rem;
    }

    .progressBar {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10000;
    }

    .demosWrap {
        display: flex;
        flex-flow: column wrap;
    }

    .demo {
        width: 80rem;
        margin: 0 auto;
        padding-top: 6.2rem;

        @include respond-to(mobile) {
            width: 100%;
        }
    }
</style>
