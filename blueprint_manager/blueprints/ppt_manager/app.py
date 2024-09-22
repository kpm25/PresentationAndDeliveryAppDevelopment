from flask import Flask, render_template, send_from_directory, abort, Blueprint, g
import os
from dotenv import load_dotenv

blueprint_base_url = 'ppt_manager'

# ppt_manager_bp = Blueprint(blueprint_base_url, __name__, template_folder='templates', static_folder='static')

# create Flask app
ppt_app = Flask(__name__, template_folder='templates', static_folder='static')


@ppt_app.before_request
def before_request():
    g.blueprint_base_url = blueprint_base_url
    g.ppt_manager_base_url = blueprint_base_url


# Load the environment variables
load_dotenv()

# Get the IP_ADDRESS value from .env file
IP_ADDRESS = os.getenv('IP_ADDRESS')

# Get the PORT value from .env file
PPT_MANAGER_PORT = int(os.getenv('PPT_MANAGER_PORT'))  # Convert the port to an integer

# debug the IP_ADDRESS and PORT in green
print(f"\033[92mIP_ADDRESS: {IP_ADDRESS}, PORT: {PPT_MANAGER_PORT}\033[0m")

app = Flask(__name__, static_url_path='/static')


# @app.route('/')
# def index():
#     webapps = []
#     # List all subdirectories in the ppt_manager folder
#     for folder in os.listdir('/ppt_manager/ppt_web_apps'):
#         if os.path.isdir(os.path.join('/ppt_manager/ppt_web_apps', folder)):
#             webapps.append(folder)
#             print(f"\033[92mAdded {folder} to webapps\033[0m")  # Debugging statement
#     print(f"\033[92mWebapps: {webapps}\033[0m")  # Debugging statement
#     return render_template('index.html', webapps=webapps)
#
#
# @app.route('/download/<path:filename>')
# def download(filename):
#     try:
#         # debug message in yellow
#         print(f"\033[93mTrying to download {filename}.pptx\033[0m")
#         return send_from_directory('static/ppt_manager/ppts', filename + '.pptx')
#     except FileNotFoundError:
#         try:
#             # debug message in yellow
#             print(f"\033[93m.pptx file not found. Trying to download {filename}.ppt\033[0m")
#             return send_from_directory('static/ppt_manager/ppts', filename + '.ppt')
#         except FileNotFoundError:
#             print("\033[93mNeither .pptx nor .ppt file found. Returning 404 error.\033[0m")  # Debugging statement
#             abort(404)  # Return a 404 Not Found error if neither file exists

# @app.route('/')
# def index():
#     webapps = []
#     # List all subdirectories in the ppt_manager folder
#     for folder in os.listdir('static/ppt_manager/ppt_web_apps'):
#         if os.path.isdir(os.path.join('static/ppt_manager/ppt_web_apps', folder)):
#             webapps.append(folder)
#             print(f"\033[92mAdded {folder} to webapps\033[0m")  # Debugging statement
#     print(f"\033[92mWebapps: {webapps}\033[0m")  # Debugging statement
#     return render_template('index.html', webapps=webapps)

@ppt_app.route('/')
def index():
    webapps = []
    # List all subdirectories in the blueprint specific folder
    base_dir = os.path.abspath(os.path.dirname(__file__))
    # print(f"Base directory: {base_dir}")  # Debugging line

    target_dir = os.path.join(base_dir, 'static', blueprint_base_url, 'ppt_web_apps')
    # print(f"Target directory: {target_dir}")  # Debugging line
    for webapp_folder_name in os.listdir(target_dir):
        if os.path.isdir(os.path.join(target_dir, webapp_folder_name)):
            # Append the HTML file name to the webapps list
            # webapp_html_file = webapp_folder_name + '.html'

            webapps.append(webapp_folder_name)

    # print(f"Webapps: {webapps}")  # Debugging line

    return render_template(f'{blueprint_base_url}/index_ppt_manager_server.html', webapps=webapps)


# @app.route('/download/<path:filename>')
# def download(filename):
#     try:
#         # debug message in yellow
#         print(f"\033[93mTrying to download {filename}.pptx\033[0m")
#         return send_from_directory('static/ppt_manager/ppts', filename + '.pptx')
#     except FileNotFoundError:
#         try:
#             # debug message in yellow
#             print(f"\033[93m.pptx file not found. Trying to download {filename}.ppt\033[0m")
#             return send_from_directory('static/ppt_manager/ppts', filename + '.ppt')
#         except FileNotFoundError:
#             print("\033[93mNeither .pptx nor .ppt file found. Returning 404 error.\033[0m")  # Debugging statement
#             abort(404)  # Return a 404 Not Found error if neither file exists


@ppt_app.route('/download/<path:filename>')
def download(filename):
    # print("Attempting to serve file: " + filename)
    try:
        # debug message in yellow
        print("\033[93m" + filename + ".pptx" + "\033[0m")
        base_dir = os.path.abspath(os.path.dirname(__file__))
        full_file_path = os.path.join(base_dir, 'static', blueprint_base_url, 'ppts', filename + '.pptx')
        # print("Full file path: " + full_file_path)
        return send_from_directory(os.path.join(base_dir, 'static', blueprint_base_url, 'ppts'), filename + '.pptx')
    except FileNotFoundError:
        try:
            # debug message in yellow
            print("\033[93m" + filename + ".ppt" + "\033[0m")
            base_dir = os.path.abspath(os.path.dirname(__file__))
            full_file_path = os.path.join(base_dir, 'static', blueprint_base_url, 'ppts', filename + '.ppt')
            # print("Full file path: " + full_file_path)
            return send_from_directory(os.path.join(base_dir, 'static', blueprint_base_url, 'ppts'), filename + '.ppt')
        except FileNotFoundError:
            abort(404)  # Return a 404 Not Found error if neither file exists


if __name__ == '__main__':
    print("\033[92mStarting Flask app\033[0m")  # Debugging statement
    ppt_app.run(port=PPT_MANAGER_PORT, host='192.168.1.24' )
