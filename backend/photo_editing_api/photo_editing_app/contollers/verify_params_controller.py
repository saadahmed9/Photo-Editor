from django.core.exceptions import SuspiciousOperation

def verify_resize_passed(request):
    if request.data.get("resize",False):
        resize = request.data.get('resize')
    else:
        raise SuspiciousOperation("please enter the required size of the image to be resized")

def verify_upload_file_passed(request):
    if request.data.get("myfile",False):
        file = request.data.get('myfile')
    else:
        raise SuspiciousOperation("myfile json key is required and allowed image files")

def verify_function_passed(request):
    if request.data.get("function",False):
        function = request.data.get('function')
    else:
        raise SuspiciousOperation("function need to be passed")

def verify_functionality_passed(request):
    val = request.data.get("function",False)
    functionality_list = ['passport_photo_size', 'background_change', 'photo_collage', 'noise_removal', 'format_change',
                          'resize', 'mosaic_maker','crop','pdf_maker','brightness_contrast']
    if val not in functionality_list:
        raise SuspiciousOperation("Please select the function from the following list  ['passport_photo_size','background_change','photo_college','noise_removal','format_change','resize','mosaic_maker']")

def verify_format_change_passed(request):
    if request.data.get("format_change", False):
        format_change = request.data.get('format_change')
    else:
        raise SuspiciousOperation("please enter the format need to be converted")

def verify_colour_passed(request):
    if request.data.get("background_change", False):
        background_change = request.data.get('background_change')
    else:
        raise SuspiciousOperation("please enter the colour of the background")

def verify_country_passed(request):
    if request.data.get("country", False):
        country = request.data.get('country')
    else:
        raise SuspiciousOperation("please enter the country")