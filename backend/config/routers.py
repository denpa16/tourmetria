from rest_framework.routers import DefaultRouter

from countries.viewsets import DepartCityViewSet, CountryViewSet, ResortViewSet
from hotels.viewsets import HotelViewSet, MealViewSet
from tours.viewsets import TourViewSet
from users.viewsets import EmailOTPTokenViewSet, OTPTokenViewSet, UserViewSet

router = DefaultRouter()

# users
router.register(r"users", UserViewSet, "users")

# countries
router.register("depart-cities", DepartCityViewSet, "depart-cities")
router.register("countries", CountryViewSet, "countries")
router.register("resorts", ResortViewSet, "resorts")

# hotels
router.register("hotels", HotelViewSet, "hotels")
router.register("meals", MealViewSet, "meals")

# tours
router.register("tours", TourViewSet, "tours")
