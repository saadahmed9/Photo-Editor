from django_cron import CronJobBase, Schedule
import os
import datetime

class RemoveFiles():

    def remove_img(self):
        path1 = "media/output/"
        files1 = os.listdir(path1)
        for file in files1:
            image_path = path1+file
            last_forder_update_timestamp = os.stat(image_path).st_mtime
            last_folder_update_datetime = datetime.datetime.fromtimestamp(last_forder_update_timestamp)
            current_datetime = datetime.datetime.now()
            difference = current_datetime - last_folder_update_datetime
            if difference.total_seconds()/60 > 10:
                os.remove(image_path)

        path1 = "media/uploads"
        files1 = os.listdir(path1)
        for file in files1:
            image_path = path1 + file
            last_forder_update_timestamp = os.stat(image_path).st_mtime
            last_folder_update_datetime = datetime.datetime.fromtimestamp(last_forder_update_timestamp)
            current_datetime = datetime.datetime.now()
            difference = current_datetime - last_folder_update_datetime
            if difference.total_seconds() / 60 > 10:
                os.remove(image_path)

        path1 = "media/Mosaic_input"
        files1 = os.listdir(path1)
        for file in files1:
            image_path = path1 + file
            last_forder_update_timestamp = os.stat(image_path).st_mtime
            last_folder_update_datetime = datetime.datetime.fromtimestamp(last_forder_update_timestamp)
            current_datetime = datetime.datetime.now()
            difference = current_datetime - last_folder_update_datetime
            if difference.total_seconds() / 60 > 10:
                os.remove(image_path)

class MyCronJob(CronJobBase):

    RUN_EVERY_MINS = 1
    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = "photo_editing_app.contollers.cron1.MyCronJob"

    @staticmethod
    def do():
        proc_obj = RemoveFiles()
        proc_obj.remove_img()
