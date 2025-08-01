#!/usr/bin/env python3
"""
Test script to demonstrate the notification feature when admin rejects items
"""

import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:5000"

def test_notification_feature():
    """
    Test the notification feature for item rejection
    """
    print("🧪 Testing Notification Feature for Item Rejection")
    print("=" * 50)
    
    # Test data
    user_data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "password123"
    }
    
    admin_data = {
        "username": "admin",
        "email": "admin@example.com", 
        "password": "adminpass",
        "role": "admin"
    }
    
    item_data = {
        "name": "Lost iPhone",
        "description": "Black iPhone 13 Pro",
        "category": "electronics",
        "location_found": "Library"
    }
    
    rejection_data = {
        "reason": "The description is too vague. Please provide more specific details like the model, color, and any distinguishing features."
    }
    
    print("📝 API Endpoints Available:")
    print("POST /auth/register - Register user/admin")
    print("POST /auth/login - Login user/admin")
    print("POST /items - Create item (requires auth)")
    print("GET /admin/items/pending - Get pending items (admin only)")
    print("PUT /items/admin/<item_id>/reject - Reject item with reason (admin only)")
    print("GET /notifications - Get user notifications (requires auth)")
    print("PUT /notifications/<notification_id>/read - Mark notification as read")
    print("GET /notifications/unread-count - Get unread notification count")
    print()
    
    print("🔧 How to test manually:")
    print("1. Register a regular user:")
    print(f"   curl -X POST {BASE_URL}/auth/register \\")
    print(f"        -H 'Content-Type: application/json' \\")
    print(f"        -d '{json.dumps(user_data)}'")
    print()
    
    print("2. Register an admin user:")
    print(f"   curl -X POST {BASE_URL}/auth/register \\")
    print(f"        -H 'Content-Type: application/json' \\")
    print(f"        -d '{json.dumps(admin_data)}'")
    print()
    
    print("3. Login as regular user and get token:")
    login_user_data = {"email": user_data["email"], "password": user_data["password"]}
    print(f"   curl -X POST {BASE_URL}/auth/login \\")
    print(f"        -H 'Content-Type: application/json' \\")
    print(f"        -d '{json.dumps(login_user_data)}'")
    print()
    
    print("4. Create an item (use token from step 3):")
    print(f"   curl -X POST {BASE_URL}/items \\")
    print(f"        -H 'Content-Type: application/json' \\")
    print(f"        -H 'Authorization: Bearer YOUR_USER_TOKEN' \\")
    print(f"        -d '{json.dumps(item_data)}'")
    print()
    
    print("5. Login as admin and get admin token:")
    login_admin_data = {"email": admin_data["email"], "password": admin_data["password"]}
    print(f"   curl -X POST {BASE_URL}/auth/login \\")
    print(f"        -H 'Content-Type: application/json' \\")
    print(f"        -d '{json.dumps(login_admin_data)}'")
    print()
    
    print("6. Get pending items (use admin token):")
    print(f"   curl -X GET {BASE_URL}/admin/items/pending \\")
    print(f"        -H 'Authorization: Bearer YOUR_ADMIN_TOKEN'")
    print()
    
    print("7. Reject an item with reason (use admin token and item ID from step 6):")
    print(f"   curl -X PUT {BASE_URL}/items/admin/ITEM_ID/reject \\")
    print(f"        -H 'Content-Type: application/json' \\")
    print(f"        -H 'Authorization: Bearer YOUR_ADMIN_TOKEN' \\")
    print(f"        -d '{json.dumps(rejection_data)}'")
    print()
    
    print("8. Check user notifications (use user token):")
    print(f"   curl -X GET {BASE_URL}/notifications \\")
    print(f"        -H 'Authorization: Bearer YOUR_USER_TOKEN'")
    print()
    
    print("9. Get unread notification count:")
    print(f"   curl -X GET {BASE_URL}/notifications/unread-count \\")
    print(f"        -H 'Authorization: Bearer YOUR_USER_TOKEN'")
    print()
    
    print("10. Mark notification as read:")
    print(f"    curl -X PUT {BASE_URL}/notifications/NOTIFICATION_ID/read \\")
    print(f"         -H 'Authorization: Bearer YOUR_USER_TOKEN'")
    print()
    
    print("✅ Expected Flow:")
    print("1. User creates an item → Item status: 'pending'")
    print("2. Admin rejects item with reason → Item status: 'rejected'")
    print("3. System creates notification for user with rejection reason")
    print("4. User can view notification with the admin's rejection reason")
    print("5. User can mark notification as read")
    print()
    
    print("📊 Database Tables Created:")
    print("- notifications (id, user_id, title, message, type, is_read, item_id, created_at)")
    print()
    
    print("🎯 Key Features Implemented:")
    print("✓ Notification model with relationships to User and Item")
    print("✓ Admin can reject items with custom reason")
    print("✓ User receives notification when item is rejected")
    print("✓ User receives notification when item is approved")
    print("✓ User can view all notifications")
    print("✓ User can mark notifications as read")
    print("✓ User can get unread notification count")
    print("✓ Admin can view all pending items")

if __name__ == "__main__":
    test_notification_feature()