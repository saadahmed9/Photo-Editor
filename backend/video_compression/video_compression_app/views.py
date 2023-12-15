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

from video_compression_app.contollers.video_compression import compress_video, compress_video_by_resolution
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
            video_url = "media/uploads/"+myfile.name
            output_url = "media/output/"+myfile.name
            target_size = request.data.get("target", None)
            resolution = request.data.get("resolution", None)
            quality = request.data.get("quality", None)
            
            stats_onj = read_stats()
            val = stats_onj["video_compression"]
            crop_count = val + 1
            newData = {"video_compression": crop_count}
            write_stats(newData)

            logger.info(request.data)
            logger.info("target is {0} and compression rate is {1}".format(target_size, resolution))
            try:
                f = open(video_url,"wb")
            except OSError:
                logger.error("could not open " + video_url)
            with f:    
                for chunk in request.FILES['myfile'].chunks():
                    f.write(chunk)
                f.close()
            api_root = reverse_lazy('stats',request = request)
            api_root = api_root[:-7]
            return_dict['output_url'] = api_root+r"static/"+ myfile.name
            if resolution is None or resolution == 'null':
                if target_size is None  or target_size == 'null':
                    target_size = (os.path.getsize(video_url) / (1024 * 1024)) / 2
                logger.info("Compressing video by target file size of {}".format(target_size))
                return_value = compress_video(video_url, output_url, target_size)
            else:
                logger.info("Compressing video by resolution of {0} and quality percent as {1}".format(resolution, quality))
                return_value = compress_video_by_resolution(video_url, output_url, resolution, quality)
            if return_value == 0:
                raise Exception("failed compressing the video file")
            input_file_size = "{:.2f}".format(os.path.getsize(video_url) / (1024 * 1024))
            output_file_size = "{:.2f}".format(os.path.getsize(output_url) / (1024 * 1024))
            try:
                with open(output_url, 'rb') as f:
                    output_video_data = f.read()
            except IOError:
                logger.error("unable to read output file " + output_url)
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