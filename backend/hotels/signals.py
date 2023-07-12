from django.dispatch import receiver
from django.db.models import signals

from hotels.models import Hotel


@receiver(signal=signals.pre_save, sender=Hotel)
def get_hotel_rooms(instance: Hotel, **kwargs):
    """
    Получение номеров отеля

    """
    pass
