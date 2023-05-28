export const breakpointCheck = {
    data() {
        return {
            windowWidth: 0,
        };
    },

    computed: {
        breakpoint() {
            switch (true) {
            case this.windowWidth < 768:
                return 'xs';
            case this.windowWidth < 1280:
                return 'sm';
            case this.windowWidth < 1440:
                return 'md';
            case this.windowWidth < 1920:
                return 'lg';
            default:
                return 'xl';
            }
        }
    },

    mounted() {
        this.windowWidth = window.innerWidth;
        window.addEventListener('resize', () => {
            this.windowWidth = window.innerWidth;
        });
    },

    beforeDestroy() {
        window.removeEventListener('resize', () => {
            this.windowWidth = window.innerWidth;
        });
    },
};
