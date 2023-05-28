<template>
    <transition name="modal"
                @after-enter="$emit('after-enter')"
                @before-leave="$emit('before-leave')"
                @after-leave="$emit('after-leave')">
        <div v-if="visible"
             :class="['modal', $style.FlatHeroGalleryModal]">
            <div :class="['modal-wrap', $style.wrap]"
                 @click.self="$emit('close')">

                <div :class="$style.content">
                    <VSquareButton :class="$style.closeBtn"
                                   :color="($deviceIs.tablet || $deviceIs.mobile) ? 'white' : 'light'"
                                   aria-label="Закрыть"
                                   @click="$emit('close')">
                        <IconCross :class="$style.icon" />
                    </VSquareButton>

                    <FlatHeroPlan v-if="onlyPlan"
                                  :class="$style.gallery"
                                  :lot="lot"
                                  is-modal
                                  @change-plan="handleChangePlan" />

                    <FlatHeroGallery v-else
                                     :class="$style.gallery"
                                     :lot="lot"
                                     :active-tab="activeTab"
                                     is-modal
                                     :plan-link="planLink"
                                     :plan-view-angle="planViewAngle"
                                     @change-plan="handleChangePlan" />
                </div>

            </div>
        </div>
    </transition>
</template>

<script>
    import FlatHeroGallery from '~/components/pages/selection/flats/flat/hero/FlatHeroGallery';
    import IconCross from '~/components/icons/IconCross';
    import FlatHeroPlan from '~/components/pages/selection/flats/flat/hero/FlatHeroPlan';

    export default {
        name: 'FlatHeroGalleryModal',

        components: {
            FlatHeroGallery,
            IconCross,
            FlatHeroPlan,
        },

        props: {
            visible: Boolean,

            data: {
                type: Object,
                default: () => ({}),
            },
        },

        data() {
            return {
                currentPlan: {
                    furniture: true,
                    not_main_wall: true,
                },
            };
        },

        computed: {
            lot() {
                return this.data?.lot ?? {};
            },

            onlyPlan() {
                return this.data?.onlyPlan || false;
            },

            activeTab() {
                return this.data?.activeTab || '';
            },

            planViewAngle() {
                return this.data?.planViewAngle || false;
            },

            planLink() {
                const path = this.$route.fullPath.split('/');
                const lastIdx = path.length ? path.length - 1 : 0;

                const res = this.$router.resolve({
                    path: `/pdf/print/${path[lastIdx - 1]}/${path[lastIdx]}/plan`,
                    query: {
                        format: 'A4',
                        furniture: this.currentPlan.furniture,
                        not_main_wall: this.currentPlan.not_main_wall,
                        time: new Date().toLocaleTimeString('ru-RU'),
                    },
                });

                return res.href;
            },
        },

        methods: {
            handleChangePlan(val) {
                this.currentPlan = val;
            },
        }
    };
</script>

<style lang="scss" module>
    .FlatHeroGalleryModal {
        z-index: 200;
    }

    .content {
        position: fixed;
        width: 100%;
        height: 100vh;
        min-height: 75rem;
        padding: 2.4rem;
        background-color: $base-50;

        @include respond-to(md) {
            min-height: 60rem;
        }

        @include respond-to(sm) {
            height: var(--vh-full-page);
            padding: 0;
            background-color: $base-0;
        }
    }

    .gallery {
        width: 100%;
        height: 100%;
    }

    .closeBtn {
        position: absolute;
        top: 4rem;
        right: 4rem;
        z-index: 2;

        @include respond-to(sm) {
            top: 2.4rem;
            right: 2.4rem;

            &:global(.v-square-button--medium) {
                width: 4rem;
                height: 4rem;
            }
        }
    }

    .icon {
        width: .9rem;
        height: .9rem;
    }
</style>
