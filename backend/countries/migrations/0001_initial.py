# Generated by Django 4.1.7 on 2023-06-04 16:23

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Country",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                (
                    "ref_id",
                    models.CharField(
                        blank=True,
                        max_length=255,
                        null=True,
                        unique=True,
                        verbose_name="Внешний ID",
                    ),
                ),
                (
                    "title_ru",
                    models.CharField(
                        blank=True,
                        max_length=255,
                        null=True,
                        verbose_name="Название на русском языке",
                    ),
                ),
                (
                    "title_en",
                    models.CharField(
                        blank=True,
                        max_length=255,
                        null=True,
                        verbose_name="Название на английском языке",
                    ),
                ),
                (
                    "code",
                    models.CharField(
                        blank=True, max_length=255, null=True, verbose_name="Код страны"
                    ),
                ),
                (
                    "alpha",
                    models.CharField(
                        blank=True,
                        max_length=255,
                        null=True,
                        verbose_name="Трехбуквенный код страны",
                    ),
                ),
                (
                    "has_tours",
                    models.BooleanField(default=True, verbose_name="В данную страну есть туры"),
                ),
                (
                    "currency",
                    models.CharField(
                        blank=True,
                        choices=[("EUR", "Евро"), ("USD", "Доллар"), ("RUR", "Рубль")],
                        max_length=32,
                        null=True,
                        verbose_name="Валюта страны на сайте Библио-Глобус",
                    ),
                ),
                (
                    "update_date",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="Последнее обновление"
                    ),
                ),
            ],
            options={
                "verbose_name": "Страна",
                "verbose_name_plural": "Страны",
            },
        ),
    ]
