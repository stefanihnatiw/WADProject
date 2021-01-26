import os, base64, json, csv, random
from flask import *
import recommandations
from recommandations import get_data, get_similar_images, get_artists_list, filter_files, get_artist_data

app = Flask(__name__)
app.secret_key = "super secret key"
app.config['DATASET_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'dataset')
app.config['RESIZED_FOLDER'] = os.path.join(app.config['DATASET_FOLDER'], 'resized')
app.config['IMAGES_FOLDER'] = os.path.join(app.config['DATASET_FOLDER'], 'images')
app.config['GRAPHS_FOLDER'] = os.path.join(app.config['DATASET_FOLDER'], 'graphs')


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

@app.route('/getImages/<page_number>/<number_rows>/<number_cols>/<set_filters>/<search_input>', methods=['GET'])
def get_images(page_number, number_rows, number_cols, set_filters, search_input):
    page_number = int(page_number)
    number_rows = int(number_rows)
    number_cols = int(number_cols)
    set_filters = json.loads(set_filters)
    images = []
    start = (page_number - 1) * number_rows * number_cols
    end = page_number * number_rows * number_cols
    image_nr = -1
    filtered_files = filter_files(set_filters, search_input)
    for (root, dirs, files) in os.walk(app.config['RESIZED_FOLDER']):
        if image_nr == end:
            break
        for filename in files:
            file_path = os.path.join(root, filename)
            if not file_path.endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif')) or \
                    (len(filtered_files) > 0 and not filename in filtered_files):
                continue
            image_nr += 1
            if start <= image_nr < end:
                with open(file_path, 'rb') as f:
                    file_data = base64.b64encode(f.read()).decode('utf-8')
                    image_data = {"title": filename, "data": file_data}
                images.append(image_data)
    return jsonify({'images': images})


@app.route('/display_image/<filename>', methods=['GET', 'POST'])
def display_image(filename):
    return render_template('display_image.html', filename=filename)


@app.route('/getArtistData/<artistname>', methods=['GET'])
def get_artist_info(artistname):
    artist_data = get_artist_data(artistname.replace("_", " "))
    data = list()
    input_file = csv.DictReader(open("recomm_df.csv"))
    work_added = 0
    for row in input_file:
        if work_added == 10:
            break
        if artistname == row['label']:
            filename = row['img_path'].rsplit("\\", 1)[1]
            file_path = os.path.join(app.config['RESIZED_FOLDER'], filename)
            with open(file_path, 'rb') as f:
                file_data = base64.b64encode(f.read()).decode('utf-8')
            data.append({"title": filename,
                         "artist": artistname,
                         "data": file_data})
            work_added += 1
    random.shuffle(data)
    for i in range(0, 5):
        del data[i]
    artist_data["works"] = data
    return jsonify({'artist': artist_data})


@app.route('/display_artist/<artistname>', methods=['GET', 'POST'])
def display_artist(artistname):
    return render_template('display_artist.html', artistname=artistname)


@app.route('/browse_images', methods=['GET', 'POST'])
def browse_images():
    return render_template('browse_images.html')


@app.route('/getArtistsDisplay/<page_number>/<number_rows>/<number_cols>', methods=['GET'])
def get_artists_display(page_number, number_rows, number_cols):
    page_number = int(page_number)
    number_rows = int(number_rows)
    number_cols = int(number_cols)
    artists = []
    start = (page_number - 1) * number_rows * number_cols
    end = page_number * number_rows * number_cols
    artist_nr = -1
    input_file = csv.DictReader(open("artists.csv"))
    for row in input_file:
        if artist_nr == end:
            break
        artist_nr += 1
        if start <= artist_nr < end:
            artist_data = {"name": row["name"], "years": row["years"], "genre": row["genre"],
                           "nationality": row["nationality"], "bio": row["bio"], "paintings": row["paintings"]}
            artists.append(artist_data)
    return jsonify({'artists': artists})


@app.route('/browse_artists', methods=['GET', 'POST'])
def browse_artists():
    return render_template('browse_artists.html')


@app.route('/getGraphs', methods=['GET'])
def get_graphs():
    graphs = []
    for (root, dirs, files) in os.walk(app.config['GRAPHS_FOLDER']):
        for filename in files:
            file_path = os.path.join(root, filename)
            if not file_path.endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif')):
                continue
            with open(file_path, 'rb') as f:
                file_data = base64.b64encode(f.read()).decode('utf-8')
                graph_data = {"data": file_data}
            graphs.append(graph_data)
    return jsonify({'graphs': graphs})


@app.route('/visualize', methods=['GET', 'POST'])
def visualize():
    return render_template('visualize.html')


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
