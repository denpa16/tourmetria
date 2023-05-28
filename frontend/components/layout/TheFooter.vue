<template>
    <footer :class="$style.TheFooter">
        <div :class="$style.wrap"
             class="container">
            <FooterCallBtnPanel :class="$style.btnPanel"
                                :messengers="messengers" />
            <FooterForm />
            <FooterMenu
                :class="$style.menu"
                :flats-list="flatsList"
                :purchase-ways-list="purchaseWaysList"
                :company-list="companyList"
                :projects-list="projectListTemp"
                :properties-list="propertiesList"
                :news-list="newsList"
                :about-list="aboutList"
                :footer-text="footerText"
                :socials="socials"
            />
            <FooterBottom :socials="socials"
                          :privacy-link="privacyLink" />
        </div>
    </footer>
</template>

<script>
    import FooterCallBtnPanel from '~/components/layout/footer/FooterCallBtnPanel';
    import FooterForm from '~/components/layout/footer/FooterForm';
    import FooterMenu from '~/components/layout/footer/FooterMenu';
    import FooterBottom from '~/components/layout/footer/FooterBottom';
    import {mapGetters} from 'vuex';

    export default {
        components: {
            FooterCallBtnPanel,
            FooterForm,
            FooterMenu,
            FooterBottom,
        },

        data() {
            return {
                flatsList: [
                    {name: 'Студии', to: '/selection/flats?rooms=0', href: '', target: ''},
                    {name: '1-комнатные', to: '/selection/flats?rooms=1', href: '', target: ''},
                    {name: '2-комнатные', to: '/selection/flats?rooms=2', href: '', target: ''},
                    {name: '3-комнатные', to: '/selection/flats?rooms=3', href: '', target: ''},
                ],

                purchaseWaysList: [
                    {name: 'Ипотека', to: '', href: '/how-buy/mortgage', target: '_blank'},
                    {name: 'Рассрочка', to: '', href: '/how-buy/installment', target: '_blank'},
                    {name: 'Материнский капитал', to: '', href: '/how-buy/capital', target: '_blank'},
                    {name: 'Военная ипотека', to: '', href: '/how-buy/military', target: '_blank'},
                    {name: '100% оплата', to: '', href: '/how-buy/full', target: '_blank'},
                ],

                companyList: [
                    {name: 'Видео', to: '', href: '/about/videos', target: '_blank'},
                    {name: 'Инвесторам', to: '', href: '/about/investors', target: '_blank'},
                    {name: 'Карьера', to: '', href: '/about/career', target: '_blank'},
                ],

                propertiesList: [
                    {name: 'Коммерческая недвижимость', to: '/selection/commercial'},
                    {name: 'Гостиничные номера', to: '/selection/hotel'},
                    {name: 'Машино-места', to: '/selection/parking'},
                    {name: 'Кладовые', to: '/selection/storage'},
                ],

                newsList: [
                    {name: 'Акции', to: '/blog/promotions', href: '', target: ''},
                    {name: 'Новости', to: '/blog/news', href: '', target: ''},
                ],

                aboutList: [
                    {name: 'Контакты', to: '', href: '/about/contacts', target: '_blank'},
                ],

                footerText: 'Любая информация, представленная на данном сайте, носит исключительно информационный характер, не является  офертой, ' +
                    'определяемой положениями ст.437 ГК РФ.'
            };
        },

        computed: {
            ...mapGetters({
                messengers: 'getMessengers',
                socials: 'getSocialLinks',
                privacyLink: 'getPrivacyLink',
                projectsList: 'projects/getProjectsList',
            }),

            projectListTemp() {
                return this.projectsList.map(item => item);
            },
        }
    };
</script>

<style lang="scss" module>
    .TheFooter {
        padding-top: 3.2rem;
        background-color: $base-50;

        @include respond-to(xs) {
            padding-top: 2.4rem;
        }
    }

    .wrap {
        width: 100%;
    }

    .btnPanel {
        margin-bottom: 1.6rem;
    }

    .menu {
        margin: 1.6rem 0 4rem;

        @include respond-to(sm) {
            margin: 1.6rem 0 3.2rem;
        }
    }
</style>
