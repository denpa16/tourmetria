import { getFileExtension } from '@/assets/js/utils/file-utils';

/** Более подробная информация в https://www.notion.so/idaproject/ImgProxy-479cdbe58ed04af4800a95a90b10cfd0 */

function imageProxy(ctx) {
    function _getQualityProperties(options) {
        return `/q:${options.q || 80}`;
    }

    function _getResizeProperties(options) {
        const pixelRatio = process.client ? Math.floor(window.devicePixelRatio) : 1;

        return `/rs:${options.fit ? 'fit' : 'fill'}:${options.w * pixelRatio || 0}:${options.h * pixelRatio || 0}`;
    }

    function _getGravityProperties(options) {
        return `/g:${options.g || 'ce'}`;
    }

    function _getBlurProperties(options) {
        return `/bl:${options.bl || 0}`;
    }

    function _getBackgroundProperties(options) {
        return options.bg ? `/bg:${options.bg}` : '';
    }

    function _getImageExtension(path, options) {
        const ex = !options.ex ?
            getFileExtension(path)
            : options.ex;

        return `@${ex}`;
    }

    function _generateImageProxyPath(path, options = {}) {
        const proxyStatic = true;
        const storeDomain = ctx.store.state?.domain?.domainUrl ? `https://${ctx.store.state.domain.domainUrl}` : null;
        let proxyUrl = ctx.$config.IMGPROXY_SITE_HOST;
        let isStatic = false;

        if (!path) {
            console.warn('ImageProxy:gen: There\'s no path');
            return '';
        }

        if (!proxyUrl) {
            return path;
        }

        if (!proxyUrl.startsWith('https://')) {
            proxyUrl = `https://${proxyUrl}`;
        }

        if (storeDomain && proxyStatic && path.startsWith('/images')) {
            isStatic = true;
        } else if (path.startsWith('/images')) {
            return path;
        }

        if (path[0] !== '/') {
            path = `/${path}`;
        }

        const [q, rs, bg, gr, bl, ex] = [
            _getQualityProperties(options),
            _getResizeProperties(options),
            _getBackgroundProperties(options),
            _getGravityProperties(options),
            _getBlurProperties(options),
            _getImageExtension(path, options),
        ];

        if (isStatic) {
            return `${proxyUrl}/insecure${q}${rs}${bg}${gr}${bl}/c:0/plain/${storeDomain}${path}${ex}`;
        } else {
            return `${proxyUrl}/insecure${q}${rs}${bg}${gr}${bl}/c:0/plain${path}${ex}`;
        }
    }

    return {
        gen: (path, options = {}) => _generateImageProxyPath(path, options),
    };
}

export default (ctx, inject) => {
    inject('image', imageProxy(ctx));
};
