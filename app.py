from flask import Flask
from dropzone_blueprint import dropzone
import subprocess
import os
import sys
import atexit
import shutil
from werkzeug.serving import is_running_from_reloader
from typing import Optional
from logging import Filter

app = Flask(__name__, static_url_path='/static')

# Register the blueprint with the main app
app.register_blueprint(dropzone, url_prefix='/')

app.config['MAX_CONTENT_LENGTH'] = 4 * 1024 * 1024 * 1024  # 4GB

node_process: Optional[subprocess.Popen] = None


def start_node_app():
    print("Entered start_node_app method...")
    global node_process

    # Check if there are any other instances running on port 4000 and shut them down
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


# if __name__ == '__main__':
#     print(f"Debug mode: {app.debug}")
#     print(f"Run from reloader: {os.environ.get('WERKZEUG_RUN_MAIN')}")
#     print(f"Flag file exists: {os.path.exists('node_server_flag.txt')}")
#
#     # Only start the Node.js app if the Flask app is not in debug mode
#     # or if the current run is from the reloader
#     # and if the flag file does not exist
#     # if (os.environ.get('WERKZEUG_RUN_MAIN') == 'true') and not os.path.exists('node_server_flag.txt'):
#     if (not app.debug or os.environ.get('WERKZEUG_RUN_MAIN') == 'true') and not os.path.exists('node_server_flag.txt'):
#         print('******Starting Node.js app...')
#         start_node_app()
#         atexit.register(stop_node_app)
#     # app.logger.addFilter(IgnoreSocketIOFilter())
#     # app.run(port=3000, host='0.0.0.0', debug=True)
#     app.run(ssl_context=('new_cert.pem', 'new_key_no_passphrase.pem'), port=4000, host='0.0.0.0', debug=True)


# if __name__ == '__main__':
#     print(f"Debug mode: {app.debug}")
#     print(f"Run from reloader: {os.environ.get('WERKZEUG_RUN_MAIN')}")
#
#     # Only start the Node.js app if the Flask app is not in debug mode
#     # or if the current run is from the reloader
#     if not app.debug or os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
#         print('******Starting Node.js app...')
#         start_node_app()
#         atexit.register(stop_node_app)
#     app.run(ssl_context=('new_cert.pem', 'new_key_no_passphrase.pem'), port=4000, host='0.0.0.0', debug=True)


# if __name__ == '__main__':
#     print(f"Debug mode: {app.debug}")
#     print(f"Run from reloader: {os.environ.get('WERKZEUG_RUN_MAIN')}")
#
#     # Only start the Node.js app if the Flask app is not in debug mode
#     # or if the current run is from the reloader
#     if not app.debug or (os.environ.get('WERKZEUG_RUN_MAIN') == 'true' and not os.path.exists('node_server_flag.txt')):
#         print('******Starting Node.js app...')
#         start_node_app()
#         atexit.register(stop_node_app)
#     app.run(ssl_context=('new_cert.pem', 'new_key_no_passphrase.pem'), port=4000, host='0.0.0.0', debug=True)


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
    app.run(ssl_context=('new_cert.pem', 'new_key_no_passphrase.pem'), port=4000, host='0.0.0.0', debug=True)
