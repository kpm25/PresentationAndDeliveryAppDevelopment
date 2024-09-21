# This file is the entry point of the application. blueprint_manager/shell_app.py is where the Flask application is created and configured.
# The create_app function is the entry point of the application. It creates the Flask application instance, configures it, and registers the blueprints.
# The create_app function is called in the manage.py file to run the application.
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate
from .config import Config

db = SQLAlchemy()


def create_app():
    # app = Flask(__name__, template_folder=Config.TEMPLATE_FOLDER)
    app = Flask(__name__, template_folder=Config.TEMPLATE_FOLDER, static_folder=Config.STATIC_FOLDER)
    # Rest of the code...
    app.config.from_object(Config)

    db.init_app(app)

    @app.context_processor
    def inject_is_blueprint():
        from blueprint_manager.blueprints.auth.config import IS_BLUEPRINT
        return dict(IS_BLUEPRINT=IS_BLUEPRINT)

    with app.app_context():
        from blueprint_manager.blueprints.core.routes import core_bp
        from blueprint_manager.blueprints.auth.routes import auth_bp
        from blueprint_manager.blueprints.blog.routes import blog_bp

        app.register_blueprint(core_bp, url_prefix='/blueprint')
        app.register_blueprint(auth_bp, url_prefix='/auth')
        app.register_blueprint(blog_bp, url_prefix='/blog')

        # Import the models after the blueprints
        from blueprint_manager.blueprints.auth.models import User
        from blueprint_manager.blueprints.blog.models import Post

        # Create the database tables
        db.create_all()

        # from blueprint_manager.blueprints.auth.utils import StaticMethod as AuthStaticMethod
        # from blueprint_manager.blueprints.blog.utils import StaticMethod as BlogStaticMethod

        # Add sample data only if the tables are empty
        # if not User.query.first() and not Post.query.first():
        #     AuthStaticMethod.execute(AuthStaticMethod.ADD_SAMPLE_DATA, app)
        #     BlogStaticMethod.execute(BlogStaticMethod.ADD_SAMPLE_DATA, app)

        # AuthStaticMethod.execute(AuthStaticMethod.DELETE_ALL, app)
        # BlogStaticMethod.execute(BlogStaticMethod.DELETE_ALL, app)

    return app
