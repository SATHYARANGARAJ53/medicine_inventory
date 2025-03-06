from django.db import models

class Medicine(models.Model):
    medicine_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    expiry_date = models.DateField()
    quantity_available = models.IntegerField()

    def __str__(self):
        return self.name

class Purchase(models.Model):
    id = models.AutoField(primary_key=True)
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    purchase_date = models.DateField()
    quantity_purchased = models.IntegerField()

    def __str__(self):
        return f"{self.medicine.name} - {self.quantity_purchased}"
