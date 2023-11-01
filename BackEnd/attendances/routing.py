from django.urls import path , include,re_path
from .consumers import AttendanceConsumer


websocket_urlpatterns = [
    re_path(r'^ws/attendance/(?P<course_id>[^/]+)/$', AttendanceConsumer.as_asgi()),
]
