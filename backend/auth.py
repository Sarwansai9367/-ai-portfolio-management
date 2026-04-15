import jwt
import datetime
import os
from functools import wraps
from flask import request, jsonify

SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-default-key-please-change")

def create_token(user_id):
    """Generate a JWT token for a given user_id."""
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token):
    """Verify a token and return the user_id if valid."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def require_auth(f):
    """Decorator to require a valid JWT token matching the user_id."""
    @wraps(f)
    def decorated(*args, **kwargs):
        # Allow development bypass if explicitly requested via query parameter
        # but in production, this should strictly enforce tokens
        
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            
        if not token:
            # Fallback for socket connections or testing
            token = request.args.get('token')
            
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
            
        user_id = verify_token(token)
        if not user_id:
            return jsonify({'error': 'Token is invalid or expired'}), 401
            
        # Optional: Inject the user_id into the request arguments for the actual endpoint
        # Here we just pass it to the function 
        return f(user_id, *args, **kwargs)
        
    return decorated
