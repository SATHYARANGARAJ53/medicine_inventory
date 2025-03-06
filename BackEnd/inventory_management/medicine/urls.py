from django.urls import path
from .views import medicine_list, medicine_detail,add_medicine,update_medicine,delete_medicine

urlpatterns = [
    path('read', medicine_list, name='medicine_list'),  # To Read All
    path('read/<int:id>/', medicine_detail, name='medicine_detail'),  # To Read One
    path('add/<str:clinic_id>', add_medicine, name='add_medicine'),  # To Add/Create
    path('update/<int:id>/', update_medicine, name='update_medicine'),  # To Update
    path('delete/<int:id>/',delete_medicine, name='delete_medicine'),  # To Delete
]
