import os.path
from flask import *
from markupsafe import Markup

app = Flask(__name__)
app.secret_key = "super secret key"
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads')


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/browse_images', methods=['GET', 'POST'])
def browse_images():
    if request.method == 'POST':
        return render_template('browse_images.html')
    else:
        return render_template('browse_images.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        return 'POST request'
    elif request.method == 'GET':
        return 'GET request'


@app.route('/submit', methods=['GET', 'POST'])
def submit():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'img' not in request.files:
            flash('No file part', 'error')
            return redirect(request.url)
        file = request.files['img']
        # if user does not select file, browser submits an empty part without filename
        if file.filename == '':
            flash('No selected file', 'error')
            return redirect(request.url)
        if file:
            filename = file.filename
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            fname = request.form.get('fname')
            lname = request.form.get('lname')
            return render_template('handle_data.html', fname=fname, lname=lname, filename=filename)
    else:
        return render_template('submit.html')


@app.route('/user/<username>')
def profile(username):
    return '{}\'s profile'.format(escape(username))


@app.route('/projects/')
def projects():
    return 'The project page'


@app.route('/about')
def about():
    return 'The about page'


with app.test_request_context():
    print(url_for('index'))
    print(url_for('login'))
    print(url_for('login', next='/'))
    print(url_for('profile', username='John Doe'))
