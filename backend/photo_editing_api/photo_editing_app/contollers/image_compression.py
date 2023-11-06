import os
import base64
import cv2

def compress_image(input_image_path, output_image_path):
    try:
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

        response = {
            'image_base64': f"data:image/jpeg;base64,{image_base64}",
            'input_file_size': input_file_size + "MB",
            'output_file_size': output_file_size + "MB",
            'error': False,
            'message': "Successfully compressed the image",
            'status': 200
        }

    except Exception as e:
        response = {
            'error': True,
            'message': str(e),
            'status': 400
        }

    return response


