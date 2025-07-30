#!/usr/bin/env python3
"""
Test script to check if models can be imported without errors
"""
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, '/home/sudeis/Desktop/Moringa-lost-found/moringa-lost-found/backend')

try:
    print("Testing model imports...")
    
    # Test importing extensions first
    from app.extensions import db, jwt
    print("✅ Extensions imported successfully")
    
    # Test importing models
    from app.models.user import User
    print("✅ User model imported successfully")
    
    from app.models.item import Item
    print("✅ Item model imported successfully")
    
    from app.models.report import Report, Claim, Comment
    print("✅ Report models imported successfully")
    
    from app.models.reward import Reward
    print("✅ Reward model imported successfully")
    
    print("✅ All models imported successfully!")
    
except Exception as e:
    print(f"❌ Error importing models: {e}")
    import traceback
    traceback.print_exc()