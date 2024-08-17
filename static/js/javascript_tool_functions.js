        //function to return strings of &nbsp; to add space between footer message and color
        function makeSpace(count) {
          alert("makeSpace function called");
          var space = "";
          for (var i = 0; i < count; i++) {
              space += "&nbsp;";
          }
          return space;
      }
      //random color generator  from one line
      function randomColor() {
        //  alert("randomColor function called");
          return '#' + Math.floor(Math.random() * 16777215).toString(16);
      }

      function changeElementColor(_document, element) {
        //  alert("changeElementColor function called, element: " + element + ", _document: " + _document);
          element.style.backgroundColor = randomColor();

      }

      //function to add drag and drop functionality
//function to add drag and drop functionality
    function addDragDrop(_element, _document){
      //alert("addDragDrop function called, id: " + _element.id);
      // Drag functionality
      let isDragging = false;
      let startX, startY, initialMouseX, initialMouseY;

      _element.addEventListener('mousedown', function(e) {
          isDragging = true;
          startX = _element.offsetLeft; // Corrected from div.offsetLeft to _element.offsetLeft
          startY = _element.offsetTop; // Corrected from div.offsetTop to _element.offsetTop
          initialMouseX = e.clientX;
          initialMouseY = e.clientY;
          e.preventDefault(); // Prevent text selection
      });

      _document.addEventListener('mousemove', function(e) {
          if (!isDragging) return;
          let dx = e.clientX - initialMouseX;
          let dy = e.clientY - initialMouseY;
          _element.style.left = startX + dx + 'px';
          _element.style.top = startY + dy + 'px';
      });

      _document.addEventListener('mouseup', function() {
          isDragging = false;
      });
    }

      //returns pop-up div at z-index 1000 with message and square color div. has button that changes to random color, has a close button which is a red square with black x
 

      //returns pop-up div at z-index 1000 with message and square color div. has button that changes to random color, has a close button which is a red square with black x
      function showPopupDiv(_document, message) {
        const color = randomColor();
        const div = _document.createElement("div");
        div.style.position = "fixed";
        div.style.top = "50%";
        div.style.left = "50%";
        div.style.transform = "translate(-50%, -50%)";
        div.style.zIndex = "1000";
        div.style.backgroundColor = "white";
        div.style.padding = "20px";
        div.style.border = "1px solid black";
        div.style.boxShadow = "5px 5px 5px 0px rgba(0,0,0,0.75)";
        div.style.textAlign = "center";

        //add id to div
        div.id = "popupDiv";

        addDragDrop(div, _document);
    
        // Message
        const messageDiv = _document.createElement("div");
        messageDiv.innerHTML = message;
        div.appendChild(messageDiv);
    
        // Add line break
        div.appendChild(_document.createElement("br"));
        div.appendChild(_document.createElement("br"));
    
        // Color square
        const colorSquare = _document.createElement("div");
        colorSquare.style.width = "100px";
        colorSquare.style.height = "100px";
        colorSquare.style.backgroundColor = color;
        colorSquare.style.display = "inline-block";
        div.appendChild(colorSquare);
    
        // Add more space
        div.appendChild(_document.createElement("br"));
        div.appendChild(_document.createElement("br"));
    
        // Change Color button
        const button = _document.createElement("button");
        button.textContent = "Change Color";
        button.onclick = function() {
           // alert("change color button clicked");
            colorSquare.style.backgroundColor = randomColor(); // Change the color of the square
        };
        div.appendChild(button);
    
        // Close button
        const closeButton = _document.createElement("button");
        closeButton.innerHTML = "X";
        closeButton.style.width = "20px";
        closeButton.style.height = "20px";
        closeButton.style.backgroundColor = "red";
        closeButton.style.color = "black";
        closeButton.style.border = "1px solid black";
        closeButton.style.display = "inline-block";
        closeButton.onclick = function() {
            div.remove();
        };
        div.appendChild(closeButton);
    
        _document.body.appendChild(div);

        return div;
    } 

 


