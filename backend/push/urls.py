from django.urls import path, include

from . import views

urlpatterns = [
    path('push_notifications/', views.push_notifications),
    path('vapid_public_key/', views.vapid_public_key),
    path('update_push_model/', views.update_push_model),
]