import pandas as pd
from annoy import AnnoyIndex
from ast import literal_eval
import csv, os, base64, random

resized_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'dataset', 'resized')
image_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'dataset', 'images')

pd.set_option('display.max_rows', 500)
pd.set_option('display.max_columns', 500)
pd.set_option('display.width', 1000)

# read the pre-saved dataframe
df = pd.read_csv('recomm_df.csv', converters={"img_repr": literal_eval})
# Initialize the annoy index used for computing the nearest neighbors
annoy_idx = AnnoyIndex(len(df['img_repr'][0]), metric='euclidean')
for it, vector in enumerate(df['img_repr']):
    annoy_idx.add_item(it, vector)
_ = annoy_idx.build(n_trees=50)


def get_similar_images_annoy(img_index, img_no, annoy_idx, df):
    base_img_id, base_vct, base_lbl = df.iloc[img_index, [0, 3, 1]]
    similar_img_ids = annoy_idx.get_nns_by_item(img_index, img_no)
    return base_img_id, base_lbl, df.iloc[similar_img_ids]


def get_recommendations(img_path):
    # Get index of an image in the dataframe by its path
    imgidx = df.loc[df['img_path'] == img_path].index[0]
    # call the function and get the recommendations dataframe (first image is the requested one)
    base_image, base_label, similar_images_df = get_similar_images_annoy(img_index=imgidx, img_no=11, annoy_idx=annoy_idx, df=df)
    return similar_images_df


def get_artists_list():
    input_file = csv.DictReader(open("artists.csv"))
    res = list()
    for row in input_file:
        data = dict()
        data["name"] = row["name"]
        data["years"] = row["years"]
        data["genre"] = row["genre"]
        data["nationality"] = row["nationality"]
        data["bio"] = row["bio"]
        data["paintings"] = int(row["paintings"])
        res.append(data)
    return res


def get_artist_data(artist):
    input_file = csv.DictReader(open("artists.csv"))
    data = dict()
    data["name"] = artist
    for row in input_file:
        if artist == row["name"]:
            data["years"] = row["years"]
            data["genre"] = row["genre"]
            data["nationality"] = row["nationality"]
            data["bio"] = row["bio"]
            data["paintings"] = int(row["paintings"])
            break
    return data


def get_similar_images(filename):
    input_file = csv.DictReader(open("recomm_df.csv"))
    data = list()
    for row in input_file:
        if filename == row['img_path'].rsplit("\\", 1)[1][:-4]:
            similar_images_df = get_recommendations(row['img_path'])
            for index, r in similar_images_df.iterrows():
                title = r['img_path'].rsplit("\\", 1)[1]
                artist = r['label'].replace("_", " ")
                try:
                    file_path = os.path.join(resized_folder, title)
                    with open(file_path, 'rb') as f:
                        file_data = base64.b64encode(f.read()).decode('utf-8')
                except IOError:
                    file_path = os.path.join(image_folder, r['label'], title)
                    with open(file_path, 'rb') as f:
                        file_data = base64.b64encode(f.read()).decode('utf-8')
                data.append({"title": title,
                             "artist": artist,
                             "data": file_data})
            data.pop(0)
            random.shuffle(data)
            for i in range(0, 5):
                del data[i]
            break
    return data

def get_data(filename):
    input_file = csv.DictReader(open("recomm_df.csv"))
    data = dict()
    data["title"] = filename+".jpg"
    for row in input_file:
        if filename == row['img_path'].rsplit("\\", 1)[1][:-4]:
            data["artist"] = row['label'].replace("_", " ")
            break
    data["genre"] = get_artist_data(data["artist"])["genre"]
    return data

def is_empty(artist_filters):
    if artist_filters == {}:
        return True
    for key in artist_filters:
        if artist_filters[key] is True:
            return False
    return True

def filter_files(set_filters, search_input):
    artist_filters = set_filters["Artist"]
    res = list()
    empty_artists = is_empty(artist_filters)
    if empty_artists and search_input == "*":
        return res

    genre_artists = list()
    input_file = csv.DictReader(open("artists.csv"))
    for row in input_file:
        if search_input.lower() in row["genre"].lower():
            genre_artists.append(row["name"])

    input_file = csv.DictReader(open("recomm_df.csv"))
    for row in input_file:
        artist_flag = search_flag = False
        filename = row['img_path'].rsplit("\\", 1)[1]
        artist = row['label'].replace("_", " ")
        if empty_artists or (artist in artist_filters and artist_filters[artist] is True):
            artist_flag = True
        if search_input == "*" or search_input.lower() in filename.lower() or search_input.lower() in artist.lower() or artist in genre_artists:
            search_flag = True
        if artist_flag and search_flag:
            res.append(filename)
    print(len(res))
    return res
