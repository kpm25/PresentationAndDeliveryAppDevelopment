from flask import Flask, jsonify, request
from dropzone_blueprint import dropzone
from dotenv import load_dotenv
from helper_file_methods import generate_default_env
import subprocess
import os
import sys
import atexit
import shutil
import requests
from werkzeug.serving import is_running_from_reloader, run_simple
import ssl
from typing import Optional
import stat
from logging import Filter

# Generate the default .env file if it does not exist
generate_default_env()

# Load the environment variables
load_dotenv()

# Get the IP_ADDRESS value from .env file
IP_ADDRESS = os.getenv('IP_ADDRESS')

# Get the USE_HTTPS value from .env file
# USE_HTTPS = os.getenv('USE_HTTPS', 'false')
USE_HTTPS = os.getenv('USE_HTTPS', 'false').lower() == 'true'

# NODE_SERVER_URL = f"{protocol}://192.168.1.24:5000"
# FLASK_SERVER_URL = f"{protocol}://192.168.1.24:4000"
# protocol = 'https' if USE_HTTPS == 'true' else 'http'
protocol = 'https' if USE_HTTPS else 'http'
# NODE_SERVER_URL = f"{protocol}:{os.getenv('NODE_SERVER_URL')}"
# FLASK_SERVER_URL = f"{protocol}:{os.getenv('FLASK_SERVER_URL')}"
# CONTENT_SERVER_URL = f"http:{os.getenv('CONTENT_SERVER_URL')}"

# Replace $IP_ADDRESS with the actual IP address in the environment variables
NODE_SERVER_URL = f"{protocol}:{os.getenv('NODE_SERVER_URL').replace('$IP_ADDRESS', IP_ADDRESS)}"
FLASK_SERVER_URL = f"{protocol}:{os.getenv('FLASK_SERVER_URL').replace('$IP_ADDRESS', IP_ADDRESS)}"
CONTENT_SERVER_URL = f"http:{os.getenv('CONTENT_SERVER_URL').replace('$IP_ADDRESS', IP_ADDRESS)}"


# content folder name
CONTENT_FOLDER = os.getenv('CONTENT_FOLDER')

# Define the Content port
CONTENT_PORT = os.getenv('CONTENT_PORT')
# Define the Content host
# CONTENT_HOST = os.getenv('CONTENT_HOST')
CONTENT_HOST = os.getenv('CONTENT_HOST').replace('$IP_ADDRESS', IP_ADDRESS)

# Keep a reference to the server process
server_process = None
# boolean flag to check if the server is running
content_server_running = False

# if USE_HTTPS == 'true':
if USE_HTTPS:
    # If USE_HTTPS is true, use SSL context
    context = ssl.SSLContext(ssl.PROTOCOL_SSLv23)
    context.load_cert_chain(certfile='new_cert.pem', keyfile='new_key_no_passphrase.pem')
else:
    # If USE_HTTPS is not true, set context to None
    context = None

# this has been moved to the create_app method in the app.py file for testing adding blueprints
# app = Flask(__name__, static_url_path='/static')

# Import the create_app function from blueprint_manager.app to test the blueprint app modules
from blueprint_manager.app import create_app
from flask_login import LoginManager, login_required, UserMixin
from blueprint_manager.blueprints.auth.models import User

login_manager = LoginManager()


# Create the Flask application instance
app = create_app()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# Register the blueprint with the main app
app.register_blueprint(dropzone, url_prefix='/')


app.config['MAX_CONTENT_LENGTH'] = 4 * 1024 * 1024 * 1024  # 4GB
app.config['SECRET_KEY'] = 'your-secret-key'

login_manager.init_app(app)

node_process: Optional[subprocess.Popen] = None


# route to give the server url
# @app.route('/config')
# def get_config():
#     print(f"Node server url: {os.getenv('NODE_SERVER_URL')} Flask server url: {os.getenv('FLASK_SERVER_URL')}")
#     return jsonify(nodeServerUrl=os.getenv('NODE_SERVER_URL'), flaskServerUrl=os.getenv('FLASK_SERVER_URL'))

# route to give the server url
@app.route('/config')
def get_config():
    print(f"Node server url: {NODE_SERVER_URL} Flask server url: {FLASK_SERVER_URL}")
    return jsonify(nodeServerUrl=NODE_SERVER_URL, flaskServerUrl=FLASK_SERVER_URL)


def print_permissions(path):
    print(f"Permissions for {path}, mode set is: {stat.filemode(os.stat(path).st_mode)}")


# routes for the content server
@app.route('/content_server', methods=['POST'])
def start_content_server():
    global server_process
    global content_server_running
    secret_key = request.json.get('secret_key')
    print(f"Secret key: {secret_key}")
    # does it match the secret key??
    if secret_key == 'abc123':
        print(f"Secret key matches")

        if server_process and server_process.poll() is None:
            return jsonify({'message': 'Server already started, you need to stop and restart it to view again...',
                            'url': f"{CONTENT_SERVER_URL}"}), 200

        # TODO: FIX THIS BUG, so that the server can be reviewed while running
        # if server_process and server_process.poll() is None:
        #     # Check if the server is still accessible
        #     try:
        #         response = requests.get(CONTENT_SERVER_URL)
        #         response.raise_for_status()
        #     except requests.exceptions.RequestException as e:
        #         print(f"Error accessing server: {e}")
        #         server_process = None  # Reset the server process so it can be started again
        #     else:
        #         return jsonify({'message': 'Server already started', 'url': f"{CONTENT_SERVER_URL}"}), 200

        # TODO: ALSO LOOK AT THIS CODE FOR POSSIBLE SOLUTIONS
        # if server_process and server_process.poll() is None:
        #     try:
        #         response = requests.post('http://localhost:4000/stop_content_server', json={'secret_key': secret_key}, timeout=5)
        #         response.raise_for_status()
        #     except requests.exceptions.RequestException as e:
        #         print(f"Error stopping server: {e}")
        #         return jsonify({'message': 'Error stopping server', 'error': str(e)}), 500
        #     else:
        #         server_process = None

        if os.path.isdir(CONTENT_FOLDER):
            print_permissions(CONTENT_FOLDER)
            for root, dirs, files in os.walk(CONTENT_FOLDER):
                for name in dirs:
                    print_permissions(os.path.join(root, name))
                for name in files:
                    print_permissions(os.path.join(root, name))

            print(f"CONTENT_FOLDER exists: {os.listdir(CONTENT_FOLDER)}")
            server_process = subprocess.Popen(['python', '-m', 'http.server', CONTENT_PORT, '--bind', CONTENT_HOST],
                                              cwd=CONTENT_FOLDER, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            if server_process.returncode is not None:
                stdout, stderr = server_process.communicate()
                print(f"stdout: {stdout.decode('utf-8')}")
                print(f"stderr: {stderr.decode('utf-8')}")
                return jsonify(
                    {'message': 'Error starting Content Folder Http Server', 'stdout': stdout.decode('utf-8'),
                     'stderr': stderr.decode('utf-8')}), 500
            else:
                content_server_running = True
                return jsonify({'message': 'Content Folder Http Server started', 'url': f"{CONTENT_SERVER_URL}"}), 200
        else:
            return jsonify({'message': f'Directory \'{CONTENT_FOLDER}\' does not exist'}), 400

    else:
        return jsonify({'message': 'Invalid secret key'}), 403


# testing routes to view the content folder as a raw python http server
@app.route('/stop_content_server', methods=['POST'])
def stop_content_server():
    global server_process
    global content_server_running
    secret_key = request.json.get('secret_key')
    if secret_key == 'abc123':
        if server_process:
            server_process.terminate()
            server_process = None
            content_server_running = False
            return jsonify({'message': 'Content Folder Http Server stopped'}), 200
        else:
            return jsonify({'message': 'Content Folder Http Server is not running'}), 400
    else:
        return jsonify({'message': 'Invalid secret key'}), 403


# method to stop the content server
def stop_content_http_server():
    global server_process
    if server_process:
        print('Stopping content http server...')
        server_process.terminate()
        server_process = None
    else:
        print('...Content http server was not running when stop was called...')


# route to check if the content server is running
@app.route('/content_server_status', methods=['GET'])
def get_content_server_status():
    global content_server_running
    # print in yellow color bold
    print(f"\033[93mContent server running: {content_server_running}\033[0m")
    return jsonify({'content_server_running': content_server_running}), 200


def start_node_app():
    print("Entered start_node_app method...")
    global node_process

    # Check if there are any other instances running on port 5000 and shut them down
    result = subprocess.run('netstat -ano | findstr :5000', shell=True, stdout=subprocess.PIPE)
    lines = result.stdout.decode().split('\n')
    for line in lines:
        if 'LISTENING' in line:
            pid = line.strip().split()[-1]
            print(f'Killing process with PID: {pid}')
            subprocess.run(f'taskkill /F /PID {pid}', shell=True)

    # Get the current directory
    current_dir = os.path.dirname(os.path.realpath(__file__))

    # The path to your Node.js app
    node_app_path = os.path.join(current_dir, 'my_nodejs_app', 'app.js')

    # The path to the ansi_text.js file in the Node.js app
    ansi_text_path = os.path.join(current_dir, 'my_nodejs_app', 'ansi_text.js')

    # The destination path in the static/dependencies directory
    dest_path = os.path.join(current_dir, 'static', 'dependencies', 'ansi_text.js')

    # Copy the ansi_text.js file to the static/dependencies directory
    shutil.copyfile(ansi_text_path, dest_path)

    # The command to start your Node.js app
    command = f"node {node_app_path}"

    # Start the Node.js app as a subprocess
    node_process = subprocess.Popen(command, shell=True)

    # Create a flag file to indicate that the Node.js server is running
    with open('node_server_flag.txt', 'w') as f:
        f.write('Node.js server is running')


def stop_node_app():
    global node_process
    if node_process:
        print('Stopping Node.js app...')
        node_process.terminate()

    # Remove the flag file to indicate that the Node.js server has stopped
    if os.path.exists('node_server_flag.txt'):
        os.remove('node_server_flag.txt')

    # Get the current directory
    # current_dir = os.path.dirname(os.path.realpath(__file__))
    # Use os.path.realpath(__file__) if __file__ is defined, otherwise use os.getcwd()
    current_dir = os.path.dirname(os.path.realpath(__file__)) if '__file__' in globals() else os.getcwd()

    # The destination path in the static/dependencies directory
    dest_path = os.path.join(current_dir, 'static', 'dependencies', 'ansi_text.js')

    # Remove the ansi_text.js file from the static/dependencies directory
    if os.path.exists(dest_path):
        os.remove(dest_path)


# class IgnoreSocketIOFilter(Filter):
#     def filter(self, record):
#         return '/socket.io/' not in record.getMessage()


if __name__ == '__main__':
    print(f"Debug mode: {app.debug}")
    print(f"Run from reloader: {os.environ.get('WERKZEUG_RUN_MAIN')}")
    print(f"Flag file exists: {os.path.exists('node_server_flag.txt')}")

    # does node server flag exist??
    if os.path.exists('node_server_flag.txt'):
        print("Node server flag exists")
    else:
        print("Node server flag does not exist")

    # Only start the Node.js app if the Flask app is not in debug mode
    # or if the current run is from the reloader
    if not app.debug or (os.environ.get('WERKZEUG_RUN_MAIN') == 'true' and not os.path.exists('node_server_flag.txt')):
        print('******Starting Node.js app...')
        start_node_app()
        atexit.register(stop_node_app)
    # app.run(ssl_context=('new_cert.pem', 'new_key_no_passphrase.pem'), port=4000, host='0.0.0.0', debug=True)
    # Run the Flask app with the appropriate context
    atexit.register(stop_content_http_server)
    # run_simple('0.0.0.0', 4000, app, ssl_context=context, use_reloader=True, use_debugger=True)
    run_simple(IP_ADDRESS, 4000, app, ssl_context=context, use_reloader=True, use_debugger=True)

