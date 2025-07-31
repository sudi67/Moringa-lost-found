#!/usr/bin/env python3
"""
Simple test script to verify signup functionality
"""
import requests
import json

def test_signup():
    url = "https://moringa-lost-found-api.onrender.com/auth/signup"
    
    test_data = {
        "username": "testuser123",
        "email": "testuser123@example.com",
        "password": "testpassword123"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print("Testing signup endpoint...")
        response = requests.post(url, json=test_data, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            print("✅ Signup successful!")
        elif response.status_code == 409:
            print("⚠️  User already exists (this is expected if running multiple times)")
        else:
            print("❌ Signup failed")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_signup()