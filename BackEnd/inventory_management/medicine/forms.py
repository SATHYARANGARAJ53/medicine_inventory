from django import forms
from .models import Medicine

class MedicineForm(forms.ModelForm):
    class Meta:
        model = Medicine
        fields = ['clinic_id','tablet_name', 'price', 'expiry_date', 'quantity_available']

    def __init__(self, *args, **kwargs):
        super(MedicineForm, self).__init__(*args, **kwargs)
        self.fields['clinic_id'].widget = forms.HiddenInput()  # Hide the field