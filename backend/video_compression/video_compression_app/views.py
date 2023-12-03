import os
from pathlib import Path
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import SuspiciousOperation
from rest_framework.reverse import reverse_lazy
from video_compression_app.contollers.get_statistics import read_stats,write_stats

from video_compression_app.contollers.verify_params_controller import verify_upload_file_passed,verify_function_passed,verify_functionality_passed
import base64
import logging

from video_compression_app.contollers.video_compression import compress_video
# Create your views here.

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

logging.basicConfig(format= '[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

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
def video_compression(request):

    logger.info("video compression endpoint!")
    return_dict = {}
    try:
        verify_upload_file_passed(request)
        verify_functionality_passed(request)
        if request.method == 'POST' and request.FILES['myfile']:
            myfile = request.FILES['myfile']
            myfile.name = myfile.name.replace(" ", "")
            video_folder = "\\".join(BASE_DIR.split("\\"))
            Path(video_folder +r"\media\uploads").mkdir(parents=True, exist_ok=True)
            Path(video_folder +r"\media\output").mkdir(parents=True, exist_ok=True)
            video_url = video_folder+r"\media\uploads\\"+myfile.name
            output_url = video_folder+r"\media\output\\"+myfile.name
            f = open(video_url,"wb")
            for chunk in request.FILES['myfile'].chunks():
                f.write(chunk)
            f.close()
            api_root = reverse_lazy('stats',request = request)
            api_root = api_root[:-7]
            logger.info(api_root)
            return_dict['output_url'] = api_root+r"static/"+ myfile.name
            return_value = compress_video(video_url, output_url)
            if return_value == 0:
                raise Exception("failed compressing the video file")
            input_file_size = "{:.2f}".format(os.path.getsize(video_url) / (1024 * 1024))
            output_file_size = "{:.2f}".format(os.path.getsize(output_url) / (1024 * 1024))
        with open(output_url, 'rb') as f:
            output_video_data = f.read()
        video_base64 = base64.b64encode(output_video_data).decode('utf-8')
        return_dict['videoUrl']=f"data:video/mp4;base64,{video_base64}"   
        return_dict['input_file_size'] = input_file_size + "MB"
        return_dict['output_file_size'] = output_file_size + "MB"
        return_dict['error'] = False
        return_dict['message'] = "Successfully Processed " 
        return_dict['status'] = 200

    except Exception as e:
        return_dict["message"] = str(e)
        return_dict['error'] = True
        return_dict['status'] = 400
    return Response(return_dict)