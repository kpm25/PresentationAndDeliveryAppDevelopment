# blog/routes.py
from flask import render_template, request, url_for, Blueprint, redirect, g
from .utils import PostSampleData, StaticMethod
from .config import IS_BLUEPRINT


# Initialize db and Post as None
db = None
Post = None

if IS_BLUEPRINT is False:
    from .models import Post, db
else:
    # to be defined later by main app
    from blueprint_manager.app import db
    from blueprint_manager.blueprints.blog.models import Post

blueprint_base_url = 'blog'

blog_bp = Blueprint(blueprint_base_url, __name__, template_folder='templates')


@blog_bp.before_request
def before_request():
    g.blueprint_base_url = blueprint_base_url
    g.blog_base_url = blueprint_base_url


@blog_bp.route('/')
def blog_index():
    print(f'inside blog/routes.py IS_BLUEPRINT: {IS_BLUEPRINT}')
    return render_template(f'{blueprint_base_url}/index.html', title='Blog')


@blog_bp.route('/view_db')
def view_blog_db():
    if Post is not None:
        posts = Post.query.all()
        if IS_BLUEPRINT is False:
            post_data = Post.query.all()
            print(f'inside blog/routes.py IS_BLUEPRINT: {IS_BLUEPRINT}\n post_data: {post_data}')
    else:
        posts = []
    return render_template(f'{blueprint_base_url}/view_db.html', title='Blog Database', data=posts)


# create a new post
@blog_bp.route('/create', methods=['GET', 'POST'])
def create():
    # user above html form to create a new post
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        new_post = Post(title=title, content=content)
        db.session.add(new_post)
        db.session.commit()
        return redirect(url_for(f'{blueprint_base_url}.view_blog_db'))
    return render_template(f'{blueprint_base_url}/create.html', title='Create Post')


@blog_bp.route('/clear_table')
def clear_table():
    if Post is not None:
        PostSampleData.delete_all()
    return redirect(url_for(f'{blueprint_base_url}.view_blog_db'))


@blog_bp.route('/set_starting_data')
def set_starting_data():
    if Post is not None:
        PostSampleData.add_sample_data()
    return redirect(url_for(f'{blueprint_base_url}.view_blog_db'))
