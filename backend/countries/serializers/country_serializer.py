from rest_framework.serializers import (
    ModelSerializer,
    CharField,
    SerializerMethodField,
)
from countries.models import Country


class CountrySerializer(ModelSerializer):
    """
    Страны

    """

    class Meta:
        model = Country
        fields = (
            "id",
            "name",
            "ref_id",
        )
