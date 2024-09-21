# blog/models.py

from flask_sqlalchemy import SQLAlchemy
from .config import IS_BLUEPRINT


# Initialize db as None
db = None

if IS_BLUEPRINT  is False:
    print(f'blog/models.py, IS_BLUEPRINT: {IS_BLUEPRINT}, so db is created here as a new sqlalchemy object')
    db = SQLAlchemy()
else:
    print(f'blog/models.py,IS_BLUEPRINT: {IS_BLUEPRINT}, so db is called from main app')
    from blueprint_manager.app import db

class Post(db.Model):
    __tablename__ = 'post'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f'<Post {self.id} - {self.title} - {self.content}>'

    def get_id(self):
        return self.id
