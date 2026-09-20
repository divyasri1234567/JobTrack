from django.urls import include, path

from rest_framework.routers import SimpleRouter

from .viewsets import (
    DashboardView,
    JobApplicationViewSet,
    RegisterViewSet,
)


router = SimpleRouter()

router.register(
    r"applications",
    JobApplicationViewSet,
    basename="applications",
)

router.register(
    r"auth",
    RegisterViewSet,
    basename="auth",
)


urlpatterns = [
    path(
        "",
        include(router.urls),
    ),
    path(
        "dashboard/",
        DashboardView.as_view(),
        name="dashboard",
    ),
]