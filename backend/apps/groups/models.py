from django.conf import settings
from django.db import models

class Group(models.Model):
    code = models.CharField(max_length=30, unique=True)
    name = models.CharField(max_length=120)
    mentor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="mentored_groups",
        limit_choices_to={"role": "MENTOR"},
    )
    interns = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="intern_groups",
        limit_choices_to={"role": "INTERN"},
        blank=True,
    )

    def __str__(self):
        return f"{self.code} — {self.name}"
