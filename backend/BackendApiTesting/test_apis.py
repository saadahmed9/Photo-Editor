import requests

# Function to get hosted url's


def get_service_url(service_name):
    base_urls = {
        "passport_photo_size": "http://xlabk8s3.cse.buffalo.edu:30010",
        "format_change": "http://xlabk8s3.cse.buffalo.edu:30014",
        "crop": "http://xlabk8s3.cse.buffalo.edu:30011",
        "noise_removal": "http://xlabk8s3.cse.buffalo.edu:30013",
        "background_change": "http://xlabk8s3.cse.buffalo.edu:30015",
        "brightness_contrast": "http://xlabk8s3.cse.buffalo.edu:30013",
        "resize": "http://xlabk8s3.cse.buffalo.edu:30011",
        "mosaic_maker": "http://xlabk8s3.cse.buffalo.edu:30016",
        "pdf_maker": "http://xlabk8s3.cse.buffalo.edu:30013",
        "video_compression": "http://xlabk8s3.cse.buffalo.edu:30018",
        "image_compression": "http://xlabk8s3.cse.buffalo.edu:30017"
        # Add other services here
    }
    return base_urls.get(service_name, "default_base_url")






# Function to test Passport Photo Size


def test_passport_photo_size():
    url = f"{get_service_url('passport_photo_size')}/passport_photo_size/"
    response = requests.post(url, files={'myfile': open('BackendApiTesting/Rohit.jpeg', 'rb')}, data={
                             'function': 'passport_photo_size', 'country': 'France', 'background_req': 'yes'})
    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']

# Repeat the same structure for other countries
def test_passport_photo_size_usa():
    # Similar implementation for USA
    url = f"{get_service_url('passport_photo_size')}/passport_photo_size/"
    response = requests.post(url, files={'myfile': open('BackendApiTesting/Rohit.jpeg', 'rb')}, data={
                             'function': 'passport_photo_size', 'country': 'USA', 'background_req': 'yes'})
    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']

def test_passport_photo_size_china():
    # Similar implementation for China
    url = f"{get_service_url('passport_photo_size')}/passport_photo_size/"
    response = requests.post(url, files={'myfile': open('BackendApiTesting/Rohit.jpeg', 'rb')}, data={
                             'function': 'passport_photo_size', 'country': 'China', 'background_req': 'yes'})
    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']

def test_passport_photo_size_india():
    # Similar implementation for China
    url = f"{get_service_url('passport_photo_size')}/passport_photo_size/"
    response = requests.post(url, files={'myfile': open('BackendApiTesting/Rohit.jpeg', 'rb')}, data={
                             'function': 'passport_photo_size', 'country': 'India', 'background_req': 'yes'})
    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']


    








# Functions to test Format Change


def test_format_change():
    url = f"{get_service_url('format_change')}/format_change/"
    with open('BackendApiTesting/Rohit.jpeg', 'rb') as file:
        files = {'myfile': file}
        data = {'function': 'format_change', 'format_change': 'jpg'}
        response = requests.post(url, files=files, data=data)

    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']


# Repeat the same structure for other formats
def test_format_change_to_heic():
    # Similar implementation for HEIC format
    url = f"{get_service_url('format_change')}/format_change/"
    with open('BackendApiTesting/Rohit.jpeg', 'rb') as file:
        files = {'myfile': file}
        data = {'function': 'format_change', 'format_change': 'heic'}
        response = requests.post(url, files=files, data=data)

    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']

def test_format_change_to_gif():
    # Similar implementation for GIF format
    url = f"{get_service_url('format_change')}/format_change/"
    with open('BackendApiTesting/Rohit.jpeg', 'rb') as file:
        files = {'myfile': file}
        data = {'function': 'format_change', 'format_change': 'gif'}
        response = requests.post(url, files=files, data=data)

    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']

def test_format_change_to_bmp():
    # Similar implementation for BMP format
    url = f"{get_service_url('format_change')}/format_change/"
    with open('BackendApiTesting/Rohit.jpeg', 'rb') as file:
        files = {'myfile': file}
        data = {'function': 'format_change', 'format_change': 'bmp'}
        response = requests.post(url, files=files, data=data)

    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']

def test_format_change_to_webp():
    # Similar implementation for WEBP format
    url = f"{get_service_url('format_change')}/format_change/"
    with open('BackendApiTesting/Rohit.jpeg', 'rb') as file:
        files = {'myfile': file}
        data = {'function': 'format_change', 'format_change': 'webp'}
        response = requests.post(url, files=files, data=data)

    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']

def test_format_change_to_hdr():
    # Similar implementation for HDR format
    url = f"{get_service_url('format_change')}/format_change/"
    with open('BackendApiTesting/Rohit.jpeg', 'rb') as file:
        files = {'myfile': file}
        data = {'function': 'format_change', 'format_change': 'hdr'}
        response = requests.post(url, files=files, data=data)

    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']

def test_format_change_to_pic():
    # Similar implementation for PIC format
    url = f"{get_service_url('format_change')}/format_change/"
    with open('BackendApiTesting/Rohit.jpeg', 'rb') as file:
        files = {'myfile': file}
        data = {'function': 'format_change', 'format_change': 'pic'}
        response = requests.post(url, files=files, data=data)

    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']

def test_format_change_to_heif():
    # Similar implementation for HEIF format
    url = f"{get_service_url('format_change')}/format_change/"
    with open('BackendApiTesting/Rohit.jpeg', 'rb') as file:
        files = {'myfile': file}
        data = {'function': 'format_change', 'format_change': 'heif'}
        response = requests.post(url, files=files, data=data)

    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']

def test_format_change_to_tiff():
    # Similar implementation for TIFF format
    url = f"{get_service_url('format_change')}/format_change/"
    with open('BackendApiTesting/Rohit.jpeg', 'rb') as file:
        files = {'myfile': file}
        data = {'function': 'format_change', 'format_change': 'tiff'}
        response = requests.post(url, files=files, data=data)

    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']











# Function to test Crop


# Function to test valid cropping
def test_crop_valid():
    url = f"{get_service_url('crop')}/crop/"
    with open('BackendApiTesting/Rohit.jpeg', 'rb') as img:  # A valid image file
        files = {'file': img}
        data = {'function': 'crop', 'crop_params': 'valid_parameters'}  # Replace with actual valid parameters
        response = requests.post(url, files=files, data=data)
    assert response.status_code == 200
    assert 'crop updated successfully' in response.json()['message']

# Function to test cropping with invalid parameters
# def test_crop_invalid_parameters():
#     url = f"{get_service_url('crop')}/crop/"
#     with open('BackendApiTesting/Rohit.jpeg', 'rb') as img:
#         files = {'file': img}
#         data = {'function': 'crop', 'crop_params': 'invalid_parameters'}  # Ensure these are actually invalid
#         response = requests.post(url, files=files, data=data)
#     assert response.status_code != 200  # Check if status code is not 200
#     assert 'error' in response.json() or 'failure' in response.json()['message']  # Adjust this based on actual API error response


# Function to test crop with no file uploaded
# def test_crop_no_file_uploaded():
#     url = f"{get_service_url('crop')}/crop/"
#     data = {'function': 'crop', 'crop_params': 'some_parameters'}  # Parameters without a file
#     response = requests.post(url, data=data)
#     assert response.status_code != 200
#     assert 'error' in response.json()  # Adjust based on your API's error response













# Fucntion to test Noise Removal


def test_noise_removal():
    url = f"{get_service_url('noise_removal')}/noise_removal/"
    # Replace with the actual file path
    with open('BackendApiTesting/Rohit.jpeg', 'rb') as file:
        files = {'myfile': file}
        data = {'function': 'noise_removal'}
        response = requests.post(url, files=files, data=data)

    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']










##Function to test Background Change


def test_background_change():
    url = f"{get_service_url('background_change')}/background_change/"
    with open('BackendApiTesting/Rohit.jpeg', 'rb') as img:  # Replace with actual file path
        files = {'myfile': img}
        data = {'function': 'background_change', 'background_change': 'white'}
        response = requests.post(url, files=files, data=data)

    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']











# Function to test Brightness and Contrast


def test_brightness_contrast_valid():
    url = f"{get_service_url('brightness_contrast')}/brightness_contrast/"
    
    # Example valid brightness and contrast values
    data = {
        'function': 'brightness_contrast',
        'brightness': 50,  # Assume this is a valid brightness value
        'contrast': 50     # Assume this is a valid contrast value
    }

    response = requests.post(url, data=data)

    assert response.status_code == 200
    # Additional assertions based on expected API response for valid adjustments










# Function to test Resize

def test_resize():
    url = f"{get_service_url('resize')}/resize/"
    with open('BackendApiTesting/Rohit.jpeg', 'rb') as img:  # Replace with the actual file path
        files = {'myfile': img}
        data = {'function': 'resize', 'resize': '180,250'}
        response = requests.post(url, files=files, data=data)

    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']














# Function to test Mosaic

def test_mosaic_maker():
    url = f"{get_service_url('mosaic_maker')}/mosaic_maker/"

    # Assuming you have multiple image paths
    image_paths = ['BackendApiTesting/1.jpg', 'BackendApiTesting/2.jpg', 'BackendApiTesting/3.png',
                   'BackendApiTesting/4.png', 'BackendApiTesting/5.png', 'BackendApiTesting/6.png']
    files = [('myfile_folder', (image_path, open(image_path, 'rb')))
             for image_path in image_paths]

    # Template image (if required)
    files.append(('myfile', open('BackendApiTesting/Rohit.jpeg', 'rb')))

    # Add selectedPixel parameter
    data = {
        'function': 'mosaic_maker',
        'selectedPixel': 30  # Example value, adjust as needed
    }
    response = requests.post(url, files=files, data=data)

    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']




def test_mosaic_maker_insufficient_images():
    # ... Implement test for insufficient number of images
    url = f"{get_service_url('mosaic_maker')}/mosaic_maker/"

    # Assuming you have multiple image paths
    image_paths = ['BackendApiTesting/1.jpg', 'BackendApiTesting/2.jpg']
    files = [('myfile_folder', (image_path, open(image_path, 'rb')))
             for image_path in image_paths]

    # Template image (if required)
    files.append(('myfile', open('BackendApiTesting/Rohit.jpeg', 'rb')))

    # Add selectedPixel parameter
    data = {
        'function': 'mosaic_maker',
        'selectedPixel': 30  # Example value, adjust as needed
    }
    response = requests.post(url, files=files, data=data)

    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']












# Function to test PDF Creator


def test_pdf_maker():
    url = f"{get_service_url('pdf_maker')}/pdf_maker/"

    # Assuming you have multiple image paths for the PDF creation
    image_paths = ['BackendApiTesting/1.jpg', 'BackendApiTesting/2.jpg', 'BackendApiTesting/3.png',
                   'BackendApiTesting/4.png', 'BackendApiTesting/5.png', 'BackendApiTesting/6.png']
    files = [('myfile', (image_path, open(image_path, 'rb')))
             for image_path in image_paths]

    data = {'function': 'pdf_maker'}
    response = requests.post(url, files=files, data=data)

    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']


def test_pdf_maker_oneImage():
    url = f"{get_service_url('pdf_maker')}/pdf_maker/"

    # Assuming you have multiple image paths for the PDF creation
    image_paths = ['BackendApiTesting/1.jpg']
    files = [('myfile', (image_path, open(image_path, 'rb')))
             for image_path in image_paths]

    data = {'function': 'pdf_maker'}
    response = requests.post(url, files=files, data=data)

    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']













#Function to test Video Compression
# def test_video_compression():
#     url = f"{get_service_url('video_compression')}/video_compression/"

#     # Replace with the actual path to your video file
#     video_path = 'BackendApiTesting/video.mp4'

#     # Prepare the files payload for the POST request
#     files = {'myfile': open(video_path, 'rb')}
#     data = {'function': 'video_compression'}

#     # Send the POST request to the API endpoint
#     response = requests.post(url, files=files, data=data)

#     # Close the file to free up system resources
#     files['myfile'].close()

#     # Assertions to check if the response is as expected
#     assert response.status_code == 200
#     assert 'Successfully Processed' in response.json()['message']


















# Function to test Image Compression


def test_image_compression():
    url = f"{get_service_url('image_compression')}/image_compression/"

    # Replace with the actual path to your image file
    image_path = 'BackendApiTesting/5.png'

    # Prepare the files payload for the POST request
    files = {'myfile': open(image_path, 'rb')}

    # Additional data based on your API requirements
    data = {
        'function': 'image_compression',
        'output_format': 'jpg',  # Assuming you are specifying the output format
        'compression_rate': 50,  # Example compression rate
        'custom_rate': '300'  # Example custom compression rate in KB
    }

    # Send the POST request to the API endpoint
    response = requests.post(url, files=files, data=data)

    # Close the file to free up system resources
    files['myfile'].close()

    # Assertions to check if the response is as expected
    assert response.status_code == 200
    assert 'Successfully Processed' in response.json()['message']





# List of all test functions
test_functions = [
    test_passport_photo_size,
    test_passport_photo_size_usa,
    test_passport_photo_size_china,
    test_passport_photo_size_india,
    test_format_change,
    test_format_change_to_heic,
    test_format_change_to_gif,
    test_format_change_to_bmp,
    test_format_change_to_webp,
    test_format_change_to_hdr,
    test_format_change_to_pic,
    test_format_change_to_heif,
    test_format_change_to_tiff,
    test_crop_valid,
    test_noise_removal,
    test_background_change,
    test_brightness_contrast_valid,
    test_resize,
    test_mosaic_maker,
    test_mosaic_maker_insufficient_images,
    test_pdf_maker,
    test_pdf_maker_oneImage,
    test_image_compression
]