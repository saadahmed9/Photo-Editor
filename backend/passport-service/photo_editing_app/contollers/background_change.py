import cv2
from matplotlib import colors
import os
import logging
import rembg
from PIL import Image
import numpy

logging.basicConfig(format= '[%(asctime)s] %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def color_bg_and_add_border(input_image_path, output_image_path, bg_color, border_color=(0,0,0), border_thickness=2):  
    input = Image.open(input_image_path)
    logger.info("running rembg ")
    output = rembg.remove(input, bgcolor=bg_color)
    logger.info(" rembg done ")
    temp_output = os.path.splitext(output_image_path)[0] + ".png"
    output.save(temp_output)
    output_image = cv2.imread(temp_output)
    output_image_with_border = cv2.copyMakeBorder(output_image, border_thickness, border_thickness, border_thickness, border_thickness, cv2.BORDER_CONSTANT, value=border_color)
    cv2.imwrite(output_image_path, output_image_with_border)
    logger.info("background change complete")
    return None
