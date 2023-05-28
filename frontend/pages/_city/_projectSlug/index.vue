<template>
    <div :class="$style.ProjectPage"
         class="page">
        <ProjectHero :slides="project.project_top_slides"
                     :city="project.city"
                     :direction-signs="project.direction_signs"
                     :tags="tags"
                     :brochure="project.brochure_pdf"
                     :promo="project.publication_on_top"
                     :custom-height-reduction="projectMenuHeight"
                     @scroll-to="scrollToBlock($event)" />

        <ProjectMenu :project="project"
                     :promo-count="promoList.length"
                     :lot-labels="currentLotLabel"
                     :lot-page-link="lotPageLink"
                     :is-show-blocks="isShowBlocks"
                     @update-height="projectMenuHeight = $event"
                     @scroll-to="scrollToBlock($event)" />

        <ProjectAbout id="about"
                      :name="project.name"
                      :title="project.description_title"
                      :description-short="project.description"
                      :description-full="project.description_full"
                      :features="project.description_features"
                      :video="project.description_video"
                      :youtube-id="project.youtube_video_id"
                      :brochure="project.brochure_pdf"
                      :tour-link="project.tour_link"
                      :slides="project.description_slides" />

        <ProjectGenplan
            v-if="isShowBlocks.genplan"
            id="genplan"
            ref="genplan"
            :phases="phases"
            :buildings="buildings"
            :project-coordinates="project && project.coordinates"
            fullscreen-height
        />

        <ProjectInfra id="infra"
                      ref="infra"
                      :project="project"
                      :infras="infras"
                      :infras-categories="infrasCategories"
                      :map-display="project.infra_map_display"
                      :map-preview="project.infra_map_preview" />

        <ProjectBenefits id="benefits"
                         :benefits-categories="project.benefits_categories"
                         :lot-labels="currentLotLabel"
                         :lot-page-link="lotPageLink"
                         :is-hotel-project="isHotelProject" />

        <ProjectLayouts
            v-if="isShowBlocks.layouts"
            id="layouts"
            :project-slug="projectSlug"
            :custom-height-reduction="projectMenuHeight"
            :layouts="projectLayouts"
            :specs="projectFlatsSpecs"
            :facets="projectFlatsFacets"
            :layouts-count="layoutsCount"
            :is-reloading="isReloading"
            :more-counter="moreCounter"
            :is-full-list="isFullList"
            :is-values-changed="isValuesChanged"
            :lot-page-link="lotPageLink"
            @change-values="handleChangeLayoutsValues"
            @show-more="getNextLayouts"
        />

        <ProjectFinishes v-if="isShowBlocks.finishes"
                         id="finishes"
                         :finishes="finishes"
                         :lot-labels="currentLotLabel" />

        <PromotionsBlock
            v-if="isShowBlocks.promotions"
            id="promotions"
            :promo-list="promoList"
            :promo-count="promoList.length"
            :preferred-project-name="project.name"
            :project-filter="project.slug"
        />

        <ProjectMortgage id="mortgage"
                         :mortgage="mortgage"
                         :lot-labels="currentLotLabel" />

        <ProjectsAdvantages
            v-if="isShowBlocks.advantages"
            id="advantages"
            :data="projectsAdvantagesData"
            @open-form="onOpenForm"
        />

        <PaymentBlock id="payment"
                      :payments-list="project && project.purchases" />

        <ProjectProgress id="progress"
                         :deadline-quarter="project.deadline_quarter"
                         :deadline-year="project.deadline_year"
                         :progress-list="Array.isArray(progressList) ? progressList : progressList.results"
                         :project="project" />

        <FormSubscribe :custom-form-source="formSubscribeSource" />

        <CareBlock id="care"
                   :blocks="neoBlocks" />

        <ProjectOffice id="office"
                       :offices="offices"
                       :project-name="project.name"
                       :project-city-name="project.city && project.city.name" />

        <ProjectDocs id="docs"
                     :documents="documents" />

        <NewsBlock
            id="news"
            :news-list="newsList"
            :specs="newsSpecs"
            :project-slug="newsProjectSlug"
            @change="filterNews"
        />
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import {breakpointCheck} from '~/assets/js/mixins/breakpointCheck';
    import {convertToObject, scrollTo, convertRemToPixels, clearDoubleSpaces} from '~/assets/js/utils/commonUtils';
    import {plural} from '~/assets/js/utils/textUtils';
    import {serializeValues} from '~/assets/js/utils/filterUtils';
    import {objectToQuery} from '~/assets/js/utils/queryUtils';
    import variables from '~/assets/scss/shared/_variables.scss';

    import FormModal from '~/components/layout/modals/forms/FormModal';

    // Components
    const ProjectHero = () => import('~/components/pages/project/ProjectHero');
    const ProjectMenu = () => import('~/components/pages/project/ProjectMenu');
    const ProjectAbout = () => import('~/components/pages/project/ProjectAbout');
    const PromotionsBlock = () => import('~/components/common/promotions/PromotionsBlock');
    const CareBlock = () => import('~/components/common/care/CareBlock');
    const NewsBlock = () => import('~/components/common/news/NewsBlock');
    const ProjectInfra = () => import('~/components/pages/project/ProjectInfra');
    const ProjectBenefits = () => import('~/components/pages/project/ProjectBenefits');
    const ProjectProgress = () => import('~/components/pages/project/ProjectProgress');
    const ProjectOffice = () => import('~/components/pages/project/ProjectOffice');
    const ProjectLayouts = () => import('~/components/pages/project/layouts/ProjectLayouts');
    const PaymentBlock = () => import('~/components/common/payment/PaymentBlock');
    const FormSubscribe = () => import('~/components/common/forms/FormSubscribe');
    const ProjectMortgage = () => import('~/components/pages/project/ProjectMortgage');
    const ProjectDocs = () => import('~/components/pages/project/ProjectDocs');
    const ProjectGenplan = () => import('~/components/pages/project/ProjectGenplan');
    const ProjectFinishes = () => import('~/components/pages/project/ProjectFinishes');
    const ProjectsAdvantages = () => import('~/components/pages/project/ProjectsAdvantages/index.vue');

    export default {
        name: 'ProjectPage',

        components: {
            ProjectHero,
            ProjectMenu,
            ProjectAbout,
            PromotionsBlock,
            CareBlock,
            NewsBlock,
            ProjectInfra,
            ProjectBenefits,
            ProjectProgress,
            ProjectOffice,
            ProjectLayouts,
            PaymentBlock,
            FormSubscribe,
            ProjectMortgage,
            ProjectDocs,
            ProjectGenplan,
            ProjectFinishes,
            ProjectsAdvantages,
        },

        mixins: [breakpointCheck],

        scrollToTop: true,

        async asyncData({app, params, error}) {
            try {
                const projectSlug = params.projectSlug.split('complex-')[1];

                const [
                    progressList,
                    project,
                    neoBlocks,
                    mortgage,
                    newsList,
                    newsSpecsRes,
                    promoList,
                    documents,
                    offices,
                    projectLayouts,
                    finishes,
                    projectFlatsSpecsRes,
                    projectFlatsFacetsRes,
                    projectAdvantages,
                    projectAdvantagesSpecs,
                ] = await Promise.all([
                    app.$axios.$get(app.$api.progress.list, {params: {project: projectSlug}}),
                    app.$axios.$get(app.$api.projects.slug(projectSlug)),
                    app.$axios.$get(app.$api.neoBlocks),
                    app.$axios.$get(app.$api.projects.mortgage),
                    app.$axios.$get(app.$api.publications.latestProjectNews(projectSlug)),
                    app.$axios.$get(app.$api.publications.specs),
                    app.$axios.$get(app.$api.publications.list, {params: {projects: projectSlug, type: 'promotion'}}),
                    app.$axios.$get(app.$api.documentCategory.list, {params: {project: projectSlug}}),
                    app.$axios.$get(app.$api.offices.list, {params: {projects: projectSlug}}),
                    app.$axios.$get(app.$api.layouts.list, {params: {project: projectSlug}}),
                    app.$axios.$get(app.$api.finishes.list, {params: {projects: projectSlug}}),
                    app.$axios.$get(app.$api.flats.specs, {params: {project: projectSlug}}),
                    app.$axios.$get(app.$api.flats.facets, {params: {project: projectSlug}}),
                    app.$axios.$get(app.$api.projectAdvantages.list),
                    app.$axios.$get(app.$api.projectAdvantages.specs),
                ]);

                if (project?.city?.slug !== params.city) {
                    error({statusCode: 404, message: 'Project not found'});
                }

                const projectFlatsSpecs = Array.isArray(projectFlatsSpecsRes) ? convertToObject(projectFlatsSpecsRes) : projectFlatsSpecsRes;
                const projectFlatsFacets = Array.isArray(projectFlatsFacetsRes?.facets) ? convertToObject(projectFlatsFacetsRes?.facets) : projectFlatsFacetsRes?.facets;
                const newsSpecs = Array.isArray(newsSpecsRes) ? convertToObject(newsSpecsRes) : newsSpecsRes;

                return {
                    projectAdvantagesSpecs: projectAdvantagesSpecs ? projectAdvantagesSpecs : [],
                    projectAdvantages: projectAdvantages ? projectAdvantages : [],
                    projectSlug: projectSlug,
                    neoBlocks: neoBlocks ? neoBlocks : [],
                    project: project || {},
                    mortgage: mortgage || {},
                    progressList: progressList || [],
                    newsList: newsList || [],
                    newsSpecs: newsSpecs || {},
                    promoList: promoList || [],
                    documents: documents || [],
                    offices: offices || [],
                    projectLayouts: projectLayouts?.results?.length ? projectLayouts.results : [],
                    projectLayoutsLength: projectLayouts?.results?.length ? projectLayouts.results.length : null,
                    layoutsCount: projectLayouts?.count ? projectLayouts.count : 0,
                    finishes: finishes || [],
                    paginationUrl: projectLayouts?.next ? projectLayouts?.next : '',
                    projectFlatsSpecs: projectFlatsSpecs || {},
                    projectFlatsFacets: projectFlatsFacets || {},
                };
            } catch (err) {
                console.warn('[Project page/asyncData] request failed: ', err);
            }
        },

        data() {
            return {
                projectAdvantages: [],
                projectAdvantagesSpecs: {},
                projectSlug: '',
                projectMenuHeight: 0,
                neoBlocks: [],
                project: {},
                phases: null,
                buildings: null,
                mortgage: {},
                infras: [],
                infrasCategories: [],
                progressList: [],
                newsList: [],
                newsSpecs: {},
                promoList: [],
                documents: [],
                offices: [],
                projectLayouts: [],
                currentLayouts: {},
                projectLayoutsLength: null,
                layoutsCount: null,
                finishes: [],
                paginationUrl: '',
                projectFlatsSpecs: {},
                projectFlatsFacets: {},
                layoutsPerView: 12,
                isReloading: false,
                isValuesChanged: false,
                isLayoutValuesDefault: false,
                values: {
                    city: 'all',
                    type: '',
                    rooms: [],
                    promo: false,
                    price: [2000000, 15000000],
                    area: [20, 200],
                    completion_year: '',
                },
            };
        },

        async fetch() {
            const genplanPromise = this.project?.has_phase
                ? this.$axios.$get(this.$api.projects.phases(this.projectSlug))
                : this.$axios.$get(this.$api.projects.buildings(this.projectSlug));

            const [
                genplan,
                infras,
                infrasCategories,
            ] = await Promise.all([
                genplanPromise,
                this.$axios.$get(this.$api.infras.list, {params: {project: this.projectSlug}}),
                this.$axios.$get(this.$api.infrasCategories.list, {params: {project: this.projectSlug}}),
            ]);

            this[this.project?.has_phase ? 'phases' : 'buildings'] = genplan;
            this.infras = infras;
            this.infrasCategories = infrasCategories;
        },

        head() {
            if (!this.project?.name) {
                return {};
            }

            const head = {
                title: this.project?.meta_title || `${this.project.name} официальный сайт г. ${this.project?.city?.name || ''}. СК Неометрия`,
            };

            head.meta = [
                {hid: 'msapplication-config', name: 'msapplication-config', content: `/favicons/projects/${this.projectSlug}/browserconfig.xml`},
                {hid: 'msapplication-TileColor', name: 'msapplication-TileColor', content: '#ffffff'},
                {hid: 'theme-color', name: 'theme-color', content: '#ffffff'},
            ];

            if (this.project?.meta_description) {
                head.meta = [
                    ...head.meta,
                    {
                        hid: 'description',
                        name: 'description',
                        content: this.project.meta_description,
                    },
                ];
            }

            head.link = [
                {
                    hid: 'favicon',
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: `/favicons/projects/${this.projectSlug}/favicon.ico`,
                },
                {
                    hid: 'apple-touch-icon',
                    rel: 'apple-touch-icon',
                    sizes: '180x180',
                    href: `/favicons/projects/${this.projectSlug}/apple-touch-icon.png`,
                },
                {
                    hid: 'favicon-32x32',
                    rel: 'icon',
                    type: 'image/png',
                    sizes: '32x32',
                    href: `/favicons/projects/${this.projectSlug}/favicon-32x32.png`,
                },
                {
                    hid: 'favicon-16x16',
                    rel: 'icon',
                    type: 'image/png',
                    sizes: '16x16',
                    href: `/favicons/projects/${this.projectSlug}/favicon-16x16.png`,
                },
                {
                    hid: 'safari-pinned-tab',
                    rel: 'mask-icon',
                    href: `/favicons/projects/${this.projectSlug}/safari-pinned-tab.svg`,
                    color: '#000000',
                },
                {
                    hid: 'site.webmanifest',
                    rel: 'manifest',
                    href: `/favicons/projects/${this.projectSlug}/site.webmanifest`,
                },
            ];

            return head;
        },

        computed: {
            ...mapState({
                lotTypeLabels: 'lot_type_labels'
            }),

            projectsAdvantagesData() {
                const specs = this.projectAdvantagesSpecs.find(el => el.name === 'type');
                const cards = this.projectAdvantages.map(item => {
                    item.tooltip = item.additional_info;
                    return item;
                });
                return {
                    slug: this.projectSlug,
                    cards,
                    specs: specs ? specs.choices : []
                };
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

                if (this.project.tags_list?.length) {
                    const customTags = this.project.tags_list.map(item => ({
                        label: item,
                        color: 'light'
                    }));
                    tags.push(...customTags);
                }

                return tags;
            },

            newsProjectSlug() {
                const newsProjects = this.newsSpecs?.projects?.news_projects;
                if (Array.isArray(newsProjects) && newsProjects.some(project => project?.value === this.projectSlug)) {
                    return this.projectSlug;
                }

                return 'all';
            },

            moreCounter() {
                return this.layoutsCount > this.projectLayoutsLength ? Math.min(this.layoutsCount - this.projectLayoutsLength, this.layoutsPerView) : 0;
            },

            isFullList() {
                return this.layoutsCount === this.projectLayoutsLength;
            },

            formSubscribeSource() {
                return `Страница проекта: ${this.project?.name || ''}: Подпишитесь на рассылку`;
            },

            isHotelProject() {
                return Boolean(this.project?.hotelroom);
            },

            currentLotLabel() {
                return this.lotTypeLabels[this.isHotelProject ? 'hotel' : 'flats'];
            },

            lotPageLink() {
                return {path: `/selection/${this.isHotelProject ? 'hotel' : 'flats'}`, query: {project: this.project?.slug}};
            },

            isShowBlocks() {
                return {
                    genplan: Boolean((this.phases || this.buildings) && !this.isHotelProject),
                    finishes: Boolean(this.finishes?.length),
                    layouts: Boolean((this.layoutsCount || !this.isLayoutValuesDefault) && !this.isHotelProject),
                    promotions: Boolean(this.promoList && this.promoList?.length),
                    advantages: this.project?.has_advantages,
                };
            },
        },

        methods: {
            onOpenForm() {
                const data = {
                    formTitle: `Заказать консультацию. Проект - ${this.project?.name || 'страница проекта'}`,
                    formSource: `Страница ${this.project?.name}: Меню страницы проекта`,
                    formComment: clearDoubleSpaces(`
                        Проект: ${this.project?.name || ''};
                        Город проекта: ${this.project?.city?.name || ''};
                    `),
                };
                this.$modal.open(FormModal, data);
            },

            scrollToBlock(id) {
                let headerHeight = this.$deviceIs.mobile ? variables['header-mobile-h'] : variables['header-h'];

                if (headerHeight.includes('rem')) {
                    headerHeight = convertRemToPixels(parseFloat(headerHeight));
                } else {
                    headerHeight = parseFloat(headerHeight);
                }

                scrollTo(id, headerHeight);
            },

            handleChangeValue(values) {
                this.values = {
                ...this.values,
                ...values,
                };
            },

            async filterNews(project) {
                try {
                    this.newsList = await this.$axios.$get(this.$api.publications.latestProjectNews(project));
                } catch (err) {
                    console.warn('[Project page/News] request failed: ', err);
                }
            },

            async handleChangeLayoutsValues(values, isDefault) {
                try {
                    const layouts = await this.$axios.$get(`${this.$api.layouts.list}?project=${this.projectSlug}`, {
                        params: serializeValues(values),
                        paramsSerializer: params => objectToQuery(params),
                    });

                    this.isValuesChanged = !this.isValuesChanged;
                    this.isLayoutValuesDefault = isDefault;
                    this.projectLayouts = layouts?.results ?? [];
                    this.paginationUrl = layouts?.next ?? '';
                    this.layoutsCount = layouts?.count ?? 0;
                    this.projectLayoutsLength = layouts?.results.length;

                    const projectFlatsFacetsRes = await this.$axios.$get(`${this.$api.flats.facets}?project=${this.projectSlug}`, {
                        params: serializeValues(values),
                        paramsSerializer: params => objectToQuery(params),
                    });
                    this.projectFlatsFacets = Array.isArray(projectFlatsFacetsRes?.facets) ? convertToObject(projectFlatsFacetsRes?.facets) : projectFlatsFacetsRes?.facets;
                } catch (err) {
                    console.warn('projectLayouts, ProjectPage', err);
                }
            },

            async getNextLayouts() {
                if (!this.paginationUrl) {
                    return;
                }

                this.isReloading = true;

                try {
                    this.currentLayouts = await this.$axios.$get(this.paginationUrl);

                    if (Array.isArray(this.currentLayouts?.results)) {
                        this.projectLayouts = [...this.projectLayouts, ...this.currentLayouts.results];
                        this.layoutsCount = this.currentLayouts?.count;
                        this.projectLayoutsLength = this.projectLayouts.length;
                        this.paginationUrl = this.currentLayouts?.next;
                    }
                } catch (e) {
                    console.error(`[getNextLayouts] request failed: ${e}`);
                } finally {
                    this.isReloading = false;
                }
            },

        }
    };
</script>

<style lang="scss" module>
.ProjectPage {
    //
}
</style>
