from django.contrib import admin

from countries.models import DepartCity


@admin.register(DepartCity)
class DepartCityAdmin(admin.ModelAdmin):
    """
    Город вылета

    """

    list_display = (
        "__str__",
        "active",
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
    list_editable = ("active",)

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .order_by("-active")
            .select_related(
                "country",
            )
        )
