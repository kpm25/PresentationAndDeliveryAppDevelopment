# auth/utils.py

# from .models import db, User
import random

import socket
from sqlalchemy import inspect

from .config import IS_BLUEPRINT
from flask import g

# Initialize db and User as None
db = None
User = None


if IS_BLUEPRINT is False:
    from .models import User, db
else:
    # to be defined later by main app
    from my_blueprint_app.app import db
    from my_blueprint_app.blueprints.auth.models import User


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
            user = User(username=name, email=email)
            db.session.add(user)

            # Commit the session to save the users to the database
        db.session.commit()

        print(f'inside auth/utils.py sample data added. IP: {get_local_ip()}')

    @staticmethod
    def delete_table():
        db.drop_all()

    @staticmethod
    def delete_all():
        # Create an Inspector object
        inspector = inspect(db.engine)

        # Check if the User table exists
        if 'user' in inspector.get_table_names():
            # Delete all rows from the User table
            db.session.query(User).delete()
            db.session.commit()
            print('All rows from the User table deleted.')
        else:
            print('User table does not exist.')

# a function that returns the base URL of a blueprint
def get_blueprint_base_url(blueprint_name, _app):
    for blueprint in _app.blueprints.values():
        if blueprint.name == blueprint_name:
            return blueprint.url_prefix
    return None

class StaticMethod:
    ADD_SAMPLE_DATA = 1
    DELETE_ALL = 2

    @staticmethod
    def execute(option, app=None):
        if option == StaticMethod.ADD_SAMPLE_DATA:
            with app.app_context():
                UserSampleData.add_sample_data()
                print('Sample data added.')
        elif option == StaticMethod.DELETE_ALL:
            with app.app_context():
                UserSampleData.delete_all()
                print('All data from the table deleted.')
        else:
            print('Invalid option')

