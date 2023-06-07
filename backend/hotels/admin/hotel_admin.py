from django.contrib import admin

from hotels.models import Hotel, HotelImage


class HotelImageInline(admin.StackedInline):
    """
    Изобаржения отеля
    
    """
    model = HotelImage
    extra = 0


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    """
    Отели

    """
    list_display = (
        "__str__",
        "city",
        "country",
        "stars",
        "update_date",
    )

    inlines = (
        HotelImageInline,
    )
