from django.urls import path
from . import views

urlpatterns = [
    path('api/process-application/', views.process_application),
    path('api/jobs/', views.job_listings),
    path('api/analytics/', views.analytics_data),
]