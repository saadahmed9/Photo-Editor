FROM python:3.11.2

# Setting env variable
ENV CE_PORT 8013

RUN mkdir -p /tmp/my-dir
ENV NUMBA_CACHE_DIR /tmp/my-dir 
# Working Directory
WORKDIR /var/opt


RUN apt-get update && \
    apt-get -y install nginx build-essential cmake  vim && \
    apt-get install ffmpeg libsm6 libxext6  -y &&\
    apt-get install dos2unix &&\
    apt-get install lsof



RUN python -m pip install --upgrade pip
 # Copying requirements.txt
COPY requirements.txt /var/opt/

RUN pip install -r requirements.txt

COPY . /var/opt

RUN dos2unix start.sh

# Change to executeable mode
RUN chmod +x /var/opt/start.sh

# Expose port
EXPOSE 8013

CMD ["./start.sh"]
