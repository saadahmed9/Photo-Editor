# Schedule Library imported
import schedule
import time
import os
import datetime

absolute_path = os.path.dirname(os.path.abspath(__file__))
def remove_img():
    path1 = absolute_path.replace("cron-job", "") + "media/output/"
    files1 = os.listdir(path1)
    for file in files1:
        image_path = path1 + file
        last_forder_update_timestamp = os.stat(image_path).st_mtime
        last_folder_update_datetime = datetime.datetime.fromtimestamp(last_forder_update_timestamp)
        current_datetime = datetime.datetime.now()
        difference = current_datetime - last_folder_update_datetime
        if difference.total_seconds() / 60 > 10:
            os.remove(image_path)

    #path1 = "media/uploads"
    path1 = absolute_path.replace("cron-job", "") + "media/uploads/"
    print("Path is", path1)
    files1 = os.listdir(path1)
    for file in files1:
        image_path = path1 + file
        last_forder_update_timestamp = os.stat(image_path).st_mtime
        last_folder_update_datetime = datetime.datetime.fromtimestamp(last_forder_update_timestamp)
        current_datetime = datetime.datetime.now()
        difference = current_datetime - last_folder_update_datetime
        if difference.total_seconds() / 60 > 10:
            os.remove(image_path)

    #path1 = "media/Mosaic_input"
    path1 = absolute_path.replace("cron-job", "") + "media/Mosaic_input/"
    files1 = os.listdir(path1)
    for file in files1:
        image_path = path1 + file
        last_forder_update_timestamp = os.stat(image_path).st_mtime
        last_folder_update_datetime = datetime.datetime.fromtimestamp(last_forder_update_timestamp)
        current_datetime = datetime.datetime.now()
        difference = current_datetime - last_folder_update_datetime
        if difference.total_seconds() / 60 > 10:
            os.remove(image_path)


def info():
    print("Running cron job")

# Task scheduling
schedule.every(1).minutes.do(remove_img)

# # After every 5 mins info() is called.
schedule.every(5).minutes.do(info)

# Loop so that the scheduling task
# keeps on running all time.
while True:
    # Checks whether a scheduled task
    # is pending to run or not
    schedule.run_pending()
    time.sleep(1)