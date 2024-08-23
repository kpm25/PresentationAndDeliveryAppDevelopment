let socket; // Declare socket in an outer scope

try {
    socket = io.connect('https://192.168.1.24:5000');
} catch (error) {
    console.error('Error connecting to Socket.IO server:', error);
}

    /*
    Dropzone.js is a popular JavaScript library that provides drag and drop file uploads with image previews.
     The Dropzone.autoDiscover property is used to control the automatic discovery feature of Dropzone.
      When a webpage is loaded, Dropzone will automatically find any form elements with the class dropzone
       and automatically attach itself to it, turning it into a dropzone.  Setting Dropzone.autoDiscover = false;
       disables this automatic discovery feature. This is useful when you want to manually instantiate
       Dropzone on your own terms, such as when you need to pass custom configuration options to the Dropzone
       instance, or when you want to delay the instantiation of Dropzone until a certain event occurs.

    */
    // Disable Dropzone's auto-discover feature
    Dropzone.autoDiscover = false;
     // Declare dropzoneInstance at the top so it can be accessed globally
    let dropzoneInstance = null;
    let dropzoneIsDroppable = false;
    let c = null;
    let lastClickeDropzoneTargetLabel= null;

    // Declare global variables to store the selected grade, semester, week, and lesson
    let selectedGrade = null;
    let selectedSemester = null;
    let selectedWeek = null;
    let selectedLesson = null;

    // Declare global variables to store the initial size of the upload directory

   let timeCompleted = 0;
   let uploadCompleted = false;
   let intervalId = null;



// Declare global variables to store the last response from the server
    let fileCount = 0; // Initialize a counter for the uploaded files

    let lastSuccessResponse = null; // Declare a variable to store the last response
    let hasSentGetInitialSizeToServer = false; // Declare a variable to check if the initial size has been sent to the server


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


function formatBytes(bytes, decimals = 1) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function reverseFormatBytes(sizeStr) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const [size, unit] = sizeStr.split(' ');

    const i = sizes.indexOf(unit);
    if (i === -1) {
        throw new Error('Invalid unit');
    }

    const bytes = parseFloat((parseFloat(size) * Math.pow(1024, i)).toFixed(1));
    return bytes;
}






//        // Log the variables to the console
//        console.log(`selectedGrade: ${selectedGrade}, selectedSemester: ${selectedSemester}, selectedWeek: ${selectedWeek}, selectedLesson: ${selectedLesson}`);




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







/*
TODO: This is the start of the code to be implemented block....
TODO: So all code up until the end of this block is to be implemented, and not deleted
*/
//a funtion to set the dropzone dropzoneTargetLabel   to be the clicked label
//when it is clicked it checks if the chain is not broken from the semester to the end of the chain,
//and is valid and if so can set the dropzone class as dropcontent, and set the dropzoneTargetLabel to the clicked label
//then on subsequent clicks of the label, the dropzone class toggles between dropcontent and showcontent with to match the label
//class toggling between selaected and not unselected
/*
 function setDropZoneDropLabelTarget(dropzoneElement) {
        if(isSelectedLabelChainValid()){

           setDropZoneDropContent();
            // Set the dropzoneTargetLabel to the clicked label
            dropzoneTargetLabel = this;


        }else{
            setDropZoneShowContent();


        }

 }
*/





/*{
The JSON object returned by the getSelectedLabels function will look like this when converted to a string:
    "semester": {
        "value": "S1",
        "id": 1,
        "label": "Semester 1"
    },
    "grade": {
        "value": "G1",
        "id": 1,
        "label": "Grade 1"
    },
    "week": {
        "value": "W1",
        "id": 1,
        "label": "Week 1"
    },
    "lesson": {
        "value": "L1",
        "id": 1,
        "label": "Lesson 1"
    }


}*/
            /*

            //condition for the dropzone to be droppable is for there to be a chain from the semester to the next level.
            //for example semester1 -> grade1 -> week1 -> lesson1
            //or semester2 -> grade2 -> week2
            //or semester1 -> grade1
            //or semester2
            //are all valid chains. because the chain is not broken from the semester to the end of the chain, but these
            //chains are invalid: semester1 -> week1, semester1 -> lesson1, semester2 -> lesson2, semester2 -> week2 -> lesson2
            //or semester1 ->  lesson1, grade2 -> lesson2, or semester2 -> week2 -> lesson2
            //because the chain is broken from the semester to the end of the chain.
            //also the dropzone should not be in mode of class dropcontent, and not in mode of class showcontent,

            //so a fist check we can do is check if a semester is selected, if a semester is selected, then we can check if the chain is not broken from the semester to the end of the chain
            //then we check for grade and week and lesson, if the chain is broken we can alert why the files cant be dropped and its not a valid path


            //so from the selectedLabelJsonObjects, we can check if the chain is not broken from the semester to the end of the chain
            //LETS CHECK IF THE CHAIN IS NOT BROKEN FROM THE SEMESTER TO THE END OF THE CHAIN
            */



           // Function to check files can be uploaded by checking if exactly one of a semester, grade, week, and lesson has been selected
            function canUploadFiles() {
              /*  // Call the function to check if the selected label chain is valid
                const chainValidationResult = isSelectedLabelChainValid();

                // Get the dropzone element
                const dropzoneElement = document.querySelector('#singleDropzone');

                // Check if the chain is valid and the dropzone has the class 'dropcontent'
                if (!chainValidationResult.isChainBroken && dropzoneElement.classList.contains('dropcontent')) {
                    // If the conditions are met, show a toast message and return true
                    toastr.success('Files can be uploaded.');
                    return true;
                } else {
                    // If the conditions are not met, alert the user with the error message and return false
                    alert(chainValidationResult.chainBrokenReason);
                    return false;
                }*/

                return true;
            }


        function isSelectedLabelChainValid() {
            const selectedLabelJsonObjects = getSelectedLabelJsonObjects();

            let result = {
                isChainBroken: false,
                chainBrokenReason: ''
            };

            // Check if a semester is selected
            const semesterSelectedLabel = selectedLabelJsonObjects["semester"]?.label || null;
            if (!semesterSelectedLabel || !semesterSelectedLabel.classList.contains('selected')) {
                result.isChainBroken = true;
                result.chainBrokenReason = 'Please select a semester before starting the upload.';
                return result;
            }

            // Check if a grade is selected
            const gradeSelectedLabel = selectedLabelJsonObjects["grade"]?.label || null;
            if (gradeSelectedLabel && !gradeSelectedLabel.classList.contains('selected')) {
                result.isChainBroken = true;
                result.chainBrokenReason = '\nPlease select a grade after selecting a semester.';
                return result;
            }

            // Check if a week is selected
            const weekSelectedLabel = selectedLabelJsonObjects["week"]?.label || null;
            if (weekSelectedLabel && !weekSelectedLabel.classList.contains('selected')) {
                result.isChainBroken = true;
                result.chainBrokenReason = '\nPlease select a week after selecting a grade.';
                return result;
            }

            // Check if a lesson is selected
            const lessonSelectedLabel = selectedLabelJsonObjects["lesson"]?.label || null;
            if (lessonSelectedLabel && lessonSelectedLabel.classList.contains('selected') && !weekSelectedLabel.classList.contains('selected')) {
                result.isChainBroken = true;
                result.chainBrokenReason = '\nPlease select a lesson after selecting a week.';
                return result;
            }

            return result;
        }


/*     function setDropZoneDropContent() {
         const dropzoneElement = document.querySelector('#singleDropzone');
        if (!dropzoneElement.classList.contains('dropcontent')) {
            dropzoneElement.classList.remove('showcontent');
            dropzoneElement.classList.add('dropcontent');
        }
    }

    function setDropZoneShowContent() {
        const dropzoneElement = document.querySelector('#singleDropzone');
        if (!dropzoneElement.classList.contains('showcontent')) {
            dropzoneElement.classList.remove('dropcontent');
            dropzoneElement.classList.add('showcontent');
        }
    }*/

/*
        // Add event listener to the semester, grade, week, and lesson labels
        document.querySelectorAll('.semester, .grade, .week, .lesson-label').forEach(function(label) {
            label.addEventListener('click', function() {
                // Check if the current chain is valid
                if (isSelectedLabelChainValid()) {
                    // If the chain is valid, set the dropzoneTargetLabel to the clicked label
                    dropzoneTargetLabel = this;
                    setDropZoneDropContent(dropzoneTargetLabel);

                    // Change the dropzone's class to 'dropcontent'
                    const dropzoneElement = document.querySelector('#singleDropzone');
                    dropzoneElement.classList.remove('showcontent');
                    dropzoneElement.classList.add('dropcontent');
                } else {
                    // If the chain is not valid, change the dropzone's class to 'showcontent'
                    const dropzoneElement = document.querySelector('#singleDropzone');
                    dropzoneElement.classList.remove('dropcontent');
                    dropzoneElement.classList.add('showcontent');
                     setDropZoneShowContent(dropzoneElement);
                }
            });
        });
*/

/*        // Add event listener to the semester, grade, week, and lesson labels
        document.querySelectorAll('.semester, .grade, .week, .lesson-label').forEach(function(label) {
            label.addEventListener('click', function() {
                // Store the last clicked label
             //   lastClickeDropzoneTargetLabel = this;
            });
        });

        // Add event listeners to the singleDropzone elements
        document.querySelectorAll('[data-target="singleDropzone"]').forEach(function(target) {
            target.addEventListener('click', function() {
                // Handle the click event
                // You can reference lastClickedLabel here to change the behavior based on which label was clicked
            });
        });*/
/*
TODO: This is the end of the code to be implemented block....
TODO: So all code up until the end of this block is to be implemented, and not deleted
*/





   //sound related code, is muted if the checkbox is checked
    function playSuccessSound() {
        const audio = document.getElementById('successAudio');
        const muteCheckbox = document.getElementById('muteSound');
       //   testProgressBar();

        // Only play the sound if the checkbox is not checked
        if (audio && (!muteCheckbox || !muteCheckbox.checked)) {
            // Catch promise rejection when trying to play the audio
            audio.play().catch(function(error) {
                console.error('Error playing audio:', error);
            });
        }
    }
    document.getElementById('playButton').addEventListener('click', playSuccessSound);


/*
TODO: Add a filesize to each individual file upload
TODO: Add a the total filesize for the total files uploaded in a drop to the last line of the log
*/
// Function to initialize Dropzone for a lesson
function initializeDropzone() {
        // Construct the file path outside of the url function
        const filePath = `${selectedSemester}/${selectedGrade}/${selectedWeek}/${selectedLesson}`;
        //  let log_list = [];



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
            maxFilesize: 4048, // Set the maximum file size to 4GB.
            /*       renameFile: function(file) {
                var newName = `${selectedGrade}_${selectedSemester}_${selectedWeek}_${selectedLesson}_${file.name}`;
                return newName;
            },*/
            init: function() {

                this.on('success', function(file, response) {

                    //                lastSuccessResponse = response; // Store the last response
                    lastSuccessResponse = {file: file, response: response}; // Store the last response
                    //console.log(new Ansi().rgbBackground(255, 0, 255).rgbText(255, 255, 255).text(`File progress: ${file.upload.progress}`).getLine());

                });
                this.on('queuecomplete', function() {


                    if(lastSuccessResponse){
                        //                     if (Array.isArray(lastSuccessResponse.accepted_files)) {
                        if(Array.isArray(lastSuccessResponse.response.accepted_files)){
                            // Iterate over each file in the accepted_files list
                            // Iterate over each file in the accepted_files list
                            lastSuccessResponse.response.accepted_files.forEach(function(acceptedFile) {
                                //    console.log(`CHECKING FILENAME: ${acceptedFile}`);
                                //        console.log(new Ansi().rgbBackground(255, 255, 0).rgbText(0, 0, 255).text(JSON.stringify(lastSuccessResponse.file)).getLine());
                                //     console.log(new Ansi().rgbBackground(0, 255, 255).rgbText(255, 255, 255).text(`File size: ${lastSuccessResponse.file.size}, formatBytes value: ${formatBytes(lastSuccessResponse.file.size)}`).getLine());
                                //     console.log(`\x1b[32m File uploaded successfully! , file: ${lastSuccessResponse.file.size}, filepath: ${acceptedFile} response: ${lastSuccessResponse.message}\x1b[0m`);
                                socket.emit('fileAdded', acceptedFile);
                                fileCount++; // Increment the counter for each successful upload
                                // Log each individual file upload
                                //                                postLog( `$${acceptedFile}`, `${1}`, getLocalISOTime()); // Send the log to the server
                                const filesize = lastSuccessResponse.file.size;
                                postLog(acceptedFile, 1 ); // Send the log to the server

                                //                                const log_entry = {path: acceptedFile, filecount: 1};
                                //                                log_list.push(log_entry);
                                //console log in green color
                                console.log(`\x1b[32m File uploaded successfully: ${acceptedFile}\x1b[0m`);
                            });
                        }


                        // Check if response.duplicate_files is defined and is an array
                        //                    if (Array.isArray(lastSuccessResponse.duplicate_files)) {
                        if(Array.isArray(lastSuccessResponse.response.duplicate_files)){
                            // Iterate over each file in the duplicate_files list
                            lastSuccessResponse.response.duplicate_files.forEach(function(duplicateFile) {
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
                        //                    postLog(`${fileFolderPath}`, `${fileCount}`,getLocalISOTime()); // Send the log to the server


                        postLog(fileFolderPath, fileCount ); // Send the log to the server
                        /*             const log_entry = {path: fileFolderPath, filecount: fileCount};
                    log_list.push(log_entry);

                    //log all log_list entries with postLog
                    log_list.forEach(function(log_entry) {
                        postLog(log_entry.path, log_entry.filecount);
                    });
                    log_list = []; // Clear the log list*/

                    }
                    if(fileCount !== 0 ){
                        update_log();
                        playSuccessSound();
                        //write success message with file upload info in the dropzone:
                        const messageElement = this.element.querySelector('.drop-message');
                        messageElement.innerHTML = `All files have been uploaded successfully.<br> Total files uploaded: ${fileCount}<br>`;
                        messageElement.innerHTML += "Files uploaded to: " + `${fileFolderPath}`;

                        // Emit 'fileUploaded' event
                        socket.emit('filesUploaded', { path: fileFolderPath, count: fileCount });


                        uploadCompleted = true; // Set the flag to true when the upload is complete
                        //  console.log(new Ansi().rgbBackground(255, 0, 0).rgbText(255, 255, 255).bold().text(`Upload completed: ${fileFolderPath}, count: ${fileCount}, uploadCompleted: ${uploadCompleted}`).getLine());

                        hasSentGetInitialSizeToServer =  false; // Reset the flag



                         //send a post request to the server utl /upload_Completed
                        //with ajax so that the server can update its stauts....
     /*                   $.ajax({
                            url:  'https://192.168.1.24:5000/upload_Completed', //nodejs server
                            type: 'POST',
                            data: JSON.stringify({ uploadDir: fileFolderPath, totalFiles: fileCount }),
                            contentType: 'application/json',
                            success: function(response) {
                                console.log('Success:', response);
                                //bold black text on pink background
                                console.log(new Ansi().pinkBackground().blackText(0, 0, 0).bold().text(`In BLock:  this.on('queuecomplete', function(), ===> Upload completed: ${fileFolderPath}, count: ${fileCount}, uploadCompleted: ${uploadCompleted}`).getLine());
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.error('Error sending data to server:', errorThrown);
                            }
                        });*/


                           fileCount = 0; // Reset the counter after setting the message
                          dropzoneInstance.removeAllFiles();

                   /*          const url_to_redirect = getURLForCurrentDropzoneRedirect();
                            //wait 0.5 seconds and then clear the console
                            setTimeout(() => {
                                // Set the new URL
                                //bold black text on red background
                                   console.log(new Ansi().rgbBackground(255, 0, 0).rgbText(0, 0, 0).bold().text(`In BLock:  this.on('queuecomplete', function(), ===> Redirecting to: ${url_to_redirect}`).getLine());
                                  window.location.href = `https://192.168.1.24:4000/?${queryString}`;
                                  window.location.reload();
                            }, 2000);*/



                    }else{
                        /*                clearInterval(intervalId);
                      hideProgressBarPopup();
                      lastSuccessResponse = null; // Reset the last response

                     playSuccessSound();
                    //write error message in the dropzone:
                    const messageElement = this.element.query*/Selector('.drop-message');
                        messageElement.innerHTML = `No files were uploaded, probably because they were duplicates.`;
                        toastr.error(`No files were uploaded. Probably because they were duplicates.`);


                        /*
                        //wait 0.5 seconds and then clear the console
                        setTimeout(() => {
                            // Set the new URL
                              window.location.href = `https://192.168.1.24:4000/?${queryString}`;
                              window.location.reload();
                        }, 2000);*/

                    }


                    fileCount = 0; // Reset the counter after setting the message
                    this.removeAllFiles();
                    // this.removeAllFiles();
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


                    /*          if(!hasSentGetInitialSizeToServer){
                        //total file size of all files
                        const totalFileSizeToSend = this.files.reduce((total, file) => total + file.size, 0);

                        console.log(new Ansi().rgbBackground(255, 0, 255).rgbText(255, 255, 255).text(`Total file size: ${totalFileSizeToSend}, formatBytes value: ${formatBytes(totalFileSizeToSend)}`).getLine());
                           // Emit an event to get the initial size of the upload directory
                             const semesterFolder = semesterDict[selectedSemester];
                                const gradeFolder = gradeDict[selectedGrade];
                                const weekFolder = weekDict[selectedWeek];
                                const lessonFolder = lessonDict[selectedLesson];
                                const uploadDirToCheck = `LessonFolders/${semesterFolder}/${gradeFolder}/${weekFolder}/${lessonFolder}`;
                              socket.emit('getInitialSize', { uploadDir: uploadDirToCheck  , totalFileSize:totalFileSizeToSend });
                              hasSentGetInitialSizeToServer = true;
                    }*/

                });
            }
        };




        // Create a new Dropzone instance
        const dropzoneElement = document.querySelector('#singleDropzone');
        if (dropzoneElement) {
            dropzoneInstance = new Dropzone(dropzoneElement, dropzoneConfig);

            //default all labels to class showcontent
       /*         document.querySelectorAll('.drop-zone-label').forEach(function(label) {
                     // label.classList.add('showcontent');

                });*/

            // Add event listener to the lesson labels to start the upload
            document.querySelectorAll('.drop-zone-label').forEach(function(label) {
                label.addEventListener('click', function() {
                    // Set the selected lesson
                    selectedLesson = this.dataset.value;

                    // Start the upload
                    // dropzoneInstance.processQueue();
                //dropzoneElement.classList.toggle('showcontent');
                    //                    dropzoneElement.classList.toggle('dropcontent');
                   //set all labels to toggle class showcontent and dropcontent classes when a label is clicked

//                       label.classList.toggle('showcontent');
//                        label.classList.toggle('dropcontent');


                });
            });



        }//end of if dropzoneElement setup

    } //end of initializeDropzone function





$(document).ready(function() {

//            const ansi = new Ansi();
            // Set the default month
            setDefaultSemesterByMonth();
            // Initialize Dropzone instance
            initializeDropzone();
            ansi = new Ansi();

            // Add event listener for the upload button
            $('#startUpload').click(function() {
                 if(canUploadFiles()){

                            // Check if a lesson has been selected
                            if (selectedLesson !== null) {
                                console.log(`Selected lesson: ${selectedLesson}`);

                                // Start the upload
                                if (dropzoneInstance) {

                                        console.log(ansi.rgbBackground(255, 0, 255).rgbText(255, 255, 255).text(`Upload has already started, please wait for it to complete.`).getLine());

                                     // Assume dropzoneInstance is your Dropzone instance
                                        let totalFileSizeToSend = dropzoneInstance.files.reduce((total, file) => total + file.size, 0);



                                            console.log(ansi.rgbBackground(255, 0, 255).rgbText(255, 255, 255).text(`Total file size: ${totalFileSizeToSend}, formatBytes value: ${formatBytes(totalFileSizeToSend)}`).getLine());
                                           // Emit an event to get the initial size of the upload directory
                                             const semesterFolder = semesterDict[selectedSemester];
                                            const gradeFolder = gradeDict[selectedGrade];
                                            const weekFolder = weekDict[selectedWeek];
                                            const lessonFolder = lessonDict[selectedLesson];
                                            const uploadDirToCheck = `LessonFolders/${semesterFolder}/${gradeFolder}/${weekFolder}/${lessonFolder}`;

                                        $.ajax({
                                            url:  'https://192.168.1.24:5000/getInitialSize', //nodejs server
                                            //                                     url:  '/getInitialSize',  //flask server
                                            type: 'POST',
                                            data: JSON.stringify({ uploadDir: uploadDirToCheck, totalFileSize: totalFileSizeToSend }),
                                            contentType: 'application/json',
                                            success: function(response) {
                                                 // Check if the upload has already started
                                                //    if (!response.uploadStarted && !uploadedCompleted) {
                                                        console.log(ansi.rgbBackground(255, 0, 255).rgbText(255, 255, 255).text(`Initial size is: ${response.initialSize}, totalFileSize: ${totalFileSizeToSend} , expectedCompleteFolderSize: ${response.expectedCompletionSize}, uploadStarted: ${response.uploadStarted}`).getLine());
        //                                                return;
        //                                            }
                                                //amount of data to send to the server
                                                expectedCompleteFolderSize =  response.totalFileSize + response.initialSize;
                                              //  alert(`Initial size is: ${response.initialSize}, totalFileSize: ${totalFileSizeToSend} , expectedCompleteFolderSize: ${expectedCompleteFolderSize}`);
                                                // Check if the Dropzone instance has files
                                                    if (dropzoneInstance.files.length > 0) {
                                                        // The server responded successfully and there are files in the Dropzone, now you can start the upload process
                                                        dropzoneInstance.processQueue();
                                                        uploadedCompleted = false; // Set the flag to false when the upload starts

                                                        // Call getFolderSize every second
                                                            const interval = 500;
                                                            if (intervalId === null) {

                                                                    intervalId = setInterval(function() {
                                                                        getFolderSize({
                                                                            uploadDirToCheck: uploadDirToCheck,
                                                                            totalFileSize: totalFileSizeToSend,
                                                                            initialSize: response.initialSize,
                                                                            expectedCompleteFolderSize: expectedCompleteFolderSize,
                                                                            deltatime: interval
                                                                        });
                                                                    }, interval);
                                                            }


                                                    } else {
                                                        // There are no files in the Dropzone, refuse to start the upload process
                                                        alert('No files to upload. Please add files to the Dropzone before starting the upload process.');
                                                    }
                                            },
                                            error: function(jqXHR, textStatus, errorThrown) {
                                                // There was an error communicating with the server
                                                console.error('Error sending data to server:', errorThrown);
                                            }
                                        });

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



        /*    function getFolderSize() {
                const uploadDirToCheck = `LessonFolders/${semesterFolder}/${gradeFolder}/${weekFolder}/${lessonFolder}`;
                $.ajax({
                    url: `https://192.168.1.24:5000/getFolderSize?path=${encodeURIComponent(uploadDirToCheck)}`,
                    type: 'GET',
                    success: function(response) {
                        console.log(`Current folder size: ${response.folderSize}`);
                        // Update your progress bar here using response.folderSize
                        console.log(new Ansi().rgbBackground(255, 0, 100).rgbText(255, 255, 0).text(`Current folder size: ${response.folderSize}, formatBytes value: ${formatBytes(response.folderSize)}`).getLine());
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.error('Error getting folder size:', errorThrown);
                    }
                });
            }*/
        /*
                    function getFolderSize(params) {
                        let timeCompleted = 0;
                        const ansi = new Ansi();
                        intervalId = setInterval(function() { // Removed 'let' keyword
                            $.ajax({
                                url: `https://192.168.1.24:5000/getFolderSize?path=${encodeURIComponent(params.uploadDirToCheck)}`,
                                type: 'GET',
                                success: function(response) {
                                    console.log(`Current folder size: ${response.folderSize}`);
                                    const percentage = (response.folderSize / params.totalFileSize) * 100;
                                    console.log(`Upload completion: ${percentage}% , time completed: ${timeCompleted}`);
                                    console.log(ansi.rgbBackground(255, 0, 100).rgbText(255, 255, 0).text(`Current folder size: ${response.folderSize}, formatBytes value: ${formatBytes(response.folderSize)}`).getLine());

                                    if(response.folderSize >= params.expectedCompleteFolderSize || timeCompleted > 10000){
                                        console.log(`Upload completion: ${percentage}%`);
                                        clearInterval(intervalId); // Stop making AJAX requests
                                        alert(`Upload completion: ${percentage}% , folder size: ${response.folderSize}, expectedCompleteFolderSize: ${params.expectedCompleteFolderSize}`);
                                    }
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    console.error('Error getting folder size:', errorThrown);
                                }
                            });
                            timeCompleted += params.deltatime;
                            console.log(ansi.rgbBackground(255, 0, 255).rgbText(0, 0, 255).text(`Seconds: ${seconds}`).getLine());
                        }, params.deltatime);
                    }
        */


           /* function getFolderSize(params) {




                function makeRequest() {

                    // Only make the AJAX request if the upload has not completed
                    if (!uploadCompleted) {
                        $.ajax({
                            url: `https://192.168.1.24:5000/getFolderSize?path=${encodeURIComponent(params.uploadDirToCheck)}`,
                            type: 'GET',
                            success: function(response) {
                                 if(intervalId !== null){
                                         try{
                                                  console.log(`Current folder size: ${response.folderSize}`);
                                                 const percentage = (response.folderSize / params.totalFileSize) * 100;
                                                 console.log(`Upload completion: ${percentage}% , time completed: ${timeCompleted}`);
                                                 console.log(ansi.rgbBackground(255, 0, 100).rgbText(255, 255, 0).text(`Current folder size: ${response.folderSize}, formatBytes value: ${formatBytes(response.folderSize)}`).getLine());




                                                 // Show the progress bar popup when the upload starts
                                                 if (!isProgressBarRunning) {
                                                     showProgressBarPopup();
                                                 }

                                                 // Calculate the number of squares to show
                                                 const numberOfSquaresToShow = Math.floor(percentage);

                                                 // Get the current number of squares in the progress bar
                                                 let progressBarPopup = document.getElementById('progressBarPopup');
                                                 let currentNumberOfSquares = progressBarPopup ? progressBarPopup.children[0].children.length : 0;

                                                 // Add squares to the progress bar popup based on the percentage progress
                                                 for (let i = currentNumberOfSquares; i < numberOfSquaresToShow; i++) {
                                                     addSquareToProgressBarPopup(i + 1); // i + 1 because square IDs start from 1
                                                 }


                                                 *//* if(response.folderSize >= params.expectedCompleteFolderSize || timeCompleted > 10000){
                                                        console.log(`Upload completion: ${percentage}%`);
                                                        uploadCompleted = true; // Set the flag to true when the upload is complete
                                                    } else {
                                                        // Only schedule the next call if the upload is not complete
                                                        timeCompleted += params.deltatime;
                                                        console.log(ansi.rgbBackground(255, 0, 255).rgbText(0, 0, 255).text(`Seconds: ${seconds}`).getLine());
                                                        setTimeout(makeRequest, params.deltatime);
                                                    }*//*
                                                 if(response.isComplete){
                                                     console.log(`Upload completion: ${percentage}%`);
                                                     //                            uploadCompleted = true; // Set the flag to true when the upload is complete
                                                     //                             uploadStarted = false; // Set the flag to false when the upload is complete
                                                     //break the interval
                                                     //                              clearInterval(intervalId);
                                                     intervalId = null;
                                                     timeCompleted = 0;
                                                     uploadCompleted = false;
                                                     //                             //refresh the page
                                                     //                            location.reload();
                                                     // Hide the progress bar popup when the upload is complete
                                                     hideProgressBarPopup();

                                                     //stop the interval method
                                                     clearInterval(intervalId);
                                                 } else {
                                                     // Only schedule the next call if the upload is not complete
                                                     timeCompleted += params.deltatime;
                                                     console.log(ansi.rgbBackground(255, 0, 255).rgbText(0, 0, 255).text(`timeCompleted: ${timeCompleted}`).getLine());
                                                     setTimeout(makeRequest, params.deltatime);
                                                 }
                                             }else{
                                                 console.log(ansi.rgbBackground(255, 0, 255).rgbText(255, 255, 255).text(`Interval id is null`).getLine());

                                             }
                                 }catch(error){
                                        console.error('Error getting folder size:', error);

                                        }


                              },
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.error('Error getting folder size:', errorThrown);
                            }
                        });
                    }
                }

                // Start the first request
                makeRequest();
            }*/

            function getFolderSize(params) {
                        function makeRequest() {
                            if (!uploadCompleted) {
                                $.ajax({
                                    url: `https://192.168.1.24:5000/getFolderSize?path=${encodeURIComponent(params.uploadDirToCheck)}`,
                                    type: 'GET',
                                    success: function(response) {
                                        try {
                                                console.log(`Current folder size: ${response.folderSize}`);
                                                const percentage = (response.folderSize / params.totalFileSize) * 100;
                                                console.log(`Upload completion: ${percentage}% , time completed: ${timeCompleted}`);
                                                console.log(ansi.rgbBackground(255, 0, 100).rgbText(255, 255, 0).text(`Current folder size: ${response.folderSize}, formatBytes value: ${formatBytes(response.folderSize)}, percentage: ${percentage}%, expectedCompleteFolderSize: ${params.expectedCompleteFolderSize} , timeCompleted: ${timeCompleted}`).getLine());
                                                console.log(ansi.randomColorText(`Current folder size: ${response.folderSize}, formatBytes value: ${formatBytes(response.folderSize)}, percentage: ${percentage}%, expectedCompleteFolderSize: ${params.expectedCompleteFolderSize} , timeCompleted: ${timeCompleted}`, 190, 185, 170).getLine());

                                                    if (!isProgressBarRunning) {
                                                        showProgressBarPopup();
                                                    }

                                                    const numberOfSquaresToShow = Math.floor(percentage);
                                                    let progressBarPopup = document.getElementById('progressBarPopup');
                                                    let currentNumberOfSquares = progressBarPopup ? progressBarPopup.children[0].children.length : 0;

                                                    for (let i = currentNumberOfSquares; i < numberOfSquaresToShow; i++) {
                                                        addSquareToProgressBarPopup(i + 1);
                                                    }

                //                                    if(response.isComplete){
                                                    if(percentage < 100){
                                                        timeCompleted += params.deltatime;
                                                        console.log(ansi.rgbBackground(255, 0, 255).rgbText(0, 0, 255).text(`timeCompleted: ${timeCompleted}`).getLine());
                                                        setTimeout(makeRequest, params.deltatime);

                                                        /*timeCompleted = 0;
                                                        uploadCompleted = true;
                                                        hideProgressBarPopup();
                                                        clearInterval(intervalId);*/
                                                        //clear in socket response for uploaded files
                                                    } else if(percentage >= 100){
                                                            console.log(new Ansi().rgbBackground(255, 0, 255).rgbText(0, 0, 255).text(`Upload completion: ${percentage}%, timeCompleted: ${timeCompleted}, uploadCompleted: ${uploadCompleted}`).getLine());
                                                             toastr.info(`..inside  makeRequest(), Upload completion: ${percentage}%`);
                                                            console.log(ansi.rgbBackground(255, 255, 0).rgbText(0, 255, 0).bold().text(`resetting page to url:/index, percentage completed: ${percentage}%, uploadCompleted: ${uploadCompleted}, timeCompleted: ${timeCompleted}`).getLine());


                //                                            https://192.168.1.24:4000/?currentSemester=1&currentGrade=1&currentWeek=1&currentLesson=8
                                                            // Set your parameters
                                                               let semesterId = getSelectedId('semester');
                                                                let gradeId = getSelectedId('grade');
                                                                let weekId = getSelectedId('week');
                                                                let lessonId = getSelectedId('lesson-label');

                                                                //debug in yellow text, cyan background AND bold
                                                                console.log(ansi.yellowText(0, 255, 255).cyanBackground(255, 255, 255).bold().text(`semesterId: ${semesterId}, gradeId: ${gradeId}, weekId: ${weekId}, lessonId: ${lessonId}`).getLine());

                                                                // Create a string from the parameters
                                                                let params = {
                                                                    currentSemester: semesterId,
                                                                    currentGrade: gradeId,
                                                                    currentWeek: weekId,
                                                                    currentLesson: lessonId
                                                                };

                                                                let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');



                                                                //debug in yellow text, cyan background AND bold the url
                                                              //  console.log(ansi.yellowText(0, 255, 255).cyanBackground(255, 255, 255).bold().text(window.location.href).getLine());


                                                                  timeCompleted = 0;
                                                                  clearInterval(intervalId);
                                                                  hideProgressBarPopup();
                                                                  lastSuccessResponse = null; // Reset the last response

                                                                 playSuccessSound();
                                                                 toastr.success(`Upload completed files successfully!`);
                                                                //use    if (dropzoneInstance) { to clear the dropzone
                                                                if(dropzoneInstance){
                                                                    fileCount = 0; // Reset the counter after setting the message
                                                                    dropzoneInstance.removeAllFiles();
                                                                    console.log(ansi.rgbBackground(255, 0, 255).rgbText(255, 255, 255).text(`dropzoneInstance.removeAllFiles() called`).getLine());
                                                                }


                                                                //wait 0.5 seconds and then clear the console
                                                                setTimeout(() => {
                                                                    // Set the new URL
                                                                      window.location.href = `https://192.168.1.24:4000/?${queryString}`;
                                                                      window.location.reload();
                                                                }, 2000);


                                                               /* playSuccessSound();
                                                               toastr.success(`Upload completed successfully!, refreshing state...`);
                                                                //wait for 1 second before refreshing the page
                                                                setTimeout(function(){
                                                                    window.location.reload();
                                                                }, 1000);*/




                                            }//if percentage is 100 or more
                                        } catch(error) {
                                            console.error('Error getting folder size:', error);
                                        }
                                    },
                                    error: function(jqXHR, textStatus, errorThrown) {
                                        console.error('Error getting folder size:', errorThrown);
                                    }
                                });
                            }
                        }

            makeRequest();
        }




});//end of document ready function


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
      }// End of getSelectedId function

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
    }// End of redirectToDisplayZone function





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


}); //end of document ready function




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


   //function to get the url for the current dropzone redirect
    function getURLForCurrentDropzoneRedirect() {
        //example pattern to achieve:   https://192.168.1.24:4000/?currentSemester=1&currentGrade=1&currentWeek=1&currentLesson=8
                let semesterId = getSelectedId('semester');
                let gradeId = getSelectedId('grade');
                let weekId = getSelectedId('week');
                let lessonId = getSelectedId('lesson-label');

                //debug in yellow text, cyan background AND bold
                console.log(new Ansi().yellowText(0, 255, 255).cyanBackground(255, 255, 255).bold().text(`semesterId: ${semesterId}, gradeId: ${gradeId}, weekId: ${weekId}, lessonId: ${lessonId}`).getLine());

                // Create a string from the parameters
                let params = {
                    currentSemester: semesterId,
                    currentGrade: gradeId,
                    currentWeek: weekId,
                    currentLesson: lessonId
                };


                const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
                const url_to_redirect = `https://192.168.1.24:4000/?${queryString}`;

            return url_to_redirect;
    }

   //socket test
    function socketTest() {

        // Emit a 'test_event' event
          playSuccessSound();
          socket.emit('test_event');
        console.log('Test event emitted');
          const ansi = new Ansi();
           console.log(ansi.rgbBackground(255, 0, 0).rgbText(255, 255, 255).bold().text('Test event emitted').getLine());
        toastr.success("A test event was fired");
        console.log(new Ansi().rgbBackground(122, 122, 0).rgbText(0, 0, 255).text(`test message...`).getLine());

    }

    socket.on('test_event', (data) => {
       toastr.warning(data);
    });


       // Listen for 'filesUploadedResponse' events from the server
    socket.on('filesUploadedResponse', function(fileData) {
      toastr.success(`socket.on('filesUploadedResponse', function(fileData)====> Files were uploaded to the server at path:  ${fileData.path}, count: ${fileData.count}`);
          const ansi = new Ansi();
           console.log(ansi.rgbBackground(255, 0, 0).rgbText(255, 255, 255).bold().text(`socket.on('filesUploadedResponse', function(fileData)====>  Files were uploaded to the server at path:  ${fileData.path}, count: ${fileData.count}`).getLine());
            playSuccessSound();
        /////////////////////////////////////
          //  https://192.168.1.24:4000/?currentSemester=1&currentGrade=1&currentWeek=1&currentLesson=8
            // Set your parameters
               const url_to_redirect = getURLForCurrentDropzoneRedirect();

                //debug in yellow text, cyan background AND bold the url
              //  console.log(ansi.yellowText(0, 255, 255).cyanBackground(255, 255, 255).bold().text(window.location.href).getLine());


                  timeCompleted = 0;
                  clearInterval(intervalId);
                  hideProgressBarPopup();
                  lastSuccessResponse = null; // Reset the last response

                //debug in green text, yellow background AND bold
                 console.log(ansi.greenText(0, 255, 255).yellowBackground().bold().text(`url_to_redirect: ${url_to_redirect}, uploadCompleted: ${uploadCompleted}, timeCompleted: ${timeCompleted}`).getLine());

                 playSuccessSound();
                 toastr.success(`Upload completed: ${fileData.path}, count: ${fileData.count}, uploadCompleted: ${uploadCompleted}`);

                  update_log(); // Update the log
                //clear the dropzone
                 if(dropzoneInstance){
                    fileCount = 0; // Reset the counter after setting the message
                    dropzoneInstance.removeAllFiles();
                    console.log(ansi.rgbBackground(255, 0, 255).rgbText(255, 255, 255).text(`dropzoneInstance.removeAllFiles() called`).getLine());
                }



                //wait 0.5 seconds and then clear the console
                setTimeout(() => {
                    // Set the new URL
                      window.location.href = `https://192.168.1.24:4000/?${url_to_redirect}`;
                      window.location.reload();
                }, 2000);



        /////////////////////////////////s

    } );

//reload the page
   socket.on('reload', function() {
       toastr.warning('Reloading page...');
       console.log(new Ansi().rgbBackground(255, 0, 255).rgbText(255, 0, 0).bold().text('Reloading page...').getLine());
       playSuccessSound();
//        location.reload();

   } );




        // Listen for 'fileDeletedResponse' events from the server
        socket.on('fileDeletedResponse', function(filepath) {
            // Message to show file deleted successfully
            toastr.success('File deleted successfully: ' + filepath);
           const ansi = new Ansi();
           console.log(ansi.rgbBackground(255, 0, 0).rgbText(255, 255, 255).bold().text('File deleted successfully: ' + filepath).getLine());

            // Refresh the file list
            RefreshFileList(getSelectedLabel('lesson-label'));

            // Play success sound
            playSuccessSound();
             update_log(); // Update the log
        })



// Function to set the default semester based on the current month of the year
function setDefaultSemesterByMonth() {
        // Get the current month
        const currentMonth = new Date().getMonth();
        //bold cyan on white in capitals
         console.log(new Ansi().bold().cyanText(0, 255, 255).text(`FRESH LOAD!!! ==>  CURRENT MONTH IS: ${currentMonth}`).getLine());

        // Check if the current month is between March and August
        if (currentMonth >= 2 && currentMonth <= 7) {
            // Select Semester 2 by default
            $('#semester2').addClass('selected');
            console.log("semester 2 selected");
            selectedSemester =  $('#semester2').val();
            //bold cyan on white in capitals
            console.log(new Ansi().bold().cyanText(0, 255, 255).text(`FRESH LOAD!!! ==>  SELECTED SEMESTER IS: ${selectedSemester}`).getLine());
        } else {
            // Select Semester 1 by default
            $('#semester1').addClass('selected');
            console.log("semester 1 selected");
            selectedSemester =  $('#semester1').val();
            //bold cyan on white in capitals
            console.log(new Ansi().bold().cyanText(0, 255, 255).text(`FRESH LOAD!!! ==>  SELECTED SEMESTER IS: ${selectedSemester}`).getLine());
        }

    return selectedSemester;
}



 //functions that take an int and return the corresponding semester, grade, week, or lesson:

function getSemester(semesterInt) {
    if (semesterInt === 1) {
        return "S1";
    } else {
        return "S2";
    }
}// End of getSemester function

//function to take a current grade as int and return the selected grade as 2 Character string
function getGrade(gradeInt) {
    return "G" + gradeInt;
}// End of getGrade function
//function to take a current week as int and return the selected week as string
function getWeek(weekInt) {
    return "W" + weekInt;
}// End of getWeek function

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
}// End of getLesson function




//use this info to work out how to make function below to return the current selected label
// <button id="semester1" class="semester" value="S1">1</button>
// <button id="semester2" class="semester" value="S2">2</button>
//
// <button id="grade1" class="grade" value="G1">1</button>
//<button id="grade2" class="grade" value="G2">2</button>
//<button id="grade3" class="grade" value="G3">3</button>
//<button id="grade4" class="grade" value="G4">4</button>
//<button id="grade5" class="grade" value="G5">5</button>
//
// <button id="week1" class="week" value="W1">1</button>
//<button id="week2" class="week" value="W2">2</button>
//<button id="week3" class="week" value="W3">3</button>
//<button id="week4" class="week" value="W4">4</button>
//<button id="week5" class="week" value="W5">5</button>
//<button id="week6" class="week" value="W6">6</button>
//<button id="week7" class="week" value="W7">7</button>
//<button id="week8" class="week" value="W8">8</button>
//<button id="week9" class="week" value="W9">9</button>
//<button id="week10" class="week" value="W10">10</button>
//<button id="week11" class="week" value="W11">11</button>
//<button id="week12" class="week" value="W12">12</button>
//<button id="week13" class="week" value="W13">13</button>
//<button id="week14" class="week" value="W14">14</button>
//<button id="week15" class="week" value="W15">15</button>
//<button id="week16" class="week" value="W16">16</button>
//<button id="week17" class="week" value="W17">17</button>
//
//<div class="lesson-label" id="lesson1" data-target="singleDropzone" data-value="L1">Lesson 1</div>
//<div class="lesson-label" id="lesson2" data-target="singleDropzone" data-value="L2">Lesson 2</div>
//<div class="lesson-label" id="lesson3" data-target="singleDropzone" data-value="L3">Lesson 3</div>
//<div class="lesson-label" id="lesson4" data-target="singleDropzone" data-value="L4">Lesson 4</div>
//<div class="lesson-label" id="lesson5" data-target="singleDropzone" data-value="L5">Lesson 5</div>
//<div class="lesson-label" id="lesson6" data-target="singleDropzone" data-value="L6">Lesson 6</div>
//<div class="lesson-label" id="lesson7" data-target="singleDropzone" data-value="TP">Teaching Plans</div>
//<div class="lesson-label" id="lesson8" data-target="singleDropzone" data-value="MS">Miscellaneous Materials</div>



/*{
The JSON object returned by the getSelectedLabels function will look like this when converted to a string:
    "semester": {
        "value": "S1",
        "id": 1,
        "label": "Semester 1"
    },
    "grade": {
        "value": "G1",
        "id": 1,
        "label": "Grade 1"
    },
    "week": {
        "value": "W1",
        "id": 1,
        "label": "Week 1"
    },
    "lesson": {
        "value": "L1",
        "id": 1,
        "label": "Lesson 1"
    }
}*/

 //function to return a json object with the selected semester, grade, week, and lesson
    function getSelectedLabelJsonObjects() {
        // Get the selected semester, grade, week, and lesson as a JSON object of label objects and their values or data-value(for lesson-label)
           let selectedLabelValues = {
                "semester": {},
                "grade": {},
                "week": {},
                "lesson": {}
            };
        //check which of each of the semester, grade, week, and lesson has a selected class, only one of each should have a selected class
        //check  which of semester has .selected class and get the int value of ist id
        for (let i = 1; i <= 2; i++) {
            if ($(`#semester${i}`).hasClass('selected')) {
                selectedSemester = i;
                selectedLabelValues["semester"].value = getSemester(i);
                selectedLabelValues["semester"].id = `semester${i}`;
                selectedLabelValues["semester"].label = document.getElementById(selectedLabelValues["semester"].id ); //get the label of the selected semester
                console.log(new Ansi().skyBlueText().yellowBackground().bold().text(`selectedSemester: ${selectedSemester}`).getLine());
            }
        }

        if(!selectedSemester){
            selectedLabelValues["semester"].value = setDefaultSemesterByMonth();
            selectedLabelValues["semester"].id = `semester${parseInt(selectedSemester)}`;
            selectedLabelValues["semester"].label = document.getElementById(selectedLabelValues["semester"].id); //get the label of the selected semester
            console.log(new Ansi().skyBlueText().yellowBackground().bold().text(`selectedSemester: ${selectedSemester}`).getLine());
        }

        // Check which grade has .selected class and get the int value of its id
        for (let i = 1; i <= 5; i++) {
            if ($(`#grade${i}`).hasClass('selected')) {
                selectedGrade = i;
                selectedLabelValues["grade"].value = getGrade(i);
                selectedLabelValues["grade"].id = `grade${i}`;
                selectedLabelValues["grade"].label = document.getElementById(selectedLabelValues["grade"].id); //get the label of the selected grade
                console.log(new Ansi().skyBlueText().yellowBackground().bold().text(`selectedGrade: ${selectedGrade}`).getLine());
            }
        }

        // If no grade is selected, select the first grade
        if (!selectedGrade) {
            selectedGrade = 1;
            selectedLabelValues["grade"].value = getGrade(1);
            selectedLabelValues["grade"].id = `grade1`;
            selectedLabelValues["grade"].label = document.getElementById(selectedLabelValues["grade"].id); //get the label of the selected grade
            console.log(new Ansi().skyBlueText().yellowBackground().bold().text(`selectedGrade: ${selectedGrade}`).getLine());
        }

        // Check which week has .selected class and get the int value of its id
        for (let i = 1; i <= 17; i++) {
            if ($(`#week${i}`).hasClass('selected')) {
                selectedWeek = i;
                selectedLabelValues["week"].value = getWeek(i);
                selectedLabelValues["week"].id = `week${i}`;
                selectedLabelValues["week"].label = document.getElementById(selectedLabelValues["week"].id); //get the label of the selected week
                console.log(new Ansi().skyBlueText().yellowBackground().bold().text(`selectedWeek: ${selectedWeek}`).getLine());
            }
        }

        // If no week is selected, select the first week
        if (!selectedWeek) {
            selectedWeek = 1;
            selectedLabelValues["week"].value = getWeek(1);
            selectedLabelValues["week"].id = `week1`;
            selectedLabelValues["week"].label = document.getElementById(selectedLabelValues["week"].id); //get the label of the selected week
            console.log(new Ansi().skyBlueText().yellowBackground().bold().text(`selectedWeek: ${selectedWeek}`).getLine());
        }

        // Check which lesson-label has .selected class and get the data-value of its id
        for (let i = 1; i <= 8; i++) {
            if ($(`#lesson${i}`).hasClass('selected')) {
                selectedLesson = i;
                selectedLabelValues["lesson"].value = getLesson(i);
                selectedLabelValues["lesson"].id = `lesson${i}`;
                selectedLabelValues["lesson"].label = document.getElementById(selectedLabelValues["lesson"].id); //get the label of the selected lesson
                console.log(new Ansi().skyBlueText().yellowBackground().bold().text(`selectedLesson: ${selectedLesson}`).getLine());
            }
        }

        // If no lesson-label is selected, select the first lesson
        if (!selectedLesson) {
            selectedLesson = 1;
            selectedLabelValues["lesson"].value = getLesson(1);
            selectedLabelValues["lesson"].id = `lesson1`;
            selectedLabelValues["lesson"].label = document.getElementById(selectedLabelValues["lesson"].id); //get the label of the selected lesson
            console.log(new Ansi().skyBlueText().yellowBackground().bold().text(`selectedLesson: ${selectedLesson}`).getLine());
        }


        // Return the selected labels as a JSON object
        return selectedLabelValues;
    }


     //function to set the selected semester, grade, week, and lesson based on the selected labels from    getSelectedLabels function
    function getSelectedLabels() {
        const selectedLabelJsonObjects = getSelectedLabelJsonObjects();
        // Set the selected semester, grade, week, and lesson based on the selected labels
        selectedSemester = selectedLabelJsonObjects["semester"].value;
        selectedGrade = selectedLabelJsonObjects["grade"].value;
        selectedWeek = selectedLabelJsonObjects["week"].value;
        selectedLesson = selectedLabelJsonObjects["lesson"].value;

        return {
            selectedSemester,
            selectedGrade,
            selectedWeek,
            selectedLesson
        }
    }

//

   // ..wait for page to fully load
    window.addEventListener('load', (event) => {
        // Get the selected semester, grade, week, and lesson
           const selectedLabels = getSelectedLabels();
        //pink text with yellow background
        console.log(new Ansi().rgbBackground(255, 255, 0).rgbText(255, 0, 255).text(`FRESH RELOAD!!!!!! selectedSemester: ${selectedLabels.selectedSemester}, selectedGrade: ${selectedLabels.selectedGrade}, selectedWeek: ${selectedLabels.selectedWeek}, selectedLesson: ${selectedLabels.selectedLesson}`).getLine());

  });











































































































































































































//logs related code:

/*
     //history log:

        //method to send post request to append log
    function postLog(filepath, fileCount) {
 */
/*       console.log(`\x1b[37m before..File uploaded successfully! , filepath: ${filepath} fileCount: ${fileCount} timestamp: ${timestamp}\x1b[0m`);
        //after removing $ from the filepath
        filepath = filepath.substring(1);
          console.log(`\x1b[37m before..File uploaded successfully! , filepath: ${filepath} fileCount: ${fileCount} timestamp: ${timestamp}\x1b[0m`);
        console.log(`\x1b[33;1m after..xxxxxFile uploaded successfully! , filepath: ${filepath} fileCount: ${fileCount} timestamp: ${timestamp}\x1b[0m`);
        console.log(`\x1b[1;4;41m after..yyyyyFile uploaded successfully! , filepath: ${filepath} fileCount: ${fileCount} timestamp: ${timestamp}\x1b[0m`);
        console.log(`\x1b[5m after..zzzzzile uploaded successfully! , filepath: ${filepath} fileCount: ${fileCount} timestamp: ${timestamp}\x1b[0m`);*//*

          const ansi = new Ansi();
        console.log(ansi.rgbBackground(122, 122, 0).rgbText(0, 0, 255).text(`filepath: ${filepath} fileCount: ${fileCount}`).getLine());

        // Send a POST request to the server to append the log
        fetch('/append_log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "path": filepath,
                "filecount": Number(fileCount)
//                "timestamp": timestamp
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

   */
/*  function appendLog(path, timestamp, fileCount) {
        const historyLog = document.getElementById('historyLog');
        const newLogEntry = `Path: ${path}, Timestamp: ${timestamp} File Count: ${fileCount}\n`;
       //place the new log entry at the top of the history log
           historyLog.value = newLogEntry + historyLog.value;

    }*//*






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

            const ansi = new Ansi();
           console.log(ansi.rgbBackground(122, 122, 0).rgbText(0, 0, 255).text(`log Lines Of Single File Data:: ${logLinesOfSingleFileData}`).getLine());
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
    update_log();*/
