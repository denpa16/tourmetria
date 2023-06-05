from celery import shared_task
from common.decorators import task_logging
from bg.services import BGClient

from bg.converters import (
    CountryDataConverter,
    CityDataConverter,
    HotelDataConverter,
    AccomodationDataConverter,
)
from bg.loaders import (
    CountryLoader,
    CityLoader,
    HotelLoader,
    AccomodationLoader,
)

from countries.models import Country
from cities.models import City
from hotels.models import Hotel
from accomodations.models import Accomodation


@task_logging
def uploading_data_from_crm() -> str:
    """
    Загрузка данных из CRM
    """

    client = BGClient()

    loaders = [
        CountryLoader(model=Country, converter=CountryDataConverter, client=client),
        CityLoader(model=City, converter=CityDataConverter, client=client),
        HotelLoader(model=Hotel, converter=HotelDataConverter, client=client),
        AccomodationLoader(model=Accomodation, converter=AccomodationDataConverter, client=client),
    ]

    updated = 0
    created = 0
    for loader in loaders:
        loader.run()
        created += loader.count_created_objects
        updated += loader.count_updated_objects

    return f"cr={created}, upd={updated}"


@task_logging
def post_uploading_data_from_crm():
    """
    Запуск задач, зависящих от обновления данных из crm
    Задачи выполняются после интеграции из crm
    """

    tasks = (
        "task_1",
        "task_2",
    )

    for task in tasks:
        task()


@shared_task
@task_logging
def task_integrating_with_crm() -> str:
    """
    Интеграция с crm

    :rtype: str
    :return: Количество созданных и обновленных объектов из CRM
    """

    statistics: str = uploading_data_from_crm()

    # post_uploading_data_from_crm()
    return statistics
