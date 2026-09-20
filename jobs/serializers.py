from django.contrib.auth.models import User
from rest_framework import serializers

from .models import JobApplication


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )


class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = [
            "id",
            "company",
            "job_title",
            "job_url",
            "location",
            "status",
            "applied_date",
            "salary",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class JobApplicationCreateSerializer(JobApplicationSerializer):
    pass


class JobApplicationUpdateSerializer(JobApplicationSerializer):
    pass