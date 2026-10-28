from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Group
from .serializers import GroupSerializer
from apps.accounts.views import IsAdminUserRole

User = get_user_model()

class GroupViewSet(viewsets.ModelViewSet):
    """
    Endpoints to manage cohort groups and assign mentors/interns.
    """
    queryset = Group.objects.all().select_related("mentor").prefetch_related("interns").order_by("id")
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy", "assign_mentor"]:
            return [permissions.IsAuthenticated(), IsAdminUserRole()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=["post"], url_path="assign-mentor")
    def assign_mentor(self, request, pk=None):
        group = self.get_object()
        mentor_id = request.data.get("mentor_id")
        if not mentor_id:
            return Response({"error": "mentor_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            mentor = User.objects.get(id=mentor_id, role=User.Role.MENTOR)
        except User.DoesNotExist:
            return Response({"error": "Valid mentor not found."}, status=status.HTTP_404_NOT_FOUND)

        group.mentor = mentor
        group.save(update_fields=["mentor"])
        return Response(GroupSerializer(group).data)
