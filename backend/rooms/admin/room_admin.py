from django.contrib import admin
from rooms.models import RoomImage, Room


class RoomImageAdminInline(admin.StackedInline):
    """
    Изображение номера

    """

    model = RoomImage
    extra = 0


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    """
    Номер

    """

    inlines = (RoomImageAdminInline,)
