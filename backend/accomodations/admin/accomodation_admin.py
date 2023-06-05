from django.contrib import admin

from accomodations.models import (
    Accomodation,
)


@admin.register(Accomodation)
class AccomodationAdmin(admin.ModelAdmin):
    """
    Вариант размещения

    """

    pass
