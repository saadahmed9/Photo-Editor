from PIL import Image, ImageOps, ImageFilter
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
def mosaicmaker(input_path, output_path, images_list, pixel_size):
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
    
    face_im_arr = load_image(main_image)
    face_image = Image.fromarray(face_im_arr)
    # plt.imshow(face_image)
    # plt.show()

    # Store width and height of original image
    width = face_im_arr.shape[0]
    height = face_im_arr.shape[1]

    num_iterations_width = width // pixel_size + (1 if width % pixel_size != 0 else 0)
    num_iterations_height = height // pixel_size + (1 if height % pixel_size != 0 else 0)    


    resized_images = {}

    # Loop through each image in the list and resize it
    for file in images_list:
        img =  Image.open(file)
        resized_images[file] = img.resize((pixel_size, pixel_size), Image.LANCZOS)


    mosaic = Image.new('RGB', (width, height))

    for i in range(num_iterations_width):
        for j in range(num_iterations_height):
            random_image_path = random.choice(images_list)

            random_image = resized_images[random_image_path]

            paste_x = i * pixel_size
            paste_y = j * pixel_size

            # Ensure the paste position does not exceed the dimensions of the main image
            paste_x = min(paste_x, width - pixel_size)
            paste_y = min(paste_y, height - pixel_size)

            mosaic.paste(random_image, (paste_x, paste_y))        
    
    #mosaic.paste(face_image, (0, 0))
    canvas = Image.blend(face_image, mosaic, 0.5)

    canvas.save(output_path)