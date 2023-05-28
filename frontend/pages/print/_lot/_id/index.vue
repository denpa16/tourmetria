<template>
    <div :class="$style.FlatPage">
        <PrintHero />
        <PrintProjectInfra :project="project"
                           :phases="phases"
                           :buildings="buildings"
                           :facets="facets"
                           :infras-categories="infrasCategories" />
        <PrintProjectSchema :phases="phases" />
        <PrintProjectBenefits :benefits="project.benefits_categories"
                              :project-slug="flat.project_slug"
                              :project-city-slug="project.city.slug" />
        <PrintLot :lot="flat"
                  :project="project"
                  :payments="payments" />

        <PrintProjectContacts :project="project"
                              :offices="offices" />
    </div>
</template>

<script>
    import PrintHero from '~/components/pages/print/PrintHero';
    import PrintProjectInfra from '~/components/pages/print/project/PrintProjectInfra';
    import PrintProjectSchema from '~/components/pages/print/project/PrintProjectSchema';
    import PrintProjectBenefits from '~/components/pages/print/project/PrintProjectBenefits';
    import PrintLot from '~/components/pages/print/PrintLot';
    import PrintProjectContacts from '~/components/pages/print/project/PrintProjectContacts';

    export default {
        name: 'FlatPage',
        components: {
            PrintProjectContacts,
            PrintLot,
            PrintProjectBenefits,
            PrintProjectSchema,
            PrintProjectInfra,
            PrintHero,
        },

        layout: 'empty',
        scrollToTop: true,

        async asyncData({app, params, error}) {
            try {
                const flatRes = await app.$axios.$get(app.$api[params.lot].id(params.id));
                const project = await app.$axios.$get(app.$api.projects.slug(flatRes.project_slug));

                const genplanPromise = project?.has_phase
                    ? app.$axios.$get(app.$api.projects.phases(project.slug))
                    : app.$axios.$get(app.$api.projects.buildings(project.slug));

                const [
                    genplan,
                    facets,
                    infrasCategories,
                    payments,
                    offices,
                ] = await Promise.all([
                    genplanPromise,
                    app.$axios.$get(app.$api.flats.facets, {params: {project: flatRes.project_slug}}),
                    app.$axios.$get(app.$api.infrasCategories.list, {params: {project: flatRes.project_slug}}),
                    app.$axios.$get(app.$api.purchases.list, {params: {projects: flatRes.project_slug}}),
                    app.$axios.$get(app.$api.offices.list, {params: {projects: flatRes.project_slug}}),
                ]);

                return {
                    flat: flatRes || {},
                    project: project || {},
                    phases: project?.has_phase ? genplan : null,
                    buildings: project?.has_phase ? null : genplan,
                    facets: facets || [],
                    infrasCategories: infrasCategories || [],
                    payments: payments || [],
                    offices: offices || [],
                };
            } catch (err) {
                console.warn('[Lot print page/asyncData] request failed: ', err);
                return error({statusCode: 404});
            }
        },

        data() {
            return {
                flat: {},
                project: {},
                phases: null,
                buildings: null,
                facets: [],
                infrasCategories: [],
                payments: [],
                offices: [],
            };
        },
    };
</script>

<style lang="scss" module>
.FlatPage {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.mobilePanel {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    transition: all .2s linear;

    @include respond-to(xs) {
        display: block;
    }

    &._hidden {
        opacity: 0;
        transform: translateY(100%);
    }
}
</style>
