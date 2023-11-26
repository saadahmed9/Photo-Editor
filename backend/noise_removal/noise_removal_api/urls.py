
from django.contrib import admin
from django.urls import path
from noise_removal_app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('upload/', views.upload, name='upload'),

    path('noise_removal/', views.noise_removal, name='noise_removal'),
    
    path('stats/', views.get_db_stat, name='stats'),
    
]   
