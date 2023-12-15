
from django.contrib import admin
from django.urls import path
from mosaic_app import views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('mosaic_maker/', views.mosaic_maker, name='mosaic_maker'),
    
    path('stats-mosaic/', views.get_db_stat, name='stats'),
    
]   
