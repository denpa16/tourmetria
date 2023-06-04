from django.db import models


class Accomodation(models.Model):
    """
    Варианты размещения

    """
    ref_id = models.CharField(
        verbose_name="Внешний ID",
        max_length=255,
        blank=True,
        null=True,
        unique=True,
    )
    name = models.CharField(
        verbose_name="Название",
        max_length=255,
        blank=True,
        null=True,
        unique=True,
    )
    name_full = models.CharField(
        verbose_name="Расшифровка названия",
        max_length=255,
        blank=True,
        null=True,
        unique=True,
    )
    AD_number = models.PositiveIntegerField(
        verbose_name="Количество взрослых",
        blank=True,
        null=True,
        default=0,
    )
    CHD_number = models.PositiveIntegerField(
        verbose_name="Количество детей",
        blank=True,
        null=True,
        default=0,
    )
    infnum = models.PositiveIntegerField(
        verbose_name="Количество младенцев",
        blank=True,
        null=True,
        default=0,
    )
    update_date = models.DateTimeField(verbose_name="Последнее обновление", null=True, blank=True)

    class Meta:
        verbose_name = "Вариант размещения"
        verbose_name_plural = "Варианты размещения"

    def __str__(self):
        return self.name
