from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Project, Task
from apps.groups.models import Group
from .serializers import (
    ProjectSerializer,
    ProjectCreateUpdateSerializer,
    TaskSerializer,
)
from apps.accounts.views import IsAdminUserRole

class ProjectViewSet(viewsets.ModelViewSet):
    """
    Endpoints to manage curriculum projects:
    - List projects
    - Create / Add project
    - Edit / Update project
    - Delete project
    - Assign project to group
    """
    queryset = Project.objects.all().select_related("group").prefetch_related("tasks").order_by("id")
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return ProjectCreateUpdateSerializer
        return ProjectSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy", "assign_group"]:
            return [permissions.IsAuthenticated(), IsAdminUserRole()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=["post"], url_path="assign-group")
    def assign_group(self, request, pk=None):
        project = self.get_object()
        group_id = request.data.get("group_id")
        if not group_id:
            return Response({"error": "group_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            group = Group.objects.get(id=group_id)
        except Group.DoesNotExist:
            return Response({"error": "Cohort group not found."}, status=status.HTTP_404_NOT_FOUND)

        project.group = group
        project.save(update_fields=["group"])
        return Response(ProjectSerializer(project).data)

class TaskViewSet(viewsets.ModelViewSet):
    """
    Endpoints to manage task deliverables under a project.
    """
    queryset = Task.objects.all().select_related("project").order_by("project_id", "number")
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [permissions.IsAuthenticated(), IsAdminUserRole()]
        return [permissions.IsAuthenticated()]
