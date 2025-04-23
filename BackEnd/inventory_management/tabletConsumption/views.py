from datetime import datetime
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import TabletConsumption
from rest_framework.decorators import api_view
from signup.models import Medical_Store_Details
from medicine.models import Medicine
import csv
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
from django.http import JsonResponse
import json
import pandas as pd
from keras.models import load_model
from sklearn.preprocessing import LabelEncoder, MinMaxScaler



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


@csrf_exempt
def generate_csv_file():
    try:
        file_path = "tablet_consumption.csv"
        with open(file_path, 'w', newline='') as f:
            writer = csv.writer(f)
            header = ["Clinic ID", "Tablet Name", "Year"] + [f"Week {i}" for i in range(1, 53)]
            writer.writerow(header)

            records = TabletConsumption.objects.all()
            for record in records:
                row = [
                    record.clinic.id,
                    record.tablet_name,
                    record.year
                ] + [getattr(record, f"week_{i}") for i in range(1, 53)]
                writer.writerow(row)

        return file_path
    except Exception as e:
        print("CSV Generation Error:", e)
        return None

# === Load and prepare dataset once ===
#E:\\MediProject\\medicine_inventory\\BackEnd\\inventory_management\\tabletConsumption\\LSTM\\tablet_consumption.csv
df = pd.read_csv('D:\\Projectronz-2\\medicine_inventory-NewBranch-05\\medicine_inventory-NewBranch-05\\BackEnd\\inventory_management\\tabletConsumption\\LSTM\\tablet_consumption.csv')  # Adjust the path as needed
df.columns = df.columns.str.strip()
week_cols = [col for col in df.columns if col.startswith('Week')]
df_long = df.melt(id_vars=['Clinic ID', 'Tablet Name', 'Year'], value_vars=week_cols,
                  var_name='Week', value_name='Consumption')
df_long['Week'] = df_long['Week'].str.extract('(\d+)').astype(int)

# === Encode features and prepare scalers ===
clinic_encoder = LabelEncoder()
tablet_encoder = LabelEncoder()
df_long['ClinicEncoded'] = clinic_encoder.fit_transform(df_long['Clinic ID'])
df_long['TabletEncoded'] = tablet_encoder.fit_transform(df_long['Tablet Name'])

# === Create and fit scaler ===
scaler = MinMaxScaler()
all_consumption = df_long['Consumption'].values.reshape(-1, 1)
scaler.fit(all_consumption)

# === Load trained model ===
# model = load_model("D:\\Projectronz-2\\medicine_inventory-NewBranch-05\\medicine_inventory-NewBranch-05\\BackEnd\\inventory_management\\tabletConsumption\\LSTM\\medicine_consumption_predictor.h5")

@csrf_exempt
def predict_for_clinic_week(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            clinic_id = data['clinic_id']
            week_num = get_custom_week_number(datetime.now())

            sub_df = df_long[(df_long['Clinic ID'] == clinic_id) & (df_long['Week'] == week_num)]
            
            clinic = get_object_or_404(Medical_Store_Details, clinic_id=clinic_id)
            print("Clinic object found:", clinic)
            
            available_tablets = set(
                Medicine.objects.filter(clinic_id=clinic)
                .values_list('tablet_name', flat=True)
            )
            
            result = {}

            for tablet in sub_df['Tablet Name'].unique():
                
                if tablet not in available_tablets:
                    continue

                tab_df = sub_df[sub_df['Tablet Name'] == tablet].sort_values('Year')
                if len(tab_df) < 2:
                    continue
                seq = tab_df['Consumption'].values[:-1]
                seq_scaled = scaler.transform(seq.reshape(-1, 1)).reshape(1, -1, 1)
                pred_scaled = model.predict(seq_scaled, verbose=0)
                pred = scaler.inverse_transform(pred_scaled)[0][0]
                result[tablet] = int(round(pred))
                print(result)

            return JsonResponse(result)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Only POST requests allowed'}, status=405)
