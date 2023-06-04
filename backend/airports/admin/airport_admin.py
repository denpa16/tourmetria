from django.contrib import admin

from airports.models import (
    Airport,
)


@admin.register(Airport)
class AirportAdmin(admin.ModelAdmin):
    """
    Аэропорт

    """
    pass
