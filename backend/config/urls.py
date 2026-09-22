
from django.contrib import admin
from django.urls import path , include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({
        "status":"success",
        "message":"ProductHub API is running",
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check),
    path('api/auth/', include("accounts.urls")),
]
