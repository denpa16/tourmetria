from django.contrib import admin

from countries.models import Resort


@admin.register(Resort)
class ResortAdmin(admin.ModelAdmin):
    """
    Курорт

    """

    pass
