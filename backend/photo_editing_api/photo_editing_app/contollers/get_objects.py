from photo_editing_app.models import FunctionActivity
from django.core.exceptions import ObjectDoesNotExist
from photo_editing_app.serializers import FunctionActivitySerializer
def get_count_by_function_name(function_name):
    try:
        return FunctionActivity.objects.get(function_name = function_name)
    except ObjectDoesNotExist as ex:
        raise Exception("function name doesn't exist")

def update_count(obj,function_name,count_val):
    FunctionActivity.objects.filter(function_name = function_name).update(function_count = count_val)
    obj.function_count = count_val
    obj.save()

def get_stats():
    dict_stat = {}
    functionality_list = ['passport_photo_size', 'background_change', 'photo_collage', 'noise_removal', 'format_change',
                          'resize','pdf_maker','mosaic_maker','crop']
    for i in functionality_list:
        function_obj = get_count_by_function_name(i)
        count_val = FunctionActivitySerializer(function_obj).data['function_count']
        dict_stat[i] = count_val

    return dict_stat