
from django.contrib import admin
from django.urls import path
from pdf_noise_brightness_app import views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('pdf_maker/', views.pdf_maker, name='pdf_maker'),
    path('noise_removal/', views.noise_removal, name='noise_removal'),
    path('brightness_contrast/', views.brightness_contrast, name='brightness_contrast'),


    path('stats/', views.get_db_stat, name='stats'),
    
]   
