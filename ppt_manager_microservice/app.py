from flask import Flask, render_template, send_from_directory, abort, Blueprint, g, url_for
import os
from config import IS_BLUEPRINT

app = Flask(__name__, static_url_path='/static')

if IS_BLUEPRINT is False:
    print("IS_BLUEPRINT is False")
else:
    print("IS_BLUEPRINT is True")

blueprint_base_url = 'ppt_manager'

auth_bp = Blueprint(blueprint_base_url, __name__, template_folder='templates', static_folder='static')


@auth_bp.before_request
def before_request():
    g.blueprint_base_url = blueprint_base_url


# @app.route('/')
# def index():
#     webapps = []
#     # List all subdirectories in the ppt_manager folder
#     for folder in os.listdir('static/ppt_manager/ppt_web_apps'):
#         if os.path.isdir(os.path.join('static/ppt_manager/ppt_web_apps', folder)):
#             webapps.append(folder)
#     # return render_template('index.html', webapps=webapps)\
#     return render_template(f'{blueprint_base_url}/index.html',  webapps=webapps)


@app.route('/')
def index():
    webapps = []

    # get static folder path
    static_folder_path = os.path.join(app.root_path, app.static_folder)

    # Define the path to the ppt_manager folder
    ppt_webapp_path = os.path.join(static_folder_path, 'ppt_manager', 'ppt_web_apps')

    # Check if the directory exists
    if os.path.isdir(ppt_webapp_path):
        # List all subdirectories in the ppt_manager folder
        for folder in os.listdir(ppt_webapp_path):
            # if os.path.isdir(os.path.join(ppt_manager_path, folder)):
            # if os.path.isdir(os.path.join(static_folder, ppt_manager_path, folder)):
            if os.path.isdir(os.path.join(ppt_webapp_path, folder)):
                webapps.append(folder)
    else:
        print(f"Directory {ppt_webapp_path} does not exist.")

    return render_template(f'{blueprint_base_url}/index.html', webapps=webapps)


# @app.route('/download/<path:filename>')
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


@app.route('/download/<path:filename>')
def download(filename):

    #debug in cyan filename
    print("\033[96m" + filename + "\033[0m")

    # Get static folder path
    static_folder_path = os.path.join(app.root_path, app.static_folder)

    # Define the path to the ppt or pptx files
    # ppt_file_path =  os.path.join(static_folder_path, 'ppts')
    ppt_file_folder_path = os.path.join(static_folder_path,  blueprint_base_url, 'ppts' )

    #debug in pink
    print("\033[95m" + ppt_file_folder_path + "\033[0m")

    # Define the full path to the .pptx and .ppt files

    ppt_file_path = os.path.join(ppt_file_folder_path,  filename + '.ppt')
    pptx_file_path = os.path.join(ppt_file_folder_path,  filename + '.pptx')

    #debug in green the filepaths
    print("\033[92m" + pptx_file_path + "\033[0m")
    print("\033[92m" + ppt_file_path + "\033[0m")



    # Check if the .pptx file exists
    if os.path.isfile(pptx_file_path):
        # Debug message in yellow
        print("\033[93m" + filename + ".pptx" + "\033[0m")
        return send_from_directory(ppt_file_folder_path, filename + '.pptx')
    # Check if the .ppt file exists
    elif os.path.isfile(ppt_file_path):
        # Debug message in yellow
        print("\033[93m" + filename + ".ppt" + "\033[0m")
        return send_from_directory(ppt_file_folder_path, filename + '.ppt')
    else:
        abort(404)  # Return a 404 Not Found error if neither file exists


if __name__ == '__main__':
    # debug in yellow and pink
    print("\033[93m" + "******ppt_manager_microservice******" + "\033[0m")
    print("\033[95m" + "******ppt_manager_microservice******" + "\033[0m")
    app.run(debug=True, port=9876, host='0.0.0.0')
