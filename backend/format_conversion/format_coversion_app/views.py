import os
from pathlib import Path
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import SuspiciousOperation
from rest_framework.reverse import reverse_lazy
from format_coversion_app.contollers.get_statistics import read_stats,write_stats

from format_coversion_app.contollers.verify_params_controller import verify_upload_file_passed,verify_function_passed,verify_functionality_passed,verify_format_change_passed
import base64
import logging

import cv2
import pillow_heif
from PIL import Image


# Create your views here.

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

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
        api_root = reverse_lazy('stats')
        api_root = api_root[:-7]
        logger.info(api_root)
        print("File check is", is_image(myfile.name))
        if is_image(myfile.name):
            logger.info("Performing initial checks")
            verify_functionality_passed(request)
        else:
            logger.info("Inside exception")
            raise SuspiciousOperation("only image files are accepted as input")
    #ABC call a function for below as below
    return image_url, output_url, api_root, myfile

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


@api_view(('POST',))
@csrf_exempt
def format_change(request):
    return_dict = {}
    try:
        image_url, output_url, api_root, myfile = initial_checks(request)
        verify_format_change_passed(request)
        stats_onj = read_stats()
        val = stats_onj["format_change"]
        crop_count = val + 1
        newData = {"format_change": crop_count}
        write_stats(newData)
        required_format = request.POST['format_change']
        part1, part2 = myfile.name.split('.')

        output_url = "media/output/" + part1+"."+required_format
        file_name = os.path.splitext(output_url)
        logger.info("converting image to {}".format(required_format))
        match required_format:
            case "gif":   
                image = Image.open(image_url)
                image.save(file_name[0]+"."+required_format)

            case "heif":
                # Register the HEIF opener with PIL
                pillow_heif.register_heif_opener()
                image = Image.open(image_url)
                image.save(file_name[0]+"."+required_format)
            
            case "heic":
                # Register the HEIF opener with PIL
                pillow_heif.register_heif_opener()
                image = Image.open(image_url)
                image.save(file_name[0]+"."+required_format)
            
            case _:
                image = cv2.imread(image_url)
                cv2.imwrite(file_name[0]+"."+required_format, image, [int(cv2.IMWRITE_JPEG_QUALITY), 100])

        logger.info("Format change functionality completed")
        return_dict['output_url'] = api_root+r"static/"+part1+"."+required_format
        try:
            with open(output_url, 'rb') as f:
                image_data = f.read()
        except IOError:
            logger.error("unable to read output file " + output_url)
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        return_dict['imageUrl']=f"data:image/{required_format};base64,{image_base64}"   
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