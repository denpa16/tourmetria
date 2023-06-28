from rest_framework.serializers import (
    ModelSerializer,
    CharField,
    SerializerMethodField,
    IntegerField,
)
from hotels.models import Meal


class MealListSerializer(ModelSerializer):
    """
    Сериализатор списка питания

    """

    class Meta:
        model = Meal
        fields = (
            "ref_id",
            "name",
        )
