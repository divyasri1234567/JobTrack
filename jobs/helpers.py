from django.db.models import Q

from .models import JobApplication


class JobApplicationHelper:

    @staticmethod
    def get_applications(request):
        applications = JobApplication.objects.filter(user=request.user)

        search = request.query_params.get("search")
        status_filter = request.query_params.get("status")
        location = request.query_params.get("location")

        if search:
            applications = applications.filter(
                Q(company__icontains=search)
                | Q(job_title__icontains=search)
            )

        if status_filter:
            applications = applications.filter(status=status_filter)

        if location:
            applications = applications.filter(location__icontains=location)

        return applications.order_by("-applied_date")

    @staticmethod
    def get_application(request, application_id):
        return JobApplication.objects.filter(
            id=application_id,
            user=request.user,
        ).first()