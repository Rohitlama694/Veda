from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model

from .serializers import (
    UserSerializer,
    UserCreateSerializer,
    ChangeEmailSerializer,
    AdminChangePasswordSerializer,
)

User = get_user_model()


class IsAdminUserRole(permissions.BasePermission):
    """
    Allows access only to authenticated users with ADMIN role or staff status.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return getattr(request.user, "role", None) == User.Role.ADMIN or request.user.is_staff


class AdminUserViewSet(viewsets.ModelViewSet):
    """
    Admin endpoints to:
    - List users
    - Add user
    - Delete user
    - Update user (including email)
    - Change user email via /change-email/
    - Change user password via /change-password/
    """
    queryset = User.objects.all().order_by("id")
    permission_classes = [permissions.IsAuthenticated, IsAdminUserRole]

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        return UserSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Protect root admin account or self-deletion
        if instance.id == 1 or instance.email.lower() == "admin@veda.internal":
            return Response(
                {"error": "The primary root administrator account cannot be deleted."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if instance == request.user:
            return Response(
                {"error": "Administrators cannot delete their own active account."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=["post"], url_path="change-email")
    def change_email(self, request, pk=None):
        user = self.get_object()
        serializer = ChangeEmailSerializer(data=request.data, context={"user": user})
        serializer.is_valid(raise_exception=True)

        user.email = serializer.validated_data["email"]
        user.save(update_fields=["email"])
        return Response(UserSerializer(user).data)

    @action(detail=True, methods=["post"], url_path="change-password")
    def change_password(self, request, pk=None):
        user = self.get_object()
        serializer = AdminChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])
        return Response({"status": "password updated successfully"})
