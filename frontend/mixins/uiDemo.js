export const uiDemo = {
    methods: {
        onChangeOptions(options) {
            if (!this.compData) {
                return;
            }

            const optionKey = Object.keys(options)[0];
            const found = this.options.find(i => i.title === optionKey);

            // For range
            if (optionKey === 'values') {
                options = Object.entries(options)
                    .map(([name, obj]) => ({ name, ...obj }))[0];
                delete options.name;
            }

            // reset значений
            if (found?.reset) {
                if (Array.isArray(found.reset)) {
                    found.reset.forEach(i => {
                        this.compData[i] = ['value', 'valueMin', 'valueMax'].includes(i) ? '' : false;
                    });
                } else {
                    this.compData[found.reset] = ['value', 'valueMin', 'valueMax'].includes(this.compData[found.reset])? '' : false;
                }
            }

            this.compData = {
                ...this.compData,
                ...options,
            };
        },

        onChangeUtils(options) {
            if (!this.utilsData) {
                return;
            }

            const optionKey = Object.keys(options)[0];
            const found = this.utilsOptions.find(i => i.title === optionKey);

            // For range
            if (optionKey === 'values') {
                options = Object.entries(options)
                    .map(([name, obj]) => ({ name, ...obj }))[0];
                delete options.name;
            }

            // reset значений
            if (found?.reset) {
                if (Array.isArray(found.reset)) {
                    found.reset.forEach(i => {
                        this.utilsData[i] = ['value', 'valueMin', 'valueMax'].includes(i) ? '' : false;
                    });
                } else {
                    this.utilsData[found.reset] = ['value', 'valueMin', 'valueMax'].includes(this.utilsData[found.reset])? '' : false;
                }
            }

            this.utilsData = {
                ...this.utilsData,
                ...options,
            };
        },
    },
};
