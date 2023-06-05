from django.utils import timezone
from bg.converters import BaseConverter


class AccomodationDataConverter(BaseConverter):
    """
    Конвертер данных для создания страны
    """

    UPDATE_FIELDS = (
        "name",
        "name_full",
        "AD_number",
        "CHD_number",
        "infnum",
        "update_date",
    )

    def cleanup_create_data(self):
        """
        Очистка данных для создания объекта
        """

        ref_id = self.data["id"]
        name = self.data["name"]
        name_full = self.data["full_name"]
        name_site = self.data["site_name"]
        AD_number = self.data["AD_number"]
        CHD_number = self.data["CHD_number"]
        infnum = self.data["infnum"]

        clean_data = {
            "ref_id": ref_id,
            "name": name,
            "name_full": name_full,
            "name_site": name_site,
            "AD_number": AD_number,
            "CHD_number": CHD_number,
            "infnum": infnum,
            "update_date": timezone.now(),
        }

        return clean_data

    def cleanup_update_data(self):
        """
        Очистка данных для обновления объекта
        """

        name = self.data["name"]
        name_full = self.data["name_full"]
        name_site = self.data["site_name"]
        AD_number = self.data["AD_number"]
        CHD_number = self.data["CHD_number"]
        infnum = self.data["infnum"]

        clean_data = {
            "name": name,
            "name_full": name_full,
            "name_site": name_site,
            "AD_number": AD_number,
            "CHD_number": CHD_number,
            "infnum": infnum,
            "update_date": timezone.now(),
        }

        return clean_data
