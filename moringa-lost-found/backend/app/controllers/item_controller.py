from flask import request, jsonify
from app.models.item import Item
from app.models import db

def add_item():
    data = request.get_json()
    item = Item(
        name=data['name'],
        description=data.get('description'),
        status=data.get('status', 'lost'),
        location_found=data.get('location_found'),
        image_url=data.get('image_url'),
        reported_by=data['reported_by']
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({"message": "Item added successfully."}), 201

def update_item(item_id):
    item = Item.query.get_or_404(item_id)
    data = request.get_json()

    item.name = data.get('name', item.name)
    item.description = data.get('description', item.description)
    item.status = data.get('status', item.status)
    item.image_url = data.get('image_url', item.image_url)
    item.location_found = data.get('location_found', item.location_found)

    db.session.commit()
    return jsonify({"message": "Item updated successfully."}), 200

def delete_item(item_id):
    item = Item.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item deleted."}), 200

def get_all_items():
    items = Item.query.all()
    result = [{
        "id": item.id,
        "name": item.name,
        "status": item.status,
        "description": item.description,
        "location_found": item.location_found,
        "reported_by": item.reported_by
    } for item in items]
    return jsonify(result), 200
