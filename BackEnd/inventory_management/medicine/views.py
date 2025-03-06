
from django.shortcuts import render, redirect, get_object_or_404, HttpResponse
from .models import Medicine
from signup.models import Medical_Store_Details
from .forms import MedicineForm

# To Read All Medicines
def medicine_list(request):
    medicines = Medicine.objects.all()
    print("Total Medicines:", medicines.count())
    return render(request, 'inventory/medicine_list.html', {'medicines': medicines})

# To Read One Medicine
def medicine_detail(request, id):
    medicine = get_object_or_404(Medicine, pk=id)
    return render(request, 'inventory/medicine_detail.html', {'medicine': medicine})

def add_medicine(request,clinic_id):
    if request.method == "POST":
        copy_data = request.POST.copy()
        copy_data['clinic_id'] = clinic_id
        form = MedicineForm(copy_data)
        if form.is_valid():
            medicine = form.save() 
            return "success"
    else:
        print("Error")
        form = MedicineForm()
    return render(request, 'inventory/medicine_form.html', {'form': form})


# To Update Medicine
def update_medicine(request, id):
    medicine = get_object_or_404(Medicine, pk=id)
    if request.method == "POST":
        form = MedicineForm(request.POST, instance=medicine)
        if form.is_valid():
            form.save()
            return redirect('medicine_list')
    else:
        form = MedicineForm(instance=medicine)
    return render(request, 'inventory/medicine_form.html', {'form': form})

# To Delete Medicine
def delete_medicine(request, id):
    medicine = get_object_or_404(Medicine, pk=id)
    if request.method == "POST":
        medicine.delete()
        return redirect('medicine_list')
    return render(request, 'inventory/medicine_confirm_delete.html', {'medicine': medicine})

