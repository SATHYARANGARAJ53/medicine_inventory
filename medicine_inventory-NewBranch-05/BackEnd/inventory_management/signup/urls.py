from django.urls import path
from .views import signup, login, get_user_details

urlpatterns = [
    path("api/signup/", signup, name="signup"),
    path("api/login/", login, name="login"),
    path("api/user-details/", get_user_details, name="user-details")
]
