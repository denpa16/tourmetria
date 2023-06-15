from django.db import models


class HotelCategory(models.Model):
    """
    Отель

    """

    ref_id = models.CharField(
        verbose_name="Внешний ID",
        max_length=255,
        blank=True,
        null=True,
    )
    name = models.CharField(
        verbose_name="Название",
        max_length=255,
        blank=True,
        null=True,
    )
    update_date = models.DateTimeField(verbose_name="Последнее обновление", null=True, blank=True)

    class Meta:
        verbose_name = "Категория отеля"
        verbose_name_plural = "Категории отелей"

    def __str__(self):
        return self.name
