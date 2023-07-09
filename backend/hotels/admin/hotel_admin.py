from django.contrib import admin
from hotels.models import Hotel

from .hotel_image_admin import HotelImageAdminInline
from .hotel_facility_admin import HotelFacilityAdminInline

from hotels.tasks import load_related_data_from_sletatru_task


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    """
    Отель

    """

    list_display = (
        "__str__",
        "active",
        "id",
        "resort",
        "category",
        "popularity_level",
        "rate",
        "beach_line",
        "update_date",
    )
    list_filter = (
        "category",
        "resort",
    )
    search_fields = (
        "name",
        "resort__name",
    )
    filter_horizontal = ("rest_types",)
    list_editable = ("active",)

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .order_by("-active")
            .select_related(
                "resort",
                "category",
            )
        )

    inlines = (
        HotelFacilityAdminInline,
        HotelImageAdminInline,
    )

    actions = [
        "load_related_data_from_sletatru",
    ]

    def load_related_data_from_sletatru(self, request, queryset):
        """
        Загрузка связанных атрибутов отелей

        """

        load_related_data_from_sletatru_task.delay()

    load_related_data_from_sletatru.short_description = (
        "Загрузка связанных атрибутов отелей из Слетать.ру"
    )
