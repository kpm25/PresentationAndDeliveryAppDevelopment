from flask import Flask
from blueprint_module import blueprint

app = Flask(__name__,  static_url_path='/static')

# Register the blueprint with the main app
app.register_blueprint(blueprint)

if __name__ == '__main__':
    app.run(port=9876, debug=True)
