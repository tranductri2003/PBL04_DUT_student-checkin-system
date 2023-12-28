from django.urls import path , include,re_path
from .consumers import StatusConsumer


websocket_urlpatterns = [
    re_path(r'^ws/user/status', StatusConsumer.as_asgi()),
]