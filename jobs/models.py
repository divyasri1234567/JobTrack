from django.contrib.auth.models import User
from django.db import models


class JobApplication(models.Model):

    STATUS_CHOICES = [
        ("APPLIED", "Applied"),
        ("INTERVIEW", "Interview"),
        ("TECHNICAL", "Technical Round"),
        ("HR", "HR Round"),
        ("OFFER", "Offer"),
        ("REJECTED", "Rejected"),
        ("WITHDRAWN", "Withdrawn"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="job_applications")
    company = models.CharField(max_length=200)
    job_title = models.CharField(max_length=200)
    job_url = models.URLField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="APPLIED")
    applied_date = models.DateField()
    salary = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company} - {self.job_title}"