from rest_framework.serializers import (
    ModelSerializer,
    CharField,
    SerializerMethodField,
)
from countries.models import DepartCity


class DepartCitySerializer(ModelSerializer):
    """
    Городов вылета

    """

    class Meta:
        model = DepartCity
        fields = (
            "id",
            "name",
            "ref_id",
        )
