# models.py

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()





# Models for main database
class MainModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # Add fields as needed
    def __repr__(self):
        return f'<MainModel {self.id}>'


class AuthUser:
    pass


class BlogPost:
    pass