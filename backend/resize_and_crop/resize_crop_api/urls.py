
from django.contrib import admin
from django.urls import path
from resize_crop_app import views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('resize/', views.resize, name='resize'),
    path('crop/', views.crop_image, name='crop'),
    
    path('stats/', views.get_db_stat, name='stats'),
    
]   
