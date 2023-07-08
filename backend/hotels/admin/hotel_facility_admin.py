from django.contrib import admin
from hotels.models import HotelFacility


class HotelFacilityAdminInline(admin.StackedInline):
    """
    Удобство в отеле

    """

    model = HotelFacility
    extra = 0


@admin.register(HotelFacility)
class HotelFacilityAdmin(admin.ModelAdmin):
    """
    Удобство в отеле

    """

    list_display = ("__str__",)
