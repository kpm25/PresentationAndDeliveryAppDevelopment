document.addEventListener('DOMContentLoaded', () => {
  const gradeButtons = document.querySelectorAll('.grade');
  const semesterButtons = document.querySelectorAll('.semester');
  const weekButtons = document.querySelectorAll('.week');
  const lessonLabels = document.querySelectorAll('.lesson');
  const dropzones = document.querySelectorAll('.dropzone');

  let currentLesson = '';
  let currentGrade = '';
  let currentSemester = '';
  let currentWeek = '';

  const dropzoneStates = {};
  dropzones.forEach(dropzone => {
    const id = dropzone.getAttribute('id');
    dropzoneStates[id] = true;
    dropzone.classList.add('showcontent');
    const messageElement = dropzone.querySelector('.drop-message');
    messageElement.innerText = "You must make a selection for Grade, Semester, and Week.";
  });

  function updateDropzoneMessages() {
    const message = currentGrade && currentSemester && currentWeek ?
      `Drop Content Here for  Grade ${currentGrade}, Semester ${currentSemester}, Week ${currentWeek}, ${currentLesson}` :
      "You must make a selection for Grade, Semester, and Week.";

    dropzones.forEach(dropzone => {
      const messageElement = dropzone.querySelector('.drop-message');
      messageElement.innerText = message;
    });
  }

function addEventListeners(elements, setCurrentSelection) {
  elements.forEach(element => {
    element.addEventListener('click', () => {
      // If the clicked element is already selected, deselect it and remove 'selected' and 'unselected' classes from all elements
      if (element.classList.contains('selected')) {
        elements.forEach(el => {
          el.classList.remove('selected');
          el.classList.remove('unselected');
        });
        setCurrentSelection('');
      } else {
        // If the clicked element is not selected, deselect all elements and select the clicked one
        elements.forEach(el => {
          el.classList.remove('selected');
          el.classList.add('unselected');
        });
        element.classList.add('selected');
        element.classList.remove('unselected');
        setCurrentSelection(element.innerText);
      }
      updateDropzoneMessages();
    });
  });
}

  addEventListeners(gradeButtons, (value) => currentGrade = value);
  addEventListeners(semesterButtons, (value) => currentSemester = value);
  addEventListeners(weekButtons, (value) => currentWeek = value);
  addEventListeners(lessonLabels, (value) => currentLesson = value);

  lessonLabels.forEach(label => {
    label.addEventListener('click', () => {
      const targetId = label.getAttribute('data-target');
      const targetDropzone = document.getElementById(targetId);
      const messageElement = targetDropzone.querySelector('.drop-message');

      targetDropzone.classList.toggle('showcontent');
      targetDropzone.classList.toggle('dropcontent');

      if (targetDropzone.classList.contains('dropcontent')) {
        label.classList.add('selected');
        label.classList.remove('unselected');
        messageElement.style.display = "block";
      } else {
        messageElement.style.display = "none";
      }

      dropzoneStates[targetId] = targetDropzone.classList.contains('dropcontent');

      Object.keys(dropzoneStates).forEach(id => {
        if (id !== targetId) {
          const otherDropzone = document.getElementById(id);
          otherDropzone.classList.add('showcontent');
          otherDropzone.classList.remove('dropcontent');
          dropzoneStates[id] = false;
          const otherMessageElement = otherDropzone.querySelector('.drop-message');
          if (otherMessageElement) {
            otherMessageElement.style.display = "none";
          }
        }
      });

      currentLesson = label.getAttribute('id');
      updateDropzoneMessages();
    });
  });
});


  //function to remove selected and unselected classes from the grade, semester and week class elements and set all dropzone dropzone states to showcontent
  function resetSelections() {

    const gradeButtons = document.querySelectorAll('.grade');
    const semesterButtons = document.querySelectorAll('.semester');
    const weekButtons = document.querySelectorAll('.week');
    const lessonLabels = document.querySelectorAll('.lesson');
    const dropzones = document.querySelectorAll('.dropzone');

    gradeButtons.forEach(button => {
      button.classList.remove('selected');
      button.classList.remove('unselected');
    });

    semesterButtons.forEach(button => {
      button.classList.remove('selected');
      button.classList.remove('unselected');
    });

    weekButtons.forEach(button => {
      button.classList.remove('selected');
      button.classList.remove('unselected');
    });

    lessonLabels.forEach(label => {
      label.classList.remove('selected');
      label.classList.remove('unselected');

    });

    dropzones.forEach(dropzone => {

      dropzone.classList.add('showcontent');
      dropzone.classList.remove('dropcontent');
       //hide the drop-zone message
      const messageElement = dropzone.querySelector('.drop-message');
      messageElement.style.display = "none";


    });
  }



/*
document.addEventListener('DOMContentLoaded', () => {
  const gradeButtons = document.querySelectorAll('.grade');
  const semesterButtons = document.querySelectorAll('.semester');
  const weekButtons = document.querySelectorAll('.week');
//  const dropzoneLabels = document.querySelectorAll('.drop-zone-label');
    const lessonLabels = document.querySelectorAll('.lesson-label');
  const dropzones = document.querySelectorAll('.dropzone');

  // Variables to store current selections
  let currentLesson = '';
  let currentGrade = '';
  let currentSemester = '';
  let currentWeek = '';

  // Initialize all dropzones to showcontent state and set initial message
  const dropzoneStates = {};
  dropzones.forEach(dropzone => {
    const id = dropzone.getAttribute('id');
    dropzoneStates[id] = true; // true represents showcontent state
    dropzone.classList.add('showcontent');
    const messageElement = dropzone.querySelector('.drop-message');
    messageElement.innerText = "You must make a selection for Grade, Semester, and Week.";
  });


 // Function to update dropzone messages
 function updateDropzoneMessages() {
  // Check if all selections are made
  const message = currentGrade && currentSemester && currentWeek ?
    `Drop Content Here for  Grade ${currentGrade}, Semester ${currentSemester}, Week ${currentWeek}, ${currentLesson}` :
    "You must make a selection for Grade, Semester, and Week.";

  dropzones.forEach(dropzone => {
    const messageElement = dropzone.querySelector('.drop-message');
    messageElement.innerText = message;
  });
} 


  gradeButtons.forEach(button => {
    button.addEventListener('click', () => {
      gradeButtons.forEach(btn => {
        btn.classList.remove('selected');
        btn.classList.add('unselected'); // Add 'unselected' to all initially
      });
      button.classList.add('selected');
      button.classList.remove('unselected'); // Remove 'unselected' from the selected button
      currentGrade = button.innerText;
      updateDropzoneMessages(); // Update messages after selection
    });
  });

  semesterButtons.forEach(button => {
    button.addEventListener('click', () => {
      semesterButtons.forEach(btn => {
        btn.classList.remove('selected');
        btn.classList.add('unselected'); // Add 'unselected' to all initially
      });
      button.classList.add('selected');
      button.classList.remove('unselected'); // Remove 'unselected' from the selected button
      currentSemester = button.innerText;
      updateDropzoneMessages(); // Update messages after selection
    });
  });

  weekButtons.forEach(button => {
    button.addEventListener('click', () => {
      weekButtons.forEach(btn =>{
         btn.classList.remove('selected')
         btn.classList.add('unselected'); // Add 'unselected' to all initially
         });
      button.classList.add('selected');
      button.classList.remove('unselected'); // Remove 'unselected' from the selected button
      currentWeek = button.innerText;
      updateDropzoneMessages(); // Update messages after selection
    });
  });


     

  lessonLabels.forEach(label => {
    label.addEventListener('click', () => {
      // Remove 'selected' class from all labels initially
      lessonLabels.forEach(lbl => {
        lbl.classList.remove('selected');
        lbl.classList.add('unselected'); // Add 'unselected' to all initially
      });
  
      const targetId = label.getAttribute('data-target');
      const targetDropzone = document.getElementById(targetId);
      const messageElement = targetDropzone.querySelector('.drop-message');
  
      // Toggle the dropzone state
      targetDropzone.classList.toggle('showcontent');
      targetDropzone.classList.toggle('dropcontent');
  
      // Check the new state of the clicked dropzone to decide on the 'selected' class
      if (targetDropzone.classList.contains('dropcontent')) {
        label.classList.add('selected'); // Add 'selected' only if in 'dropcontent' state
        label.classList.remove('unselected'); // Remove 'unselected' if in 'dropcontent' state
        messageElement.style.display = "block"; // Show message for the active dropzone
      } else {
        messageElement.style.display = "none"; // Hide message if not in 'dropcontent' state
      }
  
      // Update the dropzoneStates object
      dropzoneStates[targetId] = targetDropzone.classList.contains('dropcontent');
  
      // Ensure other dropzones are reset to 'showcontent' state and their messages are hidden
      Object.keys(dropzoneStates).forEach(id => {
        if (id !== targetId) {
          const otherDropzone = document.getElementById(id);
          otherDropzone.classList.add('showcontent');
          otherDropzone.classList.remove('dropcontent');
          dropzoneStates[id] = false; // Update state to showcontent
          const otherMessageElement = otherDropzone.querySelector('.drop-message');
          if (otherMessageElement) {
            otherMessageElement.style.display = "none"; // Hide message for non-active dropzones
          }
        }
      });
  
      // Extract and set the current lesson based on the label's text
      const labelText = label.textContent.trim();
    //  currentLesson = labelText;
//       currentLesson = this.getAttribute('data-value');
      //curent lesson is id to text
        currentLesson = label.getAttribute('id');
  
      // Optionally, update messages or UI based on the new selection
      updateDropzoneMessages();


    });
  });


  
});





*/
