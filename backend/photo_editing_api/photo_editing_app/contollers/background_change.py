import cv2
from pixellib.tune_bg import alter_bg
from matplotlib import colors
import os
from photo_editing_api.settings import MODEL_DIR
import logging

logging.basicConfig(format= '[%(asctime)s] %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def color_bg_and_add_border(input_image_path, output_image_path, bg_color, border_color=(0,0,0), border_thickness=2):
    # file_path,name = os.path.split(input_image_path)
    change_bg = alter_bg()
    # model_path = MODEL_DIR + "deeplabv3_xception_tf_dim_ordering_tf_kernels.h5"
    model_path = "media/models/deeplabv3_xception_tf_dim_ordering_tf_kernels.h5"
    change_bg.load_pascalvoc_model(model_path)
    logger.info("performing background change for input image")
    change_bg.color_bg(input_image_path, colors=bg_color, output_image_name=output_image_path)
    output_image = cv2.imread(output_image_path)
    output_image_with_border = cv2.copyMakeBorder(output_image, border_thickness, border_thickness, border_thickness, border_thickness, cv2.BORDER_CONSTANT, value=border_color)
    cv2.imwrite(output_image_path, output_image_with_border)
    return None
