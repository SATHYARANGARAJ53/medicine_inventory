from django.db import models
from signup.models import Medical_Store_Details

class RedistributionRequest(models.Model):
    id = models.AutoField(primary_key=True)
    tablet_name = models.CharField(max_length=100)
    from_clinic = models.ForeignKey(Medical_Store_Details, related_name='requests_sent', on_delete=models.CASCADE)
    to_clinic = models.ForeignKey(Medical_Store_Details, related_name='requests_received',on_delete=models.CASCADE)
    requested_quantity = models.PositiveIntegerField()
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('fulfilled', 'Fulfilled'),
        ('rejected', 'Rejected'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Request {self.id} - {self.tablet_name} from {self.from_clinic} to {self.to_clinic}"