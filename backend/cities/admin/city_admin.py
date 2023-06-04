from django.contrib import admin

from cities.models import (
    City,
)


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    """
    Город

    """

    list_display = (
        "__str__",
        "country",
    )
