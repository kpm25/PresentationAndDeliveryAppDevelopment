from flask import Flask, Blueprint, request, jsonify, render_template, redirect, url_for, g, current_app, send_file
from helper_file_methods import is_audio, is_image, is_compressed, is_video, save_file, setup_lesson_folders
from werkzeug.utils import secure_filename
import datetime
import json
import os
from datetime import datetime

print(f'...current working time: { datetime.now().strftime('%B %d, %Y at %I:%M:%S %p')}')

# Create a Blueprint object
dropzone = Blueprint('dropzone', __name__)

# Define the upload folder relative to the project root
UPLOAD_FOLDER = 'LessonFolders'
valid_lessons = ['lesson1', 'lesson2', 'lesson3']
valid_file_types = ['zip', 'mp4', 'pptx', 'jpg']

# Initialize an empty list to store the history logs
history_logs = []


@dropzone.route('/')
def index():
    # if the folder structure is not set up, set it up
    if not os.path.exists('LessonFolders'):
        setup_lesson_folders()
        # debug cyan
        print("\033[92m" + '***Setting up the lesson folders    ')
    else:
        # debug cyan
        print("\033[32m" + '***Lesson folders structure already exists')
    return render_template('dropzone.html')


@dropzone.route('/display', methods=['GET'])
def display_files():
    # Define your semester, grade, week, and lesson here
    semester = 'Semester1'
    grade = 'Grade1'
    week = 'Week1'
    lesson = 'Lesson1'
    result = list_files(semester, grade, week, lesson)

    # Define your lesson labels here
    lesson_labels = ['Label1', 'Label2', 'Label3']  # Replace with your actual lesson labels

    return render_template('display.html', result=result, lesson_labels=lesson_labels)


@dropzone.route('/list_files/<semester>/<grade>/<week>/<lesson>', methods=['GET'])
def list_files(semester, grade, week, lesson):
    _dir = os.path.join(UPLOAD_FOLDER, semester, grade, week, lesson)
    current_app.logger.info(f'Searching directory: {_dir}')
    if not os.path.exists(_dir):
        os.makedirs(_dir)
    files = []
    for root, dirs, filenames in os.walk(_dir):
        for filename in filenames:
            file_path = os.path.join(root, filename)
            files.append({'name': filename, 'path': file_path})
            current_app.logger.info(f'Found file: {file_path}')

    file_count = len(files)
    # if no files are found, return a message
    if not files:
        return jsonify({'message': '❌ No files found!', 'directory': _dir, 'file_count': file_count})  # , 404
    else:
        return jsonify({'message': '✔️Files Found!', 'files': files, 'directory': _dir, 'file_count': file_count}), 200


# test route to display dropzone.html
# @blueprint.route('/dropzone_test')
# def dropzone_test():
#     #if the folder structure is not set up, set it up
#     if not os.path.exists('LessonFolders'):
#         setup_lesson_folders()
#         #debug cyan
#         print("\033[92m" + '***Setting up the lesson folders    ')
#     else:
#         #debug cyan
#         print("\033[32m" + '***Lesson folders structure already exists')
#     return render_template('dropzone.html')


@dropzone.route('/dropzone_lessons', methods=['POST'])
def dropzone_lessons():
    # Handle the file upload here
    file = request.files['file']
    # Save the file or process it as needed
    # ...
    return 'File uploaded successfully'


# @dropzone.route('/dropzone_lessons/<path:file_path>', methods=['POST'])
# def dropzone_lessons_path(file_path):
#     print('\n\nfilename received: ', file_path + '\n\n')
#     # Extract the file name and extension
#     file_name = os.path.basename(file_path)
#     file_extension = os.path.splitext(file_path)[1]
#     print(f"\033[33m file extension: {file_extension}")
#
#     # Extract the extra information from the request headers
#     grade = request.headers.get('X-Grade')
#     semester = request.headers.get('X-Semester')
#     week = request.headers.get('X-Week')
#     lesson = request.headers.get('X-Lesson')
#     # xhr.setRequestHeader('X-File-Prefix', filePrefix);
#     file_prefix = request.headers.get('X-File-Prefix')
#
#     # Reset the variables to their initial values
#     grade = grade.split(',')[0]
#     semester = semester.split(',')[0]
#     week = week.split(',')[0]
#     lesson = lesson.split(',')[0]
#     file_prefix = file_prefix.split(',')[0]
#
#     # Map the lesson to the correct folder name
#     if lesson == 'TP':
#         lesson_folder = 'TeachPlans'
#     elif lesson == 'MS':
#         lesson_folder = 'MiscMaterials'
#     else:
#         lesson_number = lesson[1:]  # Extract the number from the lesson variable
#         lesson_folder = 'Lesson' + lesson_number
#
#     dest_folder = None
#     # Iterate over each file in the request
#     for file_key in request.files:
#         file = request.files[file_key]
#         if file:
#             # Secure the filename
#             secure_file_name = secure_filename(file.filename)
#
#             # Update the file name for each file in the request
#             file_name = secure_file_name
#
#             # Determine the type of the file
#             if is_audio(file_name):
#                 file_type = 'audio'
#             elif is_image(file_name):
#                 file_type = 'image'
#             elif is_compressed(file_name):
#                 file_type = 'compressed'
#             elif is_video(file_name):
#                 file_type = 'video'
#             else:
#                 file_type = ''
#
#             print(f"Determined file type: {file_type}")
#
#             # Construct the full path to the destination folder
#             # if file_type:
#             #     dest_folder = os.path.join('LessonFolders', 'Semester' + semester[1:], 'Grade' + grade[1:],
#             #                                'Week' + week[1:], lesson_folder, file_type)
#             # else:
#             #     dest_folder = os.path.join('LessonFolders', 'Semester' + semester[1:], 'Grade' + grade[1:],
#             #                                'Week' + week[1:], lesson_folder)
#             # In dropzone_lessons_path function
#             dest_folder = os.path.join('LessonFolders', 'Semester' + semester[1:], 'Grade' + grade[1:],
#                                        'Week' + week[1:], lesson_folder)
#
#             os.makedirs(dest_folder, exist_ok=True)
#
#             # Construct the new filename
#             new_file_name = f'{grade}_{semester}_{week}_{lesson}_{secure_file_name}'
#             print(f'New file name: {new_file_name}')
#
#             # Save the file to the destination folder
#             file_path = os.path.join(dest_folder, new_file_name)
#             print(f'Saving file to: {file_path}')
#             # file.save(file_path)
#
#             # Save the file to the appropriate subfolder
#             filename_with_prefix = save_file(file, dest_folder, file_type, file_prefix)
#
#     # Redirect to the /dropzone_lessons_result route
#     # return redirect(url_for('blueprint.dropzone_lessons_result'))
#     return jsonify(
#         {'message': '#####Files uploaded successfully', 'file_path': dest_folder}), 200


@dropzone.route('/dropzone_lessons/<path:file_path>', methods=['POST'])
def dropzone_lessons_path(file_path):
    print('\n\nfilename received: ', file_path + '\n\n')
    # Extract the file name and extension
    file_name = os.path.basename(file_path)
    file_extension = os.path.splitext(file_path)[1]
    print(f"\033[33m file extension: {file_extension}")

    # Extract the extra information from the request headers
    grade = request.headers.get('X-Grade')
    semester = request.headers.get('X-Semester')
    week = request.headers.get('X-Week')
    lesson = request.headers.get('X-Lesson')
    # xhr.setRequestHeader('X-File-Prefix', filePrefix);
    file_prefix = request.headers.get('X-File-Prefix')

    # Reset the variables to their initial values
    grade = grade.split(',')[0]
    semester = semester.split(',')[0]
    week = week.split(',')[0]
    lesson = lesson.split(',')[0]
    file_prefix = file_prefix.split(',')[0]

    # Map the lesson to the correct folder name
    if lesson == 'TP':
        lesson_folder = 'TeachPlans'
    elif lesson == 'MS':
        lesson_folder = 'MiscMaterials'
    else:
        lesson_number = lesson[1:]  # Extract the number from the lesson variable
        lesson_folder = 'Lesson' + lesson_number

    dest_folder = None
    # Initialize lists to store all files and duplicate files
    all_files = []
    duplicate_files = []
    accepted_files = []  # Initialize the list of accepted files

    # Iterate over each file in the request
    for file_key in request.files:
        file = request.files[file_key]
        if file:
            # Secure the filename
            secure_file_name = secure_filename(file.filename)

            # Update the file name for each file in the request
            file_name = secure_file_name

            # Determine the type of the file
            if is_audio(file_name):
                file_type = 'audio'
            elif is_image(file_name):
                file_type = 'image'
            elif is_compressed(file_name):
                file_type = 'compressed'
            elif is_video(file_name):
                file_type = 'video'
            else:
                file_type = ''

            print(f"Determined file type: {file_type}")

            # Construct the full path to the destination folder
            dest_folder = os.path.join('LessonFolders', 'Semester' + semester[1:], 'Grade' + grade[1:],
                                       'Week' + week[1:], lesson_folder)

            os.makedirs(dest_folder, exist_ok=True)

            # Construct the new filename
            # Construct the new filename
            new_file_name = f'{grade}_{semester}_{week}_{lesson}_{secure_file_name}'
            print(f'New file name: {new_file_name}')

            # Save the file to the destination folder if not a duplicate
            file_path_to_check = os.path.join(dest_folder, file_type, new_file_name)
            all_files.append(file_path_to_check)
            print(f'\033[92mFile path to check: {file_path_to_check}')
            if os.path.exists(file_path_to_check):
                duplicate_files.append(file_path_to_check)  # Add the full path to the list
                print(f'File already exists: {file_path_to_check}')
            else:
                print(f'Saving file to: {file_path}')
                # Save the file to the appropriate subfolder
                filename_with_prefix = save_file(file, dest_folder, file_type, file_prefix)
                accepted_files.append(new_file_name)  # Add the file to the list of accepted files

    # print in pink all files
    print("\033[95m" + '***All files: ', all_files)
    # print in pink duplicate files
    print("\033[95m" + '***Duplicate files: ', duplicate_files)

    # Check if all files are duplicates
    if all_files == duplicate_files:
        # debug in pink
        print("\033[95m" + '***All files are duplicates')
        return jsonify({'message': 'All files are duplicates'}), 409
    else:
        # Remove duplicates from the list of all files
        accepted_files = [file for file in all_files if file not in duplicate_files]
        return jsonify({'message': 'Files uploaded successfully', 'file_path': dest_folder,
                        'accepted_files': accepted_files, 'duplicate_files': duplicate_files}), 200


@dropzone.route('/dropzone_lessons_result')
def dropzone_lessons_result():
    # Retrieve the file name and extension from where you stored it

    # Render a template or return a response
    return render_template('dropzone_lessons_result.html')


@dropzone.route('/append_log', methods=['POST'])
def log_history():
    # Get the path from the request data
    path = request.json.get('path')
    filecount = request.json.get('filecount')
    # Get the current timestamp
    # timestamp = request.json.get('timestamp')  # datetime.datetime.now().isoformat()
    # Get the current timestamp
    timestamp = datetime.now().strftime('%B %d, %Y at %I:%M:%S %p')

    # if filecount == 1 then it is for a single file and we can check if the file exists, if so ignore
    # if filecount == 1:
    #     if os.path.exists(path):
    #         # debug in cyan
    #         print("\033[92m" + '***File already exists: ', path)
    #         return jsonify({'message': 'File already exists'}), 409

    # Create a dictionary for the log entry
    log_entry = {'path': path, 'timestamp': timestamp, 'filecount': filecount}

    # Write the new log entry at the end of the file
    with open('history.log', 'a') as f:
        f.write(json.dumps(log_entry) + '\n')  # Convert the dictionary into a JSON string

    print('message: Log entry added successfully: ', log_entry)

    # Return a success response
    return jsonify({'message': 'Log entry added successfully'}), 200


# get history logs
@dropzone.route('/get_logs', methods=['GET'])
def get_logs():
    # Get the history logs
    result = get_history_logs()

    # print('result: ', result)

    return jsonify(result), 200


# helper method to get the history log and put it in the history_logs list
# def get_history_logs():
#     logs = []
#     with open('history.log', 'r') as f:
#         for log_entry in f:
#             try:
#                 path, timestamp, filecount = log_entry.split(', ')
#                 timestamp = timestamp.replace('Timestamp: ', '')
#                 filecount = filecount.replace('File Count: ', '').rstrip('\n')
#                 logs.append({'path': path, 'timestamp': timestamp, 'filecount': filecount})
#             except ValueError:
#                 print(f'Invalid log entry format: {log_entry}')
#     return logs


def get_history_logs():
    logs = []
    with open('history.log', 'r') as f:
        for log_entry in f:
            try:
                log_entry_dict = json.loads(log_entry)
                logs.append(log_entry_dict)
            except json.JSONDecodeError:
                print(f'Invalid log entry format: {log_entry}')
    return logs[::-1]  # Reverse the list before returning it


@dropzone.route('/clear_history_log', methods=['DELETE'])
def clear_history_log():
    # Clear the history log file if it exists
    if os.path.exists('history.log'):
        with open('history.log', 'w') as f:
            f.write('')
        return jsonify({'message': 'History log cleared successfully'}), 200
    else:
        return jsonify({'message': 'History log not found'}), 404


@dropzone.route('/delete_file', methods=['DELETE'])
def delete_file():
    # Get the path from the request data
    path = request.json.get('path')

    print(f"Deleting file at path: {path}")

    # Check if the file exists
    if os.path.exists(path):
        # Delete the file
        os.remove(path)
        return jsonify({'message': 'File deleted successfully'}), 200
    else:
        return jsonify({'message': 'File not found'}), 404


#route /page1 display image1.html
@dropzone.route('/image1')
def image1():
    return render_template('image1.html')

# route /page2 display image2.html
@dropzone.route('/image2')
def image2():
     return render_template('image2.html')


@dropzone.route('/get_file')
def get_file():
    path = request.args.get('path')
    return send_file(os.path.abspath(path), as_attachment=True)
