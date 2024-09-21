# run_blueprint_app.py to test blueprint app modules
from blueprint_manager.app import create_app

flask_app = create_app()

# Run the application
if __name__ == "__main__":
    flask_app.run(debug=True, port=9999, host='0.0.0.0')