//command line commands to help:
//netstat -ano | findstr :4000
//taskkill /F /PID <PID#>
//example: taskkill /F /PID 12345
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors'); // Require the cors package

// Create an Express application
const app = express();

app.use(cors({ origin: 'http://192.168.1.24:3000' }));

// Create an HTTP server
const server = http.createServer(app);
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
const io = socketIO(server, {
    cors: {
        origin: 'http://192.168.1.24:3000',
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
        socket.emit('test_event', 'Test event was fired');
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

         socket.broadcast.emit('fileAddedResponse', filepath);
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
        socket.broadcast.emit('clearHistoryResponse');
    });

});

//a test route to check if the server is running
app.get('/test_nodejs', (req, res) => {
    res.send('Server is running');
});

// Start the server
server.listen(4000, '0.0.0.0', () => {
    console.log('Node.js app listening at http://0.0.0.0:4000');
     console.log('\x1b[31m%s\x1b[0m', 'Node.js app listening at http://0.0.0.0:4000');
});

