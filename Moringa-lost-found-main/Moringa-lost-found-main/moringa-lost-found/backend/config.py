import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    """Base configuration."""
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'a-very-secret-key-that-is-long'

class DevelopmentConfig(Config):
    """Development configuration."""
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'dev.db')
    DEBUG = True

class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    # Use a shared in-memory SQLite database to ensure all connections in a test use the same database.
    SQLALCHEMY_DATABASE_URI = 'sqlite:///file::memory:?cache=shared&uri=true'
    JWT_SECRET_KEY = 'super-secret-for-testing'

config = {
    'testing': TestingConfig,
    'default': DevelopmentConfig
}