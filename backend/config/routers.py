from rest_framework.routers import DefaultRouter

from users.viewsets import EmailOTPTokenViewSet, OTPTokenViewSet, UserViewSet
from airports.viewsets import AirportViewSet

router = DefaultRouter()

# users
router.register(r"users", UserViewSet, "users")

# airports
router.register(r"airports", AirportViewSet, "airports")
