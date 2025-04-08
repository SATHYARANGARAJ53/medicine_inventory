import json
import numpy as np
import pandas as pd
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from keras.models import load_model
from sklearn.preprocessing import LabelEncoder, MinMaxScaler

# === Load and prepare dataset once ===
df = pd.read_csv('E:\\MediProject\\medicine_inventory\\BackEnd\\inventory_management\\tabletConsumption\\LSTM\\tablet_consumption.csv')  # Adjust the path as needed
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
model = load_model("E:\\MediProject\\medicine_inventory\\BackEnd\\inventory_management\\tabletConsumption\\LSTM\\medicine_consumption_predictor.h5")

# @csrf_exempt
def predict_for_clinic_week():
    # if request.method == 'POST':
        try:
            # data = json.loads(request.body)
            clinic_id = "clinic_001"
            week_num = 51
            current_year = 2025

            sub_df = df_long[(df_long['Clinic ID'] == clinic_id) & (df_long['Week'] == week_num)]
            result = {}

            for tablet in sub_df['Tablet Name'].unique():
                tab_df = sub_df[sub_df['Tablet Name'] == tablet].sort_values('Year')
                if len(tab_df) < 2:
                    continue
                seq = tab_df['Consumption'].values[:-1]
                seq_scaled = scaler.transform(seq.reshape(-1, 1)).reshape(1, -1, 1)
                pred_scaled = model.predict(seq_scaled, verbose=0)
                pred = scaler.inverse_transform(pred_scaled)[0][0]
                result[tablet] = round(pred, 2)
                print(result)

            return JsonResponse(result)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    # return JsonResponse({'error': 'Only POST requests allowed'}, status=405)
