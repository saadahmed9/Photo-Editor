#!/bin/bash

#python manage.py migrate

#python manage.py loaddata  fixtures/data.json

#service cron start

python cron-job/run_cron_job.py &
python manage.py runserver 0.0.0.0:${CE_PORT}
#python manage.py runserver 0.0.0.0:80