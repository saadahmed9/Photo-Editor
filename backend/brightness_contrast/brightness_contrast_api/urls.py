
from django.contrib import admin
from django.urls import path
from brightness_contrast_app import views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('brightness_contrast/', views.brightness_contrast, name='brightness_contrast'),

    path('stats/', views.get_db_stat, name='stats'),
    
]   
