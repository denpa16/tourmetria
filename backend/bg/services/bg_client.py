import datetime
import json
import logging
import time
from typing import Any

import requests
from django.core.cache import cache
from requests import Response
import xmltodict
import json


class BGUrls:
    login = "https://login.bgoperator.ru/auth"
    countries = "http://export.bgoperator.ru/yandex?action=countries"
    cities = "http://export.bgoperator.ru/auto/jsonResorts.json"
    accomodations = "http://export.bgoperator.ru/yandex?action=vr"
    hotels = "http://export.bgoperator.ru/yandex?action=hotels"


class RequestMethods:
    get = "GET"
    post = "POST"


class BGClient:
    """
    Сервис отвечает за общение с API Библио-Глобус

    """

    def __init__(self):
        self.session = requests.Session()
        self.auth()

    def _session(self, url: str, method: str, params: dict, data: dict, headers: dict) -> Response:

        if headers is None:
            headers = {}
        if data is None:
            data = {}
        if params is None:
            params = {}
        if method == "POST":
            response = self.session.post(url=url, params=params, data=data, headers=headers)
        else:
            response = self.session.get(url=url, params=params, data=data, headers=headers)
        return response

    def api_request(
            self,
            url: str,
            method: str,
            params: Any = None,
            data: Any = None,
            headers: Any = None,
    ) -> Any:
        if headers is None:
            headers = {}
        if data is None:
            data = {}
        if params is None:
            params = {}
        response = self._session(
            url,
            method=method,
            params=params,
            data=data,
            headers=headers,
        )
        if response.status_code == 200:
            return response
        else:
            return None

    def auth(self):
        self.session.post(
            url=BGUrls.login, data={"login": "deeptrip", "pwd": "fU3,9448$wDlxgfN#iHwO"}
        )
        self.session.cookies.get_dict()

    def get_countries(self):
        response = self.api_request(
            url=BGUrls.countries,
            method=RequestMethods.get,
        )
        if response is not None:
            return response.json()
        else:
            return []

    def get_cities(self):
        response = self.api_request(
            url=BGUrls.cities,
            method=RequestMethods.get,
        )
        if response is not None:
            return response.json()
        else:
            return []

    def get_hotels(self):
        response = self.api_request(
            url=BGUrls.hotels,
            method=RequestMethods.get,
        )
        if response is not None:
            data_dict = xmltodict.parse(response.content)
            json_data = json.dumps(data_dict)
            formatted_data = json_data.replace("@", '')
            data = json.loads(formatted_data)
            return data
        else:
            return []

    def get_accomodations(self):
        response = self.api_request(
            url=BGUrls.accomodations,
            method=RequestMethods.get,
        )
        if response is not None:
            return response.json()
        else:
            return []
