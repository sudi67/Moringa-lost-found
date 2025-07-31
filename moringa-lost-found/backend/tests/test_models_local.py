#!/usr/bin/env python3
"""
Test script to verify that models can be imported without relationship conflicts
"""
import sys
import os

# Add the backend directory to the Python path
backend_path = os.path.join(os.path.dirname(__file__), 'moringa-lost-found', 'backend')
sys.path.insert(0, backend_path)

try:
    print("Testing model imports...")
    
    # Set up Flask app context for testing
    from flask import Flask
    from app.extensions import db
    
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    with app.app_context():
        # Import all models
        from app.models import User, Item, Report, Claim, Comment, Reward
        
        print("✅ All models imported successfully!")
        
        # Try to create tables
        db.create_all()
        print("✅ Database tables created successfully!")
        
        # Test creating a user
        user = User(username="testuser", email="test@example.com")
        user.set_password("testpass")
        
        db.session.add(user)
        db.session.commit()
        print("✅ User created successfully!")
        
        # Test creating an item
        item = Item(name="Test Item", description="Test description", reported_by=user.id)
        db.session.add(item)
        db.session.commit()
        print("✅ Item created successfully!")
        
        # Test creating a claim
        claim = Claim(item_id=item.id, claimant_id=user.id)
        db.session.add(claim)
        db.session.commit()
        print("✅ Claim created successfully!")
        
        # Test relationships
        print(f"Item has {len(item.claims)} claims")
        print(f"Claim belongs to item: {claim.item.name}")
        print("✅ Relationships work correctly!")
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()