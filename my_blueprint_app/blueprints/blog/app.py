# blog/app.py

import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from .routes import blog_bp, blueprint_base_url
from .models import db
from .utils import StaticMethod, get_local_ip
# from blueprints.blog.routes import blog_bp, blueprint_base_url
# from blueprints.blog.models import db
# from blueprints.blog.utils import StaticMethod, get_local_ip

# Get the directory of the current file (blog/app.py)
basedir = os.path.abspath(os.path.dirname(__file__))


def create_app(_app=None):
    is_app_none = _app is None
    if _app is None:
        _app = Flask(__name__)

    # Configuration specific to blog blueprint
    _app.config['SECRET_KEY'] = 'your_secret_key_here'

    # Set the path to blog.db using the basedir
    _app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'instance',
                                                                         blueprint_base_url + '.db')
    _app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    if is_app_none:
      db.init_app(_app)

    # Register blueprint
    _app.register_blueprint(blog_bp)

    # Create tables if they do not exist
    with _app.app_context():
        db.create_all()  # Specify the bind

    return _app


# python -m blueprints.blog.app
if __name__ == "__main__":
    try:
        app = create_app()
        port = 9876
        host = '0.0.0.0'

        # Check if the flag file exists
        flag_file_path = os.path.join(basedir, 'run_once.flag')
        flag_file_exists = os.path.exists(flag_file_path)

        if not flag_file_exists:  # Only run this code if the flag file does not exist
            while True:  # Keep asking for an option until a valid one is chosen
                print('1: Add sample data')
                print('2: Delete all data from the table')
                print('3: Run the app')
                option = int(input('Enter option: '))

                if option in [1, 2]:
                    StaticMethod.execute(option, app)
                elif option == 3:
                    # Create the flag file
                    with open(flag_file_path, 'w') as flag_file:
                        flag_file.write('')

                    app.run(debug=True, port=port, host=host)
                    break  # Exit the loop and end the program after running the app
                else:
                    print('Invalid option. Please try again.')

        # If the flag file exists, run the app without asking for an option
        else:
            print('Blog App is running...')
            local_ip = get_local_ip()
            # print(f' * Running on http://127.0.0.1:{port}/{blueprint_base_url}')
            # print(f' * Running on http://{local_ip}:{port}/{blueprint_base_url}')
            print(f' * Running on http://127.0.0.1:{port}')
            print(f' * Running on http://{local_ip}:{port}')

            app.run(debug=True, port=port, host=host)
    finally:
        # Delete the flag file when the app closes
        if os.path.exists(flag_file_path):
            os.remove(flag_file_path)
            # check if the flag file exists
            flag_file_path = os.path.join(basedir, 'run_once.flag')
            # debug print
            print('Flag file deleted, program ended.')
