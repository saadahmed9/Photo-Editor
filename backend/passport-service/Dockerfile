FROM python:3.11.2

# Setting env variable
ENV CE_PORT 8010

RUN mkdir -p /tmp/my-dir
#RUN mkdir /root/.u2net/
ENV NUMBA_CACHE_DIR /tmp/my-dir 
# Working Directory
WORKDIR /var/opt

RUN apt-get install -y curl

RUN apt-get update && \
    apt-get -y install nginx build-essential cmake  vim && \
    apt-get install ffmpeg libsm6 libxext6  -y &&\
    apt-get install dos2unix



RUN python -m pip install --upgrade pip
 # Copying requirements.txt
COPY requirements.txt /var/opt/

RUN pip install -r requirements.txt

COPY . /var/opt

RUN curl -LJO https://github.com/italojs/facial-landmarks-recognition/raw/master/shape_predictor_68_face_landmarks.dat \
    && mv shape_predictor_68_face_landmarks.dat /var/opt/media/models/

RUN dos2unix start.sh
# COPY deeplab.py /usr/local/lib/python3.11/site-packages/pixellib/semantic/

# Change to executeable mode
RUN chmod +x /var/opt/start.sh

# Expose port
EXPOSE 8010

CMD ["./start.sh"]
