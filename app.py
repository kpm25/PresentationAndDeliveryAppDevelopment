from flask import Flask
from dropzone_blueprint import dropzone
import subprocess
import os
import atexit
from werkzeug.serving import is_running_from_reloader
from typing import Optional
from logging import Filter

app = Flask(__name__, static_url_path='/static')

# Register the blueprint with the main app
app.register_blueprint(dropzone, url_prefix='/')

node_process: Optional[subprocess.Popen] = None


def start_node_app():
    global node_process

    # Check if there are any other instances running on port 4000 and shut them down
    result = subprocess.run('netstat -ano | findstr :4000', shell=True, stdout=subprocess.PIPE)
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


# class IgnoreSocketIOFilter(Filter):
#     def filter(self, record):
#         return '/socket.io/' not in record.getMessage()


if __name__ == '__main__':
    # Only start the Node.js app if the Flask app is not in debug mode
    # or if the current run is from the reloader
    # and if the flag file does not exist
    if (not app.debug or os.environ.get('WERKZEUG_RUN_MAIN') == 'true') and not os.path.exists('node_server_flag.txt'):
        start_node_app()
        atexit.register(stop_node_app)
        # app.logger.addFilter(IgnoreSocketIOFilter())
    app.run(port=3000, host='0.0.0.0', debug=True)
