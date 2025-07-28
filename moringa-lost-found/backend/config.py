import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://lostfound_user:password@localhost/lost_and_found_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'super-secret-dev-key'
