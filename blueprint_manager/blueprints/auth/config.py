# auth/config.py

import os

basedir = os.path.abspath(os.path.dirname(__file__))


print(f'inside auth/config.py basedir: {basedir}')

# is a blueprint boolean variable that is used to determine if the blueprint is registered or not.
IS_BLUEPRINT = True
