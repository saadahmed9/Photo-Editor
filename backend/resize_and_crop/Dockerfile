FROM python:3.11.2-slim

# Setting env variable
ENV CE_PORT 8011

RUN mkdir -p /tmp/my-dir
ENV NUMBA_CACHE_DIR /tmp/my-dir 
# Working Directory
WORKDIR /var/opt


RUN apt-get update && \
    apt-get -y install nginx build-essential cmake  vim && \
    apt-get install libsm6 libxext6 libgl1 libglib2.0-0 libxrender1 -y && \
    apt-get install dos2unix

RUN python -m pip install --upgrade pip
 # Copying requirements.txt
COPY requirements.txt /var/opt/

RUN pip install -r requirements.txt

COPY . /var/opt

# Create uploads and output folders
RUN mkdir -p /var/opt/media/uploads
RUN mkdir -p /var/opt/media/output

RUN dos2unix start.sh
# COPY deeplab.py /usr/local/lib/python3.11/site-packages/pixellib/semantic/

# Change to executeable mode
RUN chmod +x /var/opt/start.sh

# Expose port
EXPOSE 8011

CMD ["./start.sh"]
