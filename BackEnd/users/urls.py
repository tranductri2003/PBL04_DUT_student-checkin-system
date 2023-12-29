# urls.py

from django.urls import path

from .views import (
    UserListCreateView,
    UserRetriveUpdateDeleteView,
    TXTUploadView,
    UpdateAllUserInformation,
    send_password_reset_email,
    confirm_and_update_password,
)

app_name = 'users'

urlpatterns = [
    path('send-reset-password/',send_password_reset_email, name='send-password-reset'),
    path('confirm-reset-password/<str:uidb64>/<str:token>/', confirm_and_update_password, name='confirm-reset-password'),
    path('upload-txt/', TXTUploadView.as_view(), name='upload-txt'),
    path('update-all-user/', UpdateAllUserInformation.as_view(), name='update-password'),

    # Xem danh sách người dùng
    path('',UserListCreateView.as_view(), name='user-list-create'),
    # Chỉnh sửa và xóa người dùng
    path('<str:staff_id>/',UserRetriveUpdateDeleteView.as_view(), name='user-retrive-update-delete'),


]
