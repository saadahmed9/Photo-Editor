FROM python:3.11.2-slim

# Setting env variable
ENV CE_PORT 8017

RUN mkdir -p /tmp/my-dir
ENV NUMBA_CACHE_DIR /tmp/my-dir 
# Working Directory
WORKDIR /var/opt


RUN apt-get update && \
    apt-get -y install nginx build-essential cmake  vim && \
    apt-get install dos2unix


RUN python -m pip install --upgrade pip
 # Copying requirements.txt
COPY requirements.txt /var/opt/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /var/opt

RUN dos2unix start.sh

# Change to executeable mode
RUN chmod +x /var/opt/start.sh

# Expose port
EXPOSE 8017

CMD ["./start.sh"]
