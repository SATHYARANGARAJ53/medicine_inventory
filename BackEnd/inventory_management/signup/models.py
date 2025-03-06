from django.db import models
from django.contrib.auth.hashers import make_password,check_password

class Medical_Store_Details(models.Model):
    clinic_id = models.CharField(max_length=20, unique=True)
    clinic_name=models.CharField(max_length=200)
    email=models.EmailField(unique=True)
    password=models.CharField(max_length=128)
    district=models.CharField(max_length=50)
    
    def save(self,*args, **kwargs):
        if not self.clinic_id:
            last_clinic = Medical_Store_Details.objects.order_by("-clinic_id").first()  # Get last clinic entry
            if last_clinic and last_clinic.clinic_id:
                last_id = int(last_clinic.clinic_id.split("_")[1])
                self.clinic_id = f"clinic_{last_id + 1:03d}"
            else:
                self.clinic_id = "clinic_001"
        self.password=make_password(self.password)
        super(Medical_Store_Details,self).save(*args, **kwargs)
        
    def __str__(self):
        return f"{self.clinic_id}"