
from django.contrib import admin
from django.urls import path
from image_compression_app import views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('image_compression/', views.image_compression, name='image_compression'),
    
    path('stats-image/', views.get_db_stat, name='stats'),
    
]   
