FROM python:3.11.2

MAINTAINER Arjun <mallikharjunaraoannam@gmail.com>

# Setting env variable
ENV PYTHONUNBUFFERED 1

# Working Directory
WORKDIR /var/opt


RUN apt-get update && \
    apt-get -y install nginx build-essential cmake  vim && \
    apt-get install ffmpeg libsm6 libxext6  -y


RUN python -m pip install --upgrade pip
 # Copying requirements.txt
COPY requirements.txt /var/opt/

RUN pip install -r requirements.txt

COPY . /var/opt

COPY deeplab.py /usr/local/lib/python3.11/site-packages/pixellib/semantic/

# Change to executeable mode
#RUN chmod +x /var/opt/start.sh

# Expose port
EXPOSE 8010

CMD ["./start.sh"]
