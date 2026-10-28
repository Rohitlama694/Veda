from django.conf import settings
from django.db import models
from apps.projects.models import Task

class SubmissionAttempt(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        CORRECTIONS_REQUESTED = "CORRECTIONS_REQUESTED", "Corrections requested"
        APPROVED = "APPROVED", "Approved"

    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="attempts")
    intern = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="submission_attempts")
    repository_url = models.URLField(max_length=500)
    note = models.TextField(blank=True)
    version = models.PositiveIntegerField()
    status = models.CharField(max_length=24, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["task_id", "version"]
        constraints = [
            models.UniqueConstraint(fields=["task", "intern", "version"], name="unique_submission_attempt_version")
        ]

class Review(models.Model):
    class Decision(models.TextChoices):
        CORRECTIONS_REQUESTED = "CORRECTIONS_REQUESTED", "Corrections requested"
        APPROVED = "APPROVED", "Approved"

    attempt = models.ForeignKey(SubmissionAttempt, on_delete=models.CASCADE, related_name="reviews")
    mentor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="reviews_written")
    decision = models.CharField(max_length=24, choices=Decision.choices)
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
