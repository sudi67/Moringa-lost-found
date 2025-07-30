import pytest
from app import create_app
from app.extensions import db, jwt
from app.models.user import User
from app.models.item import Item
from app.models.report import Claim, Comment
from app.models.reward import Reward
from flask import json

@pytest.fixture
def app():
    app = create_app()
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_headers(client):
    user_data = {"username": "testuser", "email": "test@example.com", "password": "password123"}
    client.post("/auth/signup", json=user_data)
    login_resp = client.post("/auth/login", json={"email": user_data["email"], "password": user_data["password"]})
    token = login_resp.get_json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def admin_headers(client):
    admin_data = {"username": "admin", "email": "admin@example.com", "password": "adminpass", "role": "admin"}
    client.post("/auth/signup", json=admin_data)
    login_resp = client.post("/auth/login", json={"email": admin_data["email"], "password": admin_data["password"]})
    token = login_resp.get_json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_user_signup_login(client):
    user = {"username": "jane", "email": "jane@example.com", "password": "pass1234"}
    res = client.post("/auth/signup", json=user)
    assert res.status_code == 201
    assert res.get_json()["message"] == "User created successfully."

    login = client.post("/auth/login", json={"email": user["email"], "password": user["password"]})
    assert login.status_code == 200
    assert "access_token" in login.get_json()

def test_user_profile(client, auth_headers):
    res = client.get("/auth/profile", headers=auth_headers)
    assert res.status_code == 200
    data = res.get_json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"

def test_add_get_item(client, auth_headers):
    item_data = {
        "name": "Phone",
        "description": "Black Samsung phone",
        "status": "lost",
        "location_found": "Library",
        "image_url": "http://image.com/photo.png"
    }
    add_res = client.post("/items", headers=auth_headers, json=item_data)
    assert add_res.status_code == 201
    assert "message" in add_res.get_json()

    get_res = client.get("/items")
    items = get_res.get_json()
    assert isinstance(items, list)
    assert any(item["name"] == "Phone" for item in items)

def test_update_delete_item(client, auth_headers):
    item_data = {
        "name": "Wallet",
        "description": "Brown leather wallet",
        "status": "lost"
    }
    add = client.post("/items", headers=auth_headers, json=item_data)
    assert add.status_code == 201

    all_items = client.get("/items").get_json()
    item_id = next(item["id"] for item in all_items if item["name"] == "Wallet")

    update = client.put(f"/items/{item_id}", headers=auth_headers, json={"status": "found"})
    assert update.status_code == 200

    delete = client.delete(f"/items/{item_id}", headers=auth_headers)
    assert delete.status_code == 200
    assert delete.get_json()["message"] == "Item deleted."

def test_create_claim_comment_reward_and_get(client, auth_headers):
    # Add item
    item_res = client.post("/items", headers=auth_headers, json={
        "name": "Laptop", "description": "HP", "status": "lost"
    })
    assert item_res.status_code == 201

    all_items = client.get("/items").get_json()
    item_id = next(item["id"] for item in all_items if item["name"] == "Laptop")

    # Create claim
    claim = client.post("/reports/claims", headers=auth_headers, json={"item_id": item_id})
    assert claim.status_code == 201
    assert claim.get_json()["message"] == "Claim submitted."

    # Add comment
    comment = client.post("/reports/comments", headers=auth_headers, json={
        "item_id": item_id,
        "content": "Is this yours?"
    })
    assert comment.status_code == 201
    assert comment.get_json()["message"] == "Comment added."

    # Offer reward
    # First, register another user as the receiver
    client.post("/auth/signup", json={
        "username": "receiver", "email": "r@example.com", "password": "pass123"
    })
    receiver_login = client.post("/auth/login", json={"email": "r@example.com", "password": "pass123"})
    receiver_token = receiver_login.get_json()["access_token"]

    # Decode receiver user ID from token
    from flask_jwt_extended import decode_token
    receiver_id = decode_token(receiver_token)["sub"]

    reward = client.post("/reports/rewards", headers=auth_headers, json={
        "item_id": item_id,
        "receiver_id": receiver_id,
        "amount": 200,
        "paid": False
    })
    assert reward.status_code == 201
    assert reward.get_json()["message"] == "Reward offered."

    # Get user rewards
    rewards = client.get("/reports/rewards", headers=auth_headers)
    assert rewards.status_code == 200
    data = rewards.get_json()
    assert "sent" in data and len(data["sent"]) > 0
