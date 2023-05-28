import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default (ctx, inject) => {
    inject('videojs', videojs);
};
