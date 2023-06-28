# Generated by Django 4.1.9 on 2023-06-17 16:45

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("hotels", "0002_hotelimage"),
    ]

    operations = [
        migrations.CreateModel(
            name="Meal",
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
                        blank=True, max_length=255, null=True, verbose_name="Внешний ID"
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        blank=True, max_length=255, null=True, verbose_name="Название"
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
                "verbose_name": "Питание",
                "verbose_name_plural": "Питание",
            },
        ),
    ]
