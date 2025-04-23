from django.urls import path
from .views import create_redistribution_request, update_redistribution_request, get_redistribution_requests

urlpatterns = [
    path('api/create-redistribution/', create_redistribution_request),
    path('api/update-redistribution/', update_redistribution_request),
    path('api/redistribution-requests/', get_redistribution_requests),
]