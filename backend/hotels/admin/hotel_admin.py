from django.contrib import admin

from hotels.models import Hotel


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    """
    Отели

    """

    pass
