import json
import os
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import SuspiciousOperation
from photo_editing_app.contollers.passport_photo import passport_photo_face
from photo_editing_app.contollers.resize_operation import image_resize
from photo_editing_app.contollers.specs_finder import spects_detector
from photo_editing_app.contollers.background_change import color_bg_and_add_border
from rest_framework.reverse import reverse_lazy
from photo_editing_app.contollers.get_statistics import read_stats,write_stats
from photo_editing_app.contollers.pose_detection import pose_detector
from photo_editing_app.contollers.verify_params_controller import verify_upload_file_passed,verify_function_passed,verify_functionality_passed,verify_country_passed
import base64
import logging


# Create your views here.

logging.basicConfig(format= '[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def is_image(file):
    filename,file_extension = os.path.splitext(file)
    file_extension = file_extension.lower()
    if file_extension == ".jpg" or file_extension == ".jpeg" or file_extension == ".png" or file_extension == ".tif"\
            or file_extension == ".bmp" or file_extension == ".jp2" or file_extension == ".webp" or file_extension == ".exr"\
            or file_extension == ".pic" or file_extension == ".hdr" or file_extension == ".svg":
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
# lines = f1.readlines()
lines = [line.rstrip() for line in f1]
print("Printing countries with no specs", lines)




def initial_checks(request):
    return_dict = {}
    # create_application_folder_if_not_exit()
    logger.info("Initial checks being performed")
    verify_upload_file_passed(request)
    verify_function_passed(request)
    if request.method == 'POST' and request.FILES['myfile']:
        function_name = request.POST['function']
        myfile = request.FILES['myfile']
        myfile.name = myfile.name.replace(" ", "")
        image_url = "media/uploads/"+myfile.name
        output_url = "media/output/"+myfile.name
        try:
            f = open(image_url,"wb")
        except OSError:
            logger.error("could not open " + image_url)
        with f:    
            for chunk in request.FILES['myfile'].chunks():
                f.write(chunk)
            f.close()
        api_root = reverse_lazy('stats',request = request)
        api_root = api_root[:-7]
        print("File check is", is_image(myfile.name))
        if is_image(myfile.name):
            logger.info("Performing initial checks")
            verify_functionality_passed(request)
            # function_obj = get_count_by_function_name(function_name)
            # count_val = FunctionActivitySerializer(function_obj).data['function_count']
            #temp_val = count_val + 1
            #update_count(function_obj, function_name, temp_val)
        else:
            print("Inside exception")
            raise SuspiciousOperation("only image files are accepted as input")
    #ABC call a function for below as below
    return image_url, output_url, api_root, myfile

@api_view(('POST',))
@csrf_exempt
def passport_photo_size(request):
    return_dict = {}
    try:
        image_url, output_url, api_root, myfile = initial_checks(request)

        verify_country_passed(request)
        full_str = ""
        img = passport_photo_face(image_url,output_url)

        stats_onj = read_stats()
        val = stats_onj["passport_photo_size"]
        crop_count = val + 1
        newData = {"passport_photo_size": crop_count}
        write_stats(newData)

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
                logger.info("change background and border only if required")
                bg_change_flag = request.data.get("background_req", False)
                if((not bg_change_flag) or (bg_change_flag and (request.POST['background_req'] == "yes"))):
                    logger.info("Changing background to white")
                    color_bg_and_add_border(output_url, output_url, (255, 255, 255, 1))
                if country in lines:
                    text = spects_detector(image_url)
                    print(text)
                    if "without" not in text:
                        return_dict["Spects_detector"] = "For this country photo with specs is not allowed"
                    else:
                        return_dict["Spects_detector"] = "Spects not detected"
                return_dict['output_url'] = api_root + r"static/" + myfile.name
                try:
                    with open(output_url, 'rb') as f:
                        image_data = f.read()
                except IOError:
                    logger.error("unable to read output file " + output_url)
                image_base64 = base64.b64encode(image_data).decode('utf-8')
                return_dict['imageUrl']=f"data:image/jpeg;base64,{image_base64}"
        #ABC call another function for the below till statistics

        return_dict['error'] = False
        return_dict['message'] = "Successfully Processed "
        return_dict['status'] = 200
        return_dict["Statistics"] = read_stats()

    #ABC for the below implement another method for exceptions
    except Exception as e:
        return_dict["message"] = str(e)
        return_dict['error'] = True
        return_dict['status'] = 400
    return Response(return_dict)

@api_view(('POST',))
@csrf_exempt
def get_db_stat(request):
    return_dict = {}
    try:
        verify_function_passed(request)
        if request.method == 'POST' :
            function_name = request.POST['function']
            if function_name == 'stats':
                result = read_stats()
                sample_list = []
                for item,value in result.items():
                    sample_list.append({'name':item,'level':value})
                return_dict["Statistics"] = sample_list
            else:
                raise SuspiciousOperation("pass function value as stats")
    except Exception as e:
        return_dict["message"] = str(e)
        return_dict['error'] = True
        return_dict['status'] = 400
    return Response(return_dict)
