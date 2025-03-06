


from django.urls import path
from inventory.views import medicine_list, medicine_detail,add_medicine,update_medicine,delete_medicine

urlpatterns = [

    path('', medicine_list, name='medicine_list'),  # To Read All
    path('medicines/<int:id>/', medicine_detail, name='medicine_detail'),  # To Read One
    path('medicines/add/', add_medicine, name='add_medicine'),  # To Add/Create
    path('medicines/update/<int:id>/', update_medicine, name='update_medicine'),  # To Update
    path('medicines/delete/<int:id>/',delete_medicine, name='delete_medicine'),  # To Delete
]
