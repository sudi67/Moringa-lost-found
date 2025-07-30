# SQLAlchemy Relationship Conflicts Fixed

## Problem
The signup endpoint was returning a 500 Internal Server Error due to SQLAlchemy relationship conflicts:
```
Error creating backref 'item' on relationship 'Item.claims': property of that name exists on mapper 'Mapper[Claim(claims)]'
```

## Root Cause
Multiple models were defining conflicting backref relationships:
1. `Item.claims` and `Claim.item` both trying to create backrefs
2. `Item.comments` and `Comment.item` both trying to create backrefs  
3. `Item.rewards` and `Reward.item` both trying to create backrefs
4. `User.claims` and `Claim.claimant` conflicting backref names

## Changes Made

### 1. Item Model (`app/models/item.py`)
```python
# Before (conflicting)
claims = db.relationship('Claim', backref='item', lazy=True)
comments = db.relationship('Comment', backref='item', lazy=True)
rewards = db.relationship('Reward', lazy=True)

# After (fixed)
claims = db.relationship('Claim', lazy=True)
comments = db.relationship('Comment', lazy=True)
rewards = db.relationship('Reward', lazy=True)
```

### 2. Claim Model (`app/models/report.py`)
```python
# Before (conflicting)
item = db.relationship('Item', backref='claims')
claimant = db.relationship('User', backref='claims', overlaps="claims,claimant")

# After (fixed)
item = db.relationship('Item', overlaps="claims")
# claimant relationship is defined in User model
```

### 3. Comment Model (`app/models/report.py`)
```python
# Before (conflicting)
item = db.relationship('Item', backref='comments')

# After (fixed)
item = db.relationship('Item', overlaps="comments")
```

### 4. User Model (`app/models/user.py`)
```python
# Before (complex overlaps)
claims = db.relationship('Claim', backref=db.backref('claimant_user', lazy=True), lazy=True, foreign_keys='Claim.claimant_id', overlaps="claims,claimant_user")

# After (simplified)
claims = db.relationship('Claim', backref='claimant', lazy=True, foreign_keys='Claim.claimant_id')
```

### 5. Reward Model (`app/models/reward.py`)
```python
# Before (conflicting)
item = db.relationship('Item', backref='rewards')

# After (fixed)
item = db.relationship('Item', overlaps="rewards")
```

## Testing
Local testing confirms all models now work correctly:
- ✅ All models imported successfully
- ✅ Database tables created successfully  
- ✅ User, Item, and Claim creation works
- ✅ Relationships work correctly

## Next Steps
1. Commit these changes to your repository
2. Push to your main branch
3. Redeploy the application on Render
4. The signup endpoint should now work correctly

## Verification
After deployment, test the signup endpoint:
```bash
curl -X POST https://moringa-lost-found-api.onrender.com/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"testpass"}'
```

Expected response: `201 Created` with success message.