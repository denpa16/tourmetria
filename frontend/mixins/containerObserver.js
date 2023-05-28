export const containerObserver = {
    data() {
        return {
            observer: null,
            containers: [],
        };
    },

    beforeDestroy() {
        if (this.observer && this.container) {
            this.destroyObserve();
        }
    },

    methods: {
        startObserve(containers) {
            if (!containers) {
                return;
            }

            this.containers = containers;

            const devOptions = {
                threshold: .9,
            };

            const baseOptions = {
                threshold: .3,
            };

            this.observer = new IntersectionObserver(this.onVisibleChange, this.$config.UI_DEMO === true ? baseOptions : devOptions);

            this.containers.forEach(i => {
                this.observer.observe(i);
            });
        },

        destroyObserve() {
            this.containers.forEach(i => {
                this.observer.unobserve(i);
            });
        },

        onVisibleChange(entries) {
            entries.forEach(({ target, isIntersecting }) => {
                if (!isIntersecting) {
                    return;
                }

                this.handleBlockIsVisible(target);
            });
        },
    },
};
