import cv2
from pixellib.tune_bg import alter_bg
from matplotlib import colors
import os

def color_bg_and_add_border(input_image_path, output_image_path, bg_color, border_color=(0,0,0), border_thickness=2):
    # file_path,name = os.path.split(input_image_path)
    change_bg = alter_bg()
    change_bg.load_pascalvoc_model("C:\cse611\photo_editing_api\media\models\deeplabv3_xception_tf_dim_ordering_tf_kernels.h5")
    change_bg.color_bg(input_image_path, colors=bg_color, output_image_name=output_image_path)
    output_image = cv2.imread(output_image_path)
    output_image_with_border = cv2.copyMakeBorder(output_image, border_thickness, border_thickness, border_thickness, border_thickness, cv2.BORDER_CONSTANT, value=border_color)
    cv2.imwrite(output_image_path, output_image_with_border)
    return None
