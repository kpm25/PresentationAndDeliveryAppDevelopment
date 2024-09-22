from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from helper_file_methods import correct_ppt_filenames
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
        from blueprint_manager.blueprints.ppt_manager.routes import ppt_manager_bp ,blueprint_base_url

        # get USE_PPT_MANAGER_SERVER=true from .env file as a boolean
        use_ppt_manager_server = os.getenv('USE_PPT_MANAGER_SERVER') == 'true'

        # debug in cyan
        print(f"\033[96mUSE_PPT_MANAGER_SERVER: {use_ppt_manager_server}\033[0m")

        # Correct the filenames in the 'ppts' directory
        base_dir = os.path.abspath(os.path.dirname(__file__))
        ppts_dir = os.path.join(base_dir, 'blueprints', blueprint_base_url, 'static', blueprint_base_url, 'ppts')
        correct_ppt_filenames(ppts_dir)

        # also clean up ppts in microservice folder \ppt_manager_microservice\static\ppt_manager\ppts\
        parent_dir = os.path.dirname(base_dir)
        ppts_dir = os.path.join(parent_dir, 'ppt_manager_microservice', 'static', blueprint_base_url, 'ppts')
        #debug in orange
        print(f"\033[33mCorrecting ppt filenames in {ppts_dir}\033[0m")


        correct_ppt_filenames(ppts_dir)



        app.register_blueprint(core_bp, url_prefix='/blueprint')
        app.register_blueprint(auth_bp, url_prefix='/auth')
        app.register_blueprint(blog_bp, url_prefix='/blog')

        # Only register the ppt_manager_bp blueprint if USE_PPT_MANAGER_SERVER is false
        if not use_ppt_manager_server:
            app.register_blueprint(ppt_manager_bp, url_prefix='/ppt_manager')

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
