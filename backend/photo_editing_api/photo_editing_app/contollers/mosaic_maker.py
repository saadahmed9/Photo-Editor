from PIL import Image, ImageOps
import numpy as np
from matplotlib import pyplot as plt
from matplotlib import image
import glob, os
import math
from scipy import spatial
import random
import cv2

def load_image(source : str) -> np.ndarray:
    ''' Opens an image from specified source and returns a numpy array with image rgb data
    '''
    with Image.open(source) as im:
        resized_img = im.resize((1024, 1024))
        resized_img = resized_img.convert('RGB')
        im_arr = np.asarray(resized_img)
    return im_arr

def load_tile_image(source : str) -> np.ndarray:
    ''' Opens an image from specified source and returns a numpy array with image rgb data
    '''
    with Image.open(source) as im:
        resized_tile_img = im.resize((512, 512))
        im_arr = np.asarray(resized_tile_img)
    return im_arr

#resizing image to given size
def resize_image(img: Image, size: tuple) -> np.ndarray:
    '''Takes an image and resizes to a given size (width, height) as passed to the size parameter
    '''
    resz_img = ImageOps.fit(img, size, Image.ANTIALIAS, centering=(0.5, 0.5))
    resz_img = resz_img.convert('RGB')
    return np.array(resz_img)

def mosaicmaker(input_path,output_path):

    print("Inside the mosaic file")
    plt.figure(figsize=(8,8))
    print("Image path is", input_path)
    #face_im_arr = load_image(r'E:\Career\University at Buffalo\Semester 2\CSE_611\project\cse611-spring2023-team-photo-editing\backend\photo_editing_api\media\uploads\face-12.png')
    face_im_arr = load_image(input_path)
    face_image = Image.fromarray(face_im_arr)

    # dimensions of the original image
    width = face_im_arr.shape[0]
    height = face_im_arr.shape[1]


    #resolution of the mosaic image
    target_res = (80, 80)
    #template for the image
    mos_template = face_im_arr[::(height // target_res[0]), ::(height // target_res[1])]

    #number of images required to fill the image
    mos_template[:, :, -1].size
    print("Images required", mos_template.shape)

    #import list of images as an array
    images = []

    for file in glob.glob(r'E:\Career\University at Buffalo\Semester 2\CSE_611\project\cse611-spring2023-team-photo-editing\backend\photo_editing_api\media\Mosaic-input\*'):
        im = load_tile_image(file)
        images.append(im)




    #definig size for mosaic image
    mosaic_size = (40, 40)  ## Defines size of each mosiac image
    images = [resize_image(Image.fromarray(i), mosaic_size) for i in images]
    #no of images in the list
    print(len(images))

    #converting list to np array
    images_array = np.asarray(images)
    images_array.shape

    #get mean of RGB values for the input images
    image_values = np.apply_over_axes(np.mean, images_array, [1, 2]).reshape(len(images), 3)

    #setting KD values for input images
    tree = spatial.KDTree(image_values)

    #storing indices of best images
    image_idx = np.zeros(target_res, dtype=np.uint32)

    for i in range(target_res[0]):
        for j in range(target_res[1]):
            template = mos_template[i, j]
            # print(template.shape)

            match = tree.query(template, k=10)
            pick = random.randint(0, 9)
            image_idx[i, j] = match[1][pick]

    canvas = Image.new('RGB', (mosaic_size[0] * target_res[0], mosaic_size[1] * target_res[1]))
    print()

    for i in range(target_res[0]):
        for j in range(target_res[1]):
            arr = images[image_idx[j, i]]
            x, y = i * mosaic_size[0], j * mosaic_size[1]
            im = Image.fromarray(arr)
            canvas.paste(im, (x, y))

    #canvas
    print("Printing canvas", canvas)
    #canvas.save(r"E:\Career\University at Buffalo\Semester 2\CSE_611\project\cse611-spring2023-team-photo-editing\backend\photo_editing_api\media\output\testing.png")
    canvas.save(output_path)
    #cv2.imwrite(r"E:\Career\University at Buffalo\Semester 2\CSE_611\project\cse611-spring2023-team-photo-editing\backend\photo_editing_api\media\output\testing.png", canvas)