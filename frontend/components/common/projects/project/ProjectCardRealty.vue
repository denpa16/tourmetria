<template>
    <div :class="$style.ProjectCardRealty">
        <div :class="$style.infoInner">
            <div :class="$style.imgWrapper">
                <div :class="$style.tags">
                    <TagsList :tags="tags"
                              :shown-tags-count="1"
                              color-activator="transparent" />
                </div>
                <ImageLazy :image="image_display"
                           :preview="image_preview" />
            </div>

            <div v-if="header"
                 :class="$style.head">
                <p :class="[$style.title, 'h4']">
                    {{ project.name }}
                </p>
                <p :class="[$style.title, 'h4', 'c-blue']">
                    от {{ project.flat_min_price | splitShort }} млн Р
                </p>
                <div :class="$style.location">
                    <span v-if="project.city"
                          class="p6 c-base300">{{ project.city.name }}</span>
                    <AnimationRow v-if="project.direction_signs && project.direction_signs.length"
                                  :class="$style.metro"
                                  :items="project.direction_signs">
                        <template #default="{item}">
                            <MetroInfo
                                :metro="item"
                                :class="$style.metroItem"
                            />
                        </template>
                    </AnimationRow>
                </div>
            </div>

            <ul :class="$style.rows">
                <li v-if="project.studio_count"
                    :class="$style.row">
                    <NuxtLink :class="$style.link"
                              :to="`/selection/flats/?project=${project.slug}&rooms=0`"
                              @click.native="onLinkClick">
                        <div :class="[$style.type, 'p2']">
                            Студии <span class="c-base300">{{ project.studio_count }}</span>
                        </div>
                        <div :class="$style.line"></div>
                        <div :class="[$style.value, 'p2']">
                            от {{ project.studio_min_price | splitShort }} млн <span :class="$style.rub">₽</span>
                            <IconArrowLeft :class="$style.icon" />
                        </div>
                    </NuxtLink>
                </li>
                <li v-if="project.room_1_count"
                    :class="$style.row">
                    <NuxtLink :class="$style.link"
                              :to="`/selection/flats/?project=${project.slug}&rooms=1`"
                              @click.native="onLinkClick">
                        <div :class="[$style.type, 'p2']">
                            1-комн <span class="c-base300">{{ project.room_1_count }}</span>
                        </div>
                        <div :class="$style.line"></div>
                        <div :class="[$style.value, 'p2']">
                            от {{ project.room_1_min_price | splitShort }} млн <span :class="$style.rub">₽</span>
                            <IconArrowLeft :class="$style.icon" />
                        </div>
                    </NuxtLink>
                </li>
                <li v-if="project.room_2_count"
                    :class="$style.row">
                    <NuxtLink :class="$style.link"
                              :to="`/selection/flats/?project=${project.slug}&rooms=2`"
                              @click.native="onLinkClick">
                        <div :class="[$style.type, 'p2']">
                            2-комн <span class="c-base300">{{ project.room_2_count }}</span>
                        </div>
                        <div :class="$style.line"></div>
                        <div :class="[$style.value, 'p2']">
                            от {{ project.room_2_min_price | splitShort }} млн <span :class="$style.rub">₽</span>
                            <IconArrowLeft :class="$style.icon" />
                        </div>
                    </NuxtLink>
                </li>
                <li v-if="project.room_3_count"
                    :class="$style.row">
                    <NuxtLink :class="$style.link"
                              :to="`/selection/flats/?project=${project.slug}&rooms=3`"
                              @click.native="onLinkClick">
                        <div :class="[$style.type, 'p2']">
                            3-комн <span class="c-base300">{{ project.room_3_count }}</span>
                        </div>
                        <div :class="$style.line"></div>
                        <div :class="[$style.value, 'p2']">
                            от {{ project.room_3_min_price | splitShort }} млн <span :class="$style.rub">₽</span>
                            <IconArrowLeft :class="$style.icon" />
                        </div>
                    </NuxtLink>
                </li>
                <li v-if="project.room_4_count"
                    :class="$style.row">
                    <NuxtLink :class="$style.link"
                              :to="`/selection/flats/?project=${project.slug}&rooms=4`"
                              @click.native="onLinkClick">
                        <div :class="[$style.type, 'p2']">
                            3-комн <span class="c-base300">{{ project.room_4_count }}</span>
                        </div>
                        <div :class="$style.line"></div>
                        <div :class="[$style.value, 'p2']">
                            от {{ project.room_4_min_price | splitShort }} млн <span :class="$style.rub">₽</span>
                            <IconArrowLeft :class="$style.icon" />
                        </div>
                    </NuxtLink>
                </li>
            </ul>


            <div :class="$style.btnWrapper">
                <VButton :class="$style.btn"
                         :link="`/selection/flats/?project=${project.slug}`"
                         @click.native="onLinkClick">
                    Квартиры
                </VButton>
                <VButton :class="$style.btn"
                         color="dark"
                         :link="`/${project?.city?.slug}/complex-${project.slug}`"
                         @click.native="onLinkClick">
                    {{ btnText }}
                </VButton>
            </div>
        </div>
    </div>
</template>

<script>
    import ImageLazy from '~/components/common/ImageLazy';
    import IconArrowLeft from '~/components/icons/IconArrowLeft';
    import AnimationRow from '~/components/common/AnimationRow';
    import MetroInfo from '~/components/common/metro/MetroInfo';
    import TagsList from '~/components/common/TagsList';
    import {plural} from '~/assets/js/utils/textUtils';
    import {unlockBody} from '~/assets/js/utils/lockUtilsMain';

    export default {
        name: 'ProjectCardRealty',

        components: {
            ImageLazy,
            IconArrowLeft,
            AnimationRow,
            MetroInfo,
            TagsList,
        },

        props: {
            project: {
                type: Object,
                default: () => ({}),
            },

            btnText: {
                type: String,
                default: 'Подробнее о проекте',
            },

            header: {
                type: Boolean,
                default: false,
            }
        },

        computed: {
            image_preview() {
                return this.project?.project_card_images[0]?.image_preview || '';
            },

            image_display() {
                return this.project?.project_card_images[0]?.image_display || '';
            },

            tags() {
                const tags = [];
                if (this.project.days_before_start_sales) {
                    tags.push({label: `До старта продаж ${this.project.days_before_start_sales} ${plural(this.project.days_before_start_sales, ['день', 'дня', 'дней'])}`, color: 'primary'});
                }

                if (this.project.start_sales) {
                    tags.push({label: 'Старт продаж', color: 'primary'});
                }

                if (this.project.queque_realized) {
                    tags.push({label: `${this.project.queque_realized} очередь сдана`, color: 'primary'});
                }

                if (this.project.realized) {
                    tags.push({label: 'Проект сдан', color: 'transparent'});
                }

                if (this.project.finish) {
                    tags.push({label: 'Отделка', color: 'transparent'});
                }

                if (this.project.tags_list.length) {
                    const customTags = this.project.tags_list.map(item => ({
                        label: item,
                        color: 'transparent'
                    }));
                    tags.push(...customTags);
                }

                return tags;
            },
        },

        methods: {
            onLinkClick() {
                unlockBody();
            },
        },
    };
</script>

<style lang="scss" module>
    .ProjectCardRealty {
        //
    }

    .infoInner {
        padding: 1.6rem;
    }

    .imgWrapper {
        position: relative;
        overflow: hidden;
        -webkit-mask-image: -webkit-radial-gradient(white, black);
        width: 100%;
        height: 19.2rem;
        border-radius: .8rem;

        &:after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 3.5rem;
            background: linear-gradient(180deg, rgba(10, 11, 12, 0) 0%, rgba(10, 11, 12, .0086472) 6.67%, rgba(10, 11, 12, .03551) 13.33%, rgba(10, 11, 12, .0816599) 20%, rgba(10, 11, 12, .147411) 26.67%, rgba(10, 11, 12, .231775) 33.33%, rgba(10, 11, 12, .331884) 40%, rgba(10, 11, 12, .442691) 46.67%, rgba(10, 11, 12, .557309) 53.33%, rgba(10, 11, 12, .668116) 60%, rgba(10, 11, 12, .768225) 66.67%, rgba(10, 11, 12, .852589) 73.33%, rgba(10, 11, 12, .91834) 80%, rgba(10, 11, 12, .96449) 86.67%, rgba(10, 11, 12, .991353) 93.33%, #0a0b0c 100%);
            opacity: .3;
            -webkit-transform: translateZ(0);
        }

        &:before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 8.4rem;
            background: linear-gradient(180deg, rgba(10, 11, 12, 0) 0%, rgba(10, 11, 12, .0086472) 6.67%, rgba(10, 11, 12, .03551) 13.33%, rgba(10, 11, 12, .0816599) 20%, rgba(10, 11, 12, .147411) 26.67%, rgba(10, 11, 12, .231775) 33.33%, rgba(10, 11, 12, .331884) 40%, rgba(10, 11, 12, .442691) 46.67%, rgba(10, 11, 12, .557309) 53.33%, rgba(10, 11, 12, .668116) 60%, rgba(10, 11, 12, .768225) 66.67%, rgba(10, 11, 12, .852589) 73.33%, rgba(10, 11, 12, .91834) 80%, rgba(10, 11, 12, .96449) 86.67%, rgba(10, 11, 12, .991353) 93.33%, #0a0b0c 100%);
            opacity: .38;
            -webkit-transform: translateZ(0) rotate(180deg);
        }
    }

    .tags {
        position: absolute;
        top: .8rem;
        left: .8rem;
        z-index: 2;
        display: flex;
        flex-wrap: wrap;
        width: calc(100% - 1.6rem);
    }

    .tag {
        margin-bottom: .4rem;

        &:not(:last-child) {
            margin-right: .4rem;
        }
    }

    .rows {
        margin-top: 2.4rem;
    }

    .row {
        &:not(:last-child) {
            margin-bottom: 1.6rem;
        }
    }

    .link {
        display: flex;
        align-items: flex-end;
        cursor: pointer;

        @include hover {
            .type {
                color: $blue;
            }

            .value {
                color: $base-800;
            }
        }
    }

    .type {
        color: $base-800;
        transition: $default-color-transition;
    }

    .value {
        position: relative;
        color: $base-300;
        transition: $default-color-transition;
    }

    .line {
        flex: 1;
        margin-bottom: .4rem;
        border-bottom: 1px dashed $base-100;
    }

    .rub {
        padding-right: 2.4rem;
        font-family: 'Noto Sans', sans-serif;
    }

    .icon {
        position: absolute;
        top: 50%;
        right: 0;
        width: 1.2rem;
        height: 1.2rem;
        transform: translateY(-50%) rotate(180deg);
    }

    .btnWrapper {
        display: flex;
        margin-top: 3.2rem;
    }

    .btn {
        &:first-child {
            margin-right: .8rem;
        }

        &:last-child {
            flex: 1;
        }
    }

    .head {
        margin-top: 2.4rem;
    }

    .title {
        text-transform: uppercase;
    }

    .location {
        display: flex;
        margin-top: .4rem;
    }

    .metro {
        height: 1.8rem;
        margin-left: .8rem;
    }

    .metroItem {
        height: 1.7rem;
        color: $base-300;
    }
</style>
