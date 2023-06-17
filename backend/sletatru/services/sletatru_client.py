from typing import Any

import requests
from requests import Response
import logging

logger = logging.getLogger(__name__)


class SletatruPaths:
    countries = "GetCountries"
    resorts = "GetCities"
    depart_cities = "GetDepartCities"
    hotels = "GetHotels"
    hotels_categories = "GetHotelStars"
    tours = "GetTours"


class RequestMethods:
    get = "GET"
    post = "POST"


class SletatruClient:
    """
    Сервис отвечает за общение с API Sletatru

    """

    def __init__(self, url, login, password):
        self.base_url = url
        self.login = login
        self.password = password
        self.requests = requests

    def _request(self, url: str, method: str, params: dict, data: dict, headers: dict) -> Response:
        if headers is None:
            headers = {}
        if data is None:
            data = {}
        if params is None:
            params = {}
        response = self.requests.request(method, url, params=params, data=data, headers=headers)
        return response

    def api_request(
        self,
        path: str,
        method: str,
        params: Any = None,
        data: Any = None,
        headers: Any = None,
    ) -> dict[str, Any] | None:
        if headers is None:
            headers = {}
        if data is None:
            data = {}
        if params is None:
            params = {}
        url = self.get_url(path)
        response = self._request(
            url,
            method=method,
            params=params,
            data=data,
            headers=headers,
        )
        if response.status_code == 200:
            return response.json()
        else:
            return None

    def get_url(self, path):
        return "{}/{}".format(self.base_url, path)

    def get_countries(self):
        logger.info("sletatru_countries")
        data = self.api_request(path=SletatruPaths.countries, method=RequestMethods.get)
        if data is not None:
            return data["GetCountriesResult"]["Data"]
        else:
            return []

    def get_country_resorts(self, country_ref_id):
        logger.info(f"sletatru_resorts: country {country_ref_id}")
        data = self.api_request(
            path=SletatruPaths.resorts,
            method=RequestMethods.get,
            params={"countryId": country_ref_id},
        )
        if data is not None:
            return data["GetCitiesResult"]["Data"]
        else:
            return []

    def get_country_depart_cities(self):
        logger.info(f"sletatru_depart_cities")
        data = self.api_request(
            path=SletatruPaths.depart_cities,
            method=RequestMethods.get,
        )
        if data is not None:
            return data["GetDepartCitiesResult"]["Data"]
        else:
            return []

    def get_hotels_categories(self, country_ref_id):
        logger.info(f"sletatru_hotels_categories")
        data = self.api_request(
            path=SletatruPaths.hotels_categories,
            method=RequestMethods.get,
            params={"countryId": country_ref_id},
        )
        if data is not None:
            return data["GetHotelStarsResult"]["Data"]
        else:
            return []

    def get_resort_hotels(self, resort_ref_id):
        logger.info(f"sletatru_hotels")
        data = self.api_request(
            path=SletatruPaths.hotels,
            method=RequestMethods.get,
            params={"towns": resort_ref_id},
        )
        if data is not None:
            return data["GetHotelsResult"]["Data"]
        else:
            return []

    def get_tours(self, params):
        logger.info("sletatru_tours")
        path = SletatruPaths.tours
        query_params = "&".join([f"{key}={value}" for key, value in params.items()])
        url = self.get_url(path)
        headers = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/51.0.2704.106 Safari/537.36 OPR/38.0.2220.41",
            "Content-Type": "application/json",
            "Referer": url + query_params,
        }
        data = self.api_request(
            path=SletatruPaths.tours, method=RequestMethods.get, params=params, headers=headers
        )
        if data is not None:
            try:
                return data["GetToursResult"]["Data"]["aaData"]
            except Exception:
                return []
        else:
            return []
