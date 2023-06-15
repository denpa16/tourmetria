from django.contrib import admin

from countries.models import DepartCity


@admin.register(DepartCity)
class DepartCityAdmin(admin.ModelAdmin):
    """
    Город вылета

    """

    pass
