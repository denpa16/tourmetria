from django.db import models


class City(models.Model):
    """
    Город

    """

    country = models.ForeignKey(
        "countries.Country", verbose_name="Страна", on_delete=models.CASCADE
    )
    ref_id = models.CharField(
        verbose_name="Внешний ID",
        max_length=255,
        blank=True,
        null=True,
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
    update_date = models.DateTimeField(verbose_name="Последнее обновление", null=True, blank=True)

    class Meta:
        verbose_name = ("Город",)
        verbose_name_plural = "Города"

    def __str__(self):
        return self.title_ru
