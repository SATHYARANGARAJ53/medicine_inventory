from rest_framework.decorators import api_view
from django.contrib.auth.hashers import check_password,make_password
from .models import Medical_Store_Details
from django.http import JsonResponse
from rest_framework.decorators import api_view
import json
from django.db import IntegrityError
from rest_framework.response import Response
from .utils import generate_jwt_token
import jwt

@api_view(["POST"])
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
            tokens = generate_jwt_token(user)

            return Response(
                {"message": "Signup successful", "clinic_id": user.clinic_id, "token": tokens},
                status=201,
            )
        
        except IntegrityError as e:
            if "signup_medical_store_details.email" in str(e):
                return JsonResponse({"error": "Email already exists"}, status=400)

            return JsonResponse({"error": "Something went wrong!"}, status=500)


@api_view(["POST"])
def login(request):
    try:
        if request.method == "POST":
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            try:
                print(email)
                user = Medical_Store_Details.objects.get(email=email)
                
                print(email)
                
                if check_password(password,user.password):
                    tokens = generate_jwt_token(user)

                    return Response(
                        {"message": "Login successful", "clinic_id": user.clinic_id, "token": tokens},
                        status=200,
                    )
                    
                else:
                    return JsonResponse({"message": "Invalid credentials"}, status=400)
            except Medical_Store_Details.DoesNotExist:
                return JsonResponse({"message": "Invalid credentials"}, status=400)
            except Exception as e:
                print("Error : ",e)
    except Exception as e:
        print(e)


@api_view(["GET"])
def get_user_details(request):
    auth_header = request.headers.get("Authorization")
    SECRET_KEY = "Sample"
    
    if not auth_header or not auth_header.startswith("Bearer "):
        print("Authorization token missing or invalid")
        return Response({"error": "Authorization token missing or invalid"}, status=401)
    
    token = auth_header.split(" ")[1]  # Extract token from "Bearer <token>"

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])  # Decode JWT token
        print(payload)
        clinic_id = payload["clinic_id"]
        username = payload["username"]

        user = Medical_Store_Details.objects.filter(clinic_id=clinic_id).first()

        if user:
            return Response({
                "clinic_id": user.clinic_id,
                "username": user.clinic_name,
                "email": user.email,
                "district": user.district,
            })
        else:
            return Response({"error": "User not found"}, status=404)

    except jwt.ExpiredSignatureError:
        return Response({"error": "Token has expired"}, status=401)
    except jwt.InvalidTokenError:
        return Response({"error": "Invalid token"}, status=401)
