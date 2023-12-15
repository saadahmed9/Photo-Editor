
from django.contrib import admin
from django.urls import path
from video_compression_app import views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('video_compression/', views.video_compression, name='video_compression'),
    
    path('stats-video/', views.get_db_stat, name='stats'),
    
]   
