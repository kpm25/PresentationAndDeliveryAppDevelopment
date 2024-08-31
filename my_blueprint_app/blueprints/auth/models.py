# auth/models.py

from flask_sqlalchemy import SQLAlchemy
from .config import IS_BLUEPRINT


# Initialize db as None
db = None

if IS_BLUEPRINT is False:
    print(f'auth/models.py, IS_BLUEPRINT: {IS_BLUEPRINT}, so db is created here as a new sqlalchemy object')
    db = SQLAlchemy()
else:
    print(f'auth/models.py, IS_BLUEPRINT: {IS_BLUEPRINT}, so db is called from main app')
    from my_blueprint_app.app import db


class User(db.Model):
    __tablename__ = 'user'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.id} - {self.username} - {self.email}>'

    def get_id(self):
        return self.id


