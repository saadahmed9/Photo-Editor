
from django.contrib import admin
from django.urls import path
from format_coversion_app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('format_change/', views.format_change, name='format_change'),
    
    path('stats-format-change/', views.get_db_stat, name='stats'),
    
]   
