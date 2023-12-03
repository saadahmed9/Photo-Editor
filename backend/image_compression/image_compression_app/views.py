import os
from pathlib import Path
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import SuspiciousOperation
from rest_framework.reverse import reverse_lazy
from image_compression_app.contollers.get_statistics import read_stats,write_stats

from image_compression_app.contollers.verify_params_controller import verify_upload_file_passed,verify_function_passed,verify_functionality_passed
import base64
import logging

import cv2
import numpy as np
from image_compression_app.contollers.image_compression import ImageCompressClass as ICC
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
        img_dir = "\\".join(BASE_DIR.split("\\"))
        Path(img_dir+r"\media\uploads").mkdir(parents=True, exist_ok=True)
        Path(img_dir+r"\media\output").mkdir(parents=True, exist_ok=True)
        image_url = img_dir+r"\media\uploads\\"+myfile.name
        output_url = img_dir+r"\media\output\\"+myfile.name
        f = open(image_url,"wb")
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

@api_view(('POST',))
@csrf_exempt
def image_compression(request):
    logger.info("image compression endpoint!")
    return_dict = {}
    if request.method == 'POST':
        logger.info("entered POST!")
        try:
            verify_upload_file_passed(request)
            verify_functionality_passed(request)
            image_file = request.FILES.get('myfile')
            image_file.name = image_file.name.replace(" ", "")
            compression_rate = int(request.POST.get('compression_rate'))
            compression_rate = random.randint(10, 25)
            target_size = request.POST.get('custom_rate')
            input_image_size = image_file.size
            input_image_size_temp = image_file.size
            logger.info("verification done")
            target_size = request.POST.get('custom_rate')
            logger.info(compression_rate)
            logger.info(target_size)
            output_format = request.POST.get('output_format')

            # Read the image using OpenCV
            image = cv2.imdecode(np.frombuffer(image_file.read(), np.uint8), 1)

            if target_size == 'null':
            # Determine compression parameter based on output format
                compression_param = None
                if output_format.lower() == 'jpeg':
                    compression_param = [cv2.IMWRITE_JPEG_QUALITY, compression_rate]
                elif output_format.lower() == 'jpg':
                    compression_param = [cv2.IMWRITE_JPEG_QUALITY, compression_rate]
                elif output_format.lower() == 'png':
                    compression_param = [cv2.IMWRITE_PNG_COMPRESSION, compression_rate]
                elif output_format.lower() == 'tiff':
                    compression_param = [cv2.IMWRITE_TIFF_COMPRESSION, compression_rate]

                if compression_param:
                    compressed_image_base64 = ICC.compress_image(output_format, image, compression_param)
                    compressed_image_bytes = base64.b64decode(compressed_image_base64)
                    output_image_size = sys.getsizeof(compressed_image_bytes)
                    # Add relevant information to the return dictionary
                    return_dict['imageUrl'] = f"data:image/{output_format};base64,{compressed_image_base64}"
                    return_dict['input_image_size'] = f"{math.ceil(input_image_size/1024)} KB"
                    return_dict['output_image_size'] = f"{math.ceil(output_image_size/1024)} KB"
                    return_dict['format'] = output_format
                    return_dict['error'] = False
                    return_dict['message'] = "Successfully processed image"
                    return_dict['status'] = 200
                else:
                    return_dict['error'] = True
                    return_dict['message'] = 'Unsupported output format'
                    return_dict['status'] = 400
            
            elif target_size != 'null':
                target_size_temp = int(target_size)
                logger.info("custom compression under progress")
                compression_param = None
                compression_rate = 100
                
                while (input_image_size_temp/1024) > target_size_temp and compression_rate > 10:
                    logger.info("enetred while loop")
                    compression_rate -= 10
                    if output_format.lower() == 'jpeg' or output_format.lower() == 'jpg':
                        compression_param = [cv2.IMWRITE_JPEG_QUALITY, compression_rate]
                    elif output_format.lower() == 'png':
                        compression_param = [cv2.IMWRITE_PNG_COMPRESSION, compression_rate]
                    elif output_format.lower() == 'tiff':
                        compression_param = [cv2.IMWRITE_TIFF_COMPRESSION, compression_rate]
                    compressed_image_base64 = ICC.compress_image(output_format, image, compression_param)
                    input_image_size_temp = len(compressed_image_base64)

                compressed_image_bytes = base64.b64decode(compressed_image_base64)
                output_image_size = sys.getsizeof(compressed_image_bytes)
                logger.info("custom compression completed in views")
                return_dict['imageUrl'] = f"data:image/{output_format};base64,{compressed_image_base64}"
                return_dict['input_image_size'] = f"{math.ceil(input_image_size/1024)} KB"
                return_dict['output_image_size'] = f"{math.ceil(output_image_size/1024)} KB"
                return_dict['format'] = output_format
                return_dict['error'] = False
                return_dict['message'] = "Successfully processed image"
                return_dict['status'] = 200

        except Exception as e:
            return_dict['error'] = True
            return_dict['message'] = str(e)
            return_dict['status'] = 400

    return Response(return_dict)
