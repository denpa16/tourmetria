from django.db import models


class Hotel(models.Model):
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
    country = models.ForeignKey(
        "countries.Country", verbose_name="Страна", on_delete=models.CASCADE
    )
    city = models.ForeignKey("cities.City", verbose_name="Город", on_delete=models.CASCADE)
    stars = models.PositiveIntegerField(
        verbose_name="Количество звёзд",
        blank=True,
        null=True,
    )
    update_date = models.DateTimeField(verbose_name="Последнее обновление", null=True, blank=True)

    class Meta:
        verbose_name = "Отель"
        verbose_name_plural = "Отели"

    def __str__(self):
        return self.name
