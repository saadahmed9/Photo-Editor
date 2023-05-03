from PIL import Image, ImageOps
import numpy as np
from matplotlib import pyplot as plt
from matplotlib import image
import glob, os
import math
from scipy import spatial
import random
import cv2
import logging

logging.basicConfig(format= '[%(asctime)s] %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

#def create_mosaic(main_image, folder_path, num_images):
def mosaicmaker(input_path, output_path, images_list, num_images):
#def mosaicmaker(input_path, output_path, folder_path, num_images):

    main_image = input_path
    def load_image(source: str) -> np.ndarray:
        with Image.open(source) as im:
            resized_img = im.resize((1024, 1024))
            resized_img = resized_img.convert('RGB')
            im_arr = np.asarray(resized_img)
        return im_arr

    def load_tile_image(source: str) -> np.ndarray:
        with Image.open(source) as im:
            # resized_tile_img = im.resize((512, 512))
            im_arr = np.asarray(im)
        return im_arr

    # Load the main image
    plt.figure(figsize=(8, 8))
    face_im_arr = load_image(main_image)
    face_image = Image.fromarray(face_im_arr)
    # plt.imshow(face_image)
    # plt.show()

    # Store width and height of original image
    width = face_im_arr.shape[0]
    height = face_im_arr.shape[1]

    # Set the target resolution
    target_res = (100, 100)

    # Create a template for mosaic
    plt.figure(figsize=(8, 8))
    mos_template = face_im_arr[::(height // target_res[0]), ::(height // target_res[1])]
    # plt.imshow(Image.fromarray(mos_template))
    # plt.show()

    # Number of images required to fill mosaic
    num_mosaic_images = mos_template[:, :, -1].size

    logger.info("creating list of images as np arrays")
    # Create a list of all images as np arrays
    images = []
    for file in images_list:
    #for file in glob.glob(os.path.join(folder_path, '*')):
        im = load_image(file)
        images.append(im)

    # Delete any images with unexpected shapes
    images = [i for i in images if i.ndim == 3]

    # Resize the images
    def resize_image(img: Image, size: tuple) -> np.ndarray:
        resz_img = ImageOps.fit(img, size, Image.ANTIALIAS, centering=(0.5, 0.5))
        resz_img = resz_img.convert('RGB')
        return np.array(resz_img)

    logger.info("Resizing images")
    mosaic_size = (40, 40)
    images = [resize_image(Image.fromarray(i), mosaic_size) for i in images]


    # Convert list to np array
    images_array = np.asarray(images)

    logger.info("get mean of RGB values")
    # Get mean of RGB values for each image
    image_values = np.apply_over_axes(np.mean, images_array, [1, 2]).reshape(len(images), 3)

    logger.info("set KD tree")
    # Set KDTree for image_values
    tree = spatial.KDTree(image_values)

    logger.info("Storing indices of best images")
    # Store the indices of best match images
    image_idx = np.zeros(target_res, dtype=np.uint32)
    k = int(num_images / 3)
    if (k > 40):
        k = 5
    for i in range(target_res[0]):
        for j in range(target_res[1]):
            template = mos_template[i, j]
            match = tree.query(template, k)
            pick = random.randint(0, k - 1)
            image_idx[i, j] = match[1][pick]

    # Loop through the best match indices, retrieve the matching image and add it to the canvas
    canvas = Image.new('RGB', (mosaic_size[0] * target_res[0], mosaic_size[1] * target_res[1]))
    for i in range(target_res[0]):
        for j in range(target_res[1]):
            arr = images[image_idx[j, i]]
            x, y = i * mosaic_size[0], j * mosaic_size[1]
            im = Image.fromarray(arr)
            canvas.paste(im, (x, y))

    canvas.save(output_path)