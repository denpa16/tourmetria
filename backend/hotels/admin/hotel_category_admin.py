from django.contrib import admin
from hotels.models import HotelCategory


@admin.register(HotelCategory)
class HotelCategoryAdmin(admin.ModelAdmin):
    """
    Категория отеля

    """

    pass
