export const setReachGoal = (type = 'send_form') => {
    if (type && window.ym) {
        window.ym(34618210, 'reachGoal', type);
    }
};
