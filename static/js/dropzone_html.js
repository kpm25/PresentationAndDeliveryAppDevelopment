let socket; // Declare socket in an outer scope

try {
    socket = io.connect('https://192.168.1.24:5000');
} catch (error) {
    console.error('Error connecting to Socket.IO server:', error);
}

//toastr configuration
toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "1000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

//setup time function based on time zone
function getLocalISOTime() {
    let date = new Date();
    let timezoneOffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
    let localISOTime = new Date(Date.now() - timezoneOffset);

    let options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };

    return localISOTime.toLocaleString('en-US', options);
}

// Now you can use getLocalISOTime() to get the current time in your local timezone
console.log('Timestamp:', getLocalISOTime());

//dictionaries to convert from selectedSemester path
    const semesterDict = {
        "S1": 'Semester1',
        "S2":  'Semester2'
    }
    const gradeDict = {
        "G1": 'Grade1',
        "G2": 'Grade2',
        "G3": 'Grade3',
        "G4": 'Grade4',
        "G5": 'Grade5'
    }
    const weekDict = {
        "W1": 'Week1',
        "W2": 'Week2',
        "W3": 'Week3',
        "W4": 'Week4',
        "W5": 'Week5',
        "W6": 'Week6',
        "W7": 'Week7',
        "W8": 'Week8',
        "W9": 'Week9',
        "W10": 'Week10',
        "W11": 'Week11',
        "W12": 'Week12',
        "W13": 'Week13',
        "W14": 'Week14',
        "W15": 'Week15',
        "W16": 'Week16',
        "W17": 'Week17'
    }
    const lessonDict = {
        "L1": 'Lesson1',
        "L2": 'Lesson2',
        "L3": 'Lesson3',
        "L4": 'Lesson4',
        "L5": 'Lesson5',
        "L6": 'Lesson6',
        "TP": 'TeachPlans',
        "MS": 'MiscMaterials'
    }




    // Declare global variables to store the selected grade, semester, week, and lesson
    let selectedGrade = null;
    let selectedSemester = null;
    let selectedWeek = null;
    let selectedLesson = null;




// Log the variables to the console
console.log(`selectedGrade: ${selectedGrade}, selectedSemester: ${selectedSemester}, selectedWeek: ${selectedWeek}, selectedLesson: ${selectedLesson}`);



    let dropzoneInstance = null; // Declare dropzoneInstance here

    // Add event listeners to your buttons
    document.querySelectorAll('.semester').forEach(function(button) {
        button.addEventListener('click', function() {
            selectedSemester = this.value;
            console.log("selected semester is: ", selectedSemester);
        });
    });

    document.querySelectorAll('.grade').forEach(function(button) {
        button.addEventListener('click', function() {
            selectedGrade = this.value;
            console.log("selected grade is: ", selectedGrade);
        });
    });
    document.querySelectorAll('.week').forEach(function(button) {
        button.addEventListener('click', function() {
            selectedWeek = this.value;
            console.log("selected week is: ", selectedWeek);
        });
    });

    // Add event listener to the lesson labels to set the selected lesson
    document.querySelectorAll('.lesson-label').forEach(function(label) {
        label.addEventListener('click', function() {
            // Set the selected lesson
            selectedLesson = this.dataset.value;
        });
    });


    // Disable Dropzone's auto-discover feature
    Dropzone.autoDiscover = false;

   //sound related code, is muted if the checkbox is checked
    function playSuccessSound() {
        const audio = document.getElementById('successAudio');
        const muteCheckbox = document.getElementById('muteSound');

        // Only play the sound if the checkbox is not checked
        if (audio && (!muteCheckbox || !muteCheckbox.checked)) {
            // Catch promise rejection when trying to play the audio
            audio.play().catch(function(error) {
                console.error('Error playing audio:', error);
            });
        }
    }
    document.getElementById('playButton').addEventListener('click', playSuccessSound);

    // Function to initialize Dropzone for a lesson
    function initializeDropzone() {
        // Construct the file path outside of the url function
        const filePath = `${selectedSemester}/${selectedGrade}/${selectedWeek}/${selectedLesson}`;

        let lastSuccessResponse = null; // Declare a variable to store the last response

        const dropzoneConfig = {
            url: function(files) {
                // Get the first file in the array
                const file = files[0];

                const path_to_return = `/dropzone_lessons/${filePath}/${file.name}`;
                    // Log the file path
                console.log('path_to_return:', path_to_return);


                // Return the URL
                return  path_to_return;
            },
            autoProcessQueue: false,
            paramName: "file",
            uploadMultiple: true,
            parallelUploads: 50, // Increase this number
            clickable: "#uploadButton",
            maxFiles: null, // Allow unlimited files
     /*       renameFile: function(file) {
                var newName = `${selectedGrade}_${selectedSemester}_${selectedWeek}_${selectedLesson}_${file.name}`;
                return newName;
            },*/
            init: function() {
                 let fileCount = 0; // Initialize a counter for the uploaded files
            this.on('success', function(file, response) {

                lastSuccessResponse = response; // Store the last response
 /*                  // Check if response.accepted_files is defined and is an array
                    if (Array.isArray(response.accepted_files)) {
                        // Iterate over each file in the accepted_files list
                         // Iterate over each file in the accepted_files list
                            response.accepted_files.forEach(function(acceptedFile) {
                                console.log(`CHECKING FILENAME: ${acceptedFile}`);
                                console.log(`\x1b[32m File uploaded successfully! , filepath: ${acceptedFile} response: ${response.message}\x1b[0m`);
                                socket.emit('fileAdded', acceptedFile);
                                fileCount++; // Increment the counter for each successful upload
                                // Log each individual file upload
                                postLog(`$${acceptedFile}`, `${1}`, getLocalISOTime()); // Send the log to the server
                                //console log in green color
                                 console.log(`\x1b[32m File uploaded successfully: ${acceptedFile}\x1b[0m`);
                            });
                    }


                      // Check if response.duplicate_files is defined and is an array
                    if (Array.isArray(response.duplicate_files)) {
                            // Iterate over each file in the duplicate_files list
                            response.duplicate_files.forEach(function(duplicateFile) {
                                //console log in orange color
                                console.log(`\x1b[33mFile uploaded was a duplicate: ${duplicateFile}\x1b[0m`);
                                toastr.warning(`File uploaded was a duplicate: ${duplicateFile}`);
                            });
                    }*/


            });
            this.on('queuecomplete', function() {


                if(lastSuccessResponse){
                     if (Array.isArray(lastSuccessResponse.accepted_files)) {
                        // Iterate over each file in the accepted_files list
                         // Iterate over each file in the accepted_files list
                            lastSuccessResponse.accepted_files.forEach(function(acceptedFile) {
                                console.log(`CHECKING FILENAME: ${acceptedFile}`);
                                console.log(`\x1b[32m File uploaded successfully! , filepath: ${acceptedFile} response: ${lastSuccessResponse.message}\x1b[0m`);
                                socket.emit('fileAdded', acceptedFile);
                                fileCount++; // Increment the counter for each successful upload
                                // Log each individual file upload
                                postLog( `$${acceptedFile}`, `${1}`, getLocalISOTime()); // Send the log to the server
                                //console log in green color
                                 console.log(`\x1b[32m File uploaded successfully: ${acceptedFile}\x1b[0m`);
                            });
                    }


                      // Check if response.duplicate_files is defined and is an array
                    if (Array.isArray(lastSuccessResponse.duplicate_files)) {
                            // Iterate over each file in the duplicate_files list
                            lastSuccessResponse.duplicate_files.forEach(function(duplicateFile) {
                                //console log in orange color
                                console.log(`\x1b[33mFile uploaded was a duplicate: ${duplicateFile}\x1b[0m`);
                                toastr.warning(`File uploaded was a duplicate: ${duplicateFile}`);
                            });
                    }

                }


                // This code will run once after all files have been uploaded
                console.log('All files have been uploaded.');
                //get path names

                 const fileFolderPath = `${semesterDict[selectedSemester]}/${gradeDict[selectedGrade]}/${weekDict[selectedWeek]}/${lessonDict[selectedLesson]}`;
              //   const filePath = `${selectedSemester}/${selectedGrade}/${selectedWeek}/${selectedLesson}`;
                const timestamp = getLocalISOTime();
//                appendLog(`${fileFolderPath} `, timestamp, `${fileCount}`); // Log the file path and count

                if(fileCount > 1){
                    postLog(`${fileFolderPath}`, `${fileCount}`,getLocalISOTime()); // Send the log to the server
                }
                if(fileCount !== 0){
                     update_log();
                    playSuccessSound();
                      //write success message with file upload info in the dropzone:
                     const messageElement = this.element.querySelector('.drop-message');
                    messageElement.innerHTML = `All files have been uploaded successfully.<br> Total files uploaded: ${fileCount}<br>`;
                    messageElement.innerHTML += "Files uploaded to: " + `${fileFolderPath}`;

                    // Emit 'fileUploaded' event
                    socket.emit('filesUploaded', { path: fileFolderPath, count: fileCount });
                }else{
                    //write error message in the dropzone:
                    const messageElement = this.element.querySelector('.drop-message');
                    messageElement.innerHTML = `No files were uploaded, probably because they were duplicates.`;
                    toastr.error(`No files were uploaded. Probably because they were duplicates.`);
                }

                lastSuccessResponse = null; // Reset the last response


                this.removeAllFiles();
                fileCount = 0; // Reset the counter after setting the message
            });

            this.on('error', function(file, errorMessage) {
                   //console log as red color
                  console.log(`\x1b[33m ##Error uploading file:  ${errorMessage} for file: ${file.name}\x1b[0m`);
                   toastr.error(`Error uploading file: ${errorMessage} for file: ${file.name}`);
                });
            this.on('addedfile', function(file) {
                    // Update the URL when a file is added
                    this.options.url = function() {
                        // Construct the file path
//                        const filePath = `${selectedSemester}/${selectedGrade}/${selectedWeek}/${selectedLesson}/${file.name}`;

                        // Return the URL
                        return `/dropzone_lessons/${file.name}`;
                    };
                });
                this.on('sending', function(file, xhr, formData) {
                    // Construct the file prefix
                    const filePrefix = `${selectedGrade}_${selectedSemester}_${selectedWeek}_${selectedLesson}_`;

                    // Add the file prefix to the filename
                 //   file.upload.filename = `${filePrefix}_${file.name}`;

                    console.log("file name is: ", file.upload.filename);

                    // Use the global variables
                    xhr.setRequestHeader('X-Grade', selectedGrade);
                    xhr.setRequestHeader('X-Semester', selectedSemester);
                    xhr.setRequestHeader('X-Week', selectedWeek);
                    xhr.setRequestHeader('X-Lesson', selectedLesson);
                    //pass the file prefix to the server
                    xhr.setRequestHeader('X-File-Prefix', filePrefix);
                });
            }
        };

       const dropzoneElement = document.querySelector('#singleDropzone');
        if (dropzoneElement) {
             dropzoneInstance = new Dropzone(dropzoneElement, dropzoneConfig);

            // Add event listener to the lesson labels to start the upload
            document.querySelectorAll('.drop-zone-label').forEach(function(label) {
                label.addEventListener('click', function() {
                    //if the
                            // Set the selected lesson
                            selectedLesson = this.dataset.value;

                            // Start the upload
                            dropzoneInstance.processQueue();
                });
            });
        }
    }

    // Function to set default month
    function setDefaultSemester() {
            // Get the current month
            const currentMonth = new Date().getMonth();

            console.log("current month is: ", currentMonth);

            // Check if the current month is between March and August
            if (currentMonth >= 2 && currentMonth <= 7) {
                // Select Semester 2 by default
                $('#semester2').addClass('selected');
                console.log("semester 2 selected");
                selectedSemester =  $('#semester2').val();
                console.log("selected semester is: ", selectedSemester);
            } else {
                // Select Semester 1 by default
                $('#semester1').addClass('selected');
                console.log("semester 1 selected");
                selectedSemester =  $('#semester1').val();
                console.log("selected semester is: ", selectedSemester);
            }
    }


$(document).ready(function() {

    // Set the default month
    setDefaultSemester();
    // Initialize Dropzone instance
    initializeDropzone();

    // Add event listener for the upload button
    $('#startUpload').click(function() {
         if(canUploadFiles()){

                    // Check if a lesson has been selected
                    if (selectedLesson !== null) {
                        console.log(`Selected lesson: ${selectedLesson}`);

                        // Start the upload
                        if (dropzoneInstance) {
                            dropzoneInstance.processQueue();
                        } else {
                            alert('Dropzone instance not found for the selected lesson.');
                        }
                    } else {
                        alert('Please select a lesson before starting the upload.');
                    }
        }else{
            alert('Please select a semester, grade, week, and lesson before starting the upload.');
        }
    });



          // Function to check files can be uploaded by checking if exactly one of a semester, grade, week, and lesson has been selected
        function canUploadFiles() {
            // Check if exactly one semester, grade, week, and lesson has a selected class
            let semester_count = 0;
            let grade_count = 0;
            let week_count = 0;
            let lesson_count = 0;

            document.querySelectorAll('.semester').forEach(function(button) {
                if (button.classList.contains('selected')) {
                    semester_count++;
                }
            });
            document.querySelectorAll('.grade').forEach(function(button) {
                if (button.classList.contains('selected')) {
                    grade_count++;
                }
            });
            document.querySelectorAll('.week').forEach(function(button) {
                if (button.classList.contains('selected')) {
                    week_count++;
                }
            });
            document.querySelectorAll('.lesson-label').forEach(function(label) {
                if (label.classList.contains('selected')) {
                    lesson_count++;
                }
            });

            // If exactly one of each category is selected, return true
            if(semester_count === 1 && grade_count === 1 && week_count === 1 && lesson_count === 1) {
                console.log("can upload files");
                return true;
            }
            // If not, return false
            console.log("cannot upload files");
            return false;
        }

});


       //Code to deal with the selection of the semester, grade, week, and lesson and redirect to the display page
    //so that the selected labels are displayed in the display page are the same as the selected labels in the dropzone page

    function getSelectedId(buttonClass) {
        let selectedIds = [];
        document.querySelectorAll(`.${buttonClass}`).forEach(function(button) {
            if (button.classList.contains('selected')) {
                selectedIds.push(button.id);
            }
        });

        // If no button or more than one button is selected, return null
        if (selectedIds.length !== 1) {
            return null;
        }

        // Otherwise, return the numeric part of the ID of the selected button
        return selectedIds[0].replace(/\D/g, '');
    }

    function redirectToDisplayZone() {
        let url = new URL(window.location.origin + '/display');

        // Get the ID of the selected semester, grade, week, and lesson
        let semesterId = getSelectedId('semester');
        let gradeId = getSelectedId('grade');
        let weekId = getSelectedId('week');
        let lessonId = getSelectedId('lesson-label');

        // Only append the parameters if their corresponding selections are made
        if (semesterId !== null) {
            url.searchParams.append('currentSemester', semesterId);
        }
        if (gradeId !== null) {
            url.searchParams.append('currentGrade', gradeId);
        }
        if (weekId !== null) {
            url.searchParams.append('currentWeek', weekId);
        }
        if (lessonId !== null) {
            url.searchParams.append('currentLesson', lessonId);
        }

        console.log("*** redirectToDisplayZone,url: ", url);

        window.location.href = url;
    }


     //function to take a current semester as int and return the selected semester as string
        function getSemester(semesterInt) {
            if (semesterInt === 1) {
                return "S1";
            } else {
                return "S2";
            }
        }
     //function to take a current grade as int and return the selected grade as string
        function getGrade(gradeInt) {
            return "G" + gradeInt;
        }
        //function to take a current week as int and return the selected week as string
        function getWeek(weekInt) {
            return "W" + weekInt;
        }
        //function to take a current lesson as int and return the selected lesson as string
        function getLesson(lessonInt) {
           //if lesson is 7 or 8 return TP or MS
            if (lessonInt === 7) {
                return "TP";
            } else if (lessonInt === 8) {
                return "MS";
            } else {
                return "L" + lessonInt;
            }
        }



$(document).ready(function() {




     //get params from url to select the labels if they are in the url:

         // Get the URL search parameters
   let params = new URLSearchParams(window.location.search);

    // Only execute the code if there are parameters in the URL
    if (params.toString()) {
           //set the selected semester based on the URL parameters
            let selectedSemesterInt = parseInt(params.get('currentSemester') || null);
            if (isNaN(selectedSemesterInt)) {
                selectedSemester = null;
            }else{
                selectedSemester = getSemester(selectedSemesterInt);
               // Set the selected semester button
                $(`#semester${selectedSemesterInt}`).addClass('selected');
                //all other semester buttons should be unselected
                $(`#semester${selectedSemesterInt === 1 ? 2 : 1}`).removeClass('selected');
                //set the semester buttons to unselected
                $(`#semester${selectedSemesterInt === 1 ? 2 : 1}`).addClass('unselected');
            }

            // Set the variables based on the URL parameters
            let selectedGradeInt = parseInt(params.get('currentGrade') || null);
            if (isNaN(selectedGradeInt)) {
                selectedGrade = null;
            }else{
                selectedGrade = getGrade(selectedGradeInt);
                // Set the selected grade button
               $(`#grade${selectedGradeInt}`).addClass('selected');
                //all other grade buttons should be unselected
                for (let i = 1; i <= 5; i++) {
                    if (i !== selectedGradeInt) {
                        $(`#grade${i}`).removeClass('selected');
                        //set the grade buttons to unselected
                        $(`#grade${i}`).addClass('unselected');
                    }
                }


            }
            // Set the selected week
            let selectedWeekInt = parseInt(params.get('currentWeek') || null);
            if (isNaN(selectedWeekInt)) {
                selectedWeek = null;
            }else{
                selectedWeek = getWeek(selectedWeekInt);
                // Set the selected week button
               $(`#week${selectedWeekInt}`).addClass('selected');
                //all other week buttons should be unselected
                for (let i = 1; i <= 17; i++) {
                    if (i !== selectedWeekInt) {
                        $(`#week${i}`).removeClass('selected');
                        //set the week buttons to unselected
                        $(`#week${i}`).addClass('unselected');
                    }
                }
            }
            // Set the selected lesson
            let selectedLessonInt = parseInt(params.get('currentLesson') || null);
            if (isNaN(selectedLessonInt)) {
                selectedLesson = null;
            }else{
                selectedLesson = getLesson(selectedLessonInt);
                // Set the selected lesson button
                $(`#lesson${selectedLessonInt}`).addClass('selected');



                //all other lesson buttons should be unselected
                for (let i = 1; i <= 8; i++) {
                    if (i !== selectedLessonInt) {
                        $(`#lesson${i}`).removeClass('selected');
                        //set the lesson buttons to unselected
                        $(`#lesson${i}`).addClass('unselected');
                    }
                }


            }



    }else{
        console.log("no params in url");
    }



    // Add this function
    function checkSelectionsAndClickLabel() {
        // Check if all selections have been made
        if (selectedSemester !== null && selectedGrade !== null && selectedWeek !== null && selectedLesson !== null) {
            // Simulate a click on the selected lesson label
            $(`#lesson${selectedLesson}`).click();
        }
    }

    // Call the function
    checkSelectionsAndClickLabel();
         console.log("selectedSemester: ", selectedSemester);
            console.log("selectedGrade: ", selectedGrade);
            console.log("selectedWeek: ", selectedWeek);
            console.log("selectedLesson: ", selectedLesson);

     //if all selections have been are not null then activate the dropzone
    if (selectedSemester !== null && selectedGrade !== null && selectedWeek !== null && selectedLesson !== null) {
        //get target dropzone from the selected lesson id
                // Get the URL search parameters
     let params = new URLSearchParams(window.location.search);

        const selectedLessonInt = parseInt(params.get('currentLesson') || null);
        const targetId =  $(`#lesson${selectedLessonInt}`).data('target');
        const targetDropzone = document.getElementById(targetId);

        // Toggle the dropzone state
        targetDropzone.classList.toggle('showcontent');
        targetDropzone.classList.toggle('dropcontent');

    }




/*        //if a grade is not selected, select the first grade
        if (!selectedGrade) {
            selectedGrade = 'Grade1';
            $('#grade1').addClass('selected');
        }
         //click grade that is selected
            if (selectedGrade) {
                //get current selected grade with class selected
                let currentSelectedGrade =  $(`#grade${selectedGrade === 'G1' ? 1 : selectedGrade === 'G2' ? 2 : selectedGrade === 'G3' ? 3 : selectedGrade === 'G4' ? 4 : 5}`);
                //click the label  currentSelectedGrade
                currentSelectedGrade.click();
            }
     //if a week is not selected, select the first week
        if (!selectedWeek) {
            selectedWeek = 'Week1';
            $('#week1').addClass('selected');

        }
            //click week that is selected
            if (selectedWeek) {
                //get current selected week with class selected
                let currentSelectedWeek =  $(`#week${selectedWeek === 'W1' ? 1 : selectedWeek === 'W2' ? 2 : selectedWeek === 'W3' ? 3 : selectedWeek === 'W4' ? 4 : selectedWeek === 'W5' ? 5 : selectedWeek === 'W6' ? 6 : selectedWeek === 'W7' ? 7 : selectedWeek === 'W8' ? 8 : selectedWeek === 'W9' ? 9 : selectedWeek === 'W10' ? 10 : selectedWeek === 'W11' ? 11 : selectedWeek === 'W12' ? 12 : selectedWeek === 'W13' ? 13 : selectedWeek === 'W14' ? 14 : selectedWeek === 'W15' ? 15 : selectedWeek === 'W16' ? 16 : 17}`);
                //click the label  currentSelectedWeek
                currentSelectedWeek.click();
            }
        //if a lesson is not selected, select the first lesson
        if (!selectedLesson) {
            selectedLesson = 'Lesson1';
            $('#lesson1').addClass('selected');
        }
            //click lesson that is selected
            if (selectedLesson) {
                //get current selected lesson with class selected
                let currentSelectedLesson =  $(`#lesson${selectedLesson === 'L1' ? 1 : selectedLesson === 'L2' ? 2 : selectedLesson === 'L3' ? 3 : selectedLesson === 'L4' ? 4 : selectedLesson === 'L5' ? 5 : selectedLesson === 'L6' ? 6 : selectedLesson === 'TP' ? 7 : 8}`);
                //click the label  currentSelectedLesson
                currentSelectedLesson.click();
            }*/


});




//SOCKET.IO CODE:
//debug print socket version to console
console.log("socket version: ", socket.io.engine.transport.query.EIO);
console.log("socket protocol....: ", socket.io.engine.transport.query.transport);

   //code to play sound
   // Listen for 'playsound' events from the server
    socket.on('playsound', () => {
        console.log('Playing sound');
        playSuccessSound();
         socket.emit('test_event');
    });


   //socket test
    function socketTest() {
        // Emit a 'test_event' event
          playSuccessSound();
          socket.emit('test_event');
        console.log('Test event emitted');
        console.log('\x1b[31m%s\x1b[0m', 'A sound was played');
        //cyan debug message
        console.log('\x1b[36m%s\x1b[0m', 'A file was uploaded');
        toastr.success("A test event was fired");
    }

    socket.on('test_event', (data) => {
       toastr.warning(data);
    });


       // Listen for 'filesUploadedResponse' events from the server
    socket.on('filesUploadedResponse', function(fileData) {
      toastr.success(`Files were uploaded to the server at path:  ${fileData.path}, count: ${fileData.count}`);
      playSuccessSound();
        update_log(); // Update the log
    } );




        // Listen for 'fileDeletedResponse' events from the server
        socket.on('fileDeletedResponse', function(filepath) {
            // Message to show file deleted successfully
            toastr.success('File deleted successfully: ' + filepath);

            // Refresh the file list
            RefreshFileList(getSelectedLabel('lesson-label'));

            // Play success sound
            playSuccessSound();
             update_log(); // Update the log
        });





//logs related code:

     //history log:

        //method to send post request to append log
    function postLog(filepath, fileCount, timestamp) {
        console.log(`\x1b[37m before..File uploaded successfully! , filepath: ${filepath} fileCount: ${fileCount} timestamp: ${timestamp}\x1b[0m`);
        //after removing $ from the filepath
        filepath = filepath.substring(1);
          console.log(`\x1b[37m before..File uploaded successfully! , filepath: ${filepath} fileCount: ${fileCount} timestamp: ${timestamp}\x1b[0m`);
        console.log(`\x1b[33;1m after..xxxxxFile uploaded successfully! , filepath: ${filepath} fileCount: ${fileCount} timestamp: ${timestamp}\x1b[0m`);
        console.log(`\x1b[1;4;41m after..yyyyyFile uploaded successfully! , filepath: ${filepath} fileCount: ${fileCount} timestamp: ${timestamp}\x1b[0m`);
        console.log(`\x1b[5m after..zzzzzile uploaded successfully! , filepath: ${filepath} fileCount: ${fileCount} timestamp: ${timestamp}\x1b[0m`);

        // Send a POST request to the server to append the log
        fetch('/append_log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "path": filepath,
                "filecount": Number(fileCount),
                "timestamp": timestamp
            })
        })
        .then(response => {
            if (!response.ok) {
                // Extract the JSON body of the response
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            console.log("Log appended successfully:", data);
        })
        .catch(error => {
            console.error('Error logging:', error);
        });
    }

   /*  function appendLog(path, timestamp, fileCount) {
        const historyLog = document.getElementById('historyLog');
        const newLogEntry = `Path: ${path}, Timestamp: ${timestamp} File Count: ${fileCount}\n`;
       //place the new log entry at the top of the history log
           historyLog.value = newLogEntry + historyLog.value;

    }*/





    //clear the history log
    function clearHistoryLog() {
        // Send a DELETE request to the server to clear the log
        fetch('/clear_history_log', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                // Extract the JSON body of the response
                console.log("response not ok clearing log");
                return response.json().then(err => { throw err; });
            }
            return response.json();
        }
        )
        .then(data => {
            console.log("Log cleared successfully, response message:", data.message);
            // Initialize the history log text area
            const historyLog = document.getElementById('historyLog');
            //update the log
            playSuccessSound();
            socket.emit('clearHistory');
            update_log();

        })
    }


      //use this server code to append the log
    function update_log() {
        // Send a GET request to the server to get the history logs
        fetch('/get_logs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                // Extract the JSON body of the response
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            console.log("Logs retrieved successfully:", data);
            // Initialize the history log text area
            const historyLog = document.getElementById('historyLog');
//            const logLines = historyLog.value.split('\n').length;
            //loglines is the count of history log lines
            const logLinesOfSingleFileData = data.filter(log => log.filecount === 1).length;
            //log in yellow color
            console.log('\x1b[33m%s\x1b[0m', 'log Lines Of Single File Data:', logLinesOfSingleFileData);
            //clear the history log
            historyLog.value = '';
            let count = logLinesOfSingleFileData;
            data.forEach(log => {
             //Yes, the get_history_logs function you provided is correct in terms of handling JSON log entries in the format {'path': path, 'timestamp': timestamp, 'filecount': filecount}.
                //count of historyLog lines
                let newLogEntry = '';
                if(log.filecount === 1){
                     newLogEntry = `${count--}.) ${log.path},  ${log.timestamp}, File Count: ${log.filecount}\n`;
                }else{
                     newLogEntry = `${log.path},  ${log.timestamp}, File Count: ${log.filecount}\n`;
                }
                historyLog.value += newLogEntry;
                //console in magenta color
//                console.log('\x1b[35m%s\x1b[0m', 'Log entry:', newLogEntry);
            });
        })
        .catch(error => {
            console.error('Error retrieving logs:', error);
        });
    }

       //clearHistoryResponse
        socket.on('clearHistoryResponse', () => {
           // Message to show history log cleared successfully
           toastr.info('History log cleared!');
           // Update the log
            update_log();
       });

   //update the log when the page loads
    update_log();