
from django.contrib import admin
from django.urls import path
from collage_app import views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('photo_collage/', views.photo_collage, name='photo_collage'),
    
    path('stats/', views.get_db_stat, name='stats'),
    
]   
