from celery import shared_task
from common.decorators import task_logging
from sletatru.services import SletatruClient
from django.conf import settings


from sletatru.converters import (
    HotelDataConverter,
    HotelDetailDataConverter,
)
from sletatru.loaders import (
    HotelDetailLoader,
    HotelRelatedDataLoader,
)

from hotels.models import HotelCategory, Hotel


@shared_task
@task_logging
def load_related_data_from_sletatru_task():
    """
    Загрузка связанных атрибутов отелей

    """

    SLETATRU_URL = settings.SLETATRU_URL
    SLETATRU_LOGIN = settings.SLETATRU_LOGIN
    SLETATRU_PASSWORD = settings.SLETATRU_PASSWORD

    client = SletatruClient(SLETATRU_URL, SLETATRU_LOGIN, SLETATRU_PASSWORD)

    loaders = [
        HotelDetailLoader(model=Hotel, converter=HotelDetailDataConverter, client=client),
        HotelRelatedDataLoader(model=Hotel, converter=None, client=client),
    ]

    for loader in loaders:
        loader.run()
