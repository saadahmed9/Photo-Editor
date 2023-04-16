"""photo_editing_api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from photo_editing_app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('upload/', views.upload, name='upload'),
    #ABC add new urls here
    path('resize/', views.resize, name='resize'),
    path('format_change/', views.format_change, name='format_change'),
    path('background_change/', views.background_change, name='background_change'),
    path('passport_photo_size/', views.passport_photo_size, name='passport_photo_size'),
    path('noise_removal/', views.noise_removal, name='noise_removal'),
    path('pdf_maker/', views.pdf_maker, name='pdf_maker'),
]
