from django.contrib import admin
from hotels.models import Meal


@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    """
    Питание

    """

    pass
