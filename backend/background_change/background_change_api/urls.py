
from django.contrib import admin
from django.urls import path
from background_change_app import views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('background_change/', views.background_change, name='background_change'),
    
    path('stats-bg/', views.get_db_stat, name='stats'),
    
]   
