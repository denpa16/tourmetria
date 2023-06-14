from slugify import slugify

from django.utils import timezone
from sletatru.converters import BaseConverter


class CountryDataConverter(BaseConverter):
    """
    Конвертер данных для создания страны
    """

    UPDATE_FIELDS = (
        "alias",
        "flags",
        "has_tickets",
        "hotel_is_not_in_stop",
        "is_pro_visa",
        "is_visa",
        "original_name",
        "rank",
        "tickets_included",
        "update_date",
    )

    def cleanup_create_data(self):
        """
        Очистка данных для создания объекта
        """

        ref_id = self.data["Id"]
        name = self.data["Name"]
        slug = slugify(name)
        alias = self.data["Alias"]
        flags = self.data["Flags"]
        has_tickets = self.data["HasTickets"]
        hotel_is_not_in_stop = self.data["HotelIsNotInStop"]
        is_pro_visa = self.data["IsProVisa"]
        is_visa = self.data["IsVisa"]
        original_name = self.data["OriginalName"]
        rank = self.data["Rank"]
        tickets_included = self.data["TicketsIncluded"]

        clean_data = {
            "ref_id": ref_id,
            "name": name,
            "slug": slug,
            "alias": alias,
            "flags": flags,
            "has_tickets": has_tickets,
            "hotel_is_not_in_stop": hotel_is_not_in_stop,
            "is_pro_visa": is_pro_visa,
            "is_visa": is_visa,
            "original_name": original_name,
            "rank": rank,
            "tickets_included": tickets_included,
            "update_date": timezone.now(),
        }
        return clean_data

    def cleanup_update_data(self):
        """
        Очистка данных для обновления объекта
        """

        name = self.data["Name"]
        slug = slugify(name)
        alias = self.data["Alias"]
        flags = self.data["Flags"]
        has_tickets = self.data["HasTickets"]
        hotel_is_not_in_stop = self.data["HotelIsNotInStop"]
        is_pro_visa = self.data["IsProVisa"]
        is_visa = self.data["IsVisa"]
        original_name = self.data["OriginalName"]
        rank = self.data["Rank"]
        tickets_included = self.data["TicketsIncluded"]

        clean_data = {
            "name": name,
            "slug": slug,
            "alias": alias,
            "flags": flags,
            "has_tickets": has_tickets,
            "hotel_is_not_in_stop": hotel_is_not_in_stop,
            "is_pro_visa": is_pro_visa,
            "is_visa": is_visa,
            "original_name": original_name,
            "rank": rank,
            "tickets_included": tickets_included,
            "update_date": timezone.now(),
        }
        return clean_data
