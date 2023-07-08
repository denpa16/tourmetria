from django.db import models


class HotelFacility(models.Model):
    """
    Удобство в отеле

    """

    hotel = models.ForeignKey(
        "hotels.Hotel",
        verbose_name="Отель",
        on_delete=models.CASCADE,
    )
    facility = models.ForeignKey(
        "hotels.Facility",
        verbose_name="Удобство",
        on_delete=models.CASCADE,
    )
    short_description = models.CharField(
        verbose_name="Примечание",
        blank=True,
        null=True,
        max_length=255,
    )

    class Meta:
        verbose_name = "Удобство в отеле"
        verbose_name_plural = "Удобства в отелях"

    def __str__(self):
        return f"{self.id}# Удобство в отеле"
