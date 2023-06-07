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


class HotelImage(models.Model):
    """
    Изображение отеля

    """
    hotel = models.ForeignKey("hotels.Hotel", verbose_name="Изображение отеля", on_delete=models.CASCADE)
    image = models.ImageField(
        verbose_name="Изображение",
    )

    class Meta:
        verbose_name = "Изображение отеля"
        verbose_name_plural = "Изображения отеля"

    def __str__(self):
        return f"#{self.id} Изобаржение отеля"
