from django.db.models import Count, Q

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.views import APIView

from .helpers import JobApplicationHelper
from .models import JobApplication
from .serializers import (
    RegisterSerializer,
    JobApplicationCreateSerializer,
    JobApplicationSerializer,
    JobApplicationUpdateSerializer,
)


class RegisterViewSet(ViewSet):
    permission_classes = [AllowAny]

    @action(
        detail=False,
        methods=["post"],
        url_path="register",
    )
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "message": "User registered successfully",
            },
            status=status.HTTP_201_CREATED,
        )


class JobApplicationViewSet(ModelViewSet):
    http_method_names = ["put", "post", "get", "delete"]
    permission_classes = [IsAuthenticated]
    serializer_class = JobApplicationSerializer
    queryset = JobApplication.objects.all()

    def get_serializer_class(self):
        if self.action == "create":
            return JobApplicationCreateSerializer

        if self.action == "update":
            return JobApplicationUpdateSerializer

        return JobApplicationSerializer

    def get_queryset(self):
        return JobApplicationHelper.get_applications(self.request)

    def list(self, request, *args, **kwargs):
        applications = self.get_queryset()

        page = self.paginate_queryset(applications)

        if page is not None:
            serializer = self.get_serializer(page, many=True)

            return Response(
                {
                    "response": {
                        "data": serializer.data,
                        "count": self.paginator.page.paginator.count,
                        "next": self.paginator.get_next_link(),
                        "previous": self.paginator.get_previous_link(),
                    },
                    "message": "get all Job Applications successfully",
                },
                status=status.HTTP_200_OK,
            )

        serializer = self.get_serializer(applications, many=True)

        return Response(
            {
                "response": {
                    "data": serializer.data,
                    "count": applications.count(),
                    "next": None,
                    "previous": None,
                },
                "message": "get all Job Applications successfully",
            },
            status=status.HTTP_200_OK,
        )

    def retrieve(self, request, pk=None):
        application = JobApplicationHelper.get_application(
            request,
            pk,
        )

        if not application:
            return Response(
                {
                    "response": {},
                    "message": "Job Application not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(application)

        return Response(
            {
                "response": serializer.data,
                "message": "get Job Application detail successfully",
            },
            status=status.HTTP_200_OK,
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        application = serializer.save(user=request.user)

        return Response(
            {
                "response": JobApplicationSerializer(application).data,
                "message": "Job Application added successfully",
            },
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, pk=None, *args, **kwargs):
        application = JobApplicationHelper.get_application(
            request,
            pk,
        )

        if not application:
            return Response(
                {
                    "response": {},
                    "message": "Job Application not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(
            application,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)
        application = serializer.save()

        return Response(
            {
                "response": JobApplicationSerializer(application).data,
                "message": "Job Application updated successfully",
            },
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, pk=None):
        application = JobApplicationHelper.get_application(
            request,
            pk,
        )

        if not application:
            return Response(
                {
                    "response": {},
                    "message": "Job Application not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        application.delete()

        return Response(
            {
                "response": {
                    "id": pk,
                },
                "message": "Job Application deleted successfully",
            },
            status=status.HTTP_200_OK,
        )


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        applications = JobApplication.objects.filter(
            user=request.user
        )

        statistics = applications.aggregate(
            total=Count("id"),
            interviews=Count(
                "id",
                filter=Q(status="INTERVIEW"),
            ),
            offers=Count(
                "id",
                filter=Q(status="OFFER"),
            ),
            rejected=Count(
                "id",
                filter=Q(status="REJECTED"),
            ),
            applied=Count(
                "id",
                filter=Q(status="APPLIED"),
            ),
            technical=Count(
                "id",
                filter=Q(status="TECHNICAL"),
            ),
            hr=Count(
                "id",
                filter=Q(status="HR"),
            ),
        )

        return Response(
            {
                "response": {
                    "total": statistics["total"],
                    "interviews": statistics["interviews"],
                    "offers": statistics["offers"],
                    "rejected": statistics["rejected"],
                    "pipeline": {
                        "APPLIED": statistics["applied"],
                        "INTERVIEW": statistics["interviews"],
                        "TECHNICAL": statistics["technical"],
                        "HR": statistics["hr"],
                        "OFFER": statistics["offers"],
                        "REJECTED": statistics["rejected"],
                    },
                },
                "message": "Dashboard data retrieved successfully",
            },
            status=status.HTTP_200_OK,
        )