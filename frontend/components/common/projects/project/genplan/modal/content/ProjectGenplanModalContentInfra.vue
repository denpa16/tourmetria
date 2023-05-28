<template>
    <article v-if="item"
             :class="$style.ProjectGenplanModalContentInfra">
        <ImageLazy v-if="item.image_display"
                   :class="$style.img"
                   :image="item.image_display"
                   :preview="item.image_preview"
                   relative />
        <h2 v-if="item.name"
            :class="[$style.title, 'h4']">
            {{ item.name }}
        </h2>
        <p v-if="item.work_schedule"
           :class="[$style.time, 'p6', 'c-base300']">
            {{ item.work_schedule }}
        </p>

        <div :class="[$style.tags, {[$style._onImg]: item.image_display && $deviceIs.pc}]">
            <VTag v-if="item.time"
                  color="light">
                <IconWalk :class="$style.carIcon" />
                {{ item.time }} мин
            </VTag>

            <VTag v-if="infraCategoryName"
                  color="light">
                {{ infraCategoryName }}
            </VTag>

            <template v-if="item.tags && item.tags.length">
                <VTag v-for="(tag, index) in item.tags"
                      :key="tag + index"
                      color="light">
                    {{ tag }}
                </VTag>
            </template>
        </div>

        <p v-if="item.short_description"
           :class="[$style.description, 'p6', 'c-base300']">
            {{ item.short_description }}
        </p>

        <VButton color="primary"
                 :class="$style.btn"
                 @click="$emit('close')">
            Понятно
        </VButton>

    </article>
</template>

<script>
    import ImageLazy from '~/components/common/ImageLazy';
    import IconWalk from '~/components/icons/IconWalk';

    export default {
        name: 'ProjectGenplanModalContentInfra',
        components: {
            ImageLazy,
            IconWalk,
        },

        props: {
            item: {
                type: Object,
                default: () => ({}),
            },

            infrasCategories: {
                type: Array,
                default: () => [],
            },

            pointPropertyName: {
                type: String,
                default: '',
            },
        },

        data() {
            return {
                description: 'Краткое описание точки инфраструктуры буквально в две или пять строк, дабы дать пользователю примерное понимание о данном мечсте'
            };
        },

        computed: {
            infraCategoryName() {
                return this.infrasCategories.find(({slug}) => slug === this.item?.category)?.name;
            }
        }
    };
</script>

<style lang="scss" module>
    .ProjectGenplanModalContentInfra {
        position: relative;
        display: flex;
        flex-direction: column;

        @include respond-to(sm) {
            padding-top: 2.4rem;
            padding-bottom: 2.4rem;
        }

        @include respond-to(xs) {
            padding-top: 2.8rem;
            padding-bottom: 1.6rem;
        }
    }

    .img {
        overflow: hidden;
        width: 100%;
        height: 19.2rem;
        margin-bottom: 1.6rem;
        border-radius: .8rem;

        @include respond-to(sm) {
            order: 1;
            margin-top: 2.4rem;
            margin-bottom: 0;
            border-radius: 0;
        }
    }

    .title {
        text-transform: uppercase;
    }

    .time {
        margin-top: .4rem;
    }

    .tags {
        margin-top: 1.2rem;

        @include respond-to(sm) {
            order: -1;
            margin-top: 0;
            margin-bottom: 2.4rem;
        }

        @include respond-to(xs) {
            margin-bottom: 2.8rem;
        }

        &._onImg {
            position: absolute;
            top: .8rem;
            right: .8rem;
            left: .8rem;
            margin-top: 0;
        }
    }

    .carIcon {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: .4rem;
        margin-bottom: .2rem;
        color: $base-800;
    }

    .description {
        margin-top: 1.6rem;

        @include respond-to(sm) {
            order: 2;
            margin-top: 2.4rem;
        }

        @include respond-to(xs) {
            margin-top: 1.6rem;
        }
    }

    .btn {
        display: none;

        @include respond-to(sm) {
            display: flex;
            order: 3;
            margin-top: 2.4rem;
        }
    }
</style>
