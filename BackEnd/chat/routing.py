from django.urls import path , include,re_path
from .consumers import ChatConsumer


websocket_urlpatterns = [
	path("<room_slug>" , ChatConsumer.as_asgi()) ,
    re_path(r'^ws/(?P<room_slug>[^/]+)/$', ChatConsumer.as_asgi()),
]

# from channels.routing import ProtocolTypeRouter, URLRouter
# # import app.routing
# from django.urls import re_path

# from .consumers import TextRoomConsumer

# websocket_urlpatterns = [
#     re_path(r'^ws/(?P<room_name>[^/]+)/$', TextRoomConsumer.as_asgi()),
# ]

# application = ProtocolTypeRouter({
#     'websocket':
#         URLRouter(
#             websocket_urlpatterns
#         )
#     ,
# })