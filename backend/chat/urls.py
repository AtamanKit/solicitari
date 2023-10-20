from django.urls import path, include

from rest_framework import routers

from .views import ChatViewSet, get_chat_messages, get_chat_missing


router = routers.DefaultRouter()
router.register(r'messages', ChatViewSet, basename='messages')

urlpatterns = [
    path('chatspath/', include(router.urls)),

    path('get_chat_messages/<office>/', get_chat_messages),
    path('get_chat_missing/<chat_id>/', get_chat_missing),
]
