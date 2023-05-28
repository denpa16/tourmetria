export const cleanValues = values => {
    const valueIsNotEmpty = val => Array.isArray(val) ? Boolean(val.length) : Boolean(val);
    return Object.keys(values).reduce((acc, key) => ({
        ...acc,
        ...valueIsNotEmpty(values[key]) ? {[key]: values[key]} : {},
    }), {});
};

export const serializeValues = values => Object.keys(values)
    .reduce((acc, key) => {
        if (values[key]) {
            if (Array.isArray(values[key]) && values[key].length) {
                return {
                    ...acc,
                    [key]: values[key].join(','),
                };
            }
            return {
                ...acc,
                [key]: values[key],
            };
        }

        return acc;
    }, {});
