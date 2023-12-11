import logging
import os
import subprocess as sp
import shlex
import json

logging.basicConfig(format= '[%(asctime)s] %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def compress_video(input_video_path, output_video_path, target_size):
    # clean up any existing output video files if exists
    if os.path.exists(output_video_path):
        os.remove(output_video_path)
    
    logger.info("video compression in progress")
    try:   
        logger.info("starting compression")

        target_size_in_bits = int(target_size) * 1000 * 1000 * 8

        length = json.loads(sp.run(shlex.split("ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 " + input_video_path), stdout=sp.PIPE).stdout)

        total_bitrate = int(target_size_in_bits) / (length)
        
        if total_bitrate/1000 > 128:
            audio_bitrate = 128 * 1000
        elif total_bitrate/1000 > 64:
            audio_bitrate = 64 * 1000
        elif total_bitrate/1000 > 32:
            audio_bitrate = 32 * 1000
        else:
            audio_bitrate = 16 * 1000
            
        video_bitrate = int(total_bitrate - audio_bitrate)

        cmd = "ffmpeg -i " + input_video_path + " -b:v " + str(video_bitrate) + " -maxrate:v " + str(video_bitrate) + " -bufsize:v " + str(int(target_size) / 20) + " -b:a " + str(audio_bitrate) + " " + output_video_path 

        # logger.info(cmd)
        sp.run(shlex.split( cmd))



        return_value = 1
        logger.info("video compression complete")
    except Exception as e:
        logger.error("Error occured in compressing video " + str(e))
        return_value = 0
    return return_value

