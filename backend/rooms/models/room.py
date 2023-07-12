from django.db import models


class Room(models.Model):
    """
    Номер отеля

    """
    hotel = models.ForeignKey(
        "hotels.Hotel",
        verbose_name="Отель",
        on_delete=models.CASCADE
    )
    name = models.CharField(
        verbose_name="Название",
        max_length=255,
        blank=True,
        null=True
    )
    capacity = models.PositiveIntegerField(
        verbose_name="Вместимость",
        blank=True,
        null=True
    )
    description = models.TextField(
        verbose_name="Описание",
        blank=True,
        null=True
    )
    features = models.ManyToManyField(
        "rooms.RoomFeature",
        verbose_name="Преимущества номера"
    )

    class Meta:
        verbose_name = "Номер"
        verbose_name_plural = "Номера"

    def __str__(self):
        return f"{self.id}# Номер"
