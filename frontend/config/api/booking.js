const booking = {
    booking: {
        list: '/api/booking/',
        id: id => `/api/booking/${id}/`,
        order: '/api/booking/register_order/',
        orderStatus: '/api/booking/get_order_status/',
        config: '/api/booking/config/'
    }
};

export default booking;
