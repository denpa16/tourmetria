from django.contrib import admin
from hotels.models import Hotel


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    """
    Отель

    """

    list_display = (
        "__str__",
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

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related(
                "resort",
                "category",
            )
        )
