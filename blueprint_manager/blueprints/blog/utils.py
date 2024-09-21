# blog/utils.py

# from .models import db, Post
import random

import socket
from sqlalchemy import inspect

from .config import IS_BLUEPRINT
from flask import g

# Initialize db and Post as None
db = None
Post = None

if IS_BLUEPRINT is False:
    from .models import Post, db
else:
    # to be defined later by main app
    from blueprint_manager.app import db
    from blueprint_manager.blueprints.blog.models import Post


def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # doesn't even have to be reachable
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP


class PostSampleData:
    @staticmethod
    def add_sample_data():
        sample_titles = ['Post 1', 'Post 2', 'Post 3', 'Post 4', 'Post 5']
        sample_contents = ['Content of Post 1', 'Content of Post 2', 'Content of Post 3', 'Content of Post 4', 'Content of Post 5']

        # Create some sample posts
        for i in range(len(sample_titles)):
            post = Post(title=sample_titles[i], content=sample_contents[i])
            db.session.add(post)

        # Commit the session to save the posts to the database
        db.session.commit()

        print(f'inside blog/utils.py sample data added. IP: {get_local_ip()}')

    @staticmethod
    def delete_table():
        db.drop_all()

    from sqlalchemy import inspect

    @staticmethod
    def delete_all():
        # Create an Inspector object
        inspector = inspect(db.engine)

        # Check if the Post table exists
        if 'post' in inspector.get_table_names():
            # Delete all rows from the Post table
            db.session.query(Post).delete()
            db.session.commit()
            print('All rows from the Post table deleted.')
        else:
            print('Post table does not exist.')


class StaticMethod:
    ADD_SAMPLE_DATA = 1
    DELETE_ALL = 2

    @staticmethod
    def execute(option, app=None):
        if option == StaticMethod.ADD_SAMPLE_DATA:
            with app.app_context():
                PostSampleData.add_sample_data()
                print('Sample data added.')
        elif option == StaticMethod.DELETE_ALL:
            with app.app_context():
                PostSampleData.delete_all()
                print('All data from the table deleted.')
        else:
            print('Invalid option')
