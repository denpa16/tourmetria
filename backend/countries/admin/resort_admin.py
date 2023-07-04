from django.contrib import admin

from countries.models import Resort


@admin.register(Resort)
class ResortAdmin(admin.ModelAdmin):
    """
    Курорт

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
    list_editable = ("active",)

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related(
                "country",
            )
        )
