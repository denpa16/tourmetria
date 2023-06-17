from rest_framework.serializers import (
    ModelSerializer,
    CharField,
    SerializerMethodField,
)
from countries.models import Resort


class ResortSerializer(ModelSerializer):
    """
    Курорт

    """

    class Meta:
        model = Resort
        fields = (
            "id",
            "name",
            "ref_id",
        )
