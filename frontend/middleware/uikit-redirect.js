export default function({ route, redirect, store }) {
    const isTestStage = store.getters['domain/getIsTestStage'];

    const demoPages = ['examples', 'components', 'release'];
    const isDemoPage = demoPages.includes(route.path.split('/')[1]);

    if (!isTestStage && isDemoPage) {
        redirect('/');
    }
}
