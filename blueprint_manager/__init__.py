# # __init__.py
#
# from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
# from .config import Config
#
# db = SQLAlchemy()
#
# def create_app(config_name='default'):
#     app = Flask(__name__, template_folder='./blueprint_manager/templates', static_folder='./blueprint_manager/static')
#     app.config.from_object(Config)
#
#     # Initialize SQLAlchemy with the app
#     db.init_app(app)
#
#     # Import and register blueprints
#     from .blueprints.auth import auth_bp
#     from .blueprints.blog import blog_bp
#
#     app.register_blueprint(auth_bp, url_prefix='/auth')
#     app.register_blueprint(blog_bp, url_prefix='/blog')
#
#     with app.app_context():
#         setup_database(app)
#
#     return app
#
# def setup_database(app):
#     # Import models to ensure they are registered with db
#     from .models import MainModel, AuthUser, BlogPost
#     from .utils import UserSampleData, PostSampleData, get_blueprint_base_url
#
#     # Create tables for main database
#     db.create_all()
#
#     # Add sample data
#     UserSampleData.add_sample_data()
#     PostSampleData.add_sample_data()
#     print('Sample data added.')