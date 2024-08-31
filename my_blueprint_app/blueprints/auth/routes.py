# auth/routes.py
from flask import render_template, request, url_for, Blueprint, redirect, flash
from .utils import UserSampleData, StaticMethod
from .config import IS_BLUEPRINT
from flask import g
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.routing import url_parse

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
@login_required
def auth_index():
    print(f'inside auth/routes.py IS_BLUEPRINT: {IS_BLUEPRINT}')
    return render_template(f'{blueprint_base_url}/index.html', title='Authentication')


#mock login for now...
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('auth.auth_index'))
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        # Mock login for user with username 'abc' and password 'abc'
        if username == 'abc' and password == 'abc':
            # user = User.query.filter_by(username=username).first()
            # if user is None:
            #     # Create a mock user if it does not exist
            #     user = User(username=username, email='abc@example.com')
            #     db.session.add(user)
            #     db.session.commit()
            #login_user(user, remember=request.form.get('remember_me', False))
            login_user(User(username=username, email='abc@example.com'),
                       remember=request.form.get('remember_me', False))
            next_page = request.args.get('next')
            if not next_page or url_parse(next_page).netloc != '':
                next_page = url_for('auth.auth_index')
            return redirect(next_page)
        else:
            flash('Invalid username or password')
            return redirect(url_for('login'))
    return render_template('login.html', title='Sign In')

@auth_bp.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('auth_index'))


@auth_bp.route('/view_db')
@login_required
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
@login_required
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
@login_required
def clear_table():
    if User is not None:
        UserSampleData.delete_all()
    return redirect(url_for(f'{blueprint_base_url}.view_auth_db'))


@login_required
@auth_bp.route('/set_starting_data')
def set_starting_data():
    if User is not None:
        UserSampleData.add_sample_data()
    return redirect(url_for(f'{blueprint_base_url}.view_auth_db'))