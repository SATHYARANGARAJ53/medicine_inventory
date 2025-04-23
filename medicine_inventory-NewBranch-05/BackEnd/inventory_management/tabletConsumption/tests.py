import pandas as pd
import numpy as np
from keras.models import Sequential
from keras.layers import LSTM, Dense
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from keras.models import load_model
from keras.losses import MeanSquaredError

# === Load dataset ===
df = pd.read_csv('clinic_tablet_data.csv') # Replace with your file name

# === Adjust column names ===
df.columns = df.columns.str.strip() # Remove leading/trailing whitespace

# === Melt week columns into long format ===
week_cols = [col for col in df.columns if col.startswith('Week')]
df_long = df.melt(id_vars=['Clinic ID', 'Tablet Name', 'Year'], value_vars=week_cols,
                  var_name='Week', value_name='Consumption')
df_long['Week'] = df_long['Week'].str.extract('(\d+)').astype(int)

# === Encode categorical features ===
clinic_encoder = LabelEncoder()
tablet_encoder = LabelEncoder()
df_long['ClinicEncoded'] = clinic_encoder.fit_transform(df_long['Clinic ID'])
df_long['TabletEncoded'] = tablet_encoder.fit_transform(df_long['Tablet Name'])

# === Prepare supervised learning format ===
sequences = []
targets = []

for (clinic, tablet, week), group in df_long.groupby(['ClinicEncoded', 'TabletEncoded', 'Week']):
    group = group.sort_values('Year')
    if len(group) >= 2:
        sequences.append(group['Consumption'].values[:-1])
        targets.append(group['Consumption'].values[-1])

X = np.array(sequences)
y = np.array(targets)

# === Normalize ===
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X.reshape(-1, X.shape[-1])).reshape(X.shape)
y_scaled = scaler.fit_transform(y.reshape(-1, 1))

X_scaled = X_scaled.reshape((X_scaled.shape[0], X_scaled.shape[1], 1))

# === Build and train the LSTM ===
model = Sequential()
model.add(LSTM(64, input_shape=(X_scaled.shape[1], 1)))
model.add(Dense(1))
model.compile(optimizer='adam',loss=MeanSquaredError())
model.fit(X_scaled, y_scaled, epochs=50, batch_size=16)

# === Save the model ===
model.save("medicine_consumption_predictor.h5")
print("Model saved as 'medicine_consumption_predictor.h5'")
