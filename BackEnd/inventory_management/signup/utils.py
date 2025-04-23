import jwt
import datetime

SECRET_KEY = "Sample"  # Change this to a secure key

def generate_jwt_token(user):
    """
    Generate a simple JWT token with clinic_id and username.
    """

    payload = {
        "clinic_id": user.clinic_id,
        "username": user.clinic_name,
        "exp": datetime.datetime.now() + datetime.timedelta(hours=24),  # Token expires in 24 hours
    }
    
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")  # Encode the token
    return token

