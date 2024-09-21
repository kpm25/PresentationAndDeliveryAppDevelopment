# gui.py

import sys
# import threading

from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget, QMenuBar, QMenu, QAction
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtCore import QUrl
from PyQt5.QtCore import QTimer
from PyQt5.QtCore import QEvent

import time

# Import the Flask app
from multiprocessing import Process

from werkzeug.serving import run_simple
from dotenv import load_dotenv
import os
from app import app, run_app

# Load the environment variables
load_dotenv()

# Get the IP_ADDRESS value from .env file
IP_ADDRESS = os.getenv('IP_ADDRESS')

# Get the USE_HTTPS value from .env file
USE_HTTPS = os.getenv('USE_HTTPS', 'false').lower() == 'true'

protocol = 'https' if USE_HTTPS else 'http'

# Replace $IP_ADDRESS with the actual IP address in the environment variables
NODE_SERVER_URL = f"{protocol}:{os.getenv('NODE_SERVER_URL').replace('$IP_ADDRESS', IP_ADDRESS)}"
FLASK_SERVER_URL = f"{protocol}:{os.getenv('FLASK_SERVER_URL').replace('$IP_ADDRESS', IP_ADDRESS)}"

#debug the .env file
print(f"NODE_SERVER_URL: {NODE_SERVER_URL}")
print(f"FLASK_SERVER_URL: {FLASK_SERVER_URL}")
print(f"protocol: {protocol}")


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Flask App")

        # Create a QWidget for the central area
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        # Create a layout
        layout = QVBoxLayout()
        central_widget.setLayout(layout)

        # Create a web view
        self.browser = QWebEngineView()
        layout.addWidget(self.browser)

        # Get the menu bar
        menu_bar = self.menuBar()

        # # Create a menu
        # menu = QMenu("Options", menu_bar)
        # menu_bar.addMenu(menu)

        # Create a menu
        options_menu = QMenu("Options", menu_bar)
        menu_bar.addMenu(options_menu)

        # Create a new menu
        file_menu = QMenu("File", menu_bar)
        menu_bar.addMenu(file_menu)

        # Create a minimize action
        minimize_action = QAction("Minimize", self)
        options_menu.addAction(minimize_action)  # Add to options_menu

        # Connect the minimize action to the minimize method
        minimize_action.triggered.connect(self.minimize)

        # Create a test link to the Flask app at http://192.168.1.24:5000/test_nodejs

        node_server_test_link = QAction("Node Server Test", self)
        options_menu.addAction(node_server_test_link)

        # Connect the test link to the Flask app
        node_server_test_link.triggered.connect(lambda: self.browser.setUrl(QUrl(f"{NODE_SERVER_URL}/test_nodejs")))

        # Create an exit action
        exit_action = QAction("Exit", self)
        file_menu.addAction(exit_action)  # Add to file_menu

        # Connect the exit action to the close method
        exit_action.triggered.connect(self.close)

        # Create a toggle full screen action
        toggle_full_screen_action = QAction("Toggle Full Screen", self)
        options_menu.addAction(toggle_full_screen_action)  # Add to options_menu

        # Connect the toggle full screen action to the toggle_full_screen method
        toggle_full_screen_action.triggered.connect(self.toggle_full_screen)

        # Create a dropzone action
        dropzone_action = QAction("Dropzone", self)
        options_menu.addAction(dropzone_action)  # Add to options_menun)

        # Connect the dropzone action to the dropzone method
        dropzone_action.triggered.connect(self.dropzone)

        # Create a home action
        home_action = QAction("Home", self)
        options_menu.addAction(home_action)  # Add to options_menu

        # Connect the home action to the home method
        home_action.triggered.connect(self.home)

        # Display the home page by default
        self.home()




    def minimize(self):
        print("Minimize action triggered")  # Debugging print statement
        self.showMinimized()

    def close(self):
        print("Exit action triggered")  # Debugging print statement
        super().close()

    def showEvent(self, event):
        self.activateWindow()
        super().showEvent(event)

    def changeEvent(self, event):
        if event.type() == QEvent.ActivationChange:
            if self.isActiveWindow():
                self.activateWindow()
        super().changeEvent(event)

    def toggle_full_screen(self):
        if self.isFullScreen():
            self.showNormal()
        else:
            self.showFullScreen()
        QTimer.singleShot(100, self.activateWindow)  # Add this line

    def dropzone(self):
        self.browser.setUrl(QUrl(f"{FLASK_SERVER_URL}"))  # URL of your dropzone

    def home(self):
        #self.browser.setUrl(QUrl(f"{protocol}://{FLASK_SERVER_URL}/home"))  # URL of your home route
        # self.browser.setUrl(QUrl(f"{protocol}:{FLASK_SERVER_URL}/home"))  # URL of your home route
        self.browser.setUrl(QUrl(f"{FLASK_SERVER_URL}/home"))  # URL of your home route
        self.browser.loadFinished.connect(self.disable_scroll)

    def disable_scroll(self):
        disable_scroll_js = """
        var styleElement = document.createElement('style');
        styleElement.innerHTML = 'body, html { overflow: hidden; }';
        document.head.appendChild(styleElement);
        """
        self.browser.page().runJavaScript(disable_scroll_js)




if __name__ == '__main__':
    # Start the Flask app in a separate process
    flask_process = Process(target=run_app)
    flask_process.start()

    print(f"Flask app running at {protocol}://{IP_ADDRESS}:{os.getenv('FLASK_PORT')}")

    # Add a delay to give the Flask server enough time to start
    time.sleep(5)

    app = QApplication(sys.argv)
    window = MainWindow()
    # window.show()
    window.showFullScreen()  # This will start the application in full screen
    sys.exit(app.exec_())
