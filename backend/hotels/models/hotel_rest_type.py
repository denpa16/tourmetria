from django.db import models


class HotelRestType(models.Model):
    """
    Тип отдыха в отеле

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
    slug = models.SlugField(
        verbose_name="Слаг",
        max_length=255,
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = "Тип отдыха в отеле"
        verbose_name_plural = "Типы отдыха в отелях"

    def __str__(self):
        return f"{self.name}"
