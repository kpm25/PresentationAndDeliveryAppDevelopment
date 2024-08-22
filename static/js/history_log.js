        let history_log_count = 0;
        let isReversed = true; // Add this line
        let historyListAutoNumber = false;
        let historyLogList = [];
        let isReversedElement = document.getElementById('isReversed');

        function addRow(str, auto_number = false) {
            var table = document.getElementById('history_log_editableTable');
            var row = document.createElement('tr');
            var cell = document.createElement('td');

            row.classList.add('line');
            row.appendChild(cell);

/*            // Add new line to historyLogList
            if (isReversed) {
                historyLogList.unshift({ number: 1, string: randomString(10) });
                table.insertBefore(row, table.firstChild);
            } else {
                historyLogList.push({ number: historyLogList.length + 1, string: randomString(10) });
                table.appendChild(row);
            }


            // Update numbering
            for (let i = 0; i < table.rows.length; i++) {
                let index = isReversed ? table.rows.length - i - 1 : i;
                historyLogList[index].number = index + 1;
                table.rows[i].cells[0].textContent = `${historyLogList[index].number}.) ${historyLogList[index].string}`;
            }*/

            // Add new line to historyLogList
            if (isReversed) {
                historyLogList.push({ number: historyLogList.length + 1, string: str });
                table.appendChild(row);
            } else {
                historyLogList.unshift({ number: 1, string: str });
                table.insertBefore(row, table.firstChild);
            }

            // Update numbering
            for (let i = 0; i < table.rows.length; i++) {
                let index = isReversed ? i : table.rows.length - i - 1;
                historyLogList[index].number = index + 1;
                if(auto_number) {
                    table.rows[i].cells[0].textContent =  `${historyLogList[index].number}.) ${historyLogList[index].string}`;
                }else{
                    table.rows[i].cells[0].textContent = `${historyLogList[index].string}`;
                }
            }

            // Update count
            history_log_count = table.rows.length;

            // Update isReversed h1
            if(document.getElementById('isReversed')) {
                isReversedElement.textContent = isReversed ? `historyLogList is reversed: ${isReversed}` : `historyLogList is reversed: ${isReversed}`;
            }
        }


        //debug addRow function with random string
        function addRowDebug() {
            addRow(randomString(10), true);
        }
        //toggle auto numbering
        function toggleAutoNumbering() {
            historyListAutoNumber = !historyListAutoNumber;
           if(document.getElementById('autoNumbering')) {
                document.getElementById('autoNumbering').textContent = `Auto Numbering: ${historyListAutoNumber}`;
            } else {
                document.getElementById('autoNumbering').textContent = `Auto Numbering: ${historyListAutoNumber}`;
            }
        }

/*        function reverseList() {
            historyLogList.reverse();
            isReversed = !isReversed;
            if(isReversed) {
                document.getElementById('editableTable').innerHTML = '';
                //display the historyLogList in reverse order but dont use addRow() function, use existing data in historyLogList
                historyLogList.forEach((item) => {
                    document.getElementById('editableTable').innerHTML += `<tr class="line"><td>${item.number}.) ${item.string}</td></tr>`;
                });

            } else {
                 document.getElementById('editableTable').innerHTML = '';
                historyLogList.forEach((item) => {
                    document.getElementById('editableTable').innerHTML += `<tr class="line"><td>${item.number}.) ${item.string}</td></tr>`;
                });
            }

      *//*      for (let i = 0; i < historyLogList.length; i++) {
                document.getElementById('editableTable').rows[i].cells[0].textContent = `${historyLogList[i].number}.) ${historyLogList[i].string}`;
            }*//*
                // Update isReversed h1
            document.getElementById('isReversed').textContent = isReversed ? `historyLogList is reversed: ${isReversed}` : `historyLogList is reversed: ${isReversed}`;
        }*/

/*        function reverseList() {
                historyLogList.reverse();
                isReversed = !isReversed;

                // Clear the table
                document.getElementById('editableTable').innerHTML = '';

                // Add the rows back in the new order
                historyLogList.forEach((item) => {
                    document.getElementById('editableTable').innerHTML += `<tr class="line"><td>${item.number}.) ${item.string}</td></tr>`;
                });

                // Update isReversed h1
                document.getElementById('isReversed').textContent = isReversed ? `historyLogList is reversed: ${isReversed}` : `historyLogList is reversed: ${isReversed}`;
            }*/

        function reverseList() {
            historyLogList.reverse();
            isReversed = !isReversed;

            var table = document.getElementById('history_log_editableTable');

            // Create an array of the existing rows
            var rows = Array.from(table.rows);

            // Clear the table
            while (table.firstChild) {
                table.removeChild(table.firstChild);
            }

            // Add the rows back in the new order
            for (let i = 0; i < rows.length; i++) {
                if (isReversed) {
                    table.insertBefore(rows[i], table.firstChild);
                } else {
                    table.appendChild(rows[i]);
                }
            }
        }

        //clear table and historyLogList
        function clearTable() {
            document.getElementById('history_log_editableTable').innerHTML = '';
            historyLogList = [];
            history_log_count = 0;
            isReversed = false;
             if(document.getElementById('isReversed')) {
                isReversedElement.textContent = isReversed ? `historyLogList is reversed: ${isReversed}` : `historyLogList is reversed: ${isReversed}`;
            }
        }

        //one line function to return random string of certain length
        function randomString(length) {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }

        //increaseFontSize()
        function increaseHistoryLogFontSize() {
            let table = document.getElementById('history_log_editableTable');
            let fontSize = parseInt(window.getComputedStyle(table).fontSize);
            table.style.fontSize = `${fontSize + 1}px`;
        }

        //decreaseFontSize()
        function decreaseHistoryLogFontSize() {
            let table = document.getElementById('history_log_editableTable');
            let fontSize = parseInt(window.getComputedStyle(table).fontSize);
            table.style.fontSize = `${fontSize - 1}px`;
        }


             //LOG RELATED CODE:



                //method to send post request to append log
    function postLog(filepath, fileCount) {

  //      console.log(`\x1b[37m before..File uploaded successfully! , filepath: ${filepath} fileCount: ${fileCount} timestamp: ${timestamp}\x1b[0m`);
        //after removing $ from the filepath
 /*       filepath = filepath.substring(1);
          console.log(`\x1b[37m before..File uploaded successfully! , filepath: ${filepath} fileCount: ${fileCount} timestamp: ${timestamp}\x1b[0m`);
        console.log(`\x1b[33;1m after..xxxxxFile uploaded successfully! , filepath: ${filepath} fileCount: ${fileCount} timestamp: ${timestamp}\x1b[0m`);
        console.log(`\x1b[1;4;41m after..yyyyyFile uploaded successfully! , filepath: ${filepath} fileCount: ${fileCount} timestamp: ${timestamp}\x1b[0m`);
        console.log(`\x1b[5m after..zzzzzile uploaded successfully! , filepath: ${filepath} fileCount: ${fileCount} timestamp: ${timestamp}\x1b[0m`);*//**//*
*/
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
                 clearTable();
                // Initialize the history log text area
//                const historyLog = document.getElementById('historyLog');
                const historyLog = document.getElementById('history_log_editableTable');
                //clear the history log
                historyLog.value = '';
                data.forEach(log => {
                 //Yes, the get_history_logs function you provided is correct in terms of handling JSON log entries in the format {'path': path, 'timestamp': timestamp, 'filecount': filecount}.
                    const newLogEntry = `Path: ${log.path}, Timestamp: ${log.timestamp}, File Count: ${log.filecount}\n`;
//                    historyLog.value += newLogEntry;
                    addRow(newLogEntry);
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


//default display of historyLogList is not reversed

        if ( document.getElementById('isReversed')) {
            isReversedElement.textContent = isReversed ? `historyLogList is reversed: ${isReversed}` : `historyLogList is reversed: ${isReversed}`;
        }
        if(document.getElementById('autoNumbering')) {
            document.getElementById('autoNumbering').textContent = `Auto Numbering: ${historyListAutoNumber}`;
        }


