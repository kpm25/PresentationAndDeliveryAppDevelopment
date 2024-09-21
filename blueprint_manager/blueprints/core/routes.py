from flask import render_template, Blueprint

core_bp = Blueprint('core', __name__, template_folder='templates')

@core_bp.route('/')
def core_index():
    return render_template('core/index.html', title='Core')