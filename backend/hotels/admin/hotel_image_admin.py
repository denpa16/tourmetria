from django.contrib import admin
from hotels.models import HotelImage


class HotelImageAdminInline(admin.StackedInline):
    """
    Изображение отеля

    """

    model = HotelImage
    extra = 0
