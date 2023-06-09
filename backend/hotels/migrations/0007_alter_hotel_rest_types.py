# Generated by Django 4.1.9 on 2023-07-01 22:49

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("hotels", "0006_facility_facilitycategory_hotelresttype_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="hotel",
            name="rest_types",
            field=models.ManyToManyField(
                to="hotels.hotelresttype", verbose_name="Тип отдыха в отеле"
            ),
        ),
    ]
