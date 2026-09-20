from django.urls import include, path
from rest_framework.routers import SimpleRouter

from .viewsets import DashboardView, JobApplicationViewSet


router = SimpleRouter()

router.register(
    r"applications",
    JobApplicationViewSet,
    basename="applications",
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