import pytest
from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from app.models import db, User, Item, Report, Claim, Comment, Reward

# Use in-memory SQLite for testing
DATABASE_URL = "sqlite:///:memory:"

@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    """Enforce foreign key constraints on SQLite."""
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

@pytest.fixture(scope="function")
def session():
    engine = create_engine(DATABASE_URL)
    db.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()
    db.metadata.drop_all(bind=engine)


@pytest.fixture
def user(session):
    """Creates and commits a user to the session."""
    user = User(username="testuser", email="test@example.com", password_hash="hashed", role="user")
    session.add(user)
    session.commit()
    return user

@pytest.fixture
def another_user(session):
    """Creates and commits a second user to the session."""
    user = User(username="finder", email="finder@example.com", password_hash="finder_hash", role="user")
    session.add(user)
    session.commit()
    return user


def test_create_user(session, user):
    found = session.query(User).filter_by(id=user.id).first()
    assert found is not None
    assert found.email == "test@example.com"


def test_create_item(session, user, item):
    # The item fixture already creates an item, we just need to verify it
    found = session.query(Item).filter_by(name="Phone").first()
    assert found is not None
    assert found.status == "found"
    assert found.reported_by == user.id
    assert found.reporter == user  # Test the back-reference


def test_create_report(session, user, item):
    report = Report(
        user_id=user.id,
        item_id=item.id,
        is_approved=False
    )
    session.add(report)
    session.commit()

    found = session.query(Report).filter_by(item_id=item.id).first()
    assert found is not None
    assert found.item_id == item.id
    assert found.user_id == user.id
    assert found.is_approved is False


def test_create_claim_report(session, user, item):
    claim = Claim(
        item_id=item.id,
        claimant_id=user.id,
        status="pending",
    )
    session.add(claim)
    session.commit()

    found = session.query(Claim).filter_by(item_id=item.id).first()
    assert found is not None
    assert found.status == "pending"
    assert found.claimant_id == user.id

def test_create_comment(session, user, item):
    comment = Comment(
        item_id=item.id,
        author_id=user.id,
        comment_text="I think I saw this phone near the library."
    )
    session.add(comment)
    session.commit()

    found = session.query(Comment).filter_by(item_id=item.id).first()
    assert found is not None
    assert found.comment_text == "I think I saw this phone near the library."
    assert found.author_id == user.id

def test_create_reward(session, user, another_user, item):
    reward = Reward(
        item_id=item.id,
        offered_by_id=user.id,
        paid_to_id=another_user.id,
        amount=50.0,
        status='paid'
    )
    session.add(reward)
    session.commit()

    found = session.query(Reward).filter_by(item_id=item.id).first()
    assert found is not None
    assert found.amount == 50.0
    assert found.status == 'paid'
    assert found.offered_by_id == user.id
    assert found.paid_to_id == another_user.id

def test_model_defaults(session, user):
    """Tests the default values of model fields."""
    # Test Item default status
    item = Item(name="Keys", reported_by=user.id)
    session.add(item)
    session.commit()
    assert item.status == 'lost'

    # Test Claim default status
    claim = Claim(item_id=item.id, claimant_id=user.id)
    session.add(claim)
    session.commit()
    assert claim.status == 'pending'

    # Test Reward default status
    reward = Reward(item_id=item.id, offered_by_id=user.id, amount=10.0)
    session.add(reward)
    session.commit()
    assert reward.status == 'offered'

def test_user_relationships(session, user, item, another_user):
    """Tests the relationships originating from the User model."""
    # The item fixture already links the item to the user
    assert item in user.reported_items

    report = Report(user_id=user.id, item_id=item.id)
    claim = Claim(item_id=item.id, claimant_id=user.id)
    comment = Comment(item_id=item.id, author_id=user.id, comment_text="A comment")
    reward = Reward(item_id=item.id, offered_by_id=user.id, paid_to_id=another_user.id, amount=25.0)
    session.add_all([report, claim, comment, reward])
    session.commit()

    assert report in user.reports
    assert claim in user.claims
    assert comment in user.comments
    assert reward in user.rewards_offered
    assert reward in another_user.rewards_received

def test_item_relationships(session, user, item):
    """Tests the relationships originating from the Item model."""
    # Reporter back-reference is tested in test_create_item
    assert item.reporter == user

    report = Report(user_id=user.id, item_id=item.id)
    claim = Claim(item_id=item.id, claimant_id=user.id)
    comment = Comment(item_id=item.id, author_id=user.id, comment_text="A comment")
    reward = Reward(item_id=item.id, offered_by_id=user.id, amount=25.0)
    session.add_all([report, claim, comment, reward])
    session.commit()

    assert report in item.reports
    assert claim in item.claims
    assert comment in item.comments
    assert reward in item.rewards

def test_uniqueness_constraints(session, user):
    """Tests the unique constraints on the User model."""
    with pytest.raises(IntegrityError):
        duplicate_user = User(username="another", email="test@example.com", password_hash="pwd")
        session.add(duplicate_user)
        session.commit()
    session.rollback()  # Rollback the failed transaction

    with pytest.raises(IntegrityError):
        duplicate_user = User(username="testuser", email="new@example.com", password_hash="pwd")
        session.add(duplicate_user)
        session.commit()
    session.rollback()

def test_foreign_key_constraints(session):
    """Tests that foreign key constraints are enforced."""
    with pytest.raises(IntegrityError):
        # Attempt to create an item with a non-existent user ID
        item = Item(name="Orphan Item", reported_by=999)
        session.add(item)
        session.commit()
    session.rollback()

@pytest.fixture
def item(session, user):
    """Creates and commits an item to the session."""
    item = Item(name="Phone", description="iPhone 13", status="found", image_url="http://image.com/phone.jpg", reported_by=user.id)
    session.add(item)
    session.commit()
    return item
