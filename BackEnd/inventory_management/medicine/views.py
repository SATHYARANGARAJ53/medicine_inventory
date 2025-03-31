from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Medicine, Medical_Store_Details


@api_view(["POST"])
def add_medicine(request):
    try:
        
        clinic_id = request.data.get("Clinic_Id")
        tablet_name = request.data.get("Tablet_Name")
        expiry_date = request.data.get("Expiry_Date")
        quantity = request.data.get("Available_Quantity")
        price = request.data.get("Price", 0.00)

        clinic = get_object_or_404(Medical_Store_Details, clinic_id=clinic_id)
        
        medicine = Medicine.objects.create(
            clinic_id=clinic,
            tablet_name=tablet_name,
            expiry_date=expiry_date,
            quantity_available=quantity,
            price=price,
        )
        
        print(medicine)

        return Response(
            {"message": "Medicine added successfully!", "medicine": tablet_name},
            status=status.HTTP_201_CREATED,
        )
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    


    
@api_view(["GET"])
def get_medicines(request):
    try:
        clinic_id = request.GET.get('clinic_id')
        print(clinic_id)
        clinic = get_object_or_404(Medical_Store_Details, clinic_id=clinic_id)
        medicines = Medicine.objects.filter(clinic_id=clinic)
        medicine_list = list(medicines.values("tablet_name", "price", "expiry_date", "quantity_available"))
        return Response({"medicines": medicine_list})
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=400)
    
@api_view(["DELETE"])
def delete_medicine(request):
    try:
        clinic_id = request.GET.get('clinic_id')
        tablet_name = request.GET.get('tablet_name')
        print(tablet_name)
        clinic = get_object_or_404(Medical_Store_Details, clinic_id=clinic_id)
        medicine = Medicine.objects.get(clinic_id=clinic,tablet_name=tablet_name)
        medicine.delete()
        return Response({"message": "Medicine deleted successfully"}, status=200)
    except Medicine.DoesNotExist:
        return Response({"error": "Medicine not found"}, status=404)
