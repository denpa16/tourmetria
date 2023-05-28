<template>
    <div :class="$style.FlatHeroInfoMain">
        <div :class="$style.row">
            <p class="p2 c-base300">
                Проект
            </p>
            <div :class="$style.line"></div>
            <NuxtLink :class="[$style.value, 'p2', 'c-blue']"
                      :to="`/${lot.city_slug}/complex-${lot.project_slug}`">
                {{ lot.project_name }}
            </NuxtLink>
        </div>

        <div v-if="lot.building"
             :class="$style.row">
            <p class="p2 c-base300">
                Литер
            </p>
            <div :class="$style.line"></div>
            <p :class="[$style.value, 'p2']">
                {{ lot.building }} литер
            </p>
        </div>

        <div v-if="lot.section"
             :class="$style.row">
            <p class="p2 c-base300">
                Подъезд
            </p>
            <div :class="$style.line"></div>
            <p :class="[$style.value, 'p2']">
                {{ lot.section }} <span v-if="lot.section_count">из {{ lot.section_count }}</span>
            </p>
        </div>

        <div v-if="lot.floor"
             :class="$style.row">
            <p class="p2 c-base300">
                Этаж
            </p>
            <div :class="$style.line"></div>
            <p :class="[$style.value, 'p2']">
                {{ lot.floor }} <span v-if="lot.floor_count">из {{ lot.floor_count }}</span>
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'FlatHeroInfoMain',

        props: {
            lot: {
                type: Object,
                default: () => ({}),
            },
        },


    };
</script>

<style lang="scss" module>
    .FlatHeroInfoMain {
        margin-top: 2.4rem;
    }

    .row {
        display: flex;
        margin-bottom: 2.4rem;
    }

    .line {
        flex: 1;
        margin: 0 1.5rem .4rem;
        border-bottom: 1px dashed $base-100;
    }

    .value {
        min-width: 7rem;
        text-align: right;
    }
</style>
