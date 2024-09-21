# Presentation And Delivery App Development

This project can be downloaded as a zip file or cloned as a local GitHub repository. Choose the method that suits you best.


## Setup Instructions

### Python Dependencies

1. Ensure you have Python installed on your system. You can download Python from [here](https://www.python.org/downloads/).


2. Before you start, it's recommended to create a Python virtual environment for this project. Navigate to the project directory in your terminal and run the following command to create a virtual environment:

```bash
python -m venv .venv
```

3. Activate the virtual environment by running the following command:

    - On Windows:

    ```bash
    .venv\Scripts\activate
    ```

    - On macOS and Linux:

    ```bash
    source .venv/bin/activate
    ```

3. Install the Python dependencies by navigating to the project directory in your terminal and running the following command:

    ```bash
    pip install -r requirements.txt
    ```
    ==> **_Make sure you're in the project's root directory before running the above command._**

### Node.js Dependencies

1. Ensure you have Node.js and npm installed on your system. You can download Node.js and npm from [here](https://nodejs.org/en/download/).

2. Install the Node.js dependencies by navigating to the `my_nodejs_app` directory in your terminal and running the following command:

    ```bash
    npm install
    ```
 ==> **_Make sure you're in the `my_nodejs_app` directory before running the above command._**

### **Running the Project**

To run the project, both the Python application and the Node.js server need to be started.  


Make sure you're in the project's root directory before running the application.

### **Starting the Python Application**

Before running the application, ensure that the Python virtual environment is activated. 
You can do this by navigating to the project directory in your terminal and running the following command:
    
* On Windows:

```bash
    .venv\Scripts\activate
```

* On macOS and Linux:

```bash
    source .venv/bin/activate
```
Once the virtual environment is activated, you can start the application by running the following command:

```bash
python app.py
```

This command will start both the Python application and the Node.js server. It will also generate the run_app.bat and .env files if they do not exist.

For ease of use, you can create a shortcut to the run_app.bat file and place it in a suitable location, such as your desktop.
You can then set the icon of the shortcut as desired.

Alternatively, you can start the application in a Python virtual environment terminal with the command:

```
 python gui.py

```

Please note that in future versions, raw web app link access will be removed for security reasons and the application will only be accessible with authorization.



### Environment Variables

The application uses environment variables for configuration. These are stored in a `.env` file in the root directory of the project. If the `.env` file does not exist when you start the application, a default one will be created.

You can modify the `.env` file to set the environment variables to your liking. Here's an example:

```bash
# IP address
IP_ADDRESS=192.168.1.26

# Node.js server port
NODEJS_PORT=5000

# Flask server port
FLASK_PORT=4000

# Content server port
CONTENT_PORT=4001

# Client URL
CLIENT_ORIGIN=//$IP_ADDRESS:4000

# Server URLs
NODE_SERVER_URL=//$IP_ADDRESS:5000
FLASK_SERVER_URL=//$IP_ADDRESS:4000
CONTENT_SERVER_URL=//$IP_ADDRESS:4001

# Content folder name
CONTENT_FOLDER=LessonFolders

# Set USE_HTTPS to either 'true' or 'false' to use either HTTP or HTTPS in server setup
USE_HTTPS=false
```
Replace 192.168.1.26 with your own IP address. 
If these environment variables are not set, the application will use default values.



### **Verifying the Application**

You should see a message indicating that the server is running.
You can verify this by checking the node_server_flag.txt file exists on the tree or 
by going to the following URL:

http://localhost:5000/test_nodejs

The project will be running on the address specified in the .env file. and on the port specified in the .env file.
For example, if you set the FLASK_PORT to 4000 and FLASK_HOST to 192.168.1.24  and USE_HTTPS is set to false, then project will be running on the following address:

http://192.168.1.24:4000

****Ansi Color Class:

This project includes the use of the Ansi class for convenient console logging during development. The Ansi class allows you to easily format console output with different colors, backgrounds, and styles. Here's an example of how to use it:

```javascript
new Ansi().yellow().bgGreen().bold().text(`Your text here`).print();
```

This will print the text in bold, with a yellow font color and a green background.  
Please refer to the project's source code for more details on how to use the Ansi class.


### HTTPS Configuration

If you set `USE_HTTPS` to `true` in the `.env` file, the application will use HTTPS instead of HTTP. For this to work, you need to generate SSL certificates and place them in the appropriate directory.

Here's a basic guide on how to generate a self-signed SSL certificate:

1. Navigate to the root directory of your project in the terminal.

2. Run the following command to generate a new private key and a self-signed certificate:

    ```bash
    openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
    ```

3. You will be prompted to enter a passphrase for the private key. Remember this passphrase, as you will need it to start the server.

4. The `key.pem` and `cert.pem` files will be created in the current directory. These are your private key and certificate, respectively.

Remember, self-signed certificates are not validated by a Certificate Authority (CA) and should not be used in production. For a production environment, you should obtain a certificate from a trusted CA.

After generating the certificates, update the server configuration to use them. The exact steps depend on your server setup.