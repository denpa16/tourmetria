from drf_spectacular.utils import extend_schema
from rest_framework.viewsets import ReadOnlyModelViewSet
from common.viewset_mixins import SpecsFacetsMixin
from countries.filters import ResortFilter
from countries.models import Resort
from countries.serializers import ResortSerializer


@extend_schema(tags=["Resort"])
class ResortViewSet(SpecsFacetsMixin, ReadOnlyModelViewSet):
    """
    Курорт

    """

    lookup_field = "ref_id"
    lookup_url_kwargs = "ref_id"

    queryset = Resort.objects.all()
    serializer_class = ResortSerializer
    filterset_class = ResortFilter
