from django.db import models
from signup.models import Medical_Store_Details

class Medicine(models.Model):
    clinic_id = models.ForeignKey(Medical_Store_Details,on_delete=models.CASCADE, related_name="tablets")
    tablet_name = models.CharField(max_length=100,primary_key=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    expiry_date = models.DateField()
    quantity_available = models.IntegerField()

    def __str__(self):
        return self.name
