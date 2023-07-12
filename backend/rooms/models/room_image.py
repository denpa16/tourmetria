from django.db import models


class RoomImage(models.Model):
    """
    Изображние номера отеля

    """
    room = models.ForeignKey(
        "rooms.Room",
        verbose_name="Номер",
        on_delete=models.CASCADE
    )
    url = models.TextField(
        verbose_name="Ссылка"
    )

    class Meta:
        verbose_name = "Изображение номера"
        verbose_name_plural = "Изображения номеров"

    def __str__(self):
        return f"{self.id}# Изображение номера"
