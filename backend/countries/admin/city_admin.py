from django.contrib import admin

from countries.models import City


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    """
    Город

    """

    pass
