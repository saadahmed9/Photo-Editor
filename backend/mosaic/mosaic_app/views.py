import os
from pathlib import Path
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import SuspiciousOperation
from rest_framework.reverse import reverse_lazy
from mosaic_app.contollers.get_statistics import read_stats,write_stats

from mosaic_app.contollers.verify_params_controller import verify_upload_file_passed,verify_function_passed,verify_functionality_passed
import base64


import logging

from mosaic_app.contollers.mosaic_maker import mosaicmaker
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

def initial_checks(request):
    return_dict = {}
    # create_application_folder_if_not_exit()
    logger.info("Initial checks being performed")
    verify_upload_file_passed(request)
    verify_function_passed(request)
    if request.method == 'POST' and request.FILES['myfile']:
        function_name = request.POST['function']
        pixel_size = int(request.POST['selectedPixel'])
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
    return image_url, output_url, api_root, myfile, pixel_size

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

def get_mosaic_files_list(request):
    # create_application_folder_if_not_exit()
    count = 0
    if request.method == 'POST':
        function_name = request.POST['function']
        myfile_list = []
        myfile_name_list = []
        image_url_list = []
        for file in request.FILES.getlist('myfile_folder'):
            count = count + 1
            myfile_list.append(file)
            myfile_name_list.append(file.name.replace(" ", ""))
            full_path = "media/Mosaic_input/" + file.name.replace(" ", "")
            image_url_list.append(full_path)
            try:
                f = open(full_path, "wb")
            except OSError:
                logger.error("could not open " + full_path)
            with f:    
                for chunk in file.chunks():
                    f.write(chunk)
            f.close()
        logger.info("get_mosaic_files_list function complete")
    return image_url_list, count

@api_view(('POST',))
@csrf_exempt
def mosaic_maker(request):
    return_dict = {}
    try:
        image_url, output_url, api_root, myfile, pixel_size = initial_checks(request)
        #logger.info("Pixel Size " + pixel_size)
        stats_onj = read_stats()
        val = stats_onj["mosaic_maker"]
        crop_count = val + 1
        newData = {"mosaic_maker": crop_count}
        write_stats(newData)
        images_list, images_count = get_mosaic_files_list(request)


        #abc updating folder path with images list
        # logger.info("Number of images selected are ", images_count)
        #folder_path = r"E:\Career\University at Buffalo\Semester 2\CSE_611\project\cse611-spring2023-team-photo-editing\backend\photo_editing_api\media\Mosaic-input\\"
        #request.FILES.getlist('myfile')
        
        mosaicmaker(image_url, output_url, images_list, pixel_size)
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
