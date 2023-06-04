from django.db import models


class Airport(models.Model):
    """
    Аэропорт

    """

    city = models.ForeignKey(
        "cities.City",
        verbose_name="Город",
        on_delete=models.CASCADE,
    )
    title_ru = models.CharField(
        verbose_name="Название на русском языке",
        max_length=255,
        blank=True,
        null=True,
        unique=True,
    )
    title_en = models.CharField(
        verbose_name="Название на английском языке",
        max_length=255,
        blank=True,
        null=True,
        unique=True,
    )
    code = models.CharField(
        verbose_name="Код",
        max_length=255,
    )
    update_date = models.DateTimeField(verbose_name="Последнее обновление", null=True, blank=True)

    class Meta:
        verbose_name = "Аэропорт"
        verbose_name_plural = "Аэропорты"

    def __str__(self):
        return self.title_en
