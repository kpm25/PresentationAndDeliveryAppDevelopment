import os

def setup_folder_structure():
    lesson_folders = ['lesson1', 'lesson2', 'lesson3']
    file_types = ['zip', 'video', 'audio', 'image']

    base_dir = 'lessons'
    os.makedirs(base_dir, exist_ok=True)

    for lesson in lesson_folders:
        lesson_path = os.path.join(base_dir, lesson)
        os.makedirs(lesson_path, exist_ok=True)

        for file_type in file_types:
            type_path = os.path.join(lesson_path, file_type)
            os.makedirs(type_path, exist_ok=True)



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
    lessons = ['Lesson' + str(i) for i in range(1, 7)] + ['TeachPlans', 'MiscMaterials' ]

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


#option to run the function


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


def save_file(file, dest_folder, file_type, file_prefix):
    # Construct the full path to the destination folder
    full_dest_folder = os.path.join(dest_folder, file_type)

    # Create the destination folder if it doesn't exist
    os.makedirs(full_dest_folder, exist_ok=True)

    print(f'Original filename: {file.filename}')  # Debugging line
    print(f'File prefix: {file_prefix}')  # Debugging line

    filename_with_prefix = file_prefix + file.filename

    print(f'Filename with prefix: {filename_with_prefix}')  # Debugging line

    # Save the file to the destination folder
    file_path = os.path.join(full_dest_folder, filename_with_prefix)
    file.save(file_path)
    print(f'\033[37m ==> Saved file to: {file_path}' + '\033[0m')  # Print the path in white color
    #return the file name and path
    return filename_with_prefix


if __name__ == '__main__':
    option = 2
    if option == 1:
        setup_folder_structure()
        print('Folder structure setup complete.')
    elif option == 2:
        setup_lesson_folders()
        print('Lesson folders setup complete.')
    else:
        print('Invalid option. Please choose 1 or 2.')