from django.contrib import admin
from hotels.models import HotelRestType


@admin.register(HotelRestType)
class HotelRestTypeAdmin(admin.ModelAdmin):
    """
    Тип отдыха в отеле

    """

    list_display = ("__str__",)
