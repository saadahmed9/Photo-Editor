import os
import base64
import cv2
import logging

logging.basicConfig(format= '[%(asctime)s] %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

class ImageCompressClass():
    def compress_image(output_format, image, compression_param):

        logger.info("image compression method in progress")
        try:
        
            logger.info("starting compression")
            # Compress the image
            _, compressed_image = cv2.imencode("." + output_format, image, compression_param)

            # Convert the compressed image to base64 for easy transmission
            compressed_image_base64 = base64.b64encode(compressed_image.tobytes()).decode('utf-8')
            
        except Exception as e:
            logger.error("Error occured in compressing image" + str(e))
            
        logger.info("image compression method complete")
        return compressed_image_base64
    
