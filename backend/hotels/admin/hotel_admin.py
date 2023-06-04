from django.contrib import admin

from hotels.models import Hotel


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    """
    Отели

    """
    list_display = (
        "__str__",
        "city",
        "country",
        "stars",
        "update_date",
    )
