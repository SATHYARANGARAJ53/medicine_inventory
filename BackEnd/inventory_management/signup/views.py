from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.hashers import check_password,make_password
from django.contrib.auth import login, logout
from .models import Medical_Store_Details
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.db import IntegrityError

@csrf_exempt
def signup(request):
    print("Entered")
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = str(data.get("password"))
        clinic_name = data.get("clinic_name")
        district = data.get("district")
        
        try:
            user = Medical_Store_Details.objects.create(
                email=email,
                clinic_name=clinic_name,
                password=password,
                district=district
            )
            return JsonResponse({"message": "Signup successful!"}, status=201)
        
        except IntegrityError as e:
            if "signup_medical_store_details.email" in str(e):
                return JsonResponse({"error": "Email already exists"}, status=400)

            return JsonResponse({"error": "Something went wrong!"}, status=500)


@csrf_exempt
def login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        try:
            user = Medical_Store_Details.objects.get(email=email)
            if check_password(password,user.password):
                return JsonResponse({"message": "Login successful", "clinic_name": user.clinic_name}, status=200)
            else:
                return JsonResponse({"message": "Invalid credentials"}, status=400)
        except Medical_Store_Details.DoesNotExist:
            return JsonResponse({"message": "Invalid credentials"}, status=400)