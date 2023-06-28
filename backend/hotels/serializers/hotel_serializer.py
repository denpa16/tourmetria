from rest_framework.serializers import (
    ModelSerializer,
    CharField,
    SerializerMethodField,
    IntegerField,
)
from hotels.models import Hotel


class HotelListSerializer(ModelSerializer):
    """
    Сериализатор списка отелей

    """

    category_id = IntegerField(source="category.id", default=None)
    category_name = CharField(source="category.name", default="")
    resort_name = CharField(source="resort.name", default="")
    resort_slug = CharField(source="resort.slug", default="")
    country_name = CharField(source="resort.country.name", default="")
    country_slug = CharField(source="resort.country.slug", default="")

    class Meta:
        model = Hotel
        fields = (
            "id",
            "ref_id",
            "name",
            "slug",
            "beach_line",
            "rate",
            "popularity_level",
            "photos_count",
            "category_id",
            "category_name",
            "resort_name",
            "resort_slug",
            "country_name",
            "country_slug",
        )
