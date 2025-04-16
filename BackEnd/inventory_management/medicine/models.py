from django.db import models
from signup.models import Medical_Store_Details

class Medicine(models.Model):
    tablet_id = models.IntegerField(unique=True, blank=True, null=True)
    clinic_id = models.ForeignKey(Medical_Store_Details, on_delete=models.CASCADE, related_name="tablets")
    tablet_name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    expiry_date = models.DateField()
    quantity_available = models.IntegerField()

    def save(self, *args, **kwargs):
        if self.tablet_id is None:
            last_id = Medicine.objects.aggregate(models.Max('tablet_id'))['tablet_id__max'] or 0
            self.tablet_id = last_id + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.tablet_name
