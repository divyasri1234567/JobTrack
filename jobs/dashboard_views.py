from django.db import models
from django.db.models import Count

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import JobApplication


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        applications = JobApplication.objects.filter(
            user=request.user
        )

        stats = applications.aggregate(
            total=Count("id"),
            applied=Count(
                "id",
                filter=models.Q(status="APPLIED"),
            ),
            interview=Count(
                "id",
                filter=models.Q(status="INTERVIEW"),
            ),
            technical=Count(
                "id",
                filter=models.Q(status="TECHNICAL"),
            ),
            hr=Count(
                "id",
                filter=models.Q(status="HR"),
            ),
            offer=Count(
                "id",
                filter=models.Q(status="OFFER"),
            ),
            rejected=Count(
                "id",
                filter=models.Q(status="REJECTED"),
            ),
            withdrawn=Count(
                "id",
                filter=models.Q(status="WITHDRAWN"),
            ),
        )

        return Response(stats)