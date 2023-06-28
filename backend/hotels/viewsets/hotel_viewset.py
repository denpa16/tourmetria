from drf_spectacular.utils import extend_schema
from rest_framework.viewsets import ReadOnlyModelViewSet
from common.viewset_mixins import SpecsFacetsMixin
from hotels.filters import HotelFilter
from hotels.models import Hotel
from hotels.serializers import HotelListSerializer
from hotels.paginations import HotelLimitOffsetPagination


@extend_schema(tags=["Hotel"])
class HotelViewSet(SpecsFacetsMixin, ReadOnlyModelViewSet):
    """
    Отели

    """

    lookup_field = "ref_id"
    lookup_url_kwargs = "ref_id"

    serializer_class = HotelListSerializer
    filterset_class = HotelFilter
    pagination_class = HotelLimitOffsetPagination

    def get_queryset(self):
        queryset = Hotel.objects.order_by("-rate", "-popularity_level").prefetch_related(
            "category",
            "resort",
            "resort__country",
        )
        if self.action == self.list.__name__:
            queryset = Hotel.objects.order_by("-rate", "-popularity_level").prefetch_related(
                "category",
                "resort",
                "resort__country",
            )
        elif self.action == self.retrieve.__name__:
            queryset = Hotel.objects.order_by("-rate", "-popularity_level").prefetch_related(
                "category",
                "resort",
                "resort__country",
            )
        return queryset

    def get_serializer_class(self):
        serializer = HotelListSerializer
        if self.action == self.list.__name__:
            serializer = HotelListSerializer
        elif self.action == self.retrieve.__name__:
            serializer = HotelListSerializer
        return serializer
