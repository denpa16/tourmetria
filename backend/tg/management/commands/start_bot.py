from django.core.management.base import BaseCommand

from tg.services import start_bot


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        start_bot()
