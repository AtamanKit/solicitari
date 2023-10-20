from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),

    path('api/gen_app/', include('gen_app.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/push/', include('push.urls')),

    path('api/admin/', admin.site.urls),
]
