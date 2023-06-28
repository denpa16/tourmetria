from __future__ import absolute_import

import os

from celery import Celery
from celery.schedules import crontab
from django.conf import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

app = Celery(broker=settings.CELERY_BROKER_URL)
app.config_from_object("django.conf:settings")
app.autodiscover_tasks()
app.conf.beat_schedule = {
    # properties
    "task_integrating_with_crm": {
        "task": "bg.tasks.task_integrating_with_crm",
        "schedule": crontab(minute="*/1"),
        "options": {"queue": "bg"},
    },
}

if __name__ == "__main__":
    app.start()
