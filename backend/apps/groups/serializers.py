from rest_framework import serializers
from .models import Group
from apps.accounts.serializers import UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class GroupSerializer(serializers.ModelSerializer):
    mentor = UserSerializer(read_only=True)
    mentor_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role=User.Role.MENTOR),
        source="mentor",
        write_only=True,
    )
    interns = UserSerializer(many=True, read_only=True)
    intern_ids = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role=User.Role.INTERN),
        source="interns",
        many=True,
        required=False,
        write_only=True,
    )

    class Meta:
        model = Group
        fields = [
            "id",
            "code",
            "name",
            "mentor",
            "mentor_id",
            "interns",
            "intern_ids",
        ]
