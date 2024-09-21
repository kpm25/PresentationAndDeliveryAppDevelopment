from flask import render_template, send_from_directory, abort, Blueprint, g, url_for, current_app
import os
from .config import IS_BLUEPRINT

if IS_BLUEPRINT is False:
    print("IS_BLUEPRINT is False")
else:
    print("IS_BLUEPRINT is True")

blueprint_base_url = 'ppt_manager'

ppt_manager_bp = Blueprint(blueprint_base_url, __name__, template_folder='templates', static_folder='static')


@ppt_manager_bp.before_request
def before_request():
    g.blueprint_base_url = blueprint_base_url
    g.ppt_manager_base_url = blueprint_base_url


# @ppt_manager_bp.route('/')
# def index():
#     webapps = []
#     # List all subdirectories in the ppt_manager folder
#     for folder in os.listdir('static/ppt_manager/ppt_web_apps'):
#         if os.path.isdir(os.path.join('static/ppt_manager/ppt_web_apps', folder)):
#             webapps.append(folder)
#     # return render_template('index.html', webapps=webapps)\
#     return render_template(f'{blueprint_base_url}/index.html',  webapps=webapps)

# @ppt_manager_bp.route('/')
# def index():
#     webapps = []
#     # List all subdirectories in the blueprint specific folder
#     for folder in os.listdir(os.path.join('static', blueprint_base_url, 'ppt_web_apps')):
#         if os.path.isdir(os.path.join('static', blueprint_base_url, 'ppt_web_apps', folder)):
#             webapps.append(folder)
#     return render_template(f'{blueprint_base_url}/index.html',  webapps=webapps)

# @ppt_manager_bp.route('/')
# def index():
#     webapps = []
#     # List all subdirectories in the blueprint specific folder
#     base_dir = os.path.abspath(os.path.dirname(__file__))
#     target_dir = os.path.join(base_dir, 'static', blueprint_base_url, 'ppt_web_apps')
#     for folder in os.listdir(target_dir):
#         if os.path.isdir(os.path.join(target_dir, folder)):
#             webapps.append(folder)
#     return render_template(f'{blueprint_base_url}/index.html',  webapps=webapps)

@ppt_manager_bp.route('/')
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

    return render_template(f'{blueprint_base_url}/index.html', webapps=webapps)


# @ppt_manager_bp.route('/download/<path:filename>')
# def download(filename):
#     try:
#         # debug message in yellow
#         print("\033[93m" + filename + ".pptx" + "\033[0m")
#         return send_from_directory('static', filename + '.pptx')
#     except FileNotFoundError:
#         try:
#             # debug message in yellow
#             print("\033[93m" + filename + ".ppt" + "\033[0m")
#             return send_from_directory('static', filename + '.ppt')
#         except FileNotFoundError:
#             abort(404)  # Return a 404 Not Found error if neither file exists
#


@ppt_manager_bp.route('/download/<path:filename>')
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
