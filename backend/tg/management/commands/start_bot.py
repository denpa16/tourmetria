from django.core.management.base import BaseCommand
from django.conf import settings
from tg.services import start_bot


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        if settings.TG_BOT_START is True:
            start_bot()
