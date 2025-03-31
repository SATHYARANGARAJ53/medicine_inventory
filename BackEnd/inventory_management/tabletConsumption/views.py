from datetime import datetime
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import TabletConsumption
from rest_framework.decorators import api_view
from signup.models import Medical_Store_Details
from medicine.models import Medicine

# Function to get year and custom week number
def get_custom_week_number(date):
    first_day_of_year = datetime(date.year, 1, 1)
    days_since_jan1 = (date - first_day_of_year).days
    week_no = (days_since_jan1 // 7) + 1
    return week_no

@api_view(["POST"])
def record_tablet_consumption(request):
    try:
        print(request.data.get("tabletQuantity"))
        clinic_id = request.data.get("clinic_id")
        tablet_name = request.data.get("tabletName")
        quantity_consumed = int(request.data.get("tabletQuantity"))
        
        clinic_id_from = get_object_or_404(Medical_Store_Details, clinic_id=clinic_id)

        # Fetch medicine entry
        try:
            medicine = Medicine.objects.get(clinic_id=clinic_id_from, tablet_name = tablet_name)
            
        except Medicine.DoesNotExist:
            print("Catch 1: ")
            return JsonResponse({"error": "Medicine not found"}, status=404)

        # Check if enough stock is available
        if medicine.quantity_available < quantity_consumed:
            return JsonResponse({"error": "Not enough stock available"}, status=400)

        # Reduce stock in Medicine model
        medicine.quantity_available -= quantity_consumed
        medicine.save()

        # Get year and week number
        current_date = datetime.now()
        week_number = get_custom_week_number(current_date)

        # Fetch or create TabletConsumption entry
        tablet_consumption, created = TabletConsumption.objects.get_or_create(
            clinic=clinic_id_from, tablet_name=tablet_name, year=datetime.today().year,
            defaults={f"week_{i}": 0 for i in range(1, 53)}  # Initialize weeks if new entry
        )

        # Update the consumption for the correct week
        week_column = f"week_{week_number}"
        setattr(tablet_consumption, week_column, getattr(tablet_consumption, week_column) + quantity_consumed)
        tablet_consumption.save()

        return JsonResponse({"message": "Stock updated and consumption recorded successfully"}, status=200)
    except Exception as e:
        print("Error:",e)
    
    return JsonResponse({"error": "Invalid request method"}, status=400)
