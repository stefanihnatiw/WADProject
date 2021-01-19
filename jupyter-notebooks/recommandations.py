import pandas as pd
from annoy import AnnoyIndex
from ast import literal_eval
import matplotlib.pyplot as plt
import matplotlib.image as mpimg

pd.set_option('display.max_rows', 500)
pd.set_option('display.max_columns', 500)
pd.set_option('display.width', 1000)


def get_similar_images_annoy(img_index, img_no):
    base_img_id, base_vct, base_lbl = df.iloc[img_index, [0, 3, 1]]
    similar_img_ids = annoy_idx.get_nns_by_item(img_index, img_no)
    return base_img_id, base_lbl, df.iloc[similar_img_ids]


if __name__ == '__main__':
    # read the pre-saved dataframe
    df = pd.read_csv('./misc/recomm_df.csv', converters={"img_repr": literal_eval})
    print(df)

    # Initialize the annoy index used for computing the nearest neighbors
    annoy_idx = AnnoyIndex(len(df['img_repr'][0]), metric='euclidean')
    for it, vector in enumerate(df['img_repr']):
        annoy_idx.add_item(it, vector)
    _ = annoy_idx.build(n_trees=50)

    # Get index of an image in the dataframe by its path
    imgidx = df.loc[df['img_path'] ==
                    '..\\best-artworks-dataset\\images\\images\\Albrecht_Durer\\Albrecht_Durer_10.jpg'].index[0]

    # call the function and get the recommendations dataframe (first image is the requested one, that's why 6)
    base_image, base_label, similar_images_df = get_similar_images_annoy(img_index=imgidx, img_no=6)

    # visualize some results
    print(similar_images_df)

    # show the resulting recommendations
    fig = plt.figure(figsize=(50, 50))
    columns = 3
    rows = 3
    cnt = 1

    for idx, row in similar_images_df.iterrows():
        img = mpimg.imread(row['img_path'])
        fig.add_subplot(rows, columns, cnt, title=row['label'])
        plt.imshow(img)
        cnt += 1

    plt.show()
