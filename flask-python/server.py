import os, base64
from flask import *
from recommandations import get_data, get_similar_images, get_artists_list

app = Flask(__name__)
app.secret_key = "super secret key"
app.config['DATASET_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'dataset')
app.config['RESIZED_FOLDER'] = os.path.join(app.config['DATASET_FOLDER'], 'resized')
app.config['IMAGES_FOLDER'] = os.path.join(app.config['DATASET_FOLDER'], 'images')


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/getArtists', methods=['GET'])
def get_artists():
    return jsonify({'artists': get_artists_list()})

@app.route('/getImageRecs/<filename>', methods=['GET'])
def get_image_recs(filename):
    return jsonify({'recs': get_similar_images(filename)})

@app.route('/getImageData/<filename>', methods=['GET'])
def get_image_data(filename):
    image_data = get_data(filename)
    folder = filename.rsplit("_", 1)[0]
    file_path = os.path.join(app.config['IMAGES_FOLDER'], folder, filename + ".jpg")
    with open(file_path, 'rb') as f:
        file_data = base64.b64encode(f.read()).decode('utf-8')
        image_data["data"] = file_data
    return jsonify({'image': image_data})

@app.route('/getImages/<page_number>/<number_rows>/<number_cols>', methods=['GET'])
def get_images(page_number, number_rows, number_cols):
    page_number = int(page_number)
    number_rows = int(number_rows)
    number_cols = int(number_cols)
    images = []
    start = (page_number - 1) * number_rows * number_cols
    end = page_number * number_rows * number_cols
    image_nr = -1
    for (root, dirs, files) in os.walk(app.config['RESIZED_FOLDER']):
        if image_nr == end:
            break
        for file in files:
            file_path = os.path.join(root, file)
            if not file_path.endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif')):
                continue
            image_nr += 1
            if start <= image_nr < end:
                with open(file_path, 'rb') as f:
                    file_data = base64.b64encode(f.read()).decode('utf-8')
                    image_data = {"title": file, "data": file_data}
                images.append(image_data)
    return jsonify({'images': images})


@app.route('/display_image/<filename>', methods=['GET', 'POST'])
def display_image(filename):
    return render_template('display_image.html', filename=filename)


@app.route('/browse_images', methods=['GET', 'POST'])
def browse_images():
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
            # file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

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
