# Presentation And Delivery App Development

## Setup Instructions

### Python Dependencies

1. Ensure you have Python installed on your system. You can download Python from [here](https://www.python.org/downloads/).

2. Install the Python dependencies by navigating to the project directory in your terminal and running the following command:

    ```bash
    pip install -r requirements.txt
    ```

### Node.js Dependencies

1. Ensure you have Node.js and npm installed on your system. You can download Node.js and npm from [here](https://nodejs.org/en/download/).

2. Install the Node.js dependencies by navigating to the `my_nodejs_app` directory in your terminal and running the following command:

    ```bash
    npm install
    ```

## Running the Project

To run the project, you need to start both the Python application and the Node.js server.

### Starting the Python Application

Navigate to the project directory in your terminal and run the following command:

```bash
python app.py
```

This command will start both the Python application and the Node.js server.  
Environment Variables.

You can create a .env file in the root directory of the project and set the following 
environment variables to your liking , example below:


 ```bash
#node js port and host
NODEJS_PORT=5000
NODEJS_HOST=0.0.0.0


#python flask port and host
FLASK_PORT=4000
FLASK_HOST=0.0.0.0


#client origin
CLIENT_ORIGIN=https://192.168.1.24:4000

#server urls
NODE_SERVER_URL=//192.168.1.24:5000
FLASK_SERVER_URL=//192.168.1.24:4000

# Set USE_HTTPS to either 'true' or 'false' so sets protocol to either http or https in server setup
USE_HTTPS=true
```

If these environment variables are not set, the application will use default values.  
Verifying the Application
You should see a message indicating that the server is running.
You can verify this by checking the node_server_flag.txt file exists on the tree or 
by going to the following URL:

http://localhost:4000/test_nodejs

The project will be running on your local machine on any local address, 
localhost or 127.0.0.1 or the IP address of your machine.

****Ansi Color Class:

This project includes the use of the Ansi class for convenient console logging during development. The Ansi class allows you to easily format console output with different colors, backgrounds, and styles. Here's an example of how to use it:

```javascript
new Ansi().yellow().bgGreen().bold().text(`Your text here`).print();
```

This will print the text in bold, with a yellow font color and a green background.  
Please refer to the project's source code for more details on how to use the Ansi class.