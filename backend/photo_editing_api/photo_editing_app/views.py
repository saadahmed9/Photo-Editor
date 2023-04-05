import json
import os
import cv2
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import SuspiciousOperation
from photo_editing_app.contollers.passport_photo import passport_photo_face
from photo_editing_app.contollers.resize_operation import image_resize
from photo_editing_app.contollers.specs_finder import spects_detector
from matplotlib import colors
from photo_editing_app.contollers.background_change import color_bg_and_add_border
from rest_framework.reverse import reverse_lazy
from photo_editing_app.contollers.get_objects import get_count_by_function_name,update_count,get_stats
from photo_editing_app.serializers import FunctionActivitySerializer
from photo_editing_app.contollers.pose_detection import pose_detector
from photo_editing_app.contollers.verify_params_controller import verify_resize_passed,verify_upload_file_passed,verify_function_passed,verify_functionality_passed,verify_format_change_passed,verify_colour_passed,verify_country_passed
from PIL import ImageColor
# Create your views here.

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def create_application_folder_if_not_exit():
    if not os.path.exists("/".join(BASE_DIR.split("/")) + "/media/"):
        os.makedirs("/".join(BASE_DIR.split("/")) + "/media/")
    if not os.path.exists(
            "/".join(BASE_DIR.split("/")[:-1]) + "/media/output/"):
        os.makedirs("/".join(BASE_DIR.split("/")) + "/media/output/")
    if not os.path.exists(
            "/".join(BASE_DIR.split("/")[:-1]) + "/media/uploads/"):
        os.makedirs("/".join(BASE_DIR.split("/")) + "/media/uploads/")

def is_image(file):
    filename,file_extension = os.path.splitext(file)
    file_extension = file_extension.lower()
    if file_extension == ".jpg" or file_extension == ".jpeg" or file_extension == ".png":
        return True
    return False

import webcolors

def get_color_code(color_name):
    try:
        rgb_tuple = webcolors.name_to_rgb(color_name)
        hex_code = '#{:02x}{:02x}{:02x}'.format(*rgb_tuple)
        return hex_code
    except ValueError:
        return None


f = open('media/datasets/countries.json')
data = json.load(f)

f1 = open('media/datasets/countrywise_specs.txt')
lines = f1.readline()

@api_view(('POST',))
@csrf_exempt
def upload(request):
    return_dict = {}
    try:
        # create_application_folder_if_not_exit()
        verify_upload_file_passed(request)
        verify_function_passed(request)
        if request.method == 'POST' and request.FILES['myfile']:
            function_name = request.POST['function']
            myfile = request.FILES['myfile']
            myfile.name = myfile.name.replace(" ", "")
            img_dir = "\\".join(BASE_DIR.split("\\"))
            image_url = img_dir+r"\media\uploads\\"+myfile.name
            output_url = img_dir+r"\media\output\\"+myfile.name
            f = open(image_url,"wb")
            for chunk in request.FILES['myfile'].chunks():
                f.write(chunk)
            f.close()
            api_root = reverse_lazy('upload',request = request)
            api_root = api_root[:-7]
            if is_image(myfile.name):
                verify_functionality_passed(request)
                function_obj = get_count_by_function_name(function_name)
                count_val = FunctionActivitySerializer(function_obj).data['function_count']
                temp_val = count_val + 1
                update_count(function_obj, function_name, temp_val)
                if function_name == 'passport_photo_size':
                    verify_country_passed(request)
                    full_str = ""
                    img = passport_photo_face(image_url,output_url)
                    full_str = full_str+img
                    return_dict["face detection"] = full_str
                    if 'No' not in return_dict["face detection"]:
                        country = request.POST['country']
                        face_pos = pose_detector(image_url)
                        return_dict["pose detector"] = face_pos
                        if country in data:
                            image_input_size = data[country]
                            image_input_size = image_input_size.split(',')
                            image_resize(image_url, output_url, width=image_input_size[0], height=image_input_size[1])
                            color_bg_and_add_border(output_url, output_url, (255,255,255))
                            if country in lines:
                                text = spects_detector(image_url)
                                if "with" in text:
                                    return_dict["Spects_detector"] = "For this country photo with specs is not allowed"
                            return_dict['output_url'] = api_root + r"static/" + myfile.name
                elif function_name == 'background_change':
                    verify_colour_passed(request)
                    colour_option = request.POST['background_change']
                    hexa_code = get_color_code(colour_option)
                    colour_code = ImageColor.getcolor(hexa_code, "RGB")
                    color_bg_and_add_border(image_url,output_url,colour_code)
                    return_dict['output_url'] = api_root+r"static/"+ myfile.name
                elif function_name == 'photo_college':
                    pass
                elif function_name == 'noise_removal':
                    pass
                elif function_name == 'format_change':
                    verify_format_change_passed(request)
                    required_format = request.POST['format_change']
                    image = cv2.imread(image_url)
                    file_name = os.path.splitext(output_url)
                    cv2.imwrite(file_name[0]+"."+required_format, image, [int(cv2.IMWRITE_JPEG_QUALITY), 100])
                    part1,part2 = myfile.name.split('.')
                    return_dict['output_url'] = api_root+r"static/"+part1+"."+required_format
                elif function_name == 'resize':
                    verify_resize_passed(request)
                    image_input_size = request.POST['resize']
                    image_input_size = image_input_size.split(',')
                    image_resize(image_url,output_url,width=image_input_size[0],height=image_input_size[1])
                    return_dict['output_url'] = api_root + r"static/" + myfile.name
                return_dict['error'] = False
                return_dict['message'] = "Successfully Processed "
                return_dict['status'] = 200
                return_dict["Statistics"] = get_stats()
            else:
                raise SuspiciousOperation("only image files are accepted as input")
    except Exception as e:
        return_dict["message"] = str(e)
        return_dict['error'] = True
        return_dict['status'] = 400
    return Response(return_dict)
