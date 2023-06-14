from django.db import models


class Country(models.Model):
    """
    Страна

    """

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
    alias = models.CharField(
        verbose_name="Текстовый код",
        max_length=255,
        blank=True,
        null=True,
    )
    flags = models.PositiveIntegerField(
        verbose_name="Указатель группы, в которую входит страна",
        blank=True,
        null=True,
        help_text="Экзотическая страна, подходит для отдыха на море, является страной шенгенского соглашения",
    )
    has_tickets = models.BooleanField(
        verbose_name="Наличие билетов",
        default=False,
    )
    hotel_is_not_in_stop = models.BooleanField(
        verbose_name="Наличие мест в отеле",
        default=False,
    )
    is_pro_visa = models.BooleanField(
        verbose_name="Требуется ли в страну про-виза",
        default=False,
    )
    is_visa = models.BooleanField(
        verbose_name="Требуется ли в страну виза",
        default=False,
    )
    original_name = models.CharField(
        verbose_name="Название страны на латинице",
        max_length=255,
        blank=True,
        null=True,
    )
    rank = models.PositiveIntegerField(
        verbose_name="Ранг страны", blank=True, null=True, help_text="0 - самый высокий"
    )
    tickets_included = models.BooleanField(
        verbose_name="Объём турпакета",
        default=False,
        help_text="Если перелёт включён в стоимость тура, параметр принимает значение “True”; в противном случае — “False”",
    )
    update_date = models.DateTimeField(verbose_name="Последнее обновление", null=True, blank=True)

    class Meta:
        verbose_name = "Страна"
        verbose_name_plural = "Страны"

    def __str__(self):
        return self.name
