from django.contrib import admin

from countries.models import DepartCity


@admin.register(DepartCity)
class DepartCityAdmin(admin.ModelAdmin):
    """
    Город вылета

    """

    list_display = (
        "__str__",
        "id",
        "country",
        "is_popular",
        "update_date",
    )
    list_filter = (
        "country",
        "is_popular",
    )
    search_fields = (
        "name",
        "country__name",
    )

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related(
                "country",
            )
        )
