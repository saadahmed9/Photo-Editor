import logging
import shutil

logging.basicConfig(format= '[%(asctime)s] %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def compress_video(input_video_path, output_video_path):
    logger.info("video compression in progress")
    ## temporarily copy file from input location to output location
    ## TODO: video compression logic
    try:
        shutil.copy2(input_video_path, output_video_path)
    except IOError as e:
        logger.error("Error occured in compressing video")
    logger.info("video compression complete")
    return None