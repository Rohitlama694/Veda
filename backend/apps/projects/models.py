from django.db import models
from apps.groups.models import Group

class Project(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=200)
    problem_statement = models.TextField()
    expected_final_output = models.TextField()

    def __str__(self):
        return self.title

class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    number = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    expected_output = models.TextField()
    due_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ["number"]
        constraints = [
            models.UniqueConstraint(fields=["project", "number"], name="unique_task_number_per_project")
        ]

    def __str__(self):
        return f"{self.project.title}: {self.title}"
