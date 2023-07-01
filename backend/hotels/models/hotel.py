from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from ckeditor.fields import RichTextField


class Hotel(models.Model):
    """
    Отель

    """

    active = models.BooleanField(
        verbose_name="Активный",
        default=False,
    )
    resort = models.ForeignKey(
        "countries.Resort",
        verbose_name="Курорт",
        on_delete=models.CASCADE,
    )
    category = models.ForeignKey(
        "hotels.HotelCategory",
        verbose_name="Категория отеля",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    ref_id = models.CharField(
        verbose_name="Внешний ID",
        max_length=255,
        blank=True,
        null=True,
    )
    name = models.CharField(
        verbose_name="Название",
        max_length=255,
        blank=True,
        null=True,
    )
    slug = models.SlugField(
        verbose_name="Слаг",
        max_length=255,
        blank=True,
        null=True,
    )
    beach_line = models.PositiveIntegerField(
        verbose_name="Номер пляжной линии",
        blank=True,
        null=True,
    )
    is_in_bonus_program = models.BooleanField(
        verbose_name="Бонусная программа Слетать.ру",
        default=False,
        help_text="Если отель предлагает турагентам бонусы за туристов, "
        "то ставится галочка; в противном случае – нет",
    )
    original_name = models.CharField(
        verbose_name="Название отеля на латинице",
        max_length=255,
        blank=True,
        null=True,
    )
    popularity_level = models.PositiveIntegerField(
        verbose_name="Уровень популярности отеля",
        blank=True,
        null=True,
        help_text="Определяется на основе количества поисков в отель. 0 - Low, 1 - Normal, 2 - High",
    )
    photos_count = models.PositiveIntegerField(
        verbose_name="Общее количество фотографий отеля", blank=True, null=True
    )
    search_count = models.PositiveIntegerField(
        verbose_name="Количество поисков по отелю за период (1 месяц)", blank=True, null=True
    )
    rate = models.FloatField(verbose_name="Ранг отеля", blank=True, null=True)
    latitude = models.FloatField(
        verbose_name="Широта на карте",
        null=True,
        blank=True,
    )
    longitude = models.FloatField(
        verbose_name="Долгота на карте",
        null=True,
        blank=True,
    )
    distance_to_airport = models.FloatField(
        verbose_name="Расстояние до аэропорта",
        null=True,
        blank=True,
    )
    phone = PhoneNumberField(verbose_name="Телефон", blank=True, null=True)
    email = models.EmailField(verbose_name="Email", blank=True, null=True)
    room_count = models.PositiveIntegerField(
        verbose_name="Количество номеров", blank=True, null=True
    )
    description = RichTextField(
        verbose_name="Описание",
        blank=True,
        null=True,
    )
    update_date = models.DateTimeField(verbose_name="Последнее обновление", null=True, blank=True)

    class Meta:
        verbose_name = "Отель"
        verbose_name_plural = "Отели"

    def __str__(self):
        return self.name
