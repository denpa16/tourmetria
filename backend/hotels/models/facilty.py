from django.db import models
from django.core.validators import FileExtensionValidator
from colorful.fields import RGBColorField


class FacilityCategory(models.Model):
    """
    Категория удобства

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
    icon = models.FileField(
        verbose_name="Иконка",
        upload_to="i/ic/i",
        validators=[FileExtensionValidator(["svg"])],
        null=True,
        blank=True,
    )
    icon_content = models.TextField(verbose_name="Контент иконки", null=True, blank=True)
    color = RGBColorField(verbose_name="Цвет иконки", max_length=8, default="#007BA7")

    class Meta:
        verbose_name = "Категория удобства"
        verbose_name_plural = "Категории удобств"

    def __str__(self):
        return f"{self.name}"


class Facility(models.Model):
    """
    Удобство

    """

    category = models.ForeignKey(
        "hotels.FacilityCategory",
        verbose_name="Категория",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
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
    icon = models.FileField(
        verbose_name="Иконка",
        upload_to="i/ic/i",
        validators=[FileExtensionValidator(["svg"])],
        null=True,
        blank=True,
    )
    icon_content = models.TextField(verbose_name="Контент иконки", null=True, blank=True)
    color = RGBColorField(verbose_name="Цвет иконки", max_length=8, default="#007BA7")

    class Meta:
        verbose_name = "Удобство"
        verbose_name_plural = "Удобства"

    def __str__(self):
        return f"{self.name}"
