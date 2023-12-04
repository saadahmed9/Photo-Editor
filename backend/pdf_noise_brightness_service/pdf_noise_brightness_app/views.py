import os
from pathlib import Path
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import SuspiciousOperation
from rest_framework.reverse import reverse_lazy
from pdf_noise_brightness_app.contollers.noise_removal import noiseremoval
from pdf_noise_brightness_app.contollers.get_statistics import read_stats,write_stats

from pdf_noise_brightness_app.contollers.verify_params_controller import verify_upload_file_passed,verify_function_passed,verify_functionality_passed
import base64
import logging

from pdf_noise_brightness_app.contollers.pdf_maker import convert_images_to_pdf
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
        api_root = reverse_lazy('stats',request = request)
        api_root = api_root[:-7]
        print("File check is", is_image(myfile.name))
        if is_image(myfile.name):
            logger.info("Performing initial checks")
            verify_functionality_passed(request)
        else:
            print("Inside exception")
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

def initial_checks_multi_files(request):
    return_dict = {}

    # create_application_folder_if_not_exit()
    #verify_upload_file_passed(request)
    verify_function_passed(request)
    if request.method == 'POST':
    #if request.method == 'POST' and request.FILES['myfile']:
        function_name = request.POST['function']
        myfile_list = []
        myfile_name_list = []
        image_url_list = []
        for file in request.FILES.getlist('myfile'):
            myfile_list.append(file)
            myfile_name_list.append(file.name.replace(" ", ""))
            full_path = "media/uploads/" + file.name.replace(" ", "")
            image_url_list.append(full_path)
            try:
                f = open(full_path, "wb")
            except OSError:
                logger.error("could not open " + full_path)
            with f:    
                for chunk in file.chunks():
                    f.write(chunk)
            f.close()
        output_url = "media/output/" + myfile_list[0].name.split('.')[0] + ".pdf"

        api_root = reverse_lazy('stats',request = request)
        print("Just before calling the function")
        api_root = api_root[:-7]
        if True:
        #if all(map(is_image, image_url_list)):
            print("Inside the function")
            verify_functionality_passed(request)
        else:
            raise SuspiciousOperation("only image files are accepted as input")
    return image_url_list, output_url, api_root, myfile_list

@api_view(('POST',))
@csrf_exempt
def pdf_maker(request):
    return_dict = {}
    try:
        image_url_list, output_url, api_root, myfile_list = initial_checks_multi_files(request)
        logger.info("Image conversion to pdf is in process")
        stats_onj = read_stats()
        val = stats_onj["pdf_maker"]
        crop_count = val + 1
        newData = {"pdf_maker": crop_count}
        write_stats(newData)
        function_name = request.POST['function']
        # function_obj = get_count_by_function_name(function_name)
        # count_val = FunctionActivitySerializer(function_obj).data['function_count']
        #temp_val = count_val + 1
        # update_count(function_obj, function_name, temp_val)
        #convert_images_to_pdf(image_url_list, output_url)
        convert_images_to_pdf(image_url_list, output_url)
        logger.info("Image conversion to pdf is done")
        return_dict['output_url'] = api_root+r"static/"+ myfile_list[0].name.split('.')[0] + ".pdf"
        #return_dict['output_url'] = api_root + r"static/" + "output.pdf" 
        try:
            with open("media/output/" + myfile_list[0].name.split('.')[0] + ".pdf",'rb') as pdf_file:
                pdf_data = pdf_file.read()
        except IOError:
            logger.error("unable to read output file " + output_url)
        pdf_data_base64 = base64.b64encode(pdf_data).decode('utf-8')
        return_dict['imageUrl'] = f"data:application/pdf;base64,{pdf_data_base64}"
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
def noise_removal(request):
    return_dict = {}
    try:
        image_url, output_url, api_root, myfile = initial_checks(request)
        stats_onj = read_stats()
        val = stats_onj["noise_removal"]
        crop_count = val + 1
        newData = {"noise_removal": crop_count}
        write_stats(newData)
        noiseremoval(image_url, output_url)
        return_dict['output_url'] = api_root+r"static/"+ myfile.name
        try:
            with open(output_url, 'rb') as f:
                image_data = f.read()
        except IOError:
            logger.error("unable to read output file " + output_url)
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        return_dict['imageUrl']=f"data:image/jpeg;base64,{image_base64}"
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
def brightness_contrast(request):
    return_dict = {}
    try:
        verify_function_passed(request)
        stats_onj = read_stats()
        val = stats_onj["brightness_contrast"]
        crop_count = val + 1
        newData = {"brightness_contrast": crop_count}
        write_stats(newData)
        if request.method == 'POST':
            function_name = request.POST['function']
            if function_name == 'brightness_contrast':
                return_dict["message"] = "brightness_contrast updated successfully"
                return_dict['error'] = False
                return_dict['status'] = 200
                return_dict["Statistics"] = read_stats()
    except Exception as e:
        return_dict["message"] = str(e)
        return_dict['error'] = True
        return_dict['status'] = 400
    return Response(return_dict)

