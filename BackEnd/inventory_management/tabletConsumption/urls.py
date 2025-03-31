from django.urls import path
from .views import record_tablet_consumption

urlpatterns = [
    path('api/post-tablet/', record_tablet_consumption, name="posttablet"),
]