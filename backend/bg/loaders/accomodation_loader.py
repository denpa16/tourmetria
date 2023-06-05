from bg.loaders import BaseLoader
from accomodations.models import Accomodation


class AccomodationLoader(BaseLoader):
    """
    Загрузчик вариантов размещения
    """

    def load_data_from_crm(self):
        accomodations_to_update = {}
        accomodations_to_create = []
        accomodation_ref_ids = set(Accomodation.objects.values_list("ref_id", flat=True))
        accomodations_data: dict = self.client.get_accomodations()
        if len(accomodations_data) != 0:
            for city_data in accomodations_data:
                ref_id = str(city_data["id"])
                if ref_id in accomodation_ref_ids:
                    accomodations_to_update[ref_id] = self.converter(city_data, action="update")
                else:
                    converter_data = self.converter(city_data)
                    accomodations_to_create.append(Accomodation(**converter_data))

        self.bulk_create(accomodations_to_create)
        self.bulk_update(accomodations_to_update)
