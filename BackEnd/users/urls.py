# urls.py

from django.urls import path

from .views import (
    UserListCreateView,
    UserRetriveUpdateDeleteView,
    TXTUploadView,
)

app_name = 'users'

urlpatterns = [
    path('upload-txt/', TXTUploadView.as_view(), name='upload-txt'),

    # Xem danh sách người dùng
    path('',UserListCreateView.as_view(), name='user-list-create'),
    # Xem chi tiết người dùng
    path('<str:staff_id>/',UserRetriveUpdateDeleteView.as_view(), name='user-retrive-update-delete'),
    

]
