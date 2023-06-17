from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import GenericViewSet

from django.conf import settings
from sletatru.services import SletatruClient

from tours.serializers import TourListSerializer


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
        tours = self.client.get_tours(params)
        serializer = TourListSerializer(data=tours, many=True)
        serializer.is_valid()
        data = serializer.data
        return Response(data=data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        retrieve_data = "Tour Detail"
        return Response(data=retrieve_data, status=status.HTTP_200_OK)
