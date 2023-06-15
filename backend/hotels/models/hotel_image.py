from django.db import models


class HotelImage(models.Model):
    """
    Изображение отеля
    """

    hotel = models.ForeignKey(
        "hotels.Hotel",
        verbose_name="Отель",
        on_delete=models.CASCADE
    )
    image = models.ImageField(
        verbose_name="Изображение"
    )

    class Meta:
        verbose_name = "Изображение отеля"
        verbose_name_plural = "Изображения отелей"
