from django.urls import path, include

from rest_framework import routers

from . import views


router = routers.DefaultRouter()
router.register(r'calls', views.CallViewSet, basename='calls')
# router.register(r'unexecuted', views.UnexecViewSet, basename='neexecutat')
# router.register(r'remark', views.RemarkViewSet, basename='remark')

urlpatterns = [
    path('offices/', views.office),
    path('get_cities/', views.get_cities),
    path('get_pt/', views.get_pt),
    path('get_sector/', views.get_sector),
    path('damages/', views.damages),
    path('office_data/<office>/', views.office_data),
    path('sector_data/<office>/<sector>/', views.sector_data),
    path('city_data/<office>/<sector>/<city>/', views.city_data),
    path('searched_records/<office>/<sector>/<city>/<pt>/<status>/<stare>/', views.searched_records),
    path('get_executed/<record>/', views.get_executed),
    # path('push_notifications/', views.push_notifications),
    # path('vapid_public_key/', views.vapid_public_key),

    path('callspath/', include(router.urls)),
]