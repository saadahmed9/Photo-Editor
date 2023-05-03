#!/bin/bash

python manage.py migrate

python manage.py loaddata  fixtures/data.json

service cron start

python manage.py runserver 0.0.0.0:8010

