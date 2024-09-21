//command line commands to help:
//netstat -ano | findstr :4000
//taskkill /F /PID <PID#>
//example: taskkill /F /PID 12345

require('dotenv').config();
const express = require('express');

// Get the IP_ADDRESS value from .env file
const IP_ADDRESS = process.env.IP_ADDRESS;

// Get the USE_HTTPS value from .env file
//const USE_HTTPS = process.env.USE_HTTPS || 'false';
const USE_HTTPS = (process.env.USE_HTTPS || 'false').toLowerCase() === 'true';
//const protocol = USE_HTTPS === 'true' ? 'https' : 'http';
const protocol = USE_HTTPS ? 'https' : 'http';

//++++ENV VARIABLES++++
// Replace $IP_ADDRESS with the actual IP address in the environment variables
//const NODEJS_HOST = process.env.NODEJS_HOST.replace('$IP_ADDRESS', IP_ADDRESS);
//const FLASK_HOST = process.env.FLASK_HOST.replace('$IP_ADDRESS', IP_ADDRESS);
//const CONTENT_HOST = process.env.CONTENT_HOST.replace('$IP_ADDRESS', IP_ADDRESS);
//const CLIENT_ORIGIN = `${protocol}:${process.env.CLIENT_ORIGIN.replace('$IP_ADDRESS', IP_ADDRESS)}`;
//const NODE_SERVER_URL = `${protocol}:${process.env.NODE_SERVER_URL.replace('$IP_ADDRESS', IP_ADDRESS)}`;
//const FLASK_SERVER_URL = `${protocol}:${process.env.FLASK_SERVER_URL.replace('$IP_ADDRESS', IP_ADDRESS)}`;
//const CONTENT_SERVER_URL = `${protocol}:${process.env.CONTENT_SERVER_URL.replace('$IP_ADDRESS', IP_ADDRESS)}`;

//+++ END ENV VARIABLES++++

//const NODE_SERVER_URL = `${protocol}://192.168.1.24:5000`;
//const FLASK_SERVER_URL = `${protocol}://192.168.1.24:4000`;
const NODE_SERVER_URL = `${protocol}:${process.env.NODE_SERVER_URL.replace('$IP_ADDRESS', IP_ADDRESS)}`;
const FLASK_SERVER_URL = `${protocol}:${process.env.FLASK_SERVER_URL.replace('$IP_ADDRESS', IP_ADDRESS)}`;


const http = require('http');
const https = require('https');

// Depending on the USE_HTTPS value, require the appropriate module
//const http = USE_HTTPS === 'true' ? require('https') : require('http');
const fs = require('fs');
const path = require('path');
const socketIO = require('socket.io');
const cors = require('cors'); // Require the cors package
console.log('Enter app.js file.....');
const Ansi = require('./ansi_text.js');
////ansi text colors
// ansi = new Ansi();

// Create an Express application
const app = express();

//get ports and hosts from .env file FLASK_PORT and FLASK_HOST
const FLASK_PORT = process.env.FLASK_PORT || 4000;
//const FLASK_HOST = process.env.FLASK_HOST || 'localhost';
const FLASK_HOST = process.env.FLASK_HOST.replace('$IP_ADDRESS', IP_ADDRESS) || 'localhost';

//get port and host from .env file NODEJS_PORT and NODEJS_HOST
const NODEJS_PORT = process.env.NODEJS_PORT || 5000;
//const NODEJS_HOST = process.env.NODEJS_HOST || 'localhost';
const NODEJS_HOST = process.env.NODEJS_HOST.replace('$IP_ADDRESS', IP_ADDRESS) || 'localhost';

////app.use(cors({ origin: `http://192.168.1.24:${process.env.FLASK_PORT}` }));
//app.use(cors({ origin: `https://${FLASK_HOST}:${FLASK_PORT}` }));

// Get the client-side application's origin from an environment variable
//const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN  || `https://localhost:4000`;  ..notes from .env file: CLIENT_ORIGIN=//192.168.1.24:4000, so need to add protocol and ':' to the origin
//const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN  || `${USE_HTTPS === 'true' ? 'https' : 'http'}://localhost:4000`;
//const CLIENT_ORIGIN = `${protocol}:${process.env.CLIENT_ORIGIN}` || `${protocol}://localhost:4000`;
const CLIENT_ORIGIN = `${protocol}:${process.env.CLIENT_ORIGIN.replace('$IP_ADDRESS', IP_ADDRESS)}` || `${protocol}://localhost:4000`;

let uploadComplete = true;
let initialSize = 0;
let expectedCompletionSize = 0;

new Ansi().yellow().bgBlack().bold().italic().underline().text(`   client origin is  ${CLIENT_ORIGIN}   `).print();

// Set up CORS
//app.use(cors({ origin: CLIENT_ORIGIN }));
//use all origins during development:
app.use(cors());


app.use(express.json());

let options;
new Ansi().blue().bgPink().bold().italic().underline().text(`USE_HTTPS is: ${USE_HTTPS}`).print();
if (USE_HTTPS) {
    //certificate and key files
     options = {
        key: fs.readFileSync('./new_key_no_passphrase.pem'),
        cert: fs.readFileSync('./new_cert.pem')
    }

    //if key and cert have text content then print keys and cert exist
    if (options.key && options.cert) {
        new Ansi().red().bgWhite().bold().italic().underline().text(`Certificate and key files were loaded `).print();
    }
}



//port and host
 // console.log(ansi.rgbBackground(0, 123, 123).rgbText(255, 165, 255).italic().bold().underline().text(`Port from env is: ${process.env.NODEJS_PORT}, Host from env is: ${process.env.NODEJS_HOST}`).getLine());
    new Ansi().bgRGB(0, 123, 123).rgb(255, 165, 255).italic().bold().underline().text(`Port from env is: ${process.env.NODEJS_PORT}, Host from env is: ${process.env.NODEJS_HOST}`).print();

//debug in cyan color
//console.log('\x1b[36m%s\x1b[0m', `Node.js app listening at https://${NODEJS_HOST}:${NODEJS_PORT}`);
//new Ansi().cyan().text(`Node.js app listening at ${USE_HTTPS === 'true' ? 'https' : 'http'}://${NODEJS_HOST}:${NODEJS_PORT}`).print();
new Ansi().cyan().text(`Node.js app listening at ${protocol}://${NODEJS_HOST}:${NODEJS_PORT}`).print();

// Create an HTTP server
//const server = http.createServer(app);
// Create an HTTPS server
//const server = https.createServer(options, app);
// Depending on the USE_HTTPS value, create the appropriate server
//const server = USE_HTTPS === 'true' ? https.createServer(options, app) : http.createServer(app);
const server = USE_HTTPS ? https.createServer(options, app) : http.createServer(app);

// Create an HTTP server with custom request logging
/*const server = http.createServer((req, res) => {
    // Don't log requests to /socket.io/
    if (!req.url.startsWith('/socket.io/')) {
        console.log(`${req.method} ${req.url}`);
    }

    // Pass the request to the Express application
    app(req, res);
});*/


// Create a Socket.IO server
//const io = socketIO(server);
// Create a Socket.IO server and allow CORS
/*
const io = socketIO(server, {
    cors: {
//        origin: 'http://192.168.1.24:3000',
        origin: `https://${NODEJS_HOST}:${NODEJS_PORT}`,
        methods: ['GET', 'POST']
    }
});

*/

// Set up Socket.IO with CORS
//const io = socketIO(server, {
//    cors: {
//        origin: CLIENT_ORIGIN,
//        methods: ['GET', 'POST']
//    }
//});

//for development use all origins
// Set up Socket.IO with CORS
const io = socketIO(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Listen for 'connection' events from clients
io.on('connection', (socket) => {
    console.log('A user connected.....');

    // Listen for 'fileUploaded' events from this client
  //   socket.emit('filesUploaded', { path: fileFolderPath, count: fileCount });
    socket.on('filesUploaded', (fileData) => {
        //debug in cyan color
//        console.log(`\x1b[36m%s\x1b[0m Files were uploaded to the server at path:  ${fileData.path}, count: ${fileData.count}`);
        new Ansi().cyan().text(`Files were uploaded to the server at path:  ${fileData.path}, count: ${fileData.count}`).print();

        // Broadcast a 'playsound' event to all other clients
         // socket.broadcast.emit('filesUploadedResponse', fileData);
           io.emit('filesUploadedResponse', fileData);
        //socket.emit('filesUploadedResponse',  {path: fileData.path, count: fileData.count});

        //rainbow color debug message with cyan background
        // console.log(ansi.randomColorText(` socket.on('filesUploaded', (fileData) =>  Files were uploaded to the server at path:  ${fileData.path}, count: ${fileData.count}`, 0, 255, 255).getLine());
        new Ansi().randomColorText(` socket.on('filesUploaded', (fileData) =>  Files were uploaded to the server at path:  ${fileData.path}, count: ${fileData.count}`, 0, 255, 255).print();
        // console.clear();

            //wait 0.5 seconds and then clear the console
       /*   setTimeout(() => {
            console.clear();
           }, 3000);*/
    });

    //test "test_event" event in green debug color
    socket.on('test_event', () => {
        console.log('\x1b[32m%s\x1b[0m', 'A test event was fired');
//        socket.emit('test_event', 'Test event was fired');
        io.emit('test_event', 'Test event was fired');
    });

    // Listen for 'disconnect' events from this client
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    //listen for files added and delete events
                // When a file is added
//            io.emit('fileAdded', file);
//
//            // When a file is deleted
//            io.emit('fileDeleted', file);

    // Listen for 'fileAdded' events from this client
//    socket.on('fileAdded', (file) => {
    //returns two parameters filename and filepath
    socket.on('fileAdded', (filepath) => {
        //debug in cyan color
        console.log('\x1b[36m%s\x1b[0m', 'A file was added');
        console.log(`File was added at path ${filepath}`);
        // Broadcast a 'fileAdded' event to all other clients

//         socket.broadcast.emit('fileAddedResponse', filepath);
         io.emit('fileAddedResponse', filepath);  //test for all clients temporarily
         // socket.emit('fileAddedResponse', file);
        //magenta color debug message
        console.log('\x1b[35m%s\x1b[0m', 'A file was added');

    } );

    // Listen for 'fileDeleted' events from this client
    socket.on('fileDeleted', (filepath) => {
        //debug in cyan color
        console.log('\x1b[36m%s\x1b[0m', 'A file was deleted');
        console.log(`File was deleted at path ${filepath}`);

        // Broadcast a 'fileDeleted' event to all other clients
//        socket.broadcast.emit('fileDeletedResponse',  filepath);
         io.emit('fileDeletedResponse',  filepath);
    } );

    //delete all files
    socket.on('deleteAllFiles', () => {
        //debug in cyan color
        console.log('\x1b[36m%s\x1b[0m', 'All files were deleted');
        // Broadcast a 'deleteAllFiles' event to all other clients
//        socket.broadcast.emit('fileDeletedResponse');
        io.emit('fileDeletedResponse');
    } );

     //history log cleared
    socket.on('clearHistory', () => {
        //debug in cyan color
        console.log('\x1b[36m%s\x1b[0m', 'History log was cleared');
        // Broadcast a 'clearHistory' event to all other clients
//        socket.broadcast.emit('fileDeletedResponse');
//        socket.broadcast.emit('clearHistoryResponse');
        io.emit('clearHistoryResponse'); //test for all clients temporarily
    });

/*      socket.on('getInitialSize', (data) => {
          console.log('\n\n\n\n'+`Data received from client: ${data.uploadDir}, ${data.totalFileSize}`+'\n\n\n\n');
          const initialSize = calculateFolderSize(data.uploadDir);

             console.log(`Initial size is: ${data.initialSize}, data.uploadDir is: ${data.uploadDir} , totalSize to reach  is: ${data.totalFileSize}`);
            // Calculate the initial size of the upload directory
            //const initialSize = calculateInitialSize(data.uploadDir);  // Replace this with your function to calculate the initial size
         // Replace this with your function to calculate the initial size
//        socket.emit('initialSize', { initialSize: initialSize });
          console.log(`Initial size is: ${initialSize}, data.uploadDir is: ${data.uploadDir} , totalSize to reach  is: ${data.totalFileSize}`);
          io.emit('initialSize', { initialSize: initialSize , totalFileSize:totalFileSizeToSend});
     });*/

});

// Function to calculate the initial size of the upload directory
app.post('/getInitialSize', (req, res) => {
 /*   if(!uploadeComplete){

    return res.json({ message: 'Upload is not complete' });
    }*/
  //   if(uploadComplete){ //if upload, this means that the upload was completed and we can get get another upload
        const data = req.body;
        initialSize = calculateFolderSize(data.uploadDir);
        expectedCompletionSize = data.totalFileSize + initialSize;
        console.log('\n\n\n\n'+`Data received from client: ${data.uploadDir}, ${data.totalFileSize}`+'\n\n\n\n');

        console.log(`Initial size is: ${initialSize}, data.uploadDir is: ${data.uploadDir} , totalSize to reach  is: ${data.totalFileSize} , expectedCompletionSize is: ${expectedCompletionSize}`);
        // Add a new property 'uploadStarted' to the response
        res.json({
            initialSize: initialSize,
            totalFileSize: data.totalFileSize,
            uploadStarted: false,
            expectedCompletionSize: expectedCompletionSize
        });
        uploadComplete = false;
    // }
/*else {
        // If the upload has already started, return a response indicating so
        res.json({
            message: 'Upload has already started',
            uploadStarted: true

        });
    }*/
});



// Function to calculate the size of a folder
app.get('/getFolderSize', (req, res) => {
    //is folder size greater to or equal to expectedCompletionSize, if so then upload is complete and return the folder size
    const calculatedFolderSize = calculateFolderSize(req.query.path);
    const uploadCompleted =  calculatedFolderSize   >= expectedCompletionSize;
    if(uploadCompleted && !uploadComplete){


      //    console.log(ansi.randomColorText(`Upload is complete, folder size is: ${calculatedFolderSize}, expectedCompletionSize is: ${expectedCompletionSize}`, 255, 0, 255).getLine());
        new Ansi().randomColorText(`Upload is complete, folder size is: ${calculatedFolderSize}, expectedCompletionSize is: ${expectedCompletionSize}`, 255, 0, 255).print();
       //initailize the variables
        initialSize = 0;
        expectedCompletionSize = 0;
         uploadComplete = true;


        return res.json({ message: 'Upload is complete' , folderSize: calculatedFolderSize , isComplete: true });

    } else{
             const folderPath = req.query.path; // Get the folder path from the query parameters
            const folderSize = calculateFolderSize(folderPath); // Use your existing function to calculate the folder size
            //debug in cyan color yellow text
             //  console.log(ansi.cyanBackground().yellowText().italic().bold().underline().text(`\n\nFolder size is: ${folderSize} , folder path is: ${folderPath}\n\n`).getLine());
              //  console.log(ansi.randomColorText(`\n\nFolder size is: ${folderSize} , folder path is: ${folderPath}\n\n`, 255, 0, 255).getLine());
                new Ansi().randomColorText(`\n\nFolder size is: ${folderSize} , folder path is: ${folderPath}\n\n`, 255, 0, 255).print();

             res.json({ folderSize: folderSize });
           //send socket message to reload the page
           ///  io.emit('reloadPage');
             //cls the console
       //     console.clear();

    }

});

//post request to upload_Completed
app.post('/uploadCompleted', (req, res) => {
    uploadComplete = true;
     initialSize = 0;
    expectedCompletionSize = 0;
    new Ansi().red().bgWhite().bold().text(`\n\n\nIN ROUTE: /uploadCompleted ===> Upload is complete...\nupload.Dir is: ${req.body.uploadDir}\n\n\n totalFileCount is: ${req.body.totalFiles}\n\n\n`).print();

    //gold bold text on cyan background display status of:
//    uploadComplete = true;
//     initialSize = 0;
//    expectedCompletionSize = 0;
    new Ansi().gold().bgCyan().bold().text(`\n\n\nIN ROUTE: /uploadCompleted ===> Upload is complete...\nupload.Dir is: ${req.body.uploadDir}\n\n\n totalFileCount is: ${req.body.totalFiles}\n\n\n`).print();

    res.json({ message: 'Upload is complete' });
});


function calculateFolderSize(dirPath) {
    let totalSize = 0;

    // Check if the directory exists
    if (fs.existsSync(dirPath)) {
        // Synchronously read the directory
        const files = fs.readdirSync(dirPath);

        // Iterate over each file
        for (let file of files) {
            // Get the full path of the file
            const filePath = path.join(dirPath, file);

            // Get the stats of the file
            const stats = fs.statSync(filePath);

            // If the file is a directory, recursively calculate its size
            if (stats.isDirectory()) {
                totalSize += calculateFolderSize(filePath);
            } else {
                // If the file is a regular file, add its size to the total size
                totalSize += stats.size;
            }
        }
    }

    return totalSize;
}


//a test route to check if the server is running
app.get('/test_nodejs', (req, res) => {
    res.send('Server is running');
});

/*
// Node.js server
app.get('/config', (req, res) => {
    res.json({ nodeServerUrl: process.env.NODE_SERVER_URL });
});
*/


/*
// Start the server
//server.listen(4000, '0.0.0.0', () => {
server.listen(NODEJS_PORT, NODEJS_HOST, () => {
//      console.log('Node.js app listening at http://0.0.0.0:4000');
//      console.log('\x1b[31m%s\x1b[0m', 'Node.js app listening at http://0.0.0.0:4000');
    //https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
    console.log(`\x1b[31m  Node.js app listening at https://${NODEJS_HOST}:${NODEJS_PORT} \x1b[0m`);
});
*/


// Start the server
//server.listen(4000, '0.0.0.0', () => {
server.listen(NODEJS_PORT, NODEJS_HOST, () => {
//      console.log('Node.js app listening at http://0.0.0.0:4000');
//      console.log('\x1b[31m%s\x1b[0m', 'Node.js app listening at http://0.0.0.0:4000');
    //https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
//    new Ansi().yellow().bgCyan().text(`Node.js app listening at http${USE_HTTPS === 'true' ? 's' : ''}://${NODEJS_HOST}:${NODEJS_PORT}`).print();
    new Ansi().yellow().bgCyan().text(`Node.js app listening at ${protocol}://${NODEJS_HOST}:${NODEJS_PORT}`).print();
});




