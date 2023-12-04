from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import SuspiciousOperation
from collage_app.contollers.get_statistics import read_stats,write_stats

from collage_app.contollers.verify_params_controller import verify_function_passed
import logging


# Create your views here.

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
def photo_collage(request):
    return_dict = {}
    try:
        verify_function_passed(request)
        stats_onj = read_stats()
        val = stats_onj["photo_collage"]
        crop_count = val + 1
        newData = {"photo_collage": crop_count}
        write_stats(newData)
        if request.method == 'POST':
            function_name = request.POST['function']
            if function_name == 'photo_collage':
                return_dict["message"] = "photo_collage updated successfully"
                return_dict['error'] = False
                return_dict['status'] = 200
                return_dict["Statistics"] = read_stats()
    except Exception as e:
        return_dict["message"] = str(e)
        return_dict['error'] = True
        return_dict['status'] = 400
    return Response(return_dict)
