from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.response import Response

from rest_framework.viewsets import ReadOnlyModelViewSet

from airports.models import Airport
from airports.serializers import AirportSerializer

from bg.services import BGClient


@extend_schema(tags=["Airports"])
class AirportViewSet(ReadOnlyModelViewSet):
    """
    Аэропорты

    """

    queryset = Airport.objects.all()
    serializer_class = AirportSerializer

    @action(detail=False, methods=("GET",))
    def bg_countries(self, request, *args, **kwargs):
        """
        БГ страны

        """
        bg_client = BGClient()
        countries = bg_client.get_countries()
        return Response(countries)

    @action(detail=False, methods=("GET",))
    def bg_cities(self, request, *args, **kwargs):
        """
        БГ города

        """
        bg_client = BGClient()
        cities = bg_client.get_cities()
        return Response(cities)

    @action(detail=False, methods=("GET",))
    def bg_accomodations(self, request, *args, **kwargs):
        """
        БГ варинты размещения

        """
        bg_client = BGClient()
        accomodations = bg_client.get_accomodations()
        return Response(accomodations)
