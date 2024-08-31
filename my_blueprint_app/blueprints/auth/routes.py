# auth/routes.py
from flask import render_template, request, url_for, Blueprint, redirect
from .utils import UserSampleData, StaticMethod
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

blueprint_base_url = 'auth'

auth_bp = Blueprint(blueprint_base_url, __name__, template_folder='templates')


@auth_bp.before_request
def before_request():
    g.blueprint_base_url = blueprint_base_url


@auth_bp.route('/')
def auth_index():
    print(f'inside auth/routes.py IS_BLUEPRINT: {IS_BLUEPRINT}')
    return render_template(f'{blueprint_base_url}/index.html', title='Authentication')


@auth_bp.route('/view_db')
def view_auth_db():
    if User is not None:
        users = User.query.all()
        if IS_BLUEPRINT is False:
            user_data = User.query.all()
            print(f'inside auth/routes.py IS_BLUEPRINT: {IS_BLUEPRINT}\n user_data: {user_data}')
    else:
        users = []
    return render_template(f'{blueprint_base_url}/view_db.html', title='Auth Database', data=users)


# create a new user
@auth_bp.route('/create', methods=['GET', 'POST'])
def create():
    # user above html form to create a new user
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        new_user = User(username=username, email=email)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for(f'{blueprint_base_url}.view_auth_db'))
    return render_template(f'{blueprint_base_url}/create.html', title='Create User')


@auth_bp.route('/clear_table')
def clear_table():
    if User is not None:
        UserSampleData.delete_all()
    return redirect(url_for(f'{blueprint_base_url}.view_auth_db'))


@auth_bp.route('/set_starting_data')
def set_starting_data():
    if User is not None:
        UserSampleData.add_sample_data()
    return redirect(url_for(f'{blueprint_base_url}.view_auth_db'))