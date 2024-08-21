//command line commands to help:
//netstat -ano | findstr :4000
//taskkill /F /PID <PID#>
//example: taskkill /F /PID 12345

require('dotenv').config();
const express = require('express');
//const http = require('http');
const https = require('https');
const fs = require('fs');
const socketIO = require('socket.io');
const cors = require('cors'); // Require the cors package
console.log('Enter app.js file.....');
const Ansi = require('./ansi_text.js');
////ansi text colors
 ansi = new Ansi();

// Create an Express application
const app = express();

//get ports and hosts from .env file FLASK_PORT and FLASK_HOST
const FLASK_PORT = process.env.FLASK_PORT || 4000;
const FLASK_HOST = process.env.FLASK_HOST || 'localhost';

//get port and host from .env file NODEJS_PORT and NODEJS_HOST
const NODEJS_PORT = process.env.NODEJS_PORT || 5000;
const NODEJS_HOST = process.env.NODEJS_HOST || 'localhost';

////app.use(cors({ origin: `http://192.168.1.24:${process.env.FLASK_PORT}` }));
//app.use(cors({ origin: `https://${FLASK_HOST}:${FLASK_PORT}` }));

// Get the client-side application's origin from an environment variable
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN  || `https://localhost:4000`;


console.log(ansi.yellowBackground().blackText().italic().bold().underline().text(`   client origin is  ${CLIENT_ORIGIN}   `).getLine());

// Set up CORS
app.use(cors({ origin: CLIENT_ORIGIN }));




//certificate and key files
const options = {
  key: fs.readFileSync('./new_key_no_passphrase.pem'),
  cert: fs.readFileSync('./new_cert.pem')
}
//  console.log(`\x1b[1;4;41m Certificate and key files were loaded ${options.key} and ${options.cert} \x1b[0m`);

//if key and cert have text content then print keys and cert exist
if (options.key && options.cert) {
    const text = ansi.redBackground().whiteText().italic().bold().underline().text(`Certificate and key files were loaded `).getLine();
    console.log(text);

}






//port and host
  console.log(ansi.rgbBackground(0, 123, 123).rgbText(255, 165, 255).italic().bold().underline().text(`Port from env is: ${process.env.NODEJS_PORT}, Host from env is: ${process.env.NODEJS_HOST}`).getLine());

//debug in cyan color
console.log('\x1b[36m%s\x1b[0m', `Node.js app listening at https://${NODEJS_HOST}:${NODEJS_PORT}`);

// Create an HTTP server
//const server = http.createServer(app);
// Create an HTTPS server
const server = https.createServer(options, app);

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
const io = socketIO(server, {
    cors: {
        origin: CLIENT_ORIGIN,
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
        console.log(`\x1b[36m%s\x1b[0m Files were uploaded to the server at path:  ${fileData.path}, count: ${fileData.count}`);

        // Broadcast a 'playsound' event to all other clients
         // socket.broadcast.emit('filesUploadedResponse', fileData);
           io.emit('filesUploadedResponse', fileData);
        //socket.emit('filesUploadedResponse',  {path: fileData.path, count: fileData.count});

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

});

//a test route to check if the server is running
app.get('/test_nodejs', (req, res) => {
    res.send('Server is running');
});

// Start the server
//server.listen(4000, '0.0.0.0', () => {
server.listen(NODEJS_PORT, NODEJS_HOST, () => {
//      console.log('Node.js app listening at http://0.0.0.0:4000');
//      console.log('\x1b[31m%s\x1b[0m', 'Node.js app listening at http://0.0.0.0:4000');
    //https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
    console.log(`\x1b[31m  Node.js app listening at https://${NODEJS_HOST}:${NODEJS_PORT} \x1b[0m`);
});

