from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Medicine, Medical_Store_Details
from datetime import date ,timedelta


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
        print("Received Clinic ID:", clinic_id)
        if not clinic_id:
            print("No Clinic ID provided")
            return Response({"error": "Clinic ID is required"}, status=400)

        clinic = get_object_or_404(Medical_Store_Details, clinic_id=clinic_id)
        print("Clinic object found:", clinic)

        medicines = Medicine.objects.filter(clinic_id=clinic)

        today = date.today()
        expiry_threshold = today + timedelta(days=7)

        medicine_list = []
        for med in medicines:
            print(f"Tablet: {med.tablet_name}, Expiry: {med.expiry_date}, Qty: {med.quantity_available}")

            expiry = med.expiry_date
            quantity = med.quantity_available
            medicine_list.append({
                "tablet_name": med.tablet_name,
                "expiry_date": med.expiry_date.strftime("%Y-%m-%d") if expiry else "N/A",
                "quantity_available": med.quantity_available,
                "price": float(med.price),
                "near_expiry": med.expiry_date <= expiry_threshold if expiry else False,
                "low_stock": med.quantity_available < 80 if quantity is not None else True,
            })

        print("Returning medicine list:", medicine_list)
        return Response({"medicines": medicine_list}, status=200)
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