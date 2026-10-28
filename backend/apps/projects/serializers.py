from rest_framework import serializers
from .models import Project, Task
from apps.groups.models import Group

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "id",
            "project",
            "number",
            "title",
            "description",
            "expected_output",
            "due_date",
        ]
        read_only_fields = ["id"]

class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    tasks_count = serializers.IntegerField(source="tasks.count", read_only=True)
    group_code = serializers.CharField(source="group.code", read_only=True)
    group_name = serializers.CharField(source="group.name", read_only=True)
    group_id = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.all(),
        source="group",
        write_only=True,
        required=False,
    )

    class Meta:
        model = Project
        fields = [
            "id",
            "group",
            "group_id",
            "group_code",
            "group_name",
            "title",
            "problem_statement",
            "expected_final_output",
            "tasks_count",
            "tasks",
        ]
        read_only_fields = ["id", "group", "group_code", "group_name", "tasks_count", "tasks"]

class ProjectCreateUpdateSerializer(serializers.ModelSerializer):
    group = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all())

    class Meta:
        model = Project
        fields = [
            "id",
            "group",
            "title",
            "problem_statement",
            "expected_final_output",
        ]
        read_only_fields = ["id"]
