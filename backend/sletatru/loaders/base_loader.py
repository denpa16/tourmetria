import abc
import logging
from abc import abstractmethod

from django.db.models import Model

from sletatru.converters import BaseConverter
from sletatru.services import SletatruClient


class BaseLoader(abc.ABC):
    """
    Основной класс загрузчика данных
    """

    def __init__(self, model: Model, converter: BaseConverter, client: SletatruClient):
        if not issubclass(model, Model):
            raise TypeError(f"{model} must be an instance django.db.models.Model")

        self.model = model
        self.model_name = self.model.__name__
        self.converter = converter
        self._client = client
        self._count_created_objects = 0
        self._count_updated_objects = 0

    @abstractmethod
    def load_data_from_crm(self):
        """
        Загрузка данных из crm
        """

    def bulk_create(self, instances: list[Model]):
        """
        Сохранение данных
        """

        if instances:
            objs = self.model.objects.bulk_create(instances)
            self.count_created_objects = len(objs)

    def bulk_update(self, instances_data: dict[str, dict]):
        """
        Обновление данных
        """

        if not isinstance(instances_data, dict):
            raise TypeError("instances_data must be a dictionary")

        if instances_data:
            update_instances = self.model.objects.filter(ref_id__in=instances_data)
            for instance in update_instances:
                for field_name, field_value in instances_data[instance.ref_id].items():
                    setattr(instance, field_name, field_value)

            self.model.objects.bulk_update(update_instances, fields=self.converter.UPDATE_FIELDS)

            self.count_updated_objects = len(instances_data)

    def run(self):
        """
        Запуск обновления данных
        """

        self.load_data_from_crm()
        self.logger_statistics()

    @property
    def client(self) -> SletatruClient:
        return self._client

    def logger_statistics(self):
        """
        Логирование статистики обновления
        """

        logging.info(
            f"[{self.model_name}]: "
            f"created={self.count_created_objects}, "
            f"updated={self.count_updated_objects}"
        )

    @property
    def count_created_objects(self) -> int:
        """
        Количество созданных объектов
        """

        return self._count_created_objects

    @property
    def count_updated_objects(self) -> int:
        """
        Количество обновленных объектов
        """

        return self._count_updated_objects

    @count_created_objects.setter
    def count_created_objects(self, value: int):
        self._count_created_objects += int(value)

    @count_updated_objects.setter
    def count_updated_objects(self, value: int):
        self._count_updated_objects += int(value)
