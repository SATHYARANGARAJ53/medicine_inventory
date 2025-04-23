from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import json
from .models import RedistributionRequest
from signup.models import Medical_Store_Details
from medicine.models import Medicine

@csrf_exempt
def create_redistribution_request(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            tablet_name = data['tablet_name']
            from_clinic_id = data['from_clinic_id']
            requested_quantity = data['requested_quantity']
            
            from_clinic = get_object_or_404(Medical_Store_Details, clinic_id=from_clinic_id)

            # Find a donor clinic with same tablet and enough quantity
            donor_medicine = (
                Medicine.objects
                .filter(tablet_name=tablet_name)
                .exclude(clinic_id=from_clinic)
                .filter(quantity_available__gte=requested_quantity)
                .order_by('expiry_date')
                .first()
            )

            if donor_medicine:
                to_clinic = donor_medicine.clinic_id

                # Check for existing pending request
                existing_request = RedistributionRequest.objects.filter(
                    tablet_name=tablet_name,
                    from_clinic=from_clinic,
                    to_clinic=to_clinic,
                    requested_quantity=requested_quantity,
                    status='pending'
                ).first()

                if existing_request:
                    return JsonResponse({'message': 'A similar pending request already exists'}, status=409)
                
                last_request = RedistributionRequest.objects.order_by('-id').first()
                
                if last_request:
                    last_id = last_request.id
                    next_id = last_id + 1
                else:
                    next_id = 1
                    

                req = RedistributionRequest.objects.create(
                    id=next_id,
                    tablet_name=tablet_name,
                    from_clinic=from_clinic,
                    to_clinic=to_clinic,
                    requested_quantity=requested_quantity,
                    status='pending'
                )

                return JsonResponse({'message': 'Redistribution request created', 'request_id': next_id})
            else:
                return JsonResponse({'message': 'No donor clinic found with enough stock'}, status=404)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Only POST allowed'}, status=405)


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import RedistributionRequest, Medical_Store_Details

@csrf_exempt
def get_redistribution_requests(request):
    if request.method == 'GET':
        clinic_id = request.GET.get('clinic_id')
        if not clinic_id:
            return JsonResponse({'error': 'clinic_id is required'}, status=400)
        
        try:
            clinic = Medical_Store_Details.objects.get(clinic_id=clinic_id)
            requests = RedistributionRequest.objects.filter(to_clinic=clinic, status='pending')

            response_data = []
            for req in requests:
                response_data.append({
                    'id': req.id,
                    'tablet_name': req.tablet_name,
                    'requested_quantity': req.requested_quantity,
                    'from_clinic': req.from_clinic.clinic_name,
                    'status': req.status,
                })

            return JsonResponse({'requests': response_data}, status=200)

        except Medical_Store_Details.DoesNotExist:
            return JsonResponse({'error': 'Clinic not found'}, status=404)

    return JsonResponse({'error': 'Only GET allowed'}, status=405)



@csrf_exempt
def update_redistribution_request(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            action = data.get('action')
            request_id = data.get('request_id')

            if not request_id or not action:
                return JsonResponse({'error': 'Missing request_id or action'}, status=400)

            req = get_object_or_404(RedistributionRequest, id=request_id)

            if req.status != 'pending':
                return JsonResponse({'error': 'Request already processed'}, status=400)

            if action == 'accept':
                donor_med = Medicine.objects.get(clinic_id=req.to_clinic, tablet_name=req.tablet_name)
                if donor_med.quantity_available < req.requested_quantity:
                    return JsonResponse({'error': 'Donor stock insufficient'}, status=400)

                # Update quantities
                donor_med.quantity_available -= req.requested_quantity
                donor_med.save()

                # Add to receiver clinic (create if doesn't exist)
                receiver_med, created = Medicine.objects.get_or_create(
                    clinic_id=req.from_clinic,
                    tablet_name=req.tablet_name,
                    defaults={
                        'price': donor_med.price,
                        'expiry_date': donor_med.expiry_date,
                        'quantity_available': 0,
                    }
                )
                receiver_med.quantity_available += req.requested_quantity
                receiver_med.save()

                req.status = 'fulfilled'
                req.save()
                return JsonResponse({'message': 'Redistribution fulfilled'})

            elif action == 'reject':
                req.status = 'rejected'
                req.save()
                return JsonResponse({'message': 'Request rejected'})

            else:
                return JsonResponse({'error': 'Invalid action'}, status=400)

        except Exception as e:
            print('error:', str(e))
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Only POST allowed'}, status=405)
