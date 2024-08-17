// Variables to store current selections
let currentLesson = '';
let currentGrade = '';
let currentSemester = '';
let currentWeek = '';

document.addEventListener('DOMContentLoaded', () => {
  resetSelections();
  setDefaultMonth();
});


// Function to remove selected classes from the grade, semester, week, and lesson elements
function resetSelections() {
  ['.semester', '.grade', '.week', '.lesson-label'].forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.classList.remove('selected');
      element.classList.remove('unselected');
      element.addEventListener('click', function() {
        // If this element is already selected, deselect it
        if (this.classList.contains('selected')) {
          this.classList.remove('selected');
          this.classList.add('unselected');
          // Update the corresponding variable
          if (selector === '.semester') {
            currentSemester = '';
          } else if (selector === '.grade') {
            currentGrade = '';
          } else if (selector === '.week') {
            currentWeek = '';
          } else if (selector === '.lesson-label') {
            currentLesson = '';
          }
        } else {
          // Deselect all elements in the group
          elements.forEach(el => {
            el.classList.remove('selected');
            el.classList.add('unselected');
          });
          // Add 'selected' class to the clicked element
          this.classList.add('selected');
          this.classList.remove('unselected');
          // Update the corresponding variable
          if (selector === '.semester') {
            currentSemester = this.innerText;
          } else if (selector === '.grade') {
            currentGrade = this.innerText;
          } else if (selector === '.week') {
            currentWeek = this.innerText;
          } else if (selector === '.lesson-label') {
            currentLesson = this.getAttribute('id');
          }
        }
        console.log(`currentSemester: ${currentSemester}, currentGrade: ${currentGrade}, currentWeek: ${currentWeek}, currentLesson: ${currentLesson}`);

        // Check if any elements in the group are selected
        const isSelected = Array.from(elements).some(el => el.classList.contains('selected'));
        if (!isSelected) {
          // If none are selected, remove both 'selected' and 'unselected' classes from all elements in the group
          elements.forEach(el => {
            el.classList.remove('selected');
            el.classList.remove('unselected');
          });
        }
      });
    });
  });
}

function setDefaultMonth() {
  // Get the current month
  const currentMonth = new Date().getMonth();
  console.log("current month is: ", currentMonth);
  // Check if the current month is between March and August
  if (currentMonth >= 2 && currentMonth <= 7) {
    // Select Semester 2 by default
    document.querySelector('#semester2').classList.add('selected');
    console.log("semester 2 selected");
    currentSemester = document.querySelector('#semester2').innerText;
    console.log("current semester is: ", currentSemester);
  } else {
    // Select Semester 1 by default
    document.querySelector('#semester1').classList.add('selected');
    console.log("semester 1 selected");
    currentSemester = document.querySelector('#semester1').innerText;
    console.log("current semester is: ", currentSemester);
  }
}
