from celery import shared_task
from common.decorators import task_logging
from sletatru.services import SletatruClient
from django.conf import settings

from sletatru.converters import (
    CountryDataConverter,
    CityDataConverter,
)
from sletatru.loaders import (
    CountryLoader,
    CityLoader,
)

from countries.models import Country, City


@shared_task
@task_logging
def daily_uploading_data_from_crm() -> str:
    """
    Загрузка данных из CRM
    """

    SLETATRU_URL = settings.SLETATRU_URL
    SLETATRU_LOGIN = settings.SLETATRU_LOGIN
    SLETATRU_PASSWORD = settings.SLETATRU_PASSWORD

    client = SletatruClient(SLETATRU_URL, SLETATRU_LOGIN, SLETATRU_PASSWORD)

    loaders = [
        CountryLoader(model=Country, converter=CountryDataConverter, client=client),
        CityLoader(model=City, converter=CityDataConverter, client=client),
    ]

    updated = 0
    created = 0
    for loader in loaders:
        loader.run()
        created += loader.count_created_objects
        updated += loader.count_updated_objects

    return f"cr={created}, upd={updated}"