# urls.py

from django.urls import path

from .views import (
    UserListCreateView,
    UserRetriveUpdateDeleteView,
    TXTUploadView,
    UpdateAllUserInformation,
)

app_name = 'users'

urlpatterns = [
    path('upload-txt/', TXTUploadView.as_view(), name='upload-txt'),
    path('update-all-user/', UpdateAllUserInformation.as_view(), name='update-password'),

    # Xem danh sách người dùng
    path('',UserListCreateView.as_view(), name='user-list-create'),
    # Chỉnh sửa và xóa người dùng
    path('<str:staff_id>/',UserRetriveUpdateDeleteView.as_view(), name='user-retrive-update-delete'),
    

]
