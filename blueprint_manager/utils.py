
from .models import db, AuthUser, MainModel, BlogPost

import random

import socket

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




class UserSampleData:
    @staticmethod
    def add_sample_data():
        sample_names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Helen', 'Ivy', 'Jack', 'Karl']
        sample_emails = ['gmail', 'yahoo', 'hotmail', 'outlook', 'protonmail']
        # Create some sample users
        for name in sample_names:
            email = name + '@' + sample_emails[random.randint(0, len(sample_emails) - 1)] + '.com'
            user = AuthUser(username=name, email=email)
            db.session.add(user)

        # Commit the session to save the users to the database
        db.session.commit()

    @staticmethod
    def delete_table_Auth():
        db.drop_all()

    @staticmethod  # delete all data from the table
    def delete_all_Auth():
        db.session.query(AuthUser).delete()
        db.session.commit()


# a function that returns the base URL of a blueprint


def get_blueprint_base_url(blueprint_name, _app):
    for blueprint in _app.blueprints.values():
        if blueprint.name == blueprint_name:
            return blueprint.url_prefix
    return None


class PostSampleData:
    @staticmethod
    def add_sample_data():
        sample_titles = ['Post 1', 'Post 2', 'Post 3', 'Post 4', 'Post 5']
        sample_contents = ['Content of Post 1', 'Content of Post 2', 'Content of Post 3', 'Content of Post 4', 'Content of Post 5']

        # Create some sample posts
        for i in range(len(sample_titles)):
            post = BlogPost(title=sample_titles[i], content=sample_contents[i])
            db.session.add(post)

        # Commit the session to save the posts to the database
        db.session.commit()

    @staticmethod
    def delete_table_Blog():
        db.drop_all()

    @staticmethod  # delete all data from the table
    def delete_all_Blog():
        db.session.query(BlogPost).delete()
        db.session.commit()



