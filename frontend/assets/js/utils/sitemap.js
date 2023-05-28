import axios from 'axios';

export default async function getAppRoutes() {
    try {
        let baseUrl = '';
        if (process.env.PROXY_URL) {
            baseUrl = process.env.PROXY_URL;
        } else if (process.env.SERVER_API_URL) {
            baseUrl = process.env.SERVER_API_URL;
        } else {
            baseUrl = 'http://backend:8000';
        }

        const object = await axios.get(`${baseUrl}/api/sitemap`)
            .then(res => res.data);

        if (!object) {
            return;
        }
        const projects = object.projects;
        const news = object.news;
        const promotions = object.promotions;
        const flats = object.flats;

        const routes = [];
        routes.push({
            url: '/',
            priority: 1,
        });

        if (projects?.length) {
            projects.forEach(item => {
                routes.push(`/${item[0]}/complex-${item[1]}/`);
            });
        }

        if (news?.length) {
            news.forEach(id => {
                routes.push(`/blog/news/${id}`);
            });
        }

        if (promotions?.length) {
            promotions.forEach(id => {
                routes.push(`/blog/promotions/${id}`);
            });
        }

        if (flats?.length) {
            flats.forEach(id => {
                routes.push(`/selection/flats/${id}`);
            });
        }

        return routes;
    } catch (e) {
        console.error(`[getAppRoutes]: ${e}`);
    }

    return [];
}
