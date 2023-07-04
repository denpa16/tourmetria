from django.contrib import admin
from hotels.models import Hotel

from .hotel_image_admin import HotelImageAdminInline


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
            .select_related(
                "resort",
                "category",
            )
        )

    inlines = (HotelImageAdminInline,)
