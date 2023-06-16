from common.paginations import BaseLimitOffsetPagination


class HotelLimitOffsetPagination(BaseLimitOffsetPagination):
    """
    Пагинация для отелей

    """

    default_limit = 20
