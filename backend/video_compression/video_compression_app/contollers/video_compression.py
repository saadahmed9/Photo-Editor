import logging
import ffmpeg
import os

logging.basicConfig(format= '[%(asctime)s] %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def compress_video(input_video_path, output_video_path):
    # clean up any existing output video files if exists
    if os.path.exists(output_video_path):
        os.remove(output_video_path)
    
    logger.info("video compression in progress")
    try:
        logger.info(" input " + input_video_path)
        logger.info(" output " + output_video_path)
        
        logger.info("starting compression")
        (
            ffmpeg.input(input_video_path)
            .output(output_video_path)
            .run()
        )
        return_value = 1
    except Exception as e:
        logger.error("Error occured in compressing video" + str(e))
        return_value = 0

    logger.info("video compression complete")
    return return_value

