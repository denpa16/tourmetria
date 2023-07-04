from django.contrib import admin

from countries.models import Country


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    """
    Страна

    """

    list_display = (
        "__str__",
        "active",
        "id",
        "has_tickets",
        "hotel_is_not_in_stop",
        "is_visa",
        "is_pro_visa",
        "rank",
        "tickets_included",
        "update_date",
    )
    list_filter = (
        "has_tickets",
        "hotel_is_not_in_stop",
        "is_visa",
        "is_pro_visa",
        "rank",
        "tickets_included",
    )
    search_fields = ("name",)
    list_editable = ("active",)
