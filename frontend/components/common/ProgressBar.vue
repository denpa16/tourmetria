<template>
    <div
        :style="[{width: `${progress}%`}]"
        :class="$style.ProgressBar"
    >
    </div>
</template>

<script>
import { throttle } from '~/assets/js/utils/common-utils';

export default {
    name: 'ProgressBar',

    data() {
        return {
            progress: 0,
            throttleResize: null,
        };
    },

    mounted() {
        this.$nextTick(() => {
            this.handleProgressPos();
            this.throttleResize = throttle(this.handleProgressPos, 200);
            window.addEventListener('scroll', this.throttleResize);
        });
    },

    beforeDestroy() {
        if (this.throttleResize) {
            this.throttleResize = null;
            this.progress = 0;
        }

        window.removeEventListener('scroll', this.throttleResize);
    },

    methods: {
        handleProgressPos() {
            const app = document.documentElement;
            const height = app.scrollHeight - app.clientHeight;
            const width = window.pageYOffset / height * 100;
            this.progress = Math.ceil(width);
        },
    },
};
</script>

<style lang="scss" module>
    $progress-color: $violet;

    .ProgressBar {
        bottom: 0;
        left: 0;
        display: block;
        width: 0;
        height: .2rem;
        background: $progress-color;
        transition: width .3s linear;
    }
</style>
