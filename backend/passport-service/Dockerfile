FROM python:3.11.2-slim

# Setting env variable
ENV CE_PORT 8010

RUN mkdir -p /tmp/my-dir
RUN mkdir /root/.u2net/
ENV NUMBA_CACHE_DIR /tmp/my-dir 
# Working Directory
WORKDIR /var/opt

RUN apt-get update && \
    apt-get -y install nginx build-essential cmake  vim && \
    apt-get install libsm6 libxext6 libgl1 libglib2.0-0 libxrender1 -y && \
    apt-get install dos2unix

RUN apt-get install -y curl

RUN python -m pip install --upgrade pip
 # Copying requirements.txt
COPY requirements.txt /var/opt/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /var/opt

# Create uploads and output folders
RUN mkdir -p /var/opt/media/uploads
RUN mkdir -p /var/opt/media/output
RUN mkdir -p /var/opt/media/models

RUN curl -LJO https://github.com/italojs/facial-landmarks-recognition/raw/master/shape_predictor_68_face_landmarks.dat \
    && mv shape_predictor_68_face_landmarks.dat /var/opt/media/models/

RUN dos2unix start.sh
# COPY deeplab.py /usr/local/lib/python3.11/site-packages/pixellib/semantic/

# Change to executeable mode
RUN chmod +x /var/opt/start.sh

# Expose port
EXPOSE 8010

CMD ["./start.sh"]
