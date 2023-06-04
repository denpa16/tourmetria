from django.core.management.base import BaseCommand

from bg.tasks import task_integrating_with_crm


class Command(BaseCommand):
    """
    Старт загрузки данных из Библио-Глобус

    """

    def handle(self, *args, **kwargs):
        task_integrating_with_crm.delay()
