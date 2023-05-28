<template>
    <div v-if="isAnyBenefits"
         :class="$style.PrintProjectBenefits">
        <PrintPage v-for="(benefitsList, i) in benefitPages"
                   :key="i">
            <PrintProjectBenefitsList :benefits="benefitsList"
                                      :project-slug="projectSlug"
                                      :project-city-slug="projectCitySlug"
                                      @overflow="handleOverflow" />
        </PrintPage>
    </div>
</template>

<script>
    import PrintPage from '~/components/common/print/PrintPage';
    import PrintProjectBenefitsList
        from '~/components/common/print/project/PrintProjectBenefitsList';
    export default {
        name: 'PrintProjectBenefits',
        components: {PrintProjectBenefitsList, PrintPage},
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

        data() {
            return {
                doubleItems: [],
            };
        },

        computed: {
            isAnyBenefits() {
                if (!Array.isArray(this.benefits) || !this.benefits.length) {
                    return false;
                }

                return this.benefits.some(item => item.benefits?.length);
            },

            benefitPages() {
                const slicedBenefits = [];
                const benefits = this.benefits.reduce((res, item) => {
                    if (!Array.isArray(item.benefits) || !item.benefits.length) {
                        return res;
                    }
                    res = res.length ? [...res, ...item.benefits] : [...item.benefits];
                    return res;
                }, []);
                benefits.sort((a, b) => a?.order - b?.order);

                if (this.doubleItems?.length) {
                    let count = 0;
                    let nextSliceItem = null;

                    benefits.reduce((slice, item, index, arr) => {
                        const isDoubleItem = this.doubleItems.includes(item.id);
                        const isLast = index === (arr.length - 1);

                        if (!isDoubleItem) {
                            count += 1;
                            slice.push(item);
                        } else {
                            item.double = true;

                            if (count === 2) {
                                if (!slice[1]) {
                                    slicedBenefits.push([...slice]);
                                    slice = [item];
                                    count = 2;

                                    if (isLast) {
                                        slicedBenefits.push([...slice]);
                                    }

                                    return slice;
                                }

                                nextSliceItem = slice[1];
                                slice[1] = item;
                                slicedBenefits.push([...slice]);
                                count = 1;
                                return [nextSliceItem];
                            }
                            count += 2;
                            slice.push(item);
                        }

                        if (count >= 3 || isLast) {
                            slicedBenefits.push([...slice]);
                            count = 0;
                            return [];
                        }

                        return slice;
                    }, []);
                } else {
                    while (benefits.length) {
                        const slice = benefits.splice(0, 3);
                        slicedBenefits.push(slice);
                    }
                }

                return slicedBenefits;
            }
        },

        methods: {
            handleOverflow(id) {
                this.doubleItems.push(id);
            },
        },
    };
</script>

<style lang="scss" module>
    .PrintProjectBenefits {
        //
    }
</style>
