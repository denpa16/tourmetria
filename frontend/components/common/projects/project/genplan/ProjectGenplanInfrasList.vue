<template>
    <transition-group name="list-fade-down"
                      tag="ul"
                      :class="[$style.ProjectGenplanInfrasList, {[$style._right]: right}]">
        <ProjectGenplanInfraItem v-if="!render && isShowCompactViewCount"
                                 key="firstCompactCount"
                                 component="li"
                                 first-count
                                 :top="left"
                                 :bottom="right"
                                 :is-opened="isOpened"
                                 @click.stop="isOpened = !isOpened">
            <transition name="fade-content">
                <IconCross v-if="isOpened"
                           :class="$style.closeIcon" />
                <span v-else>+{{ compactViewCount }}</span>
            </transition>
        </ProjectGenplanInfraItem>

        <ProjectGenplanInfraItem v-for="(infraItem, i) in currentItems"
                                 :key="infraItem.id"
                                 :class="[$style.infraItem, {[$style._render]: render}]"
                                 :style="infraItem.style"
                                 :item="infraItem"
                                 :first-count="!isShowCompactViewCount && !i"
                                 :top="!isShowCompactViewCount && left"
                                 :bottom="!isShowCompactViewCount && right"
                                 :render="render"
                                 component="li"
                                 @click.stop="$emit('click', infraItem)" />

        <ProjectGenplanInfraItem v-if="!render && isOpened && realMaxItems < infras.length"
                                 key="lastCompactCount"
                                 component="li"
                                 disabled>
            +{{ compactViewCount }}
        </ProjectGenplanInfraItem>
    </transition-group>
</template>

<script>
    import ProjectGenplanInfraItem
        from '~/components/common/projects/project/genplan/ProjectGenplanInfraItem';
    import IconCross from '~/components/icons/IconCross';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';

    export default {
        name: 'ProjectGenplanInfrasList',

        components: {
            IconCross,
            ProjectGenplanInfraItem
        },

        mixins: [breakpointCheck],

        props: {
            infras: {
                type: Array,
                default: () => [],
            },

            maxHeight: {
                type: Number,
                default: 0,
            },

            left: {
                type: Boolean,
                default: false,
            },

            right: {
                type: Boolean,
                default: false,
            },

            render: {
                type: Boolean,
                default: false,
            },

            scaleValue: {
                type: Number,
                default: 1,
            },

            pointPropertyName: {
                type: String,
                default: '',
            },
        },

        data() {
            return {
                itemHeight: 44,
                itemsGap: 8,
                isOpened: false,
                compactViewItemsCount: 3,
                compactViewItemsMobileCount: 2,
            };
        },

        computed: {
            maxItems() {
                if (!this.maxHeight) {
                    return;
                }

                return Math.floor(this.maxHeight / (this.itemHeight + this.itemsGap));
            },

            isShowCompactViewCount() {
                return this.breakpoint === 'xs'
                    ? this.infras.length > this.compactViewItemsMobileCount
                    : this.infras.length > this.compactViewItemsCount;
            },

            realMaxItems() {
                if (this.isShowCompactViewCount && !this.isOpened) {
                    return this.breakpoint === 'xs'
                        ? this.compactViewItemsMobileCount
                        : this.compactViewItemsCount;
                }

                if (this.isShowCompactViewCount && this.isOpened) {
                    return (this.maxItems - 1) > this.infras.length ? this.maxItems - 2 : this.maxItems - 1;
                }

                return this.maxItems;
            },

            compactViewCount() {
                return this.infras.length - this.realMaxItems;
            },

            currentItems() {
                if (this.render) {
                    return [...this.infras].map(infra => {
                        const point = infra[this.pointPropertyName];
                        infra.style = {
                            left: `${point[0]}%`,
                            top: `${point[1]}%`,
                            transform: `scale(${this.scaleValue})`
                        };
                        return infra;
                    });
                }

                return this.infras.slice(0, this.realMaxItems);
            }
        },
    };
</script>

<style lang="scss" module>
    .ProjectGenplanInfrasList {
        display: flex;
        flex-direction: column;

        & > * {
            margin-bottom: .8rem;

            &:last-child {
                margin-bottom: 0;
            }
        }

        &._right {
            flex-direction: column-reverse;

            & > * {
                margin-top: .8rem;
                margin-bottom: 0;

                &:last-child {
                    margin-top: 0;
                }
            }
        }
    }

    .infraItem {
        &._render {
            position: absolute;
            z-index: 101;
        }
    }

    .closeIcon {
        width: 1.6rem;
        height: 1.6rem;
    }
</style>
