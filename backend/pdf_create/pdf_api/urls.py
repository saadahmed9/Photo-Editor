
from django.contrib import admin
from django.urls import path
from pdf_app import views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('pdf_maker/', views.pdf_maker, name='pdf_maker'),
    
    path('stats/', views.get_db_stat, name='stats'),
    
]   
