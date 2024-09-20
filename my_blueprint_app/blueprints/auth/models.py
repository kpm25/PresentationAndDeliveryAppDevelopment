# auth/models.py

from flask_sqlalchemy import SQLAlchemy
from .config import IS_BLUEPRINT
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

# Initialize db as None
db = None

if IS_BLUEPRINT is False:
    print(f'auth/models.py, IS_BLUEPRINT: {IS_BLUEPRINT}, so db is created here as a new sqlalchemy object')
    db = SQLAlchemy()
else:
    print(f'auth/models.py, IS_BLUEPRINT: {IS_BLUEPRINT}, so db is called from main app')
    from my_blueprint_app.app import db


# class User(db.Model):
#     __tablename__ = 'user'
#     __table_args__ = {'extend_existing': True}
#
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(50), unique=True, nullable=False)
#     email = db.Column(db.String(120), unique=True, nullable=False)
#
#     def __repr__(self):
#         return f'<User {self.id} - {self.username} - {self.email}>'

class User(UserMixin, db.Model):
    __tablename__ = 'user'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    # password_hash = db.Column(db.String(128))

    # def set_password(self, password):
    #     self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_id(self):
        return self.id


