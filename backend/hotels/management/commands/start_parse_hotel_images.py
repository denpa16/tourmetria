from django.core.management.base import BaseCommand
from hotels.tasks import parse_images


class Command(BaseCommand):
    """
    Парсинг изображений отелей с сайте БГ

    """

    def handle(self, *args, **kwargs):
        parse_images.delay()
