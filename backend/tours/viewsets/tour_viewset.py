from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import GenericViewSet
from django.conf import settings

from sletatru.services import SletatruClient
from tours.utils import get_detail_tour, serialize_detailed_tour, serialize_list_tour


@extend_schema(tags=["Tours"])
class TourViewSet(GenericViewSet):
    """
    Туры

    """

    client = SletatruClient(
        settings.SLETATRU_URL, settings.SLETATRU_LOGIN, settings.SLETATRU_PASSWORD
    )

    def get_queryset(self):
        return None

    def list(self, request, *args, **kwargs):
        params = request.query_params
        tours_data = self.client.get_tours(params)
        data = serialize_list_tour(tours_data)
        return Response(data=data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        params = request.query_params
        tours = self.client.get_tours(params)
        pk = kwargs.get("pk")
        detailed_tour = get_detail_tour(tours, pk)
        data = serialize_detailed_tour(detailed_tour)
        return Response(data=data, status=status.HTTP_200_OK)

    @action(detail=False, methods=("GET",))
    def get_tours_dates(self, request, *args, **kwargs):
        """
        Список доступных дат туров

        """
        params = request.query_params
        tours_dates = self.client.get_tours_dates(params)
        return Response(data=tours_dates, status=status.HTTP_200_OK)
