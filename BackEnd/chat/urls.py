from django.urls import path

from . import views

app_name = 'chat'
urlpatterns = [
    path("create/", views.CreateRoom.as_view(), name="createroom"),
    path("", views.RoomListView.as_view(), name="rooms"),
    path("<str:slug>/", views.RoomView.as_view(), name="room"),
]
