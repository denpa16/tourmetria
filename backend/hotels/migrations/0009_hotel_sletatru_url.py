# Generated by Django 4.1.9 on 2023-07-11 19:18

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("hotels", "0008_alter_facilitycategory_options_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="hotel",
            name="sletatru_url",
            field=models.URLField(
                blank=True, null=True, verbose_name="Ссылка страницы отеля на сайте Слетать.ру"
            ),
        ),
    ]
