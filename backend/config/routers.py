from rest_framework.routers import DefaultRouter

from countries.viewsets import DepartCityViewSet
from users.viewsets import EmailOTPTokenViewSet, OTPTokenViewSet, UserViewSet

router = DefaultRouter()

# users
router.register(r"users", UserViewSet, "users")

# countries
router.register("depart-cities", DepartCityViewSet, "depart-cities")
