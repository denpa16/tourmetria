from django.core.management.base import BaseCommand
import logging

from sletatru.tasks import daily_uploading_data_from_crm

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    """
    Загрузка данных из Слетать.ру

    """

    def handle(self, *args, **kwargs):
        daily_uploading_data_from_crm.delay()
