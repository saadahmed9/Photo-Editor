import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pdf_noise_brightness_api.settings')

application = get_wsgi_application()
