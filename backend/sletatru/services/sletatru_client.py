from typing import Any

import requests
from requests import Response
import logging

logger = logging.getLogger(__name__)


class SletatruPaths:
    countries = "GetCountries"
    cities = "GetCities"


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
        logger.info(f"sletatru_cities: country {country_ref_id}")
        data = self.api_request(
            path=SletatruPaths.cities,
            method=RequestMethods.get,
            params={"countryId": country_ref_id},
        )
        if data is not None:
            return data["GetCitiesResult"]["Data"]
        else:
            return []
