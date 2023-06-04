from django.db import models

from countries.constants import Currency


class Country(models.Model):
    """
    Страна

    """

    ref_id = models.CharField(
        verbose_name="Внешний ID",
        max_length=255,
        blank=True,
        null=True,
        unique=True,
    )
    title_ru = models.CharField(
        verbose_name="Название на русском языке",
        max_length=255,
        blank=True,
        null=True,
    )
    title_en = models.CharField(
        verbose_name="Название на английском языке",
        max_length=255,
        blank=True,
        null=True,
    )
    code = models.CharField(
        verbose_name="Код страны",
        max_length=255,
        blank=True,
        null=True,
    )
    alpha = models.CharField(
        verbose_name="Трехбуквенный код страны",
        max_length=255,
        blank=True,
        null=True,
    )
    has_tours = models.BooleanField(
        verbose_name="В данную страну есть туры",
        default=True,
    )
    currency = models.CharField(
        verbose_name="Валюта страны на сайте Библио-Глобус",
        max_length=32,
        choices=Currency.choices,
        blank=True,
        null=True,
    )
    update_date = models.DateTimeField(verbose_name="Последнее обновление", null=True, blank=True)

    class Meta:
        verbose_name = "Страна"
        verbose_name_plural = "Страны"

    def __str__(self):
        return self.title_ru
