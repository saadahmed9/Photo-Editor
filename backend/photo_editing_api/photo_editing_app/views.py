import json
import os
import cv2
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import SuspiciousOperation
from django.urls import reverse_lazy
from photo_editing_app.contollers.passport_photo import passport_photo_face
from photo_editing_app.contollers.resize_operation import image_resize
from photo_editing_app.contollers.specs_finder import spects_detector
from photo_editing_app.contollers.noise_removal import noiseremoval
from photo_editing_app.contollers.pdf_maker import convert_images_to_pdf
from photo_editing_app.contollers.mosaic_maker import mosaicmaker
from matplotlib import colors
from photo_editing_app.contollers.background_change import color_bg_and_add_border
from rest_framework.reverse import reverse_lazy
#from photo_editing_app.contollers.get_objects import get_count_by_function_name,update_count,get_stats, get_stats_inmemory
from photo_editing_app.contollers.get_objects import get_stats_inmemory
from photo_editing_app.contollers.get_statistics import read_stats,write_stats
#from photo_editing_app.serializers import FunctionActivitySerializer
from photo_editing_app.contollers.pose_detection import pose_detector
from photo_editing_app.contollers.verify_params_controller import verify_resize_passed,verify_upload_file_passed,verify_function_passed,verify_functionality_passed,verify_format_change_passed,verify_colour_passed,verify_country_passed
from PIL import ImageColor, Image
from django.http import HttpResponse
import base64
import logging
import pillow_heif
from photo_editing_app.contollers.video_compression import compress_video
# Create your views here.

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

logging.basicConfig(format= '[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def create_application_folder_if_not_exit():
    if not os.path.exists("/".join(BASE_DIR.split("/")) + "/media/"):
        os.makedirs("/".join(BASE_DIR.split("/")) + "/media/")
    if not os.path.exists(
            "/".join(BASE_DIR.split("/")[:-1]) + "/media/output/"):
        os.makedirs("/".join(BASE_DIR.split("/")) + "/media/output/")
    if not os.path.exists(
            "/".join(BASE_DIR.split("/")[:-1]) + "/media/uploads/"):
        os.makedirs("/".join(BASE_DIR.split("/")) + "/media/uploads/")

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

# def initial_checks(request):
#     return_dict = {}
#     try:
#         # create_application_folder_if_not_exit()
#         logger.info("Initial checks being performed")
#         verify_upload_file_passed(request)
#         verify_function_passed(request)
#         if request.method == 'POST' and request.FILES['myfile']:
#             function_name = request.POST['function']
#             myfile = request.FILES['myfile']
#             myfile.name = myfile.name.replace(" ", "")
#             img_dir = "\\".join(BASE_DIR.split("\\"))
#             image_url = img_dir+r"\media\uploads\\"+myfile.name
#             output_url = img_dir+r"\media\output\\"+myfile.name
#             f = open(image_url,"wb")
#             for chunk in request.FILES['myfile'].chunks():
#                 f.write(chunk)
#             f.close()
#             api_root = reverse_lazy('upload',request = request)
#             api_root = api_root[:-7]
#             print("File check is", is_image(myfile.name))
#             if is_image(myfile.name):
#                 verify_functionality_passed(request)
#                 function_obj = get_count_by_function_name(function_name)
#                 count_val = FunctionActivitySerializer(function_obj).data['function_count']
#                 temp_val = count_val + 1
#                 update_count(function_obj, function_name, temp_val)
#             else:
#                 print("Inside exception")
#                 raise Exception("only image files are accepted as input")
#                 #raise SuspiciousOperation("only image files are accepted as input")
#     #ABC call a function for below as below
#     except Exception as e:
#         return_dict["message"] = str(e)
#         return_dict['error'] = True
#         return_dict['status'] = 400
#     return image_url, output_url, api_root, myfile


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
        image_url = img_dir+r"\media\uploads\\"+myfile.name
        output_url = img_dir+r"\media\output\\"+myfile.name
        f = open(image_url,"wb")
        for chunk in request.FILES['myfile'].chunks():
            f.write(chunk)
        f.close()
        api_root = reverse_lazy('upload',request = request)
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
        img_dir = "\\".join(BASE_DIR.split("\\"))
        for file in request.FILES.getlist('myfile'):
            myfile_list.append(file)
            myfile_name_list.append(file.name.replace(" ", ""))
            full_path = img_dir + r"\media\uploads\\" + file.name.replace(" ", "")
            image_url_list.append(full_path)
            f = open(full_path, "wb")
            for chunk in file.chunks():
                f.write(chunk)
            f.close()
        output_url = img_dir + r"\media\output\\" + myfile_list[0].name.split('.')[0] + ".pdf"

        api_root = reverse_lazy('upload',request = request)
        print("Just before calling the function")
        api_root = api_root[:-7]
        if True:
        #if all(map(is_image, image_url_list)):
            print("Inside the function")
            verify_functionality_passed(request)
            # function_obj = get_count_by_function_name(function_name)
            # count_val = FunctionActivitySerializer(function_obj).data['function_count']
            #temp_val = count_val + 1
            #update_count(function_obj, function_name, temp_val)
        else:
            raise SuspiciousOperation("only image files are accepted as input")
    #ABC call a function for below as below
    # except Exception as e:
    #     return_dict["message"] = str(e)
    #     return_dict['error'] = True
    #     return_dict['status'] = 400
    return image_url_list, output_url, api_root, myfile_list

def get_mosaic_files_list(request):
    # create_application_folder_if_not_exit()
    count = 0
    if request.method == 'POST':
        function_name = request.POST['function']
        myfile_list = []
        myfile_name_list = []
        image_url_list = []
        img_dir = "\\".join(BASE_DIR.split("\\"))
        for file in request.FILES.getlist('myfile_folder'):
            count = count + 1
            myfile_list.append(file)
            myfile_name_list.append(file.name.replace(" ", ""))
            full_path = img_dir + r"\media\Mosaic_input\\" + file.name.replace(" ", "")
            image_url_list.append(full_path)
            f = open(full_path, "wb")
            for chunk in file.chunks():
                f.write(chunk)
            f.close()
        print("Just before calling the function")
    return image_url_list, count

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
                with open(output_url, 'rb') as f:
                    image_data = f.read()
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
def resize(request):
    return_dict = {}
    try:
        logger.info("Resize functionality")
        image_url, output_url, api_root, myfile = initial_checks(request)

        verify_resize_passed(request)
        stats_onj = read_stats()
        val = stats_onj["resize"]
        crop_count = val + 1
        newData = {"resize": crop_count}
        write_stats(newData)
        image_input_size = request.POST['resize']
        image_input_size = image_input_size.split(',')
        image_resize(image_url,output_url,width=image_input_size[0],height=image_input_size[1])
        with open(output_url, 'rb') as f:
            image_data = f.read()
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        return_dict['imageUrl']=f"data:image/jpeg;base64,{image_base64}"    
        return_dict['output_url'] = api_root + r"static/" + myfile.name
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

        img_dir = "\\".join(BASE_DIR.split("\\"))
        output_url = img_dir + r"\media\output\\" + part1+"."+required_format
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
        with open(output_url, 'rb') as f:
            image_data = f.read()
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

@api_view(('POST',))
@csrf_exempt
def background_change(request):
    return_dict = {}
    try:
        image_url, output_url, api_root, myfile = initial_checks(request)

        verify_colour_passed(request)
        stats_onj = read_stats()
        val = stats_onj["background_change"]
        crop_count = val + 1
        newData = {"background_change": crop_count}
        write_stats(newData)
        colour_option = request.POST['background_change']
        hexa_code = colour_option
        colour_code = ImageColor.getcolor(hexa_code, "RGBA")
        color_bg_and_add_border(image_url,output_url,colour_code)
        return_dict['output_url'] = api_root+r"static/"+ myfile.name
        with open(output_url, 'rb') as f:
            image_data = f.read()
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
        with open(output_url, 'rb') as f:
            image_data = f.read()
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
def pdf_maker(request):
    return_dict = {}
    try:
        image_url_list, output_url, api_root, myfile_list = initial_checks_multi_files(request)
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
        print("Image conversion is done")
        return_dict['output_url'] = api_root+r"static/"+ myfile_list[0].name.split('.')[0] + ".pdf"
        #return_dict['output_url'] = api_root + r"static/" + "output.pdf"
        with open("\\".join(BASE_DIR.split("\\")) + r"\media\output\\" + myfile_list[0].name.split('.')[0] + ".pdf",
                  'rb') as pdf_file:
            pdf_data = pdf_file.read()
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
def mosaic_maker(request):
    return_dict = {}
    try:
        image_url, output_url, api_root, myfile = initial_checks(request)
        stats_onj = read_stats()
        val = stats_onj["mosaic_maker"]
        crop_count = val + 1
        newData = {"mosaic_maker": crop_count}
        write_stats(newData)
        images_list, images_count = get_mosaic_files_list(request)


        #abc updating folder path with images list
        logger.info("Number of images selected are ", images_count)
        #folder_path = r"E:\Career\University at Buffalo\Semester 2\CSE_611\project\cse611-spring2023-team-photo-editing\backend\photo_editing_api\media\Mosaic-input\\"
        #request.FILES.getlist('myfile')
        mosaicmaker(image_url, output_url, images_list, 30)
        return_dict['output_url'] = api_root+r"static/"+ myfile.name
        with open(output_url, 'rb') as f:
            image_data = f.read()
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
def upload(request):
    return_dict = {}
    try:
        # create_application_folder_if_not_exit()
        verify_upload_file_passed(request)
        verify_function_passed(request)
        if request.method == 'POST' and request.FILES['myfile']:
            function_name = request.POST['function']
            myfile = request.FILES['myfile']
            myfile.name = myfile.name.replace(" ", "")
            img_dir = "\\".join(BASE_DIR.split("\\"))
            image_url = img_dir+r"\media\uploads\\"+myfile.name
            output_url = img_dir+r"\media\output\\"+myfile.name
            f = open(image_url,"wb")
            for chunk in request.FILES['myfile'].chunks():
                f.write(chunk)
            f.close()
            api_root = reverse_lazy('upload',request = request)
            api_root = api_root[:-7]
            if is_image(myfile.name):
                verify_functionality_passed(request)
                # function_obj = get_count_by_function_name(function_name)
                # count_val = FunctionActivitySerializer(function_obj).data['function_count']
                # temp_val = count_val + 1
                #update_count(function_obj, function_name, temp_val)
                if function_name == 'passport_photo_size':
                    verify_country_passed(request)
                    full_str = ""
                    img = passport_photo_face(image_url,output_url)
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
                            color_bg_and_add_border(output_url, output_url, (255,255,255))
                            if country in lines:
                                text = spects_detector(image_url)
                                if "with" in text:
                                    return_dict["Spects_detector"] = "For this country photo with specs is not allowed"
                            return_dict['output_url'] = api_root + r"static/" + myfile.name
                elif function_name == 'background_change':
                    verify_colour_passed(request)
                    colour_option = request.POST['background_change']
                    hexa_code = get_color_code(colour_option)
                    colour_code = ImageColor.getcolor(hexa_code, "RGB")
                    color_bg_and_add_border(image_url,output_url,colour_code)
                    return_dict['output_url'] = api_root+r"static/"+ myfile.name
                elif function_name == 'photo_college':
                    pass
                elif function_name == 'noise_removal':
                    pass
                elif function_name == 'format_change':
                    verify_format_change_passed(request)
                    required_format = request.POST['format_change']
                    image = cv2.imread(image_url)
                    file_name = os.path.splitext(output_url)
                    cv2.imwrite(file_name[0]+"."+required_format, image, [int(cv2.IMWRITE_JPEG_QUALITY), 100])
                    part1,part2 = myfile.name.split('.')
                    return_dict['output_url'] = api_root+r"static/"+part1+"."+required_format
                elif function_name == 'resize':
                    verify_resize_passed(request)
                    image_input_size = request.POST['resize']
                    image_input_size = image_input_size.split(',')
                    image_resize(image_url,output_url,width=image_input_size[0],height=image_input_size[1])
                    return_dict['output_url'] = api_root + r"static/" + myfile.name
                return_dict['error'] = False
                return_dict['message'] = "Successfully Processed "
                return_dict['status'] = 200
                #return_dict["Statistics"] = get_stats()
            else:
                raise SuspiciousOperation("only image files are accepted as input")
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
                # function_obj = get_count_by_function_name(function_name)
                # count_val = FunctionActivitySerializer(function_obj).data['function_count']
                # temp_val = count_val + 1
               # update_count(function_obj, function_name, temp_val)
                return_dict["message"] = "photo_collage updated successfully"
                return_dict['error'] = False
                return_dict['status'] = 200
                return_dict["Statistics"] = read_stats()
    except Exception as e:
        return_dict["message"] = str(e)
        return_dict['error'] = True
        return_dict['status'] = 400
    return Response(return_dict)


@api_view(('POST',))
@csrf_exempt
def crop_image(request):
    return_dict = {}
    try:
        verify_function_passed(request)
        if request.method == 'POST':
            function_name = request.POST['function']
            if function_name == 'crop':
                # function_obj = get_count_by_function_name(function_name)
                # count_val = FunctionActivitySerializer(function_obj).data['function_count']
                # temp_val = count_val + 1
                #update_count(function_obj, function_name, temp_val)
                stats_onj = read_stats()
                val = stats_onj["crop"]
                crop_count = val + 1
                newData = {"crop": crop_count}
                write_stats(newData)

                return_dict["message"] = "crop updated successfully"
                return_dict['error'] = False
                return_dict['status'] = 200
                return_dict["Statistics"] = read_stats()
                #return_dict["Statistics"] = get_stats_inmemory("crop")
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
                # function_obj = get_count_by_function_name(function_name)
                # count_val = FunctionActivitySerializer(function_obj).data['function_count']
                # temp_val = count_val + 1
                #update_count(function_obj, function_name, temp_val)
                return_dict["message"] = "brightness_contrast updated successfully"
                return_dict['error'] = False
                return_dict['status'] = 200
                return_dict["Statistics"] = read_stats()
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
            video_url = video_folder+r"\media\uploads\\"+myfile.name
            output_url = video_folder+r"\media\output\\"+myfile.name
            f = open(video_url,"wb")
            for chunk in request.FILES['myfile'].chunks():
                f.write(chunk)
            f.close()
            api_root = reverse_lazy('upload',request = request)
            api_root = api_root[:-7]

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


@api_view(('POST',))
@csrf_exempt
def image_compression(request):
    logger.info("image compression endpoint!")
    return_dict = {}
    try:
        verify_upload_file_passed(request)
        verify_functionality_passed(request)
        if request.method == 'POST' and request.FILES['myfile']:
            myfile = request.FILES['myfile']
            myfile.name = myfile.name.replace(" ", "")
            image_folder = "\\".join(BASE_DIR.split("\\"))
            input_image_path = image_folder + r"\media\uploads\\" + myfile.name
            output_image_path = image_folder + r"\media\output\\" + myfile.name
            f = open(input_image_path, "wb")
            for chunk in request.FILES['myfile'].chunks():
                f.write(chunk)
            f.close()
            api_root = reverse_lazy('upload', request=request)
            api_root = api_root[:-7]

            return_dict['output_url'] = api_root + r"static/" + myfile.name
            image = cv2.imread(input_image_path)
            compression_params = [cv2.IMWRITE_JPEG_QUALITY, 10]
            success = cv2.imwrite(output_image_path, image, compression_params)

            if not success:
                raise Exception("Failed compressing the image file")
                
            input_file_size = "{:.2f}".format(os.path.getsize(input_image_path) / (1024 * 1024))
            output_file_size = "{:.2f}".format(os.path.getsize(output_image_path) / (1024 * 1024))

            with open(output_image_path, 'rb') as f:
                output_image_data = f.read()
            image_base64 = base64.b64encode(output_image_data).decode('utf-8')
            return_dict['imageUrl'] = f"data:image/jpeg;base64,{image_base64}"
            return_dict['input_file_size'] = input_file_size + "MB"
            return_dict['output_file_size'] = output_file_size + "MB"
            return_dict['error'] = False
            return_dict['message'] = "Successfully Processed"
            return_dict['status'] = 200

    except Exception as e:
        return_dict["message"] = str(e)
        return_dict['error'] = True
        return_dict['status'] = 400

    return Response(return_dict)