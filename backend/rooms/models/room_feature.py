from django.db import models


class RoomFeatureCategory(models.Model):
    """
    Категория преимущества номера

    """

    name = models.CharField(verbose_name="Название", max_length=255)

    class Meta:
        verbose_name = "Категория преимущества номера"
        verbose_name_plural = "Категории преимуществ номер"

    def __str__(self):
        return f"{self.name}"


class RoomFeature(models.Model):
    """
    Преимущества номера

    """

    category = models.ForeignKey(
        "rooms.RoomFeatureCategory",
        verbose_name="Категория",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    name = models.CharField(verbose_name="Название", max_length=255)

    class Meta:
        verbose_name = "Преимущество номера"
        verbose_name_plural = "Преимущества номеров"

    def __str__(self):
        return f"{self.name}"
