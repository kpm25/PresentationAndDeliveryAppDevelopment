import os
import math
import subprocess
import platform


# def setup_folder_structure():
#     lesson_folders = ['lesson1', 'lesson2', 'lesson3']
#     file_types = ['zip', 'video', 'audio', 'image']
#
#     base_dir = 'lessons'
#     os.makedirs(base_dir, exist_ok=True)
#
#     for lesson in lesson_folders:
#         lesson_path = os.path.join(base_dir, lesson)
#         os.makedirs(lesson_path, exist_ok=True)
#
#         for file_type in file_types:
#             type_path = os.path.join(lesson_path, file_type)
#             os.makedirs(type_path, exist_ok=True)


# def setup_lesson_folders():
#     semesters = ['Semester1', 'Semester2']
#     grades = ['Grade' + str(i) for i in range(1, 6)]
#     weeks = ['Week' + str(i) for i in range(1, 18)]
#     lessons = ['Lesson' + str(i) for i in range(1, 7)] + ['TeachPlans', 'MiscMaterials' ]
#     file_types =  ['zip', 'video', 'audio', 'image']
#
#     base_dir = 'LessonFolders'
#     os.makedirs(base_dir, exist_ok=True)
#
#     for semester in semesters:
#         semester_path = os.path.join(base_dir, semester)
#         os.makedirs(semester_path, exist_ok=True)
#
#         for grade in grades:
#             grade_path = os.path.join(semester_path, grade)
#             os.makedirs(grade_path, exist_ok=True)
#
#             for week in weeks:
#                 week_path = os.path.join(grade_path, week)
#                 os.makedirs(week_path, exist_ok=True)
#
#                 for lesson in lessons:
#                     lesson_path = os.path.join(week_path, lesson)
#                     os.makedirs(lesson_path, exist_ok=True)
#
#                     for file_type in file_types:
#                         type_path = os.path.join(lesson_path, file_type)
#                         os.makedirs(type_path, exist_ok=True)

# This version of the function will create a directory structure like this:
# LessonFolders/
#     Semester1/
#         Grade1/
#             Week1/
#                 Lesson1/
#                     zip/
#                     video/
#                     audio/
#                     image/


def setup_lesson_folders():
    semesters = ['Semester1', 'Semester2']
    grades = ['Grade' + str(i) for i in range(1, 6)]
    weeks = ['Week' + str(i) for i in range(1, 18)]
    lessons = ['Lesson' + str(i) for i in range(1, 7)] + ['TeachPlans', 'MiscMaterials']

    base_dir = 'LessonFolders'
    os.makedirs(base_dir, exist_ok=True)

    for semester in semesters:
        semester_path = os.path.join(base_dir, semester)
        os.makedirs(semester_path, exist_ok=True)

        for grade in grades:
            grade_path = os.path.join(semester_path, grade)
            os.makedirs(grade_path, exist_ok=True)

            for week in weeks:
                week_path = os.path.join(grade_path, week)
                os.makedirs(week_path, exist_ok=True)

                for lesson in lessons:
                    lesson_path = os.path.join(week_path, lesson)
                    os.makedirs(lesson_path, exist_ok=True)

    # Count the total number of directories using os.walk and a list comprehension
    dir_count = sum([len(dirs) for _, dirs, _ in os.walk(base_dir)])

    print(f'Total directory count in setup_lesson_folders: {dir_count}')


def setup_lesson_folders_min():
    semesters = ['Semester1', 'Semester2']
    grades = ['Grade' + str(i) for i in range(1, 6)]

    base_dir = 'LessonFolders'
    os.makedirs(base_dir, exist_ok=True)

    for semester in semesters:
        semester_path = os.path.join(base_dir, semester)
        os.makedirs(semester_path, exist_ok=True)

        for grade in grades:
            grade_path = os.path.join(semester_path, grade)
            os.makedirs(grade_path, exist_ok=True)

    # Count the total number of directories using os.walk and a list comprehension
    dir_count = sum([len(dirs) for _, dirs, _ in os.walk(base_dir)])

    print(f'Total directory count in setup_lesson_folders_min: {dir_count}')


def check_all_grade_folders_exist():
    base_dir = 'LessonFolders'
    semesters = ['Semester1', 'Semester2']
    grades = ['Grade' + str(i) for i in range(1, 6)]

    for semester in semesters:
        for grade in grades:
            grade_folder_path = os.path.join(base_dir, semester, grade)
            if not os.path.exists(grade_folder_path):
                print(f"Folder {grade_folder_path} does not exist.")
                return False
    print("All grade folders exist under both Semester1 and Semester2.")
    return True


# This version of the function will create a directory structure like this:
# LessonFolders/
#     Semester1/
#         Grade1/
#             Week1/
#                 Lesson1/
#                 ...
#             ...
#         ...
#     Semester2/
#         ...


# option to run the function


# helper methods

def is_audio(filename):
    result = '.' in filename and filename.rsplit('.', 1)[1].lower() in {'wav', 'mp3', 'aac', 'ogg', 'wma', 'flac',
                                                                        'alac'}
    print(f"is_audio({filename}): {result}")
    return result


def is_image(filename):
    result = '.' in filename and filename.rsplit('.', 1)[1].lower() in {'jpeg', 'jpg', 'png', 'gif', 'bmp', 'tiff',
                                                                        'webp'}
    print(f"is_image({filename}): {result}")
    return result


def is_compressed(filename):
    result = '.' in filename and filename.rsplit('.', 1)[1].lower() in {'zip', 'rar', '7z', 'tar', 'gz', 'bz2'}
    print(f"is_compressed({filename}): {result}")
    return result


def is_video(filename):
    result = '.' in filename and filename.rsplit('.', 1)[1].lower() in {'mp4', 'mkv', 'flv', 'avi', 'mov', 'wmv'}
    print(f"is_video({filename}): {result}")
    return result


def is_document(filename):
    result = '.' in filename and filename.rsplit('.', 1)[1].lower() in {'doc', 'docx', 'ppt', 'pptx', 'pdf', 'xls',
                                                                        'xlsx', 'txt'}
    print(f"is_document({filename}): {result}")
    return result


def save_file(file, dest_folder, file_type, filename_with_prefix):
    # Construct the full path to the destination folder
    full_dest_folder = os.path.join(dest_folder, file_type)

    # Create the destination folder if it doesn't exist
    os.makedirs(full_dest_folder, exist_ok=True)

    # print(f'Original filename: {file.filename}')  # Debugging line
    # print(f'File prefix: {file_prefix}')  # Debugging line

    # filename_with_prefix = file_prefix + file.filename

    print(f'Filename with prefix: {filename_with_prefix}')  # Debugging line

    # Save the file to the destination folder
    file_path = os.path.join(full_dest_folder, filename_with_prefix)
    file.save(file_path)
    print(f'\033[37m ==> Saved file to: {file_path}' + '\033[0m')  # Print the path in white color
    # return the file name and path
    return filename_with_prefix


# converting methods:
def reverse_format_bytes(size_str):
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    size, unit = size_str.split(' ')

    i = sizes.index(unit)
    if i == -1:
        raise ValueError('Invalid unit')

    _bytes = round(float(size) * math.pow(1024, i), 1)
    return _bytes


def format_bytes(_bytes, decimals=2):
    if _bytes == 0:
        return '0 Bytes'

    k = 1024
    dm = decimals if decimals > 0 else 0
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    i = math.floor(math.log(_bytes, k))

    return f"{round(_bytes / math.pow(k, i), dm)} {sizes[i]}"


# generate default env file if it does not exist
def generate_default_env():
    if not os.path.exists('.env'):
        with open('.env', 'w') as f:
            f.write(
                "#Define IP address\n"
                "#IP_ADDRESS=0.0.0.0\n"
                "IP_ADDRESS=192.168.1.26\n\n"
                "#node js port and host\n"
                "NODEJS_PORT=5000\n"
                "NODEJS_HOST=$IP_ADDRESS\n\n"
                "#python flask port and host\n"
                "FLASK_PORT=4000\n"
                "FLASK_HOST=$IP_ADDRESS\n\n"
                "#content server port and host\n"
                "CONTENT_PORT=4001\n"
                "CONTENT_HOST=$IP_ADDRESS\n\n"
                "#client urls\n"
                "CLIENT_ORIGIN=//$IP_ADDRESS:4000\n\n"
                "#server urls\n"
                "NODE_SERVER_URL=//$IP_ADDRESS:5000\n"
                "FLASK_SERVER_URL=//$IP_ADDRESS:4000\n"
                "CONTENT_SERVER_URL=//$IP_ADDRESS:4001\n\n"
                "#content folder name\n"
                "CONTENT_FOLDER=LessonFolders\n\n"
                "# Set USE_HTTPS to either 'true' or 'false' so sets protocol to either http or https in server setup\n"
                "USE_HTTPS=false\n"
                "# run the ppt_manager on a different port\n"
                "USE_PPT_MANAGER_SERVER=false\n"
                "PPT_MANAGER_PORT=9876\n"
            )

            # debug message in blue
            print('\033[34m' + 'Default .env file created.' + '\033[0m')
            print(
                '\033[34m' + 'Please update the IP_ADDRESS in the .env file with your machine\'s IP address.' + '\033[0m')

            # Determine the operating system
            os_name = platform.system()
            if os_name == 'Windows':
                ip_command = 'ipconfig'
                print(
                    '\033[34m' + 'You can find your IP address by running "ipconfig" in the command line.' + '\033[0m')
            elif os_name == 'Darwin' or os_name == 'Linux':
                ip_command = 'ifconfig'
                print(
                    '\033[34m' + 'You can find your IP address by running "ifconfig" in the command line.' + '\033[0m')
            else:
                print('\033[31m' + 'Unsupported operating system. Please manually find your IP address.' + '\033[0m')
                return

            # Run the command and display the output to the user
            result = subprocess.run(ip_command, capture_output=True, text=True)
            print('\033[34m' + f'Here is the output of "{ip_command}":' + '\033[0m')
            print(result.stdout)


# auto generate helper batch file to run the gui.py
def create_batch_file():
    drive_letter = os.getcwd()[:2]  # Get the drive letter from the current directory
    batch_content = f'''@echo off
{drive_letter}
cd "{os.getcwd()}"
call .venv\\Scripts\\activate
python gui.py
REM pause
pause

'''
    with open('run_app.bat', 'w') as f:
        f.write(batch_content)


# method to correct ppt file names, such as replacing hyphens with underscores
def correct_ppt_filenames(directory):
    """
    This function replaces hyphens with underscores in the filenames
    in the given directory.
    """
    for filename in os.listdir(directory):
        if '-' in filename:
            new_filename = filename.replace('-', '_')
            os.rename(os.path.join(directory, filename), os.path.join(directory, new_filename))
            print("\033[96m" + "Renamed " + filename + " to " + new_filename + "\033[0m")
        else:
            print("\033[35m" + "No hyphens found in  ppt with name: " + filename + "\033[0m")


if __name__ == '__main__':
    option = 3
    if option == 1:
        check_all_grade_folders_exist()
        print('Grade folders check complete.')
    elif option == 2:
        setup_lesson_folders()
        print('Lesson folders setup complete.')
    elif option == 3:
        setup_lesson_folders_min()
        print('Lesson folders setup complete.')
    else:
        print('Invalid option. Please choose 1 or 2.')
