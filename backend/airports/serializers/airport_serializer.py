from rest_framework.serializers import ModelSerializer
from airports.models import Airport


class AirportSerializer(ModelSerializer):
    """
    Сериализатор аэропортов

    """

    class Meta:
        model = Airport
        fields = (
            "id",
        )
