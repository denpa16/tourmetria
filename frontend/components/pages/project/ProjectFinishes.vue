<template>
    <section :class="$style.ProjectFinishes">
        <div :class="[$style.container, 'container']">
            <h3 :class="[$style.title, 'h3']">
                отделка {{ lotLabels.plural[1] }}
            </h3>

            <ProjectFinishesFilter :finishes="finishes"
                                   :values="values"
                                   @change-rooms="handleChangeRooms"
                                   @change-finishes="handleChangeFinishes" />

            <ProjectFinishesSlider :slides="finishesSlides"
                                   :finishes="finishes"
                                   :value="values.finish" />
        </div>
    </section>
</template>

<script>
    import ProjectFinishesFilter from '~/components/pages/project/ProjectFinishesFilter';
    import ProjectFinishesSlider from '~/components/pages/project/ProjectFinishesSlider';

    export default {
        name: 'ProjectFinishes',

        components: {
            ProjectFinishesFilter,
            ProjectFinishesSlider,
        },

        props: {
            finishes: {
                type: Array,
                default: () => [],
            },

            lotLabels: {
                type: Object,
                default: () => ({}),
            },
        },

        data() {
            return {
                activeIndex: 0,
                finishesDetail: [],
                values: {
                    finish: '',
                    room: '',
                },
            };
        },

        computed: {
            finishesSlides() {
                let items = [];
                this.finishes.forEach(item => {
                    if (item?.slug === this.values.finish) {
                        item.finishkindarea_set.forEach(elem => {
                            if (elem?.slug === this.values.room) {
                                items = elem.finishkindareaphoto_set.slice();
                            }
                        });
                    }
                });

                return items;
            },
        },

        watch: {
            'values.finish'(value) {
                const finishkindarea = this.finishes.filter(elem => elem.slug === value);
                this.values.room = finishkindarea[0].finishkindarea_set[0]?.slug;
            },
        },

        created() {
            if (this.finishes.length) {
                this.values.finish = this.finishes[0]?.slug;
                this.values.room = this.finishes[0]?.finishkindarea_set[0]?.slug;
            }
        },

        methods: {
            handleChangeRooms(value) {
                if (!value) {
                    return;
                }

                this.values.room = value;
            },

            handleChangeFinishes(value) {
                if (!value) {
                    return;
                }

                this.values.finish = value;
            },
        },
    };
</script>

<style lang="scss" module>
    .ProjectFinishes {
        height: 100%;
        padding-top: 6.4rem;

        @include respond-to(xs) {
            padding-top: 40px;
        }
    }

    .title {
        margin-bottom: 3.2rem;
        text-align: center;
        text-transform: uppercase;

        @include respond-to(sm) {
            margin-bottom: 2.4rem;
        }

        @include respond-to(xs) {
            margin-bottom: 24px;
            font-size: 20px;
            line-height: 24px;
        }
    }
</style>
