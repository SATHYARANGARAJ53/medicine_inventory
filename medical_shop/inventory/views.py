
from django.shortcuts import render, redirect, get_object_or_404
from .models import Medicine
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

# To Add Medicine
def add_medicine(request):
    if request.method == "POST":
        form = MedicineForm(request.POST)
        if form.is_valid():
            medicine = form.save() 
            print("Saved Medicine ID:", medicine.medicine_id)  # Debugging Line
            return redirect('medicine_list')
    else:
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
