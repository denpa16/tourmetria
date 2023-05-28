<template>
    <div
        :class="[$style.UiKitPage, 'page', 'container']"
    >
        <ProgressBar :class="$style.progressBar" />

        <div :class="$style.demosWrap">
            <!-- VAccordion -->
            <VAccordionDemo
                ref="VAccordion"
                data-item="VAccordion"
                :class="$style.demo"
            />

            <!-- VBreadcrumbDemo -->
            <VBreadcrumbDemo
                ref="VBreadcrumb"
                data-item="VBreadcrumb"
                :class="$style.demo"
            />

            <!-- VButton -->
            <VButtonDemo
                ref="VButton"
                data-item="VButton"
                :class="$style.demo"
            />

            <!-- VCalendar -->
            <client-only>
                <VCalendarDemo
                    ref="VCalendar"
                    data-item="VCalendar"
                    :class="$style.demo"
                />
            </client-only>

            <!-- VCheckbox -->
            <VCheckboxDemo
                ref="VCheckbox"
                data-item="VCheckbox"
                :class="$style.demo"
            />

            <!-- VFile -->
            <VFileDemo
                ref="VFile"
                data-item="VFile"
                :class="$style.demo"
            />

            <!-- VIcon -->
            <VIconDemo
                ref="VIcon"
                data-item="VIcon"
                :class="$style.demo"
            />

            <!-- VInput -->
            <VInputDemo
                ref="VInput"
                data-item="VInput"
                :class="$style.demo"
            />

            <!-- VInputSelect -->
            <VInputSelectDemo
                ref="VInputSelect"
                data-item="VInputSelect"
                :class="$style.demo"
            />

            <!-- VPopover -->
            <VPopoverDemo
                ref="VPopover"
                data-item="VPopover"
                :class="$style.demo"
            />

            <!-- VRange -->
            <VRangeDemo
                ref="VRange"
                data-item="VRange"
                :class="$style.demo"
            />

            <!-- Rub -->
            <VRubDemo
                ref="Rub"
                data-item="Rub"
                :class="$style.demo"
            />

            <!-- VSelect -->
            <VSelectDemo
                ref="VSelect"
                data-item="VSelect"
                :class="$style.demo"
            />

            <!-- VSkeleton -->
            <VSkeletonDemo
                ref="VSkeleton"
                data-item="VSkeleton"
                :class="$style.demo"
            />

            <!-- VSwitch -->
            <VSwitchDemo
                ref="VSwitch"
                data-item="VSwitch"
                :class="$style.demo"
            />

            <!-- VTabBar -->
            <VTabBarDemo
                ref="VTabBar"
                data-item="VTabBar"
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
import VAccordionDemo from '~/components/ui-starter/ui-demo/VAccordionDemo';
import VBreadcrumbDemo from '~/components/ui-starter/ui-demo/VBreadcrumbDemo';
import VButtonDemo from '~/components/ui-starter/ui-demo/VButtonDemo';
import VCalendarDemo from '~/components/ui-starter/ui-demo/VCalendarDemo.vue';
import VCheckboxDemo from '~/components/ui-starter/ui-demo/VCheckboxDemo';
import VFileDemo from '~/components/ui-starter/ui-demo/VFileDemo';
import VIconDemo from '~/components/ui-starter/ui-demo/VIconDemo';
import VInputDemo from '~/components/ui-starter/ui-demo/VInputDemo';
import VInputSelectDemo from '~/components/ui-starter/ui-demo/VInputSelectDemo';
import VPopoverDemo from '~/components/ui-starter/ui-demo/VPopoverDemo';
import VRangeDemo from '~/components/ui-starter/ui-demo/VRangeDemo';
import VSelectDemo from '~/components/ui-starter/ui-demo/VSelectDemo';
import VSkeletonDemo from '~/components/ui-starter/ui-demo/VSkeletonDemo';
import VSwitchDemo from '~/components/ui-starter/ui-demo/VSwitchDemo';
import VTabBarDemo from '~/components/ui-starter/ui-demo/VTabBarDemo.vue';
import VRubDemo from '~/components/ui-starter/ui-demo/VRubDemo.vue';

export default {
    name: 'UiKitPage',

    components: {
        VRubDemo,
        ProgressBar,
        VAccordionDemo,
        VBreadcrumbDemo,
        VButtonDemo,
        VCalendarDemo,
        VCheckboxDemo,
        VFileDemo,
        VIconDemo,
        VInputDemo,
        VInputSelectDemo,
        VPopoverDemo,
        VRangeDemo,
        VSelectDemo,
        VSkeletonDemo,
        VSwitchDemo,
        VTabBarDemo,
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
            this.setActive({ category: 'Components', item: 'UI-Kit', title: item });

            if (item) {
                window.history.replaceState(null, null, `${this.$route.path}#${item}`);
            }
        },
    },
};
</script>

<style lang="scss" module>
    .UiKitPage {
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
