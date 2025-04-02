from django.urls import path
from .views import add_medicine, get_medicines, delete_medicine,update_medicine

urlpatterns = [
    path('api/add-medicine/', add_medicine, name='add_medicine'),  
    path('api/get-medicines/', get_medicines, name="get_medicines"),
    path('api/delete-medicine/', delete_medicine, name="delete_medicine"),
    path('api/update-medicine/', update_medicine, name="update_medicine"),

]
