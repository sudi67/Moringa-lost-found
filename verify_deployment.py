#!/usr/bin/env python3
"""
Deployment verification script
Run this after redeploying the backend to verify all endpoints work
"""
import requests
import json
import random
import string

def generate_random_user():
    """Generate random user data for testing"""
    random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    return {
        "username": f"testuser_{random_suffix}",
        "email": f"test_{random_suffix}@example.com",
        "password": "testpassword123"
    }

def test_signup():
    """Test the signup endpoint"""
    url = "https://moringa-lost-found-api.onrender.com/auth/signup"
    user_data = generate_random_user()
    
    headers = {"Content-Type": "application/json"}
    
    try:
        print("🧪 Testing signup endpoint...")
        print(f"   User: {user_data['username']} ({user_data['email']})")
        
        response = requests.post(url, json=user_data, headers=headers)
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 201:
            print("   ✅ Signup successful!")
            return user_data
        else:
            print(f"   ❌ Signup failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return None

def test_login(user_data):
    """Test the login endpoint"""
    if not user_data:
        print("🧪 Skipping login test (no user data)")
        return None
        
    url = "https://moringa-lost-found-api.onrender.com/auth/login"
    login_data = {
        "email": user_data["email"],
        "password": user_data["password"]
    }
    
    headers = {"Content-Type": "application/json"}
    
    try:
        print("🧪 Testing login endpoint...")
        
        response = requests.post(url, json=login_data, headers=headers)
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data:
                print("   ✅ Login successful!")
                return data["access_token"]
            else:
                print("   ❌ Login response missing access_token")
                return None
        else:
            print(f"   ❌ Login failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return None

def test_protected_route(token):
    """Test a protected route"""
    if not token:
        print("🧪 Skipping protected route test (no token)")
        return
        
    url = "https://moringa-lost-found-api.onrender.com/auth/me"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        print("🧪 Testing protected route (/auth/me)...")
        
        response = requests.get(url, headers=headers)
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ Protected route accessible!")
        else:
            print(f"   ❌ Protected route failed: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")

def main():
    print("🚀 Starting deployment verification...\n")
    
    # Test signup
    user_data = test_signup()
    print()
    
    # Test login
    token = test_login(user_data)
    print()
    
    # Test protected route
    test_protected_route(token)
    print()
    
    print("✅ Deployment verification complete!")

if __name__ == "__main__":
    main()