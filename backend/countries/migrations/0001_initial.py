# Generated by Django 4.1.9 on 2023-06-14 19:58

from django.db import migrations, models
import django.db.models.deletion


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
                    "slug",
                    models.SlugField(blank=True, max_length=255, null=True, verbose_name="Слаг"),
                ),
                (
                    "alias",
                    models.CharField(
                        blank=True, max_length=255, null=True, verbose_name="Текстовый код"
                    ),
                ),
                (
                    "flags",
                    models.PositiveIntegerField(
                        blank=True,
                        help_text="Экзотическая страна, подходит для отдыха на море, является страной шенгенского соглашения",
                        null=True,
                        verbose_name="Указатель группы, в которую входит страна",
                    ),
                ),
                ("has_tickets", models.BooleanField(default=False, verbose_name="Наличие билетов")),
                (
                    "hotel_is_not_in_stop",
                    models.BooleanField(default=False, verbose_name="Наличие мест в отеле"),
                ),
                (
                    "is_pro_visa",
                    models.BooleanField(
                        default=False, verbose_name="Требуется ли в страну про-виза"
                    ),
                ),
                (
                    "is_visa",
                    models.BooleanField(default=False, verbose_name="Требуется ли в страну виза"),
                ),
                (
                    "original_name",
                    models.CharField(
                        blank=True,
                        max_length=255,
                        null=True,
                        verbose_name="Название страны на латинице",
                    ),
                ),
                (
                    "rank",
                    models.PositiveIntegerField(
                        blank=True,
                        help_text="0 - самый высокий",
                        null=True,
                        verbose_name="Ранг страны",
                    ),
                ),
                (
                    "tickets_included",
                    models.BooleanField(
                        default=False,
                        help_text="Если перелёт включён в стоимость тура, параметр принимает значение “True”; в противном случае — “False”",
                        verbose_name="Объём турпакета",
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
        migrations.CreateModel(
            name="City",
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
                    "slug",
                    models.SlugField(blank=True, max_length=255, null=True, verbose_name="Слаг"),
                ),
                (
                    "description_url",
                    models.TextField(
                        blank=True, null=True, verbose_name="Ссылка на описание города"
                    ),
                ),
                (
                    "is_popular",
                    models.BooleanField(
                        default=False,
                        help_text="Если курорт был признан популярным на основе статистики поисковых запросов, сделанных на сайте sletat.ru и сайтах партнёров, поле принимает значение “True”; в противном случае — “False”",
                        verbose_name="Популярность города",
                    ),
                ),
                (
                    "original_name",
                    models.CharField(
                        blank=True,
                        max_length=255,
                        null=True,
                        verbose_name="Название города на латинице",
                    ),
                ),
                (
                    "update_date",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="Последнее обновление"
                    ),
                ),
                (
                    "country",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="countries.country",
                        verbose_name="Страна",
                    ),
                ),
            ],
            options={
                "verbose_name": "Город",
                "verbose_name_plural": "Города",
            },
        ),
    ]