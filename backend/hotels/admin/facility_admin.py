from django.contrib import admin
from hotels.models import Facility, FacilityCategory


@admin.register(FacilityCategory)
class FacilityCategoryAdmin(admin.ModelAdmin):
    """
    Категория удобства

    """

    list_display = ("__str__",)


@admin.register(Facility)
class FacilityAdmin(admin.ModelAdmin):
    """
    Удобство

    """

    list_display = (
        "__str__",
        "category",
    )
