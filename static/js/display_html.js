let socket; // Declare socket in an outer scope

try {
    socket = io.connect('https://192.168.1.24:5000');
} catch (error) {
    console.error('Error connecting to Socket.IO server:', error);
}
   //toastr configuration will make in a base template later on and any other common code
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

    // Declare global variables to store the selected grade, semester, week, and lesson
    let selectedGrade = null;
    let selectedSemester = null;
    let selectedWeek = null;
    let selectedLesson = null;


    // Log the variables to the console
    console.log(`selectedGrade: ${selectedGrade}, selectedSemester: ${selectedSemester}, selectedWeek: ${selectedWeek}, selectedLesson: ${selectedLesson}`);


    // Function to update the click event for the lesson labels
    function updateLessonLabelClickEvent() {
        // Remove the existing click event
        document.querySelectorAll('.lesson-label').forEach(function(label) {
            label.removeEventListener('click', labelClickEvent);
        });

        // Add the updated click event
        document.querySelectorAll('.lesson-label').forEach(function(label) {
            label.addEventListener('click', labelClickEvent);
        });
    }
const fileDisplayDiv = document.getElementById('fileDisplay');

    // Function to handle the click event for the lesson labels
function labelClickEvent() {
    RefreshFileList(this);
}

function RefreshFileList(selectedLabel) {
     // Set the selected lesson
    selectedLesson = selectedLabel.dataset.value;
    console.log("selected lesson is: ", selectedLesson);

    // Fetch the files for the selected semester, grade, week, and lesson
    const fetchUrl = `/list_files/${selectedSemester}/${selectedGrade}/${selectedWeek}/${selectedLesson}`;
    console.log("fetchUrl: ", fetchUrl);
    fetch(fetchUrl, {
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
        console.log("Received data: ", data);

            //if file_count is 0, display an error message and throw an error
            if (data.file_count === 0 ) {
                console.error('No files found for the selected lesson, data:', data);
                throw data;
            }if(!canLessonBeDisplayed()){
                console.error('No Lesson selected, data:', data);
                throw data;
            }
            else {
                    const fileDisplayDiv = document.getElementById('fileDisplay');
                    fileDisplayDiv.innerHTML = `<h1>${data.message}</h1>
                      <p>Directory: ${data.directory}</p>
                      <p>FileCount: ${data.file_count}</p>`;

                    let tableHtml = `<table><thead><tr><th style="text-align: center; color: red; text-decoration: underline;">Files ${data.directory}:</th></tr></thead><tbody>`;
                    tableHtml += '<tr><td> </td></tr>'; // empty row

                    // Add a new row with the checkbox and delete button
                    tableHtml += `<tr><td style="text-align: center;"><input type="checkbox" id="deleteAllCheckbox">
                      <button style="color:green;" id="deleteAllButton">Delete All</button></td></tr>`;

                    for (let i = 0; i < 10; i++) {
                        tableHtml += '<tr><td> </td></tr>'; // empty rows
                    }


  /*              data.files.forEach(file => {
                  //  const filePath = file.path;
                    console.log("Adding file to table: ", file.path);
                    tableHtml += `<tr><td>&emsp;&emsp;📄 <a href="${file.path}" download>${file.name}  </a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td><button style="color:red;" class="delete-button" data-filepath='${file.path}'>Delete</button></td></tr>`;
                    console.log(`file:  ${file.name}, filePath: ${file.path}, data.directory: ${data.directory}`);
                    console.log(`filePath: ${file.path}`);
                });*/
                 data.files.forEach(file => {
                    //const filePath = file.path;
                    console.log("Adding file to table: ", file.path);
                    tableHtml += `<tr><td>&emsp;&emsp;📄 <a href="/get_file?path=${encodeURIComponent(file.path)}">${file.name}</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td><button style="color:red;" class="delete-button" data-filepath='${file.path}'>Delete</button></td></tr>`;
                    console.log(`file:  ${file.name}, filePath: ${file.path}, data.directory: ${data.directory}`);
                    console.log(`filePath: ${file.path}`);

                });

                fileDisplayDiv.innerHTML += tableHtml;

                document.querySelectorAll('.delete-button').forEach(button => {
                    button.addEventListener('click', function() {
                        deleteFile(this.dataset.filepath);
                        console.log("delete button clicked, this.dataset.filepath: ", this.dataset.filepath);
                        socket.emit('fileDeleted', this.dataset.filepath);
                    });
                });
                //console.log("fileDisplayDiv.innerHTML: ", fileDisplayDiv.innerHTML);

                document.getElementById('deleteAllButton').addEventListener('click', function() {
                    if (document.getElementById('deleteAllCheckbox').checked) {
                        if (confirm('Are you sure you want to delete all files?')) {
                            data.files.forEach(file => {
                                deleteFile(file.path);
                            });
                        }
                         socket.emit('deleteAllFiles');
                    } else {
                        alert('Please check the "Delete All Checkbox" in order to delete all files.');
                    }
                });


            }

    })
    .catch(error => {
        console.error('Error:', error);
        // Display the message and directory path from the server
        const fileDisplayDiv = document.getElementById('fileDisplay');
        fileDisplayDiv.innerHTML = `<h1>${error.message}</h1>
          <p>path: ${selectedSemester}/${selectedGrade}/${selectedWeek}/${selectedLesson}</p>
          <p>Directory: ${error.directory}</p>
          <p>FileCount: ${error.file_count}</p>
        <p>Please select a different lesson or contact the administrator for assistance.</p>`;
    });
}



    // Add event listeners to your buttons
    document.querySelectorAll('.semester').forEach(function(button) {
        button.addEventListener('click', function() {
            selectedSemester = this.value;
            console.log("selected semester is: ", selectedSemester);
            updateLessonLabelClickEvent();
        });
    });

    document.querySelectorAll('.grade').forEach(function(button) {
        button.addEventListener('click', function() {
            selectedGrade = this.value;
            console.log("selected grade is: ", selectedGrade);
            updateLessonLabelClickEvent();
        });
    });
    document.querySelectorAll('.week').forEach(function(button) {
        button.addEventListener('click', function() {
            selectedWeek = this.value;
            console.log("selected week is: ", selectedWeek);
            updateLessonLabelClickEvent();
        });
    });

    // Initialize the click event for the lesson labels
    updateLessonLabelClickEvent();

    //function to display lesson files but checks if semester, grade, week and lesson are selected
    function canLessonBeDisplayed() {
        const isAnySemesterSelected = Array.from(document.querySelectorAll('.semester')).some(semester => semester.classList.contains('selected'));
        const isAnyGradeSelected = Array.from(document.querySelectorAll('.grade')).some(grade => grade.classList.contains('selected'));
        const isAnyWeekSelected = Array.from(document.querySelectorAll('.week')).some(week => week.classList.contains('selected'));
        const isAnyLessonSelected = Array.from(document.querySelectorAll('.lesson-label')).some(lesson => lesson.classList.contains('selected'));

            if (isAnySemesterSelected && isAnyGradeSelected && isAnyWeekSelected && isAnyLessonSelected) {
            const json = {
                semester: isAnySemesterSelected,
                grade: isAnyGradeSelected,
                week: isAnyWeekSelected,
                lesson: isAnyLessonSelected
            };
            console.log("json: ", json);
            return true;
        } else {
            return false;
        }
    }


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

    //Code to deal with redirection to dropzone page so that the labels are selected
    // the same as the ones selected on this page

    //function to get lesson int from selectedLesson
/*    function getLessonInt(lessonString) {
        //if lesson is TP or MS return 7 or 8
        if (lessonString === "TeachPlans") {
            return 7;
        } else if (lessonString === "MiscMaterials") {
            return 8;
        } else if (lessonString.includes('Lesson')){
            return parseInt(lessonString.replace('Lesson', ''));
        } else{
            return null;
        }
    }*/

   function getLessonInt(lessonString) {
        if (!lessonString) {
            return null;
        }
        if (lessonString === "TeachPlans") {
            return 7;
        } else if (lessonString === "MiscMaterials") {
            return 8;
        } else if (lessonString.includes('Lesson')){
            return parseInt(lessonString.replace('Lesson', ''));
        } else{
            return null;
        }
    }
    //function to get Selected int id for semester, grade and week selected
    function getSelectedIntId(selectedString) {
        if (!selectedString) {
            return null;
        }
        if (selectedString === "Semester1") {
            return 1;
        } else if (selectedString === "Semester2") {
            return 2;
        } else if (selectedString.includes('Grade')) {
            return parseInt(selectedString.replace('Grade', ''));
        } else if (selectedString.includes('Week')) {
            return parseInt(selectedString.replace('Week', ''));
        } else {
            return null;
        }
    }

    function redirectToDropzone() {
        let url = new URL(window.location.origin + '/');

        url.searchParams.append('currentSemester', getSelectedIntId(selectedSemester) !== null ? getSelectedIntId(selectedSemester) : '');
        url.searchParams.append('currentGrade', getSelectedIntId(selectedGrade) !== null ? getSelectedIntId(selectedGrade) : '');
        url.searchParams.append('currentWeek', getSelectedIntId(selectedWeek) !== null ? getSelectedIntId(selectedWeek) : '');

        // Remove 'lesson' from currentLesson and convert to int if null then set to empty string
        let lessonNumber =  getLessonInt(selectedLesson)  || '';
        url.searchParams.append('currentLesson', lessonNumber);

        console.log("*** redirectToDropzone, url: ", url);

        window.location.href = url;
    }

$(document).ready(function() {
        //function to take a current semester as int and return the selected semester as string
        function getSemester(semesterInt) {
            if (semesterInt === 1) {
                return "Semester1";
            } else {
                return "Semester2";
            }
        }
        //function to take a current grade as int and return the selected grade as string
        function getGrade(gradeInt) {
            return "Grade" + gradeInt;
        }
        //function to take a current week as int and return the selected week as string
        function getWeek(weekInt) {
            return "Week" + weekInt;
        }
        //function to take a current lesson as int and return the selected lesson as string
        function getLesson(lessonInt) {
            //if lesson is 7 or 8 return TP or MS
            if (lessonInt === 7) {
                return "TeachPlans";
            } else if (lessonInt === 8) {
                return "MiscMaterials";
            } else {
                return "Lesson" + lessonInt;
            }
        }


        //get params from url to select the labels if they are in the url:

        // Get the URL search parameters
        let params = new URLSearchParams(window.location.search);

        // Only execute the code if there are parameters in the URL
        if (params.toString()) {
            //set the selected semester based on the URL parameters
            let selectedSemesterInt = parseInt(params.get('currentSemester') || null);
            if (isNaN(selectedSemesterInt)) {
                console.log("Invalid semester parameter in URL");
//                selectedSemester = null;
                setDefaultSemester();
            } else {
                selectedSemester = getSemester(selectedSemesterInt);
                // Set the selected semester button
                $(`#semester${selectedSemesterInt}`).addClass('selected');
                //set the other semester to unselected
                $(`#semester${selectedSemesterInt === 1 ? 2 : 1}`).removeClass('selected');
                //set the other semester to unselected
                $(`#semester${selectedSemesterInt === 2 ? 1 : 2}`).removeClass('selected');

            }

            // Set the variables based on the URL parameters
            let selectedGradeInt = parseInt(params.get('currentGrade') || null);
            if (isNaN(selectedGradeInt)) {
                console.log("Invalid grade parameter in URL");
//                selectedGrade = null;
                setDefaultGrade();
            } else {
                selectedGrade = getGrade(selectedGradeInt);
                // Set the selected grade button
                $(`#grade${selectedGradeInt}`).addClass('selected');
                //set the other grade to removed selected and added unselected
                for (let i = 1; i <= 5; i++) {
                    if (i !== selectedGradeInt) {
                        $(`#grade${i}`).removeClass('selected');
                        $(`#grade${i}`).addClass('unselected');
                    }
                }

            }
            // Set the selected week
            let selectedWeekInt = parseInt(params.get('currentWeek') || null);
            if (isNaN(selectedWeekInt)) {
                console.error("Invalid week parameter in URL");
//                selectedWeek = null;
                setDefaultWeek();
            } else {
                selectedWeek = getWeek(selectedWeekInt);
                // Set the selected week button
                $(`#week${selectedWeekInt}`).addClass('selected');
                //set the other week to removed selected and added unselected
                for (let i = 1; i <= 17; i++) {
                    if (i !== selectedWeekInt) {
                        $(`#week${i}`).removeClass('selected');
                        $(`#week${i}`).addClass('unselected');
                    }
                }
            }
            // Set the selected lesson
            let selectedLessonInt = parseInt(params.get('currentLesson') || null);
            if (isNaN(selectedLessonInt)) {
                console.log("Invalid lesson parameter in URL");
//                selectedLesson = null;
                setDefaultLesson();
            } else {
                selectedLesson = getLesson(selectedLessonInt);
                // Set the selected lesson button
                $(`#lesson${selectedLessonInt}`).addClass('selected');
                //set the other lesson to removed selected and added unselected
                for (let i = 1; i <= 8; i++) {
                    if (i !== selectedLessonInt) {
                        $(`#lesson${i}`).removeClass('selected');
                        $(`#lesson${i}`).addClass('unselected');
                    }
                }
            }
        } else {
            console.log("No URL parameters found");
        }



        //debug after loading the page
        console.log(`#####selectedGrade: ${selectedGrade}, selectedSemester: ${selectedSemester}, selectedWeek: ${selectedWeek}, selectedLesson: ${selectedLesson}`);

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


      function setDefaultGrade(){
                 //if a week is not selected, select the first week
                if (!selectedGrade) {
                    selectedGrade = 'Grade1';
                    $('#grade1').addClass('selected');
                }
               //click grade that is selected
                if (selectedGrade) {
                    //get current selected grade with class selected
                    let currentSelectedGrade =  $(`#grade${selectedGrade === 'Grade1' ? 1 : selectedGrade === 'Grade2' ? 2 : selectedGrade === 'Grade3' ? 3 : selectedGrade === 'Grade4' ? 4 : 5}`);
                    //click the label  currentSelectedGrade
                    currentSelectedGrade.click();
                }
       }

      function setDefaultWeek(){
           //if a week is not selected, select the first week
            if (!selectedWeek) {
                selectedWeek = 'Week1';
                $('#week1').addClass('selected');

            }
            //click week that is selected
            if (selectedWeek) {

                //get current selected week with class selected
                let currentSelectedWeek =  $(`#week${selectedWeek === 'Week1' ? 1 : selectedWeek === 'Week2' ? 2 : selectedWeek === 'Week3' ? 3 : selectedWeek === 'Week4' ? 4 : selectedWeek === 'Week5' ? 5 : selectedWeek === 'Week6' ? 6 : selectedWeek === 'Week7' ? 7 : selectedWeek === 'Week8' ? 8 : selectedWeek === 'Week9' ? 9 : selectedWeek === 'Week10' ? 10 : selectedWeek === 'Week11' ? 11 : selectedWeek === 'Week12' ? 12 : selectedWeek === 'Week13' ? 13 : selectedWeek === 'Week14' ? 14 : selectedWeek === 'Week15' ? 15 : selectedWeek === 'Week16' ? 16 : 17}`);
                //click the label  currentSelectedWeek
                currentSelectedWeek.click();

            }
      }

      function setDefaultLesson() {
        // If a lesson is not selected, select the first lesson
        if (!selectedLesson) {
            selectedLesson = 'Lesson1';
            $('#lesson1').addClass('selected');
        }
        // Click lesson that is selected
        if (selectedLesson) {
            // Get current selected lesson with class selected
            let currentSelectedLesson = $(`#lesson${selectedLesson === 'Lesson1' ? 1 : selectedLesson === 'Lesson2' ? 2 : selectedLesson === 'Lesson3' ? 3 : selectedLesson === 'Lesson4' ? 4 : selectedLesson === 'Lesson5' ? 5 : selectedLesson === 'Lesson6' ? 6 : selectedLesson === 'TeachPlans' ? 7 : 8}`);
            // Click the label currentSelectedLesson
            currentSelectedLesson.click();
        }
    }


/*    //set the default semester, grade, week and lesson if not selected
           if (!selectedSemester) {
                setDefaultSemester();
            }
            if (!selectedGrade) {
                setDefaultGrade();
            }
            if (!selectedWeek) {
                setDefaultWeek();
            }
            if (!selectedLesson) {
                setDefaultLesson();
            }*/


         //Refresh the file list if a lesson is selected
        if (selectedLesson) {
            RefreshFileList(getSelectedLabel('lesson-label'));
        }





    }); //end of document ready function





         //deletefile function

       function deleteFile(filePath) {
            console.log("filePath: ", filePath);
            console.log("Deleting file:", filePath);

            // Send a DELETE request to the server to delete the file
            fetch(`/delete_file`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "path": filePath
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
                console.log("File deleted successfully:", data);
                // Refresh the file list
                fetchAndDisplayFiles(); // Call the function that fetches and displays the file list
                 playSuccessSound();
            })
            .catch(error => {
                console.error('Error deleting file:', error);
            });
        }




     //function to reset the selections
    function fetchAndDisplayFiles() {
        //get a reference to the selected lesson  and call the labelClickEvent function
        const selectedLesson = document.querySelector('.lesson-label.selected');
        if (selectedLesson) {
            labelClickEvent.call(selectedLesson);
        }


    }

  //SOCKET IO RELATED CODE:

   // Listen for 'playsound' events from the server
    socket.on('playsound', () => {
        console.log('Playing sound');
        playSuccessSound();
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





     // Helper method to get selected label
        function getSelectedLabel(labelClass) {
            // Check which of the labels is selected
            const selectedLabel = document.querySelector(`.${labelClass}.selected`);
            return selectedLabel;
        }



      // Listen for 'fileUploaded' events from the server and display the files accordingly
        socket.on('fileAddedResponse', function(filepath) {


            //message to show file uploaded successfully
            toastr.success(`File uploaded successfully at path:  ${filepath}`);


              RefreshFileList(getSelectedLabel('lesson-label'));

            const ansi = new Ansi();
           console.log(ansi.rgbBackground(255, 0, 0).rgbText(255, 255, 255).bold().text('A file was upload').getLine());

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

            const ansi = new Ansi();

             console.log(ansi.rgbBackground(255, 0, 0).rgbText(255, 255, 255).bold().text('A file was deleted').getLine());

            // Play success sound
            playSuccessSound();
             update_log(); // Update the log
        });




     //LOG RELATED CODE:
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
                //clear the history log
                historyLog.value = '';
                data.forEach(log => {
                 //Yes, the get_history_logs function you provided is correct in terms of handling JSON log entries in the format {'path': path, 'timestamp': timestamp, 'filecount': filecount}.
                    const newLogEntry = `Path: ${log.path}, Timestamp: ${log.timestamp}, File Count: ${log.filecount}\n`;
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

