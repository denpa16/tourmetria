import Swiper, {Navigation, Pagination, Thumbs, Mousewheel, Autoplay, Grid, Controller, FreeMode, EffectCreative, EffectFade, Lazy, Parallax, Zoom} from 'swiper';
import 'swiper/swiper-bundle.css';

export default (ctx, inject) => {
    Swiper.use([Navigation, Pagination, Thumbs, Mousewheel, Autoplay, Grid, Controller, FreeMode, EffectCreative, EffectFade, Lazy, Parallax, Zoom]);

    inject('Swiper', Swiper);
};
