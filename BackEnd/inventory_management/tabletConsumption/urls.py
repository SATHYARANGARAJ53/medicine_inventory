from django.urls import path
from .views import record_tablet_consumption, predict_for_clinic_week,generate_csv_file

urlpatterns = [
    path('api/post-tablet/', record_tablet_consumption, name="posttablet"),
    path('api/predict/', predict_for_clinic_week, name="predict"),
    path('api/getcsv',generate_csv_file,name="getcsv")
]