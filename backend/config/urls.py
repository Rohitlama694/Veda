from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def healthz(_request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path("admin/", admin.site.urls),
    path("healthz/", healthz, name="healthz"),
    path("api/accounts/", include("apps.accounts.urls")),
    path("api/groups/", include("apps.groups.urls")),
    path("api/projects/", include("apps.projects.urls")),
    path("api/", include("apps.accounts.urls")),
]

